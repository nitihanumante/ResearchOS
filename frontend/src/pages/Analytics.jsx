import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { getHistory } from "../services/api";

function Analytics() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHistory();

      if (Array.isArray(data)) {
        setReports(data);
      } else if (data && Array.isArray(data.reports)) {
        setReports(data.reports);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("Unable to load research analytics.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalReports = reports.length;

  const totalDocuments = reports.reduce((total, report) => {
    return (
      total +
      (Array.isArray(report.documents)
        ? report.documents.length
        : 0)
    );
  }, 0);

  const reviewedReports = reports.filter(
    (report) =>
      report.review !== null &&
      report.review !== undefined &&
      report.review !== ""
  ).length;

  const averageDocuments =
    totalReports > 0
      ? (totalDocuments / totalReports).toFixed(1)
      : "0";

  const latestReport =
    reports.length > 0 ? reports[0] : null;

  // ==========================================
  // CHART DATA
  // ==========================================

  const chartData = useMemo(() => {
    return reports
      .slice()
      .reverse()
      .map((report, index) => ({
        name:
          report.topic?.length > 18
            ? report.topic.substring(0, 18) + "..."
            : report.topic || `Report ${index + 1}`,

        documents: Array.isArray(report.documents)
          ? report.documents.length
          : 0,

        reports: 1,
      }));
  }, [reports]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Analytics</h1>

        <p style={styles.subtitle}>
          Loading research analytics...
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* =================================
          HEADER
      ================================= */}

      <div style={styles.header}>

        <div>
          <h1 style={styles.title}>
            Analytics
          </h1>

          <p style={styles.subtitle}>
            Overview of your ResearchOS research activity
          </p>
        </div>

        <button
          style={styles.refreshButton}
          onClick={loadAnalytics}
          disabled={loading}
        >
          🔄 Refresh
        </button>

      </div>


      {/* =================================
          ERROR
      ================================= */}

      {error && (
        <div style={styles.error}>
          ⚠️ {error}
        </div>
      )}


      {/* =================================
          STATISTICS CARDS
      ================================= */}

      <div style={styles.statsGrid}>

        <div style={styles.card}>

          <div style={styles.cardIcon}>
            📄
          </div>

          <div style={styles.cardLabel}>
            Total Research Reports
          </div>

          <div style={styles.cardValue}>
            {totalReports}
          </div>

        </div>


        <div style={styles.card}>

          <div style={styles.cardIcon}>
            📚
          </div>

          <div style={styles.cardLabel}>
            Documents Processed
          </div>

          <div style={styles.cardValue}>
            {totalDocuments}
          </div>

        </div>


        <div style={styles.card}>

          <div style={styles.cardIcon}>
            ✅
          </div>

          <div style={styles.cardLabel}>
            Reports Reviewed
          </div>

          <div style={styles.cardValue}>
            {reviewedReports}
          </div>

        </div>


        <div style={styles.card}>

          <div style={styles.cardIcon}>
            📊
          </div>

          <div style={styles.cardLabel}>
            Avg. Documents / Report
          </div>

          <div style={styles.cardValue}>
            {averageDocuments}
          </div>

        </div>

      </div>


      {/* =================================
          CHARTS
      ================================= */}

      {reports.length > 0 && (
        <div style={styles.chartsGrid}>

          {/* DOCUMENTS CHART */}

          <div style={styles.chartCard}>

            <h2 style={styles.chartTitle}>
              Documents per Research
            </h2>

            <p style={styles.chartSubtitle}>
              Number of documents processed for each
              research report.
            </p>

            <div style={styles.chartContainer}>

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 0,
                    bottom: 60,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#dbe5f1"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    tick={{
                      fontSize: 11,
                      fill: "#475569",
                    }}
                  />

                  <YAxis
                    stroke="#64748b"
                    allowDecimals={false}
                    tick={{
                      fill: "#475569",
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #bfdbfe",
                      borderRadius: "10px",
                      color: "#1e3a8a",
                      boxShadow:
                        "0 6px 20px rgba(37, 99, 235, 0.10)",
                    }}
                    labelStyle={{
                      color: "#1d4ed8",
                      fontWeight: "600",
                    }}
                  />

                  <Bar
                    dataKey="documents"
                    fill="#2563eb"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* RESEARCH ACTIVITY */}

          <div style={styles.chartCard}>

            <h2 style={styles.chartTitle}>
              Research Activity
            </h2>

            <p style={styles.chartSubtitle}>
              Research reports generated in your
              current history.
            </p>

            <div style={styles.chartContainer}>

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 0,
                    bottom: 60,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#dbe5f1"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    tick={{
                      fontSize: 11,
                      fill: "#475569",
                    }}
                  />

                  <YAxis
                    stroke="#64748b"
                    allowDecimals={false}
                    tick={{
                      fill: "#475569",
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #bfdbfe",
                      borderRadius: "10px",
                      color: "#1e3a8a",
                      boxShadow:
                        "0 6px 20px rgba(37, 99, 235, 0.10)",
                    }}
                    labelStyle={{
                      color: "#1d4ed8",
                      fontWeight: "600",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="reports"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: "#2563eb",
                    }}
                    activeDot={{
                      r: 7,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>
      )}


      {/* =================================
          LATEST RESEARCH
      ================================= */}

      <div style={styles.section}>

        <h2 style={styles.sectionTitle}>
          Latest Research
        </h2>

        {latestReport ? (

          <div style={styles.latestCard}>

            <div>

              <div style={styles.latestTopic}>
                {latestReport.topic ||
                  "Untitled Research"}
              </div>

              <div style={styles.latestId}>
                Report ID:{" "}
                {latestReport.report_id || "N/A"}
              </div>

              {latestReport.created_at && (
                <div style={styles.latestDate}>
                  Created:{" "}
                  {new Date(
                    latestReport.created_at
                  ).toLocaleString()}
                </div>
              )}

            </div>

            <div style={styles.latestBadge}>
              {Array.isArray(
                latestReport.documents
              )
                ? `${latestReport.documents.length} documents`
                : "0 documents"}
            </div>

          </div>

        ) : (

          <div style={styles.empty}>

            <div style={styles.emptyIcon}>
              📊
            </div>

            <h3>
              No research activity yet
            </h3>

            <p>
              Start a research project from the
              Dashboard.
            </p>

          </div>

        )}

      </div>


      {/* =================================
          RECENT ACTIVITY
      ================================= */}

      <div style={styles.section}>

        <h2 style={styles.sectionTitle}>
          Recent Research Activity
        </h2>

        {reports.length === 0 ? (

          <div style={styles.empty}>
            <p>
              No research reports available.
            </p>
          </div>

        ) : (

          <div style={styles.activityList}>

            {reports
              .slice(0, 10)
              .map((report, index) => {

                const documentCount =
                  Array.isArray(
                    report.documents
                  )
                    ? report.documents.length
                    : 0;

                return (
                  <div
                    key={
                      report.report_id || index
                    }
                    style={styles.activityItem}
                  >

                    <div
                      style={styles.activityLeft}
                    >

                      <div
                        style={styles.topic}
                      >
                        {report.topic ||
                          "Untitled Research"}
                      </div>

                      <div
                        style={styles.reportId}
                      >
                        Report ID:{" "}
                        {report.report_id ||
                          "N/A"}
                      </div>

                    </div>


                    <div
                      style={styles.activityRight}
                    >

                      <span
                        style={
                          styles.documentBadge
                        }
                      >
                        📚 {documentCount} documents
                      </span>

                      {report.review && (
                        <span
                          style={
                            styles.reviewBadge
                          }
                        >
                          ✓ Reviewed
                        </span>
                      )}

                    </div>

                  </div>
                );
              })}

          </div>

        )}

      </div>

    </div>
  );
}


// ==========================================
// LIGHT THEME STYLES
// ==========================================

const styles = {
  container: {
    padding: "42px 44px 60px",

    minHeight: "100%",

    background: "#ffffff",

    color: "#1e3a8a",

    maxWidth: "1400px",

    margin: "0 auto",

    boxSizing: "border-box",

    overflowY: "auto",
  },

  header: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "20px",

    marginBottom: "32px",
  },

  title: {
    fontSize: "42px",

    fontWeight: "700",

    margin: "0 0 8px 0",

    color: "#2563eb",
  },

  subtitle: {
    fontSize: "18px",

    color: "#64748b",

    margin: 0,

    lineHeight: "1.5",
  },

  refreshButton: {
    display: "flex",

    alignItems: "center",

    gap: "8px",

    border: "1px solid #bfdbfe",

    borderRadius: "10px",

    padding: "11px 18px",

    background: "#eff6ff",

    color: "#2563eb",

    fontSize: "14px",

    fontWeight: "600",

    cursor: "pointer",
  },

  error: {
    padding: "14px 18px",

    marginBottom: "24px",

    borderRadius: "10px",

    background: "#fef2f2",

    border: "1px solid #fecaca",

    color: "#dc2626",
  },

  // ======================================
  // STATISTICS
  // ======================================

  statsGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",

    gap: "20px",

    marginBottom: "24px",
  },

  card: {
    padding: "24px",

    borderRadius: "16px",

    background: "#ffffff",

    border: "1px solid #dbe5f1",

    minHeight: "140px",

    boxSizing: "border-box",

    boxShadow:
      "0 5px 18px rgba(37, 99, 235, 0.06)",
  },

  cardIcon: {
    fontSize: "24px",

    marginBottom: "14px",
  },

  cardLabel: {
    color: "#64748b",

    fontSize: "14px",

    marginBottom: "10px",
  },

  cardValue: {
    fontSize: "32px",

    fontWeight: "700",

    color: "#1d4ed8",
  },

  // ======================================
  // CHARTS
  // ======================================

  chartsGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(420px, 1fr))",

    gap: "20px",

    marginBottom: "24px",
  },

  chartCard: {
    padding: "24px",

    borderRadius: "16px",

    background: "#ffffff",

    border: "1px solid #dbe5f1",

    boxSizing: "border-box",

    boxShadow:
      "0 5px 18px rgba(37, 99, 235, 0.06)",
  },

  chartTitle: {
    margin: "0 0 6px 0",

    fontSize: "20px",

    color: "#1d4ed8",
  },

  chartSubtitle: {
    margin: "0 0 20px 0",

    color: "#64748b",

    fontSize: "13px",
  },

  chartContainer: {
    width: "100%",

    height: "320px",
  },

  // ======================================
  // SECTIONS
  // ======================================

  section: {
    padding: "24px",

    borderRadius: "16px",

    background: "#ffffff",

    border: "1px solid #dbe5f1",

    marginBottom: "24px",

    boxSizing: "border-box",

    boxShadow:
      "0 5px 18px rgba(37, 99, 235, 0.06)",
  },

  sectionTitle: {
    margin: "0 0 20px 0",

    fontSize: "22px",

    color: "#1d4ed8",
  },

  // ======================================
  // LATEST
  // ======================================

  latestCard: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "20px",

    padding: "20px",

    borderRadius: "12px",

    background: "#f8fbff",

    border: "1px solid #dbeafe",
  },

  latestTopic: {
    fontSize: "18px",

    fontWeight: "600",

    color: "#1d4ed8",

    marginBottom: "8px",

    overflowWrap: "anywhere",
  },

  latestId: {
    fontSize: "12px",

    color: "#64748b",

    wordBreak: "break-all",
  },

  latestDate: {
    fontSize: "12px",

    color: "#64748b",

    marginTop: "5px",
  },

  latestBadge: {
    padding: "8px 12px",

    borderRadius: "8px",

    background: "#dbeafe",

    border: "1px solid #bfdbfe",

    color: "#1d4ed8",

    fontSize: "13px",

    fontWeight: "600",

    whiteSpace: "nowrap",
  },

  // ======================================
  // ACTIVITY
  // ======================================

  activityList: {
    display: "flex",

    flexDirection: "column",

    gap: "12px",
  },

  activityItem: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "20px",

    padding: "18px",

    borderRadius: "12px",

    background: "#f8fbff",

    border: "1px solid #dbe5f1",
  },

  activityLeft: {
    flex: 1,

    minWidth: 0,
  },

  topic: {
    fontSize: "16px",

    fontWeight: "600",

    color: "#1d4ed8",

    marginBottom: "6px",

    lineHeight: "1.4",

    overflowWrap: "anywhere",
  },

  reportId: {
    fontSize: "12px",

    color: "#64748b",

    wordBreak: "break-all",
  },

  activityRight: {
    display: "flex",

    alignItems: "center",

    gap: "8px",

    flexWrap: "wrap",

    justifyContent: "flex-end",
  },

  documentBadge: {
    padding: "7px 10px",

    borderRadius: "8px",

    background: "#eff6ff",

    border: "1px solid #dbeafe",

    color: "#1d4ed8",

    fontSize: "12px",

    fontWeight: "600",

    whiteSpace: "nowrap",
  },

  reviewBadge: {
    padding: "7px 10px",

    borderRadius: "8px",

    background: "#f0fdf4",

    border: "1px solid #bbf7d0",

    color: "#15803d",

    fontSize: "12px",

    fontWeight: "600",

    whiteSpace: "nowrap",
  },

  // ======================================
  // EMPTY
  // ======================================

  empty: {
    padding: "50px 20px",

    textAlign: "center",

    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "40px",

    marginBottom: "12px",
  },
};

export default Analytics;