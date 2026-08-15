from groq import Groq

from app.core.settings import settings


class WriterAgent:
    """
    AI agent responsible for writing a research report
    using structured research material extracted from
    multiple sources.
    """

    def __init__(self):
        self.client = Groq(
            api_key=settings.GROQ_API_KEY
        )

    def write_report(
        self,
        topic: str,
        documents: list
    ) -> str:

        # --------------------------------------------------
        # Build research context
        # --------------------------------------------------

        context = ""

        for index, doc in enumerate(documents[:5], start=1):

            title = doc.get(
                "title",
                "Untitled Source"
            )

            url = doc.get(
                "url",
                ""
            )

            summary = doc.get(
                "summary",
                ""
            )

            key_points = doc.get(
                "key_points",
                []
            )

            context += f"""
SOURCE {index}

Title:
{title}

URL:
{url}

Summary:
{summary}

Key Points:
"""

            if key_points:

                for point in key_points:

                    context += f"- {point}\n"

            else:

                context += "- No key points available.\n"

            context += "\n"


        # --------------------------------------------------
        # Prompt
        # --------------------------------------------------

        prompt = f"""
You are a professional AI research assistant.

Research Topic:
{topic}

Using ONLY the research material provided below,
write a detailed and well-structured research report.

IMPORTANT RULES:

1. Do not invent facts.
2. Do not introduce information that is not present
   in the research material.
3. Combine information from multiple sources where
   appropriate.
4. Avoid repeating the same information.
5. Keep the report objective and informative.
6. Clearly distinguish findings from general discussion.
7. Use the provided sources as evidence.
8. Write naturally and professionally.

The report MUST contain these sections:

1. Introduction

2. Key Findings

3. Advantages

4. Challenges

5. Future Trends

6. Conclusion

For the Key Findings section, prioritize the
important points extracted from the sources.

Research Material:

{context}
"""


        # --------------------------------------------------
        # Generate report
        # --------------------------------------------------

        response = self.client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[

                {
                    "role": "system",

                    "content": (
                        "You are an expert research writer "
                        "who produces accurate, structured "
                        "and evidence-based reports."
                    )
                },

                {
                    "role": "user",

                    "content": prompt
                }

            ],

            temperature=0.3,

            max_tokens=2500
        )


        # --------------------------------------------------
        # Return report
        # --------------------------------------------------

        return response.choices[0].message.content


# ----------------------------------------------------------
# Singleton instance
# ----------------------------------------------------------

writer_agent = WriterAgent()