from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent

from app.core.config import settings
from app.graph.tools import TOOLS


model = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=settings.GROQ_API_KEY,
    temperature=0.2,
)

agent = create_react_agent(
    model=model,
    tools=TOOLS,

)