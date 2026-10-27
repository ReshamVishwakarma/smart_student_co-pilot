from datetime import datetime, timezone, timedelta
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.proactive import TaskItem, DeadlineRuleConfig
from app.services.proactive_engine import ProactiveDeadlineRuleEngine, get_seed_tasks

client = TestClient(app)


@pytest.fixture
def rule_engine():
    """Provides a fresh instance of the deterministic rule engine."""
    return ProactiveDeadlineRuleEngine(
        config=DeadlineRuleConfig(urgent_window_hours=12.0, upcoming_window_hours=48.0)
    )


@pytest.fixture
def fixed_now():
    """Deterministic reference timestamp for consistent unit tests."""
    return datetime(2026, 10, 27, 14, 0, 0, tzinfo=timezone.utc)


def test_upcoming_deadline_within_urgent_window(rule_engine, fixed_now):
    """
    Scenario 1: Task is due in 5 hours (< 12h threshold) and uncompleted.
    Expected: Triggers an URGENT proactive suggestion with explainable trigger reason.
    """
    task = TaskItem(
        id="task-urgent-1",
        title="Implement Raft Election Timeout",
        course="CS401",
        deadline=fixed_now + timedelta(hours=5),
        is_completed=False,
        estimated_minutes=90,
    )

    suggestion = rule_engine.evaluate_task(task, reference_time=fixed_now)

    assert suggestion is not None
    assert suggestion.priority == "urgent"
    assert suggestion.confidence == 0.95
    assert suggestion.is_simulated is False
    assert "5.0h" in suggestion.explanation.trigger
    assert "urgent threshold" in suggestion.explanation.trigger


def test_upcoming_deadline_within_preparation_window(rule_engine, fixed_now):
    """
    Scenario 2: Task is due in 24 hours (between 12h and 48h) and uncompleted.
    Expected: Triggers a HIGH priority advance preparation suggestion.
    """
    task = TaskItem(
        id="task-prep-1",
        title="Revise Module 4 GCN Lecture Notes",
        course="CS425",
        deadline=fixed_now + timedelta(hours=24),
        is_completed=False,
        estimated_minutes=45,
    )

    suggestion = rule_engine.evaluate_task(task, reference_time=fixed_now)

    assert suggestion is not None
    assert suggestion.priority == "high"
    assert suggestion.confidence == 0.85
    assert suggestion.is_simulated is False
    assert "advance preparation window" in suggestion.explanation.trigger


def test_distant_deadline_no_suggestion(rule_engine, fixed_now):
    """
    Scenario 3: Task is due in 72 hours (> 48h threshold).
    Expected: Returns None to avoid student notification fatigue.
    """
    task = TaskItem(
        id="task-distant-1",
        title="Capstone Final Report Draft",
        course="CS499",
        deadline=fixed_now + timedelta(hours=72),
        is_completed=False,
        estimated_minutes=180,
    )

    suggestion = rule_engine.evaluate_task(task, reference_time=fixed_now)

    assert suggestion is None


def test_completed_task_no_suggestion(rule_engine, fixed_now):
    """
    Scenario 4: Task deadline is approaching in 2 hours, BUT the student has already marked it completed.
    Expected: Returns None. The engine must never nag the user for completed work.
    """
    task = TaskItem(
        id="task-completed-1",
        title="Submit Peer Code Review",
        course="Open Source Practicum",
        deadline=fixed_now + timedelta(hours=2),
        is_completed=True,  # Completed!
        estimated_minutes=30,
    )

    suggestion = rule_engine.evaluate_task(task, reference_time=fixed_now)

    assert suggestion is None


def test_overdue_task_suggestion(rule_engine, fixed_now):
    """
    Scenario 5: Task deadline has passed 3 hours ago and task is uncompleted.
    Expected: Returns an urgent overdue reminder.
    """
    task = TaskItem(
        id="task-overdue-1",
        title="Lab 2 Submission",
        course="CS401",
        deadline=fixed_now - timedelta(hours=3),
        is_completed=False,
    )

    suggestion = rule_engine.evaluate_task(task, reference_time=fixed_now)

    assert suggestion is not None
    assert suggestion.priority == "urgent"
    assert suggestion.confidence == 0.99
    assert "Overdue:" in suggestion.title


def test_evaluate_endpoint_api(fixed_now):
    """
    Integration Test: POST /api/v1/suggestions/evaluate processes tasks correctly.
    """
    payload = {
        "tasks": [
            {
                "id": "t1",
                "title": "Urgent Lab",
                "course": "CS401",
                "deadline": (fixed_now + timedelta(hours=4)).isoformat(),
                "is_completed": False,
            },
            {
                "id": "t2",
                "title": "Distant Report",
                "course": "CS499",
                "deadline": (fixed_now + timedelta(hours=100)).isoformat(),
                "is_completed": False,
            },
            {
                "id": "t3",
                "title": "Finished Homework",
                "course": "CS300",
                "deadline": (fixed_now + timedelta(hours=2)).isoformat(),
                "is_completed": True,
            },
        ],
        "reference_time": fixed_now.isoformat(),
    }

    response = client.post("/api/v1/suggestions/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["evaluated_tasks_count"] == 3
    assert data["triggered_suggestions_count"] == 1
    assert len(data["suggestions"]) == 1
    assert data["suggestions"][0]["task_id"] == "t1"
    assert data["suggestions"][0]["priority"] == "urgent"


def test_seed_tasks_endpoint_api():
    """
    Integration Test: GET /api/v1/suggestions/tasks/seed returns standard demo tasks.
    """
    response = client.get("/api/v1/suggestions/tasks/seed")
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 4
    # Check that both completed and uncompleted tasks exist in seed
    has_completed = any(t["is_completed"] for t in tasks)
    has_uncompleted = any(not t["is_completed"] for t in tasks)
    assert has_completed and has_uncompleted
