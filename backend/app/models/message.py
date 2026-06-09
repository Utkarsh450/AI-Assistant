from datetime import datetime

from pydantic import BaseModel


class Message(BaseModel):

    conversation_id: str

    role: str

    content: str

    created_at: datetime