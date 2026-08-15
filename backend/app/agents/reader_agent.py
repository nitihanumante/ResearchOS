import requests
import trafilatura

from concurrent.futures import ThreadPoolExecutor, as_completed

from app.agents.summarizer_agent import summarizer


class ReaderAgent:

    def __init__(self, timeout=10, max_workers=5):
        self.timeout = timeout
        self.max_workers = max_workers

    def read_url(self, url: str):
        try:
            response = requests.get(
                url,
                headers={
                    "User-Agent": "Mozilla/5.0"
                },
                timeout=self.timeout,
            )

            response.raise_for_status()

            text = trafilatura.extract(response.text)

            return text if text else ""

        except Exception as e:
            print(f"Error reading {url}: {e}")
            return ""

    def process_result(self, result):
        """
        Read and summarize one search result.
        This function is executed concurrently.
        """

        url = result.get("url")
        title = result.get("title", "Untitled")

        if not url:
            return None

        print(f"Reading: {url}")

        content = self.read_url(url)

        if not content:
            return None

        clean_text = content.strip()

        try:
            summary_data = summarizer.summarize(
                title,
                clean_text
            )

            return {
                "title": title,
                "url": url,
                "summary": summary_data.get(
                    "summary",
                    ""
                ),
                "key_points": summary_data.get(
                    "key_points",
                    []
                ),
            }

        except Exception as e:
            print(
                f"Error summarizing {title}: {e}"
            )

            return None

    def read_search_results(self, search_results):

        documents = []

        if not search_results:
            return documents

        print(
            f"\nReading {len(search_results)} "
            f"sources concurrently..."
        )

        # Limit the number of sources processed
        # during one research request.
        search_results = search_results[:8]

        with ThreadPoolExecutor(
            max_workers=self.max_workers
        ) as executor:

            futures = [
                executor.submit(
                    self.process_result,
                    result
                )
                for result in search_results
            ]

            for future in as_completed(futures):

                try:
                    document = future.result()

                    if document:
                        documents.append(document)

                        print(
                            f"Completed: "
                            f"{document['title']}"
                        )

                except Exception as e:

                    print(
                        f"Reader worker error: {e}"
                    )

        print(
            f"\nSuccessfully processed "
            f"{len(documents)} sources."
        )

        return documents


reader_agent = ReaderAgent()