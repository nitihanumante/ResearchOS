from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "ResearchOS"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = ""

    GROQ_API_KEY: str = ""
    TAVILY_API_KEY: str = ""

    MODEL_NAME: str = "llama-3.3-70b-versatile"

    class Config:
        env_file = ".env"


settings = Settings()