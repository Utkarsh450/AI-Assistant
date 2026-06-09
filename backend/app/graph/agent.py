from langchain_mistralai import ChatMistralAI
from langgraph.prebuilt import create_react_agent

from app.core.config import settings
from app.graph.tools import TOOLS


model = ChatMistralAI(
    model="mistral-small-latest",
    api_key=settings.MISTRAL_API_KEY,
    temperature=0.2,
)

agent = create_react_agent(
    model=model,
    tools=TOOLS,

)