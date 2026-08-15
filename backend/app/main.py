from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.settings import settings
from app.core.logger import logger

from app.api.routes.health import router as health_router
from app.api.routes.research import router as research_router
from app.api.history import router as history_router


app = FastAPI(
    title=settings.APP_NAME,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    logger.info("ResearchOS Backend Started")


@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.APP_NAME} 🚀"
    }


app.include_router(health_router)
app.include_router(research_router)
app.include_router(history_router)