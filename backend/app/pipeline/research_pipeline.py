import uuid
from datetime import datetime, timezone

from app.database.research_store import save_report

from app.agents.search_agent import search_agent
from app.agents.reader_agent import reader_agent
from app.agents.writer_agent import writer_agent
from app.agents.critic_agent import critic_agent


class ResearchPipeline:
    """
    Orchestrates the complete multi-agent research workflow.

    Workflow:
        Search Agent
              ↓
        Reader Agent
              ↓
        Summarizer
        (inside Reader)
              ↓
        Writer Agent
              ↓
        Critic Agent
              ↓
        Save Report
    """

    def run(self, topic: str):

        print("\n==============================")
        print("Starting Research Pipeline")
        print("==============================")

        if not topic or not topic.strip():
            raise ValueError("Research topic cannot be empty.")

        topic = topic.strip()

        # Generate unique report ID
        report_id = str(uuid.uuid4())

        # ==================================================
        # STEP 1 — SEARCH
        # ==================================================

        print("\n[1/6] Searching web...")

        search_results = search_agent.search(topic)

        print(
            f"Found {len(search_results)} search results."
        )

        # ==================================================
        # STEP 2 — READ DOCUMENTS
        # ==================================================

        print("\n[2/6] Reading webpages...")

        documents = reader_agent.read_search_results(
            search_results
        )

        print(
            f"Processed {len(documents)} documents."
        )

        # ==================================================
        # STEP 3 — GENERATE REPORT
        # ==================================================

        print("\n[3/6] Generating research report...")

        report = writer_agent.write_report(
            topic,
            documents
        )

        if not report:
            raise RuntimeError(
                "Writer agent returned an empty report."
            )

        print("Research report generated successfully.")

        # ==================================================
        # STEP 4 — CRITIC REVIEW
        # ==================================================

        print("\n[4/6] Critic reviewing report...")

        review = critic_agent.review_report(
            report
        )

        print("Critic review completed.")

        # ==================================================
        # STEP 5 — CREATE RESULT
        # ==================================================

        print("\n[5/6] Creating final result...")

        result = {
            "report_id": report_id,
            "topic": topic,
            "documents": documents,
            "report": report,
            "review": review,
            "created_at": datetime.now(
                timezone.utc
            ).isoformat(),
        }

        # ==================================================
        # STEP 6 — SAVE REPORT
        # ==================================================

        print("\n[6/6] Saving report...")

        save_report(result)

        print("Report saved successfully!")
        print(f"Report ID: {report_id}")

        print("\n==============================")
        print("Pipeline Completed Successfully!")
        print("==============================")

        return result


# ==========================================================
# CREATE PIPELINE INSTANCE
# ==========================================================

research_pipeline = ResearchPipeline()