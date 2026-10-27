import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_health_check():
    """Verify that the top-level GET /health endpoint returns HTTP 200 and healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "timestamp" in data
    assert "service" in data


def test_v1_health_check():
    """Verify that GET /api/v1/health returns HTTP 200 and healthy status."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["environment"] == "development"


def test_not_found_endpoint():
    """Verify that querying a non-existent route returns HTTP 404."""
    response = client.get("/api/v1/non_existent_route")
    assert response.status_code == 404


def test_current_context_endpoint():
    """Verify that GET /api/v1/context/current returns structured student state."""
    response = client.get("/api/v1/context/current")
    assert response.status_code == 200
    data = response.json()
    assert data["is_simulated"] is True
    assert "focus_state" in data
    assert "interruption_score" in data["focus_state"]
    assert "academic_context" in data


def test_proactive_suggestions_endpoint():
    """Verify that GET /api/v1/suggestions/proactive returns suggestions with explainability metadata."""
    response = client.get("/api/v1/suggestions/proactive")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    first_suggestion = data[0]
    assert "id" in first_suggestion
    assert "title" in first_suggestion
    assert "explanation" in first_suggestion
    assert "trigger" in first_suggestion["explanation"]
    assert "interruption_cost" in first_suggestion["explanation"]
