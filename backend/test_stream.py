import asyncio

from app.graph.agent import agent


async def main():

    async for event in agent.astream_events(
        {
            "messages": [
                (
                    "user",
                    "Latest AI news"
                )
            ]
        },
        version="v2"
    ):

        print(event)


asyncio.run(main())