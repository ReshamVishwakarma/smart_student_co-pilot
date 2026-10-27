from datetime import datetime, timezone
from typing import Dict, Any
from fastapi import APIRouter

router = APIRouter()


@router.get("/current", summary="Get Current Student Context State (Simulated)")
async def get_current_context() -> Dict[str, Any]:
    """
    Returns the normalized current student context state.
    Note: Returns simulated foundation data for Phase 1.
    """
    return {
        "is_simulated": True,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "focus_state": {
            "current_mode": "deep_work",
            "session_duration_minutes": 42,
            "interruption_score": 28,  # Low interruption cost -> suggestions permitted
            "is_interruption_allowed": True,
        },
        "academic_context": {
            "current_course": "CS401: Distributed Systems",
            "upcoming_deadline": {
                "title": "Raft Consensus Lab",
                "due_at": "Today, 23:59",
                "hours_remaining": 9.5,
                "urgency": "high",
            },
        },
        "telemetry_context": {
            "active_window": "VS Code - raft.py",
            "ambient_noise_level": "quiet",
            "idle_duration_seconds": 0,
        },
    }
