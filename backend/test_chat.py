from app.graph.agent import agent

response = agent.invoke(
    {
        "messages": [
            (
                "user",
                "Who is the Prime Minister of India?"
            )
        ]
    }
)

print(response)