from langchain_tavily import TavilySearch

from app.core.config import settings


search_tool = TavilySearch(
    tavily_api_key=settings.TAVILY_API_KEY,
    max_results=5,
    topic="general",
)

TOOLS = [
    search_tool
]