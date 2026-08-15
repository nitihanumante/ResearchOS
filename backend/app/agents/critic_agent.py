import json

from groq import Groq
from app.core.settings import settings


class CriticAgent:
    """
    Reviews the generated research report and provides
    a structured quality assessment.
    """

    def __init__(self):
        self.client = Groq(
            api_key=settings.GROQ_API_KEY
        )

    def review_report(self, report: str):
        """
        Reviews the final research report and returns
        structured quality feedback.
        """

        if not report:
            return {
                "score": 0,
                "rating": "Poor",
                "strengths": [],
                "weaknesses": [],
                "suggestions": [],
                "review": "No report was provided for review."
            }

        prompt = f"""
You are an expert research reviewer.

Review the following research report carefully.

Evaluate it based on:

1. Accuracy
2. Completeness
3. Organization
4. Clarity
5. Source/research coverage
6. Missing information
7. Overall quality

Give the report an overall score from 0 to 100.

Use this rating scale:

90-100 = Excellent
75-89 = Good
60-74 = Average
40-59 = Needs Improvement
0-39 = Poor

Return ONLY valid JSON.

The JSON must have exactly this structure:

{{
    "score": 0,
    "rating": "Good",
    "strengths": [
        "strength 1",
        "strength 2",
        "strength 3"
    ],
    "weaknesses": [
        "weakness 1",
        "weakness 2"
    ],
    "suggestions": [
        "suggestion 1",
        "suggestion 2"
    ],
    "review": "A short overall assessment of the report."
}}

Research Report:

{report}
"""

        try:

            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                temperature=0.2,
                max_tokens=700,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an expert research reviewer. "
                            "Always return valid JSON when requested."
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            text = response.choices[0].message.content.strip()

            # Remove markdown code fences if the model adds them
            if text.startswith("```json"):
                text = text[7:]

            elif text.startswith("```"):
                text = text[3:]

            if text.endswith("```"):
                text = text[:-3]

            text = text.strip()

            review_data = json.loads(text)

            # Validate score
            score = review_data.get("score", 0)

            try:
                score = int(score)
            except (ValueError, TypeError):
                score = 0

            score = max(0, min(100, score))

            # Make sure lists exist
            strengths = review_data.get(
                "strengths",
                []
            )

            weaknesses = review_data.get(
                "weaknesses",
                []
            )

            suggestions = review_data.get(
                "suggestions",
                []
            )

            if not isinstance(strengths, list):
                strengths = [str(strengths)]

            if not isinstance(weaknesses, list):
                weaknesses = [str(weaknesses)]

            if not isinstance(suggestions, list):
                suggestions = [str(suggestions)]

            return {
                "score": score,
                "rating": review_data.get(
                    "rating",
                    self._get_rating(score)
                ),
                "strengths": strengths,
                "weaknesses": weaknesses,
                "suggestions": suggestions,
                "review": review_data.get(
                    "review",
                    ""
                )
            }

        except json.JSONDecodeError:

            # Fallback if Groq doesn't return valid JSON
            return {
                "score": 0,
                "rating": "Unable to Score",
                "strengths": [],
                "weaknesses": [],
                "suggestions": [],
                "review": text
                    if "text" in locals()
                    else "Unable to generate review."
            }

        except Exception as e:

            print(
                f"Critic Agent Error: {e}"
            )

            return {
                "score": 0,
                "rating": "Unable to Score",
                "strengths": [],
                "weaknesses": [],
                "suggestions": [],
                "review": (
                    "The critic agent could not "
                    "complete the review."
                )
            }

    def _get_rating(self, score: int):
        """
        Converts numerical score into a rating.
        """

        if score >= 90:
            return "Excellent"

        if score >= 75:
            return "Good"

        if score >= 60:
            return "Average"

        if score >= 40:
            return "Needs Improvement"

        return "Poor"


critic_agent = CriticAgent()