from datetime import datetime

from pydantic import BaseModel, EmailStr


class User(BaseModel):

    email: EmailStr

    name: str

    created_at: datetime