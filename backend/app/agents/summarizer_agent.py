from groq import Groq

from app.core.settings import settings


class SummarizerAgent:
    """
    AI agent responsible for summarizing webpage content
    and extracting structured key points.
    """

    def __init__(self):
        self.client = Groq(
            api_key=settings.GROQ_API_KEY
        )

    def summarize(self, title: str, content: str):
        """
        Summarize article content and extract key points.

        Returns:
        {
            "summary": "...",
            "key_points": [
                "...",
                "...",
                "..."
            ]
        }
        """

        # --------------------------------------------------
        # Empty content
        # --------------------------------------------------

        if not content or not content.strip():
            return {
                "summary": "",
                "key_points": []
            }

        # --------------------------------------------------
        # Limit content sent to LLM
        # --------------------------------------------------

        article_text = content.strip()[:5000]

        # --------------------------------------------------
        # Prompt
        # --------------------------------------------------

        prompt = f"""
You are an expert research summarizer.

Analyze the following article and return a structured summary.

Title:
{title}

Article:
{article_text}

Your response MUST follow this exact format:

SUMMARY:
Write a clear summary in 4-5 sentences.

KEY_POINTS:
- Write key point 1
- Write key point 2
- Write key point 3
- Write key point 4
- Write key point 5

Rules:

1. The summary must contain 4-5 sentences.
2. Extract 3-5 important key points.
3. Each key point must be a complete sentence.
4. Do not invent information.
5. Use only information present in the article.
6. Do not add headings other than SUMMARY and KEY_POINTS.
"""

        # --------------------------------------------------
        # Call Groq
        # --------------------------------------------------

        response = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert research "
                        "summarizer who produces "
                        "structured and factual output."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
            max_tokens=500,
        )

        # --------------------------------------------------
        # Get LLM response
        # --------------------------------------------------

        text = response.choices[0].message.content

        if not text:
            return {
                "summary": "",
                "key_points": []
            }

        text = text.strip()

        # --------------------------------------------------
        # Parse SUMMARY
        # --------------------------------------------------

        summary = ""

        if "SUMMARY:" in text:

            summary_part = text.split(
                "SUMMARY:",
                1
            )[1]

            if "KEY_POINTS:" in summary_part:

                summary = summary_part.split(
                    "KEY_POINTS:",
                    1
                )[0].strip()

            else:

                summary = summary_part.strip()

        # --------------------------------------------------
        # Parse KEY POINTS
        # --------------------------------------------------

        key_points = []

        if "KEY_POINTS:" in text:

            key_points_part = text.split(
                "KEY_POINTS:",
                1
            )[1].strip()

            lines = key_points_part.splitlines()

            for line in lines:

                line = line.strip()

                # Remove bullet markers
                if line.startswith("-"):
                    line = line[1:].strip()

                elif line.startswith("*"):
                    line = line[1:].strip()

                # Remove numbered markers
                elif len(line) >= 2 and line[0].isdigit():

                    if line[1] in [".", ")"]:
                        line = line[2:].strip()

                # Ignore empty lines
                if line:
                    key_points.append(line)

        # --------------------------------------------------
        # Fallback
        # --------------------------------------------------

        # If the model didn't follow the exact format,
        # don't lose the generated response.

        if not summary:

            summary = text

        # Limit to 5 key points
        key_points = key_points[:5]

        # --------------------------------------------------
        # Return structured result
        # --------------------------------------------------

        return {
            "summary": summary,
            "key_points": key_points
        }


# ----------------------------------------------------------
# Singleton instance
# ----------------------------------------------------------

summarizer = SummarizerAgent()