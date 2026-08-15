from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.logger import logger
from app.pipeline.research_pipeline import research_pipeline

router = APIRouter()


# =========================================================
# REQUEST MODEL
# =========================================================

class ResearchRequest(BaseModel):
    topic: str


# =========================================================
# START RESEARCH
# =========================================================

@router.post("/research/start")
async def start_research(request: ResearchRequest):

    try:
        topic = request.topic.strip()

        if not topic:
            raise HTTPException(
                status_code=400,
                detail="Research topic cannot be empty."
            )

        logger.info(
            f"Research started for topic: {topic}"
        )

        # =================================================
        # RUN YOUR ACTUAL RESEARCH PIPELINE
        # =================================================

        result = research_pipeline.run(topic)

        # =================================================
        # VALIDATE RESULT
        # =================================================

        if not result:
            raise HTTPException(
                status_code=500,
                detail="Research pipeline returned no result."
            )

        logger.info(
            f"Research completed successfully. "
            f"Report ID: {result.get('report_id')}"
        )

        # =================================================
        # RETURN RESULT TO FRONTEND
        # =================================================

        return {
            "success": True,
            "report_id": result.get("report_id"),
            "topic": result.get("topic", topic),
            "documents": result.get("documents", []),
            "report": result.get("report", ""),
            "review": result.get("review", {}),
            "created_at": result.get("created_at"),
        }

    except HTTPException:
        raise

    except Exception as e:

        logger.exception(
            "Research pipeline failed."
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        ) from e