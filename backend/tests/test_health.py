import os

os.environ.setdefault("SECRET_KEY", "test-secret")

from fastapi.testclient import TestClient

from backend.main import app


def test_health_endpoint() -> None:
    client = TestClient(app)
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "MemoryMind AI",
        "version": "0.1.0",
    }
