from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.api.v1.router import api_router
from app.core.logging import setup_logging
from config.settings import settings
from app.db.session import engine
from app.db.base import Base

# Setup logging
logger = setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting AI Surveillance Platform...")
    # Initialize database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database initialized")
    
    yield
    
    # Shutdown
    logger.info("Shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "message": "AI Surveillance Platform API",
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_STR}/docs"
    }

@app.websocket("/ws/detections")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    # Real-time detection streaming logic here
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({"status": "connected"})
    except Exception as e:
        logger.error(f"WebSocket error: {e}")

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )