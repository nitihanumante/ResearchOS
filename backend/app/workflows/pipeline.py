from app.agents.search_agent import SearchAgent
from app.agents.reader_agent import ReaderAgent
from app.agents.writer_agent import WriterAgent


class ResearchPipeline:
    """
    Orchestrates the complete research workflow.
    """

    def __init__(self):
        self.search_agent = SearchAgent()
        self.reader_agent = ReaderAgent()
        self.writer_agent = WriterAgent()

    def run(self, topic: str):
        print("\n========== RESEARCH PIPELINE ==========")
        print(f"Topic: {topic}")

        # Step 1 - Search
        print("\n[1/3] Searching the web...")
        search_results = self.search_agent.search(topic)

        if not search_results:
            return {
                "success": False,
                "message": "No search results found."
            }

        # Step 2 - Read
        print("[2/3] Reading webpages...")
        documents = self.reader_agent.read_search_results(search_results)

        if not documents:
            return {
                "success": False,
                "message": "Unable to read webpage content."
            }

        # Step 3 - Write
        print("[3/3] Generating report...")
        report = self.writer_agent.write_report(topic, documents)

        print("Research completed successfully.")

        return {
            "success": True,
            "topic": topic,
            "search_results": search_results,
            "documents": documents,
            "report": report
        }


pipeline = ResearchPipeline()