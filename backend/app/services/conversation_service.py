from datetime import datetime

from app.database.session import database


class ConversationService:

    @staticmethod
    async def create_conversation():

        conversation = {
            "title": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }

        result = await database.conversations.insert_one(
            conversation
        )

        return {
            "conversation_id": str(
                result.inserted_id
            ),
            "title": None,
        }

    @staticmethod
    async def get_conversations():

        conversations = await (
            database.conversations
            .find()
            .sort("updated_at", -1)
            .to_list(None)
        )

        return [
            {
                "id": str(conv["_id"]),
                "title": conv.get("title")
                or "New Chat",
            }
            for conv in conversations
        ]

    @staticmethod
    async def get_conversation(
        conversation_id: str,
    ):

        messages = await (
            database.messages
            .find(
                {
                    "conversation_id": conversation_id
                }
            )
            .sort("created_at", 1)
            .to_list(None)
        )

        return [
            {
                "id": str(msg["_id"]),
                "role": msg["role"],
                "content": msg["content"],
                "created_at": msg[
                    "created_at"
                ].isoformat(),
            }
            for msg in messages
        
        ]