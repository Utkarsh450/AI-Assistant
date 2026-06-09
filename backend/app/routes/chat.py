from fastapi import APIRouter

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/")
def chat_status() -> dict[str, str]:
    return {"message": "chat route ready"}
