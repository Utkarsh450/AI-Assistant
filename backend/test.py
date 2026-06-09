import asyncio

from app.database.session import database


async def main():

    collections = await database.list_collection_names()

    print(collections)


asyncio.run(main())