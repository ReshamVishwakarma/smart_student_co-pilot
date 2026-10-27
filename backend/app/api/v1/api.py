from fastapi import APIRouter
from app.api.v1.endpoints import health, context, suggestions

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(context.router, prefix="/context", tags=["Context Engine"])
api_router.include_router(suggestions.router, prefix="/suggestions", tags=["Proactive Suggestions"])
