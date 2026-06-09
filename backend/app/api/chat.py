from fastapi import APIRouter

from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
)

from app.services.chat_service import ChatService

from sse_starlette.sse import EventSourceResponse

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post(
    "/",
    response_model=ChatResponse,
)
async def chat(
    payload: ChatRequest,
):

    response = await ChatService.chat(
        conversation_id=payload.conversation_id,
        user_message=payload.message,
    )

    return response


@router.post("/stream")
async def stream_chat(
    payload: ChatRequest,
):

    async def event_generator():

        async for token in ChatService.stream_chat(
            conversation_id=payload.conversation_id,
            user_message=payload.message,
        ):
            yield {
                "data": token
            }

        yield {
            "data": "[DONE]"
        }

    return EventSourceResponse(
        event_generator()
    
    
    )