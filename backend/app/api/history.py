from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
)

from app.database.research_store import (
    get_all_reports,
    get_report,
    delete_report,
)


router = APIRouter(
    prefix="/history",
    tags=["History"],
)


# ============================================================
# GET ALL RESEARCH REPORTS
# ============================================================

@router.get("/")
async def get_history():
    """
    Return all saved research reports.
    """

    reports = get_all_reports()

    return {
        "count": len(reports),
        "reports": reports,
    }


# ============================================================
# GET SINGLE RESEARCH REPORT
# ============================================================

@router.get("/{report_id}")
async def get_history_report(report_id: str):
    """
    Return one research report using its report ID.
    """

    report = get_report(report_id)

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Research report not found.",
        )

    return report


# ============================================================
# DELETE RESEARCH REPORT
# ============================================================

@router.delete("/{report_id}")
async def delete_history_report(report_id: str):
    """
    Delete one research report.
    """

    deleted = delete_report(report_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Research report not found.",
        )

    return {
        "message": "Research report deleted successfully.",
        "report_id": report_id,
    }


# ============================================================
# EXPORT RESEARCH REPORT AS PDF
# ============================================================

@router.get("/{report_id}/pdf")
async def export_report_pdf(report_id: str):
    """
    Generate and download a research report as a PDF.
    """

    # --------------------------------------------------------
    # Get report
    # --------------------------------------------------------

    report = get_report(report_id)

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Research report not found.",
        )

    # --------------------------------------------------------
    # Create PDF in memory
    # --------------------------------------------------------

    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=50,
        leftMargin=50,
        topMargin=50,
        bottomMargin=50,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=22,
        leading=28,
        spaceAfter=20,
    )

    heading_style = ParagraphStyle(
        "Heading",
        parent=styles["Heading2"],
        fontSize=16,
        leading=20,
        spaceBefore=15,
        spaceAfter=10,
    )

    body_style = ParagraphStyle(
        "Body",
        parent=styles["BodyText"],
        fontSize=10.5,
        leading=16,
        spaceAfter=8,
    )

    small_style = ParagraphStyle(
        "Small",
        parent=styles["BodyText"],
        fontSize=9,
        leading=13,
        textColor="#555555",
    )

    story = []

    # --------------------------------------------------------
    # Title
    # --------------------------------------------------------

    topic = report.get(
        "topic",
        "Research Report",
    )

    story.append(
        Paragraph(
            str(topic),
            title_style,
        )
    )

    # --------------------------------------------------------
    # Report ID
    # --------------------------------------------------------

    story.append(
        Paragraph(
            f"<b>Report ID:</b> {report_id}",
            small_style,
        )
    )

    # --------------------------------------------------------
    # Created date
    # --------------------------------------------------------

    if report.get("created_at"):

        story.append(
            Paragraph(
                f"<b>Created:</b> "
                f"{report.get('created_at')}",
                small_style,
            )
        )

    story.append(Spacer(1, 20))

    # --------------------------------------------------------
    # Research Report
    # --------------------------------------------------------

    story.append(
        Paragraph(
            "Research Report",
            heading_style,
        )
    )

    research_report = report.get(
        "report",
        "",
    )

    if isinstance(research_report, str):

        # Split into paragraphs
        paragraphs = research_report.split("\n")

        for paragraph in paragraphs:

            paragraph = paragraph.strip()

            if not paragraph:
                story.append(
                    Spacer(1, 6)
                )
                continue

            # Make simple markdown headings readable
            if paragraph.startswith("#"):

                heading = paragraph.lstrip("#").strip()

                story.append(
                    Paragraph(
                        heading,
                        heading_style,
                    )
                )

            else:

                # Escape problematic HTML characters
                paragraph = (
                    paragraph
                    .replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
                )

                story.append(
                    Paragraph(
                        paragraph,
                        body_style,
                    )
                )

    else:

        story.append(
            Paragraph(
                str(research_report),
                body_style,
            )
        )

    # --------------------------------------------------------
    # Critic Review
    # --------------------------------------------------------

    review = report.get("review")

    if review:

        story.append(
            Spacer(1, 15)
        )

        story.append(
            Paragraph(
                "Critic Review",
                heading_style,
            )
        )

        if isinstance(review, str):

            for paragraph in review.split("\n"):

                paragraph = paragraph.strip()

                if not paragraph:
                    continue

                paragraph = (
                    paragraph
                    .replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
                )

                story.append(
                    Paragraph(
                        paragraph,
                        body_style,
                    )
                )

        else:

            story.append(
                Paragraph(
                    str(review),
                    body_style,
                )
            )

    # --------------------------------------------------------
    # Research Sources
    # --------------------------------------------------------

    documents = report.get("documents")

    if isinstance(documents, list) and documents:

        story.append(
            Spacer(1, 15)
        )

        story.append(
            Paragraph(
                "Research Sources",
                heading_style,
            )
        )

        for index, document_item in enumerate(
            documents,
            start=1,
        ):

            if isinstance(
                document_item,
                dict,
            ):

                source_title = document_item.get(
                    "title",
                    "Untitled Source",
                )

                source_url = document_item.get(
                    "url",
                    "",
                )

                summary = document_item.get(
                    "summary",
                    "",
                )

                story.append(
                    Paragraph(
                        f"<b>{index}. "
                        f"{source_title}</b>",
                        body_style,
                    )
                )

                if source_url:

                    safe_url = (
                        str(source_url)
                        .replace("&", "&amp;")
                        .replace("<", "&lt;")
                        .replace(">", "&gt;")
                    )

                    story.append(
                        Paragraph(
                            safe_url,
                            small_style,
                        )
                    )

                if summary:

                    safe_summary = (
                        str(summary)
                        .replace("&", "&amp;")
                        .replace("<", "&lt;")
                        .replace(">", "&gt;")
                    )

                    story.append(
                        Paragraph(
                            safe_summary,
                            body_style,
                        )
                    )

            else:

                story.append(
                    Paragraph(
                        f"{index}. "
                        f"{str(document_item)}",
                        body_style,
                    )
                )

    # --------------------------------------------------------
    # Build PDF
    # --------------------------------------------------------

    document.build(story)

    buffer.seek(0)

    # --------------------------------------------------------
    # Return PDF
    # --------------------------------------------------------

    filename = (
        f"research_report_{report_id}.pdf"
    )

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                f'attachment; filename="{filename}"'
        },
    )