from fastapi import APIRouter

from app.services.conversation_service import (
    ConversationService
)

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"]
)


@router.post("/")
async def create_conversation():

    return await ConversationService.create_conversation()


@router.get("/")
async def get_conversations():

    return await ConversationService.get_conversations()


@router.get("/{conversation_id}")
async def get_conversation(
    conversation_id: str
):

    return await ConversationService.get_conversation(
        conversation_id
    )