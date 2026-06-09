from fastapi import FastAPI

from app.api.chat import router as chat_router
from app.api.conversation import (
    router as conversation_router
)

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="ChatGPT Clone",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    chat_router,
    prefix="/api"
)

app.include_router(
    conversation_router,
    prefix="/api"
)


@app.get("/")
async def root():

    return {
        "message": "Server Running 🚀"
    }