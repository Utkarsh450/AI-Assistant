from datetime import datetime

from pydantic import BaseModel


class Conversation(BaseModel):

    user_id: str

    title: str

    thread_id: str

    created_at: datetime