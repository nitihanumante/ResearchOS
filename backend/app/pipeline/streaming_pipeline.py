import json
import time

from app.agents.search_agent import search_agent
from app.agents.reader_agent import reader_agent
from app.agents.writer_agent import writer_agent
from app.agents.critic_agent import critic_agent


def stream_event(step, status, data=None):
    """
    Create a Server-Sent Event (SSE) message.
    """

    payload = {
        "step": step,
        "status": status,
        "data": data
    }

    return f"data: {json.dumps(payload)}\n\n"


def run_streaming_pipeline(topic: str):
    """
    Run the complete research pipeline while
    streaming progress and timing information
    to the frontend.
    """

    # ==========================================================
    # TOTAL PIPELINE TIMER
    # ==========================================================

    total_start = time.perf_counter()

    # ==========================================================
    # SEARCH
    # ==========================================================

    yield stream_event(
        "search",
        "started"
    )

    search_start = time.perf_counter()

    try:

        search_results = search_agent.search(topic)

        search_duration = round(
            time.perf_counter() - search_start,
            2
        )

    except Exception as e:

        search_duration = round(
            time.perf_counter() - search_start,
            2
        )

        yield stream_event(
            "search",
            "failed",
            {
                "duration": search_duration,
                "error": str(e)
            }
        )

        return

    yield stream_event(
        "search",
        "completed",
        {
            "results": len(search_results),
            "duration": search_duration
        }
    )

    # ==========================================================
    # READER / DOCUMENT COLLECTION
    # ==========================================================

    yield stream_event(
        "reader",
        "started"
    )

    reader_start = time.perf_counter()

    try:

        documents = reader_agent.read_search_results(
            search_results
        )

        reader_duration = round(
            time.perf_counter() - reader_start,
            2
        )

    except Exception as e:

        reader_duration = round(
            time.perf_counter() - reader_start,
            2
        )

        yield stream_event(
            "reader",
            "failed",
            {
                "duration": reader_duration,
                "error": str(e)
            }
        )

        return

    yield stream_event(
        "reader",
        "completed",
        {
            "documents": len(documents),
            "duration": reader_duration
        }
    )

    # ==========================================================
    # WRITER
    # ==========================================================

    yield stream_event(
        "writer",
        "started"
    )

    writer_start = time.perf_counter()

    try:

        report = writer_agent.write_report(
            topic,
            documents
        )

        writer_duration = round(
            time.perf_counter() - writer_start,
            2
        )

    except Exception as e:

        writer_duration = round(
            time.perf_counter() - writer_start,
            2
        )

        yield stream_event(
            "writer",
            "failed",
            {
                "duration": writer_duration,
                "error": str(e)
            }
        )

        return

    yield stream_event(
        "writer",
        "completed",
        {
            "duration": writer_duration
        }
    )

    # ==========================================================
    # CRITIC
    # ==========================================================

    yield stream_event(
        "critic",
        "started"
    )

    critic_start = time.perf_counter()

    try:

        review = critic_agent.review_report(
            report
        )

        critic_duration = round(
            time.perf_counter() - critic_start,
            2
        )

    except Exception as e:

        critic_duration = round(
            time.perf_counter() - critic_start,
            2
        )

        yield stream_event(
            "critic",
            "failed",
            {
                "duration": critic_duration,
                "error": str(e)
            }
        )

        return

    yield stream_event(
        "critic",
        "completed",
        {
            "duration": critic_duration
        }
    )

    # ==========================================================
    # TOTAL TIME
    # ==========================================================

    total_duration = round(
        time.perf_counter() - total_start,
        2
    )

    # ==========================================================
    # FINAL RESULT
    # ==========================================================

    yield stream_event(
        "completed",
        "success",
        {
            "topic": topic,

            "documents": documents,

            "report": report,

            "review": review,

            "timings": {
                "search": search_duration,
                "reader": reader_duration,
                "writer": writer_duration,
                "critic": critic_duration,
                "total": total_duration
            }
        }
    )