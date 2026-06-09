from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    MISTRAL_API_KEY: str

    TAVILY_API_KEY: str

    LANGCHAIN_API_KEY: str

    LANGCHAIN_TRACING_V2: bool = True

    LANGCHAIN_PROJECT: str = "react-search-agent"

    MONGODB_URI: str

    DATABASE_NAME: str

    class Config:
        env_file = ".env"


settings = Settings()