from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes.health import router as health_router

app = FastAPI(
    title="Digital Health Twin API",
    description="API for the SwasthyaDrishti Digital Health Twin prototype",
    version="1.0.0",
)

# Allow the deployed Vercel frontend to access the Render backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://frontend-dbgkntxs7-git-happens1.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Digital Health Twin API is running",
        "status": "success",
    }


app.include_router(health_router, prefix="/api")