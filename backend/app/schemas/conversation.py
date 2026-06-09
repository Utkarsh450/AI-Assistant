from pydantic import BaseModel


class CreateConversationResponse(BaseModel):
    conversation_id: str
    title: str


class ConversationResponse(BaseModel):
    id: str
    title: str


class ConversationListResponse(BaseModel):
    conversations: list[ConversationResponse]