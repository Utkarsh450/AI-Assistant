from datetime import datetime

from bson import ObjectId

from langchain_core.messages import (
    HumanMessage,
    AIMessage,
)

from app.database.session import database
from app.graph.agent import agent


class ChatService:

    @staticmethod
    async def get_messages(
        conversation_id: str,
    ):
        messages = await (
            database.messages.find(
                {
                    "conversation_id": conversation_id
                }
            )
            .sort("created_at", 1)
            .to_list(None)
        )

        return messages

    @staticmethod
    def convert_messages(
        db_messages,
    ):
        messages = []

        for msg in db_messages:

            if msg["role"] == "user":

                messages.append(
                    HumanMessage(
                        content=msg["content"]
                    )
                )

            elif msg["role"] == "assistant":

                messages.append(
                    AIMessage(
                        content=msg["content"]
                    )
                )

        return messages

    @staticmethod
    async def save_message(
        conversation_id: str,
        role: str,
        content: str,
    ):
        await database.messages.insert_one(
            {
                "conversation_id": conversation_id,
                "role": role,
                "content": content,
                "created_at": datetime.utcnow(),
            }
        )

    @classmethod
    async def chat(
        cls,
        conversation_id: str,
        user_message: str,
    ):

        # Load previous conversation history
        db_messages = await cls.get_messages(
            conversation_id
        )

        # Convert MongoDB messages -> LangChain messages
        messages = cls.convert_messages(
            db_messages
        )

        # Append latest user message
        messages.append(
            HumanMessage(
                content=user_message
            )
        )

        # Invoke LangGraph Agent
        response = await agent.ainvoke(
            {
                "messages": messages
            }
        )

        print("\n===== RAW AGENT RESPONSE =====\n")
        print(response)

        ai_response = response["messages"][-1].content

        # Set title on first message
        conversation = await database.conversations.find_one(
            {
                "_id": ObjectId(conversation_id)
            }
        )

        if conversation and not conversation.get("title"):

            await database.conversations.update_one(
                {
                    "_id": ObjectId(conversation_id)
                },
                {
                    "$set": {
                        "title": user_message[:50]
                    }
                }
            )

        # Save user message
        await cls.save_message(
            conversation_id=conversation_id,
            role="user",
            content=user_message,
        )

        # Save assistant response
        await cls.save_message(
            conversation_id=conversation_id,
            role="assistant",
            content=ai_response,
        )

        # Update conversation timestamp
        await database.conversations.update_one(
            {
                "_id": ObjectId(conversation_id)
            },
            {
                "$set": {
                    "updated_at": datetime.utcnow()
                }
            }
        )

        return {
            "response": ai_response
        }

    @classmethod
    async def stream_chat(
        cls,
        conversation_id: str,
        user_message: str,
    ):

        db_messages = await cls.get_messages(
            conversation_id
        )

        messages = cls.convert_messages(
            db_messages
        )

        messages.append(
            HumanMessage(
                content=user_message
            )
        )

        final_response = ""

        async for event in agent.astream_events(
            {
                "messages": messages
            },
            version="v2"
        ):

            if event["event"] == "on_chat_model_stream":

                chunk = event["data"]["chunk"]

                if chunk.content:

                    final_response += chunk.content

                    yield chunk.content

        # Set title on first message
        conversation = await database.conversations.find_one(
            {
                "_id": ObjectId(conversation_id)
            }
        )

        if conversation and not conversation.get("title"):

            await database.conversations.update_one(
                {
                    "_id": ObjectId(conversation_id)
                },
                {
                    "$set": {
                        "title": user_message[:50]
                    }
                }
            )

        # Save user message
        await cls.save_message(
            conversation_id=conversation_id,
            role="user",
            content=user_message,
        )

        # Save assistant response
        await cls.save_message(
            conversation_id=conversation_id,
            role="assistant",
            content=final_response,
        )

        # Update conversation timestamp
        await database.conversations.update_one(
            {
                "_id": ObjectId(conversation_id)
            },
            {
                "$set": {
                    "updated_at": datetime.utcnow()
                }
            }
        )