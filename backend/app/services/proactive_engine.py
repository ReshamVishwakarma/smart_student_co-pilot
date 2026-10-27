from datetime import datetime, timezone, timedelta
from typing import List, Optional
from app.schemas.proactive import (
    TaskItem,
    DeadlineRuleConfig,
    ProactiveSuggestionItem,
    SuggestionExplanation,
)


class ProactiveDeadlineRuleEngine:
    """
    Deterministic rule engine that evaluates student tasks against academic deadlines.

    Note: This is a deterministic rule-based engine (Phase 2), NOT a trained ML model.
    It applies explainable, transparent threshold logic to evaluate whether a proactive
    nudge should be generated or withheld.
    """

    def __init__(self, config: Optional[DeadlineRuleConfig] = None):
        self.config = config or DeadlineRuleConfig()

    def evaluate_task(
        self,
        task: TaskItem,
        config: Optional[DeadlineRuleConfig] = None,
        reference_time: Optional[datetime] = None,
    ) -> Optional[ProactiveSuggestionItem]:
        """
        Evaluate an individual student task and return a proactive suggestion if conditions trigger.
        Returns None if task is completed or outside the proactive notification window.
        """
        # Rule 1: Never interrupt the student for already completed tasks
        if task.is_completed:
            return None

        cfg = config or self.config
        now = reference_time or datetime.now(timezone.utc)

        # Normalize timezones to UTC for deterministic comparison
        task_deadline = task.deadline
        if task_deadline.tzinfo is None:
            task_deadline = task_deadline.replace(tzinfo=timezone.utc)
        if now.tzinfo is None:
            now = now.replace(tzinfo=timezone.utc)

        delta_seconds = (task_deadline - now).total_seconds()
        hours_remaining = delta_seconds / 3600.0

        # Rule 2: Overdue task (< 0 hours)
        if hours_remaining < 0:
            overdue_hours = abs(hours_remaining)
            return ProactiveSuggestionItem(
                id=f"rule-sug-{task.id}-overdue",
                task_id=task.id,
                title=f"Overdue: {task.title}",
                description=f"This task was due {overdue_hours:.1f} hours ago for {task.course}. Check if late submissions are accepted.",
                category="academic_deadline",
                priority="urgent",
                confidence=0.99,
                is_simulated=False,
                explanation=SuggestionExplanation(
                    trigger=f"Deterministic Rule: Deadline passed {overdue_hours:.1f} hours ago and task remains uncompleted.",
                    interruption_cost="Immediate priority overrides interruption gate — risk of late grade penalty.",
                    rationale=f"Surfacing overdue assignments for {task.course} minimizes progressive grading deduction.",
                ),
                created_at=now.isoformat(),
                status="pending",
            )

        # Rule 3: Urgent deadline window (0 <= hours_remaining <= urgent_window_hours)
        if hours_remaining <= cfg.urgent_window_hours:
            return ProactiveSuggestionItem(
                id=f"rule-sug-{task.id}-urgent",
                task_id=task.id,
                title=f"Upcoming Urgent Deadline: {task.title}",
                description=(
                    f"Due in {hours_remaining:.1f} hours for {task.course}. "
                    f"Estimated effort: {task.estimated_minutes} minutes."
                ),
                category="academic_deadline",
                priority="urgent",
                confidence=0.95,
                is_simulated=False,
                explanation=SuggestionExplanation(
                    trigger=(
                        f"Deterministic Rule: Deadline is in {hours_remaining:.1f}h, "
                        f"which is within the urgent threshold ({cfg.urgent_window_hours:.0f}h)."
                    ),
                    interruption_cost=(
                        "Low Interruption Cost: Timely notification prevents submission failure."
                    ),
                    rationale=(
                        f"Allocating focused time now ensures {task.title} can be submitted before "
                        f"the cutoff without last-minute network/platform congestion."
                    ),
                ),
                created_at=now.isoformat(),
                status="pending",
            )

        # Rule 4: Preparation window (urgent_window_hours < hours_remaining <= upcoming_window_hours)
        if hours_remaining <= cfg.upcoming_window_hours:
            return ProactiveSuggestionItem(
                id=f"rule-sug-{task.id}-upcoming",
                task_id=task.id,
                title=f"Advance Preparation: {task.title}",
                description=(
                    f"Due in {hours_remaining:.1f} hours for {task.course}. "
                    f"Planning a study session now will avoid deadline cramming."
                ),
                category="academic_deadline",
                priority="high",
                confidence=0.85,
                is_simulated=False,
                explanation=SuggestionExplanation(
                    trigger=(
                        f"Deterministic Rule: Deadline is in {hours_remaining:.1f}h, "
                        f"within the advance preparation window ({cfg.upcoming_window_hours:.0f}h)."
                    ),
                    interruption_cost=(
                        "Low Interruption Cost: Non-intrusive nudge scheduled during cognitive recovery."
                    ),
                    rationale=(
                        f"Spacing out study sessions for {task.course} enhances concept retention "
                        f"compared to single-session cramming."
                    ),
                ),
                created_at=now.isoformat(),
                status="pending",
            )

        # Rule 5: Distant deadline (> upcoming_window_hours)
        # Suppress proactive notification to avoid student attention fatigue
        return None

    def evaluate_all(
        self,
        tasks: List[TaskItem],
        config: Optional[DeadlineRuleConfig] = None,
        reference_time: Optional[datetime] = None,
    ) -> List[ProactiveSuggestionItem]:
        """
        Evaluate a collection of tasks and return all triggered proactive suggestions.
        """
        suggestions: List[ProactiveSuggestionItem] = []
        cfg = config or self.config
        ref = reference_time or datetime.now(timezone.utc)

        for task in tasks:
            sug = self.evaluate_task(task, config=cfg, reference_time=ref)
            if sug is not None:
                suggestions.append(sug)

        return suggestions


def get_seed_tasks(reference_time: Optional[datetime] = None) -> List[TaskItem]:
    """
    Generate standard student sample tasks relative to reference_time.
    Provides test cases for:
    1. Urgent upcoming deadline (due in 6 hours, uncompleted) -> Triggers URGENT
    2. Upcoming deadline (due in 28 hours, uncompleted) -> Triggers HIGH
    3. Distant deadline (due in 96 hours, uncompleted) -> Does NOT trigger
    4. Completed task (due in 4 hours, is_completed=True) -> Does NOT trigger
    """
    now = reference_time or datetime.now(timezone.utc)

    return [
        TaskItem(
            id="task-1",
            title="Complete Raft Consensus Node Heartbeat RPC",
            course="CS401: Distributed Systems",
            deadline=now + timedelta(hours=6),
            is_completed=False,
            estimated_minutes=90,
            tags=["Lab 3", "Go", "High Weightage"],
        ),
        TaskItem(
            id="task-2",
            title="Revise Graph Convolutional Networks (GCN) Lecture Notes",
            course="CS425: Deep Learning for Vision & Graph",
            deadline=now + timedelta(hours=28),
            is_completed=False,
            estimated_minutes=45,
            tags=["Quiz Prep", "Module 4"],
        ),
        TaskItem(
            id="task-3",
            title="Draft Methodology Section for B.Tech Capstone Report",
            course="CS499: Senior Capstone Project",
            deadline=now + timedelta(hours=96),
            is_completed=False,
            estimated_minutes=120,
            tags=["Project", "Documentation"],
        ),
        TaskItem(
            id="task-4",
            title="Review Peer PR: Memory Leak Fix in Ingestion Pipeline",
            course="Open Source Practicum",
            deadline=now + timedelta(hours=4),
            is_completed=True,  # Already completed
            estimated_minutes=30,
            tags=["Code Review", "Git"],
        ),
    ]


proactive_engine = ProactiveDeadlineRuleEngine()
