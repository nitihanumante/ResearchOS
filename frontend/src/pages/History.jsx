import { useEffect, useState } from "react";
import {
  FileText,
  Eye,
  Trash2,
  RefreshCw,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getHistory,
  deleteReport,
} from "../services/api";

import styles from "./History.module.css";

function History() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD RESEARCH HISTORY
  // ==========================================

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHistory();

      const history = Array.isArray(data)
        ? data
        : data?.reports || [];

      setReports(history);
    } catch (err) {
      console.error("Failed to load history:", err);
      setError("Unable to load research history.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD HISTORY WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    loadHistory();
  }, []);

  // ==========================================
  // VIEW REPORT
  // ==========================================

  const handleView = (report) => {
    if (!report?.report_id) {
      return;
    }

    navigate(`/report/${report.report_id}`);
  };

  // ==========================================
  // DELETE REPORT
  // ==========================================

  const handleDelete = async (reportId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this research report?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      // Delete the report from the backend
      await deleteReport(reportId);

      // Remove the report from the UI
      setReports((previous) =>
        previous.filter(
          (report) => report.report_id !== reportId
        )
      );
    } catch (err) {
      console.error("Failed to delete report:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to delete research report."
      );
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date unavailable";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString();
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className={styles.page}>

      {/* ======================================
          HEADER
      ====================================== */}

      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            Research History
          </h1>

          <p className={styles.subtitle}>
            View and manage your previously generated
            research reports.
          </p>
        </div>

        <button
          className={styles.refreshButton}
          onClick={loadHistory}
          disabled={loading}
        >
          <RefreshCw
            size={18}
            className={loading ? styles.spin : ""}
          />

          <span>Refresh</span>
        </button>
      </div>

      {/* ======================================
          ERROR MESSAGE
      ====================================== */}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {/* ======================================
          LOADING
      ====================================== */}

      {loading ? (
        <div className={styles.loading}>
          <RefreshCw
            size={34}
            className={styles.spin}
          />

          <p>
            Loading research history...
          </p>
        </div>

      ) : reports.length === 0 ? (

        /* ====================================
           EMPTY STATE
        ==================================== */

        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <FileText size={34} />
          </div>

          <h2>
            No Research Reports Yet
          </h2>

          <p>
            Generate your first research report
            from the Dashboard.
          </p>

          <button
            className={styles.startButton}
            onClick={() => navigate("/")}
          >
            Start Research
          </button>
        </div>

      ) : (

        /* ====================================
           REPORT LIST
        ==================================== */

        <>
          <div className={styles.summary}>
            <div className={styles.summaryIcon}>
              <FileText size={20} />
            </div>

            <span>
              {reports.length} Research Report
              {reports.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className={styles.reportList}>

            {reports.map((report) => (
              <article
                className={styles.reportCard}
                key={report.report_id}
              >

                {/* REPORT ICON */}

                <div className={styles.reportIcon}>
                  <FileText size={28} />
                </div>

                {/* REPORT INFORMATION */}

                <div className={styles.reportInfo}>

                  <h2 className={styles.reportTitle}>
                    {report.topic ||
                      "Untitled Research Report"}
                  </h2>

                  <p className={styles.reportId}>
                    Report ID:{" "}
                    {report.report_id}
                  </p>

                  <div className={styles.date}>
                    <Clock size={16} />

                    <span>
                      {formatDate(
                        report.created_at ||
                          report.timestamp ||
                          report.created
                      )}
                    </span>
                  </div>

                </div>

                {/* ACTION BUTTONS */}

                <div className={styles.actions}>

                  {/* VIEW */}

                  <button
                    className={styles.viewButton}
                    onClick={() =>
                      handleView(report)
                    }
                  >
                    <Eye size={18} />

                    <span>
                      View
                    </span>
                  </button>

                  {/* DELETE */}

                  <button
                    className={styles.deleteButton}
                    onClick={() =>
                      handleDelete(
                        report.report_id
                      )
                    }
                  >
                    <Trash2 size={18} />

                    <span>
                      Delete
                    </span>
                  </button>

                </div>

              </article>
            ))}

          </div>
        </>
      )}

    </div>
  );
}

export default History;