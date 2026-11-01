from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes import health, prediction

app = FastAPI(
    title="Digital Health Twin API",
    description="API for personalized health monitoring and experimental health assessment.",
    version="1.0.0",
)

# Allow the local React frontend and deployed Vercel frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://frontend-dbgkntxs7-git-happens1.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes.
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(prediction.router, prefix="/api", tags=["Prediction"])


@app.get("/")
def root():
    return {
        "message": "Digital Health Twin API is running",
        "status": "success",
    }
