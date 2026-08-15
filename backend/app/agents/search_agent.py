from tavily import TavilyClient
from app.core.settings import settings


class SearchAgent:
    """
    AI Agent responsible for searching the web.
    """

    def __init__(self):
        self.client = TavilyClient(
            api_key=settings.TAVILY_API_KEY
        )

    def search(self, query: str):
        try:
            print(f"Searching web for: {query}")

            response = self.client.search(
                query=query,
                search_depth="basic",
                max_results=6,
                include_answer=False,
            )

            results = response.get("results", [])

            print(
                f"Search completed. "
                f"Found {len(results)} sources."
            )

            return results

        except Exception as e:
            print(f"Search error: {e}")
            return []


# Create singleton instance
search_agent = SearchAgent()