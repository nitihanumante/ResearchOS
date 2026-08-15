from groq import Groq
from app.core.settings import settings


class Summarizer:

    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)

    def summarize(self, title: str, content: str):

        content = content[:3000]

        prompt = f"""
Summarize the following article.

Title:
{title}

Article:
{content}

Return:
1. A short summary (100-150 words)
2. Three key points
"""

        response = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert research summarizer."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
            max_tokens=350,
        )

        return response.choices[0].message.content


summarizer = Summarizer()