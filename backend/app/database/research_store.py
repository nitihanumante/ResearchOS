import json
import os


# Path to research_reports.json
REPORTS_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "data",
    "research_reports.json",
)


def load_reports():
    """
    Load all research reports from the JSON file.
    """
    if not os.path.exists(REPORTS_FILE):
        return []

    try:
        with open(REPORTS_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)

            if not isinstance(data, list):
                return []

            return data

    except (json.JSONDecodeError, FileNotFoundError):
        return []


def save_reports(reports):
    """
    Save the complete list of research reports.
    """
    os.makedirs(os.path.dirname(REPORTS_FILE), exist_ok=True)

    with open(REPORTS_FILE, "w", encoding="utf-8") as file:
        json.dump(
            reports,
            file,
            indent=4,
            ensure_ascii=False,
        )


def save_report(report):
    """
    Add a single research report to the stored reports.
    """
    reports = load_reports()

    # Add newest report at the beginning
    reports.insert(0, report)

    save_reports(reports)

    return report


def get_all_reports():
    """
    Return all saved research reports.
    """
    return load_reports()


def get_report(report_id: str):
    """
    Return a single research report by report_id.
    """
    reports = load_reports()

    for report in reports:
        if str(report.get("report_id")) == str(report_id):
            return report

    return None


def get_report_by_id(report_id: str):
    """
    Backward-compatible alias for get_report().
    """
    return get_report(report_id)


def delete_report(report_id: str):
    """
    Delete a research report by report_id.

    Returns:
        True  -> report was found and deleted
        False -> report was not found
    """
    reports = load_reports()

    original_count = len(reports)

    remaining_reports = [
        report
        for report in reports
        if str(report.get("report_id")) != str(report_id)
    ]

    # Report was not found
    if len(remaining_reports) == original_count:
        return False

    # Save updated reports
    save_reports(remaining_reports)

    return True