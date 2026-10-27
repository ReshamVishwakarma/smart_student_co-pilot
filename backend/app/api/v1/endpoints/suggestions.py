from datetime import datetime, timezone
from typing import List, Dict, Any
from fastapi import APIRouter

from app.schemas.proactive import (
    TaskItem,
    ProactiveSuggestionItem,
    EvaluateTasksRequest,
)
from app.services.proactive_engine import proactive_engine, get_seed_tasks

router = APIRouter()


@router.get("/proactive", summary="Get Proactive Suggestions (Rule Engine + Foundation)")
async def get_proactive_suggestions() -> List[Dict[str, Any]]:
    """
    Returns proactive AI suggestions:
    - Genuine deterministic rule-based suggestions generated from student task deadlines (is_simulated: False).
    - Foundation wellness placeholder clearly marked (is_simulated: True).
    """
    now = datetime.now(timezone.utc)
    seed_tasks = get_seed_tasks(reference_time=now)
    rule_suggestions = proactive_engine.evaluate_all(seed_tasks, reference_time=now)

    # Convert Pydantic items to dict
    results: List[Dict[str, Any]] = [s.model_dump() for s in rule_suggestions]

    # Include foundation wellness suggestion clearly labeled as simulated
    results.append({
        "id": "sug-wellness-simulated",
        "task_id": "none",
        "title": "Hydration & Eye Strain Break",
        "description": "Continuous typing detected for 42 minutes. Stand up and stretch for 3 minutes to maintain cognitive performance.",
        "category": "wellness_focus",
        "priority": "low",
        "confidence": 0.82,
        "is_simulated": True,
        "explanation": {
            "trigger": "Simulated Telemetry: Focus timer exceeded 40 minutes continuous input.",
            "interruption_cost": "Low (Score: 25/100) - non-intrusive micro-toast between study blocks.",
            "rationale": "Evidence-based Pomodoro pacing mitigates fatigue during prolonged coding.",
        },
        "created_at": now.isoformat(),
        "status": "pending",
    })

    return results


@router.post("/evaluate", summary="Evaluate Custom Tasks with Deterministic Rule Engine")
async def evaluate_custom_tasks(
    payload: EvaluateTasksRequest,
) -> Dict[str, Any]:
    """
    Accepts student tasks and evaluates them deterministically using the Proactive
    Deadline Rule Engine. Returns triggered suggestions and audit metadata.
    """
    ref_time = payload.reference_time or datetime.now(timezone.utc)
    suggestions = proactive_engine.evaluate_all(
        tasks=payload.tasks,
        config=payload.config,
        reference_time=ref_time,
    )

    return {
        "engine": "Deterministic Proactive Deadline Rule Engine (Phase 2)",
        "reference_time": ref_time.isoformat(),
        "evaluated_tasks_count": len(payload.tasks),
        "triggered_suggestions_count": len(suggestions),
        "suggestions": [s.model_dump() for s in suggestions],
    }


@router.get("/tasks/seed", summary="Get Sample Academic Tasks for Testing")
async def get_sample_tasks() -> List[TaskItem]:
    """
    Returns standard student sample tasks used for demonstration:
    - Urgent upcoming deadline (< 12h)
    - Preparation deadline (12h - 48h)
    - Distant deadline (> 48h)
    - Completed task
    """
    return get_seed_tasks()
