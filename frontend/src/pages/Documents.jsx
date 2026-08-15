import { useEffect, useState } from "react";
import {
    ExternalLink,
    FileText,
    RefreshCw,
    Search,
} from "lucide-react";

import { getHistory } from "../services/api";

function Documents() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // =========================================================
    // LOAD DOCUMENTS
    // =========================================================

    const loadDocuments = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getHistory();

            const reports = Array.isArray(data)
                ? data
                : data?.reports || [];

            const allDocuments = [];

            reports.forEach((report) => {
                if (Array.isArray(report.documents)) {
                    report.documents.forEach((document) => {
                        allDocuments.push({
                            ...document,
                            reportId: report.report_id,
                            topic: report.topic,
                        });
                    });
                }
            });

            setDocuments(allDocuments);
        } catch (err) {
            console.error(
                "Failed to load documents:",
                err
            );

            setError(
                "Unable to load research documents."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        loadDocuments();
    }, []);

    // =========================================================
    // SEARCH
    // =========================================================

    const filteredDocuments = documents.filter(
        (document) => {
            const search =
                searchTerm.toLowerCase().trim();

            if (!search) {
                return true;
            }

            return (
                (document.title || "")
                    .toLowerCase()
                    .includes(search) ||

                (document.topic || "")
                    .toLowerCase()
                    .includes(search) ||

                (document.summary || "")
                    .toLowerCase()
                    .includes(search)
            );
        }
    );

    // =========================================================
    // UI
    // =========================================================

    return (
        <div style={styles.container}>

            {/* =================================================
                HEADER
            ================================================= */}

            <div style={styles.header}>

                <div>
                    <h1 style={styles.title}>
                        Documents
                    </h1>

                    <p style={styles.subtitle}>
                        Research sources collected by
                        ResearchOS
                    </p>
                </div>

                <button
                    style={styles.refreshButton}
                    className="documents-refresh"
                    onClick={loadDocuments}
                    disabled={loading}
                >
                    <RefreshCw
                        size={18}
                        className={
                            loading ? "spin" : ""
                        }
                    />

                    <span>
                        {loading
                            ? "Loading..."
                            : "Refresh"}
                    </span>
                </button>

            </div>


            {/* =================================================
                SEARCH
            ================================================= */}

            {!loading &&
                documents.length > 0 && (

                    <div
                        style={
                            styles.searchContainer
                        }
                    >

                        <Search
                            size={21}
                            style={
                                styles.searchIcon
                            }
                        />

                        <input
                            type="text"
                            placeholder="Search research documents..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                            style={
                                styles.searchInput
                            }
                        />

                    </div>
                )}


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div style={styles.error}>

                    <strong>
                        Error
                    </strong>

                    <p>
                        {error}
                    </p>

                </div>
            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div style={styles.center}>

                    <RefreshCw
                        size={36}
                        className="spin"
                    />

                    <p>
                        Loading research documents...
                    </p>

                </div>

            ) : documents.length === 0 ? (

                /* =================================================
                   EMPTY STATE
                ================================================= */

                <div style={styles.empty}>

                    <div
                        style={
                            styles.emptyIcon
                        }
                    >
                        <FileText
                            size={42}
                            strokeWidth={1.6}
                        />
                    </div>

                    <h2>
                        No Documents Yet
                    </h2>

                    <p>
                        Start a research task from the
                        Dashboard to collect research
                        sources.
                    </p>

                </div>

            ) : (

                /* =================================================
                   DOCUMENTS
                ================================================= */

                <div>

                    {/* COUNT */}

                    <div style={styles.count}>

                        Showing{" "}

                        <strong>
                            {filteredDocuments.length}
                        </strong>{" "}

                        of{" "}

                        <strong>
                            {documents.length}
                        </strong>{" "}

                        research source
                        {documents.length !== 1
                            ? "s"
                            : ""}

                    </div>


                    {/* NO SEARCH RESULTS */}

                    {filteredDocuments.length ===
                    0 ? (

                        <div
                            style={
                                styles.noResults
                            }
                        >

                            <Search size={38} />

                            <h3>
                                No matching documents
                            </h3>

                            <p>
                                Try searching with a
                                different keyword.
                            </p>

                        </div>

                    ) : (

                        /* DOCUMENT GRID */

                        <div
                            style={styles.grid}
                            className="documents-grid"
                        >

                            {filteredDocuments.map(
                                (
                                    document,
                                    index
                                ) => (

                                    <div
                                        key={`${document.url || "document"}-${index}`}
                                        style={styles.card}
                                        className="documents-card"
                                    >

                                        {/* =================
                                            DOCUMENT ICON
                                        ================= */}

                                        <div
                                            style={
                                                styles.icon
                                            }
                                        >
                                            <FileText
                                                size={27}
                                            />
                                        </div>


                                        {/* =================
                                            TITLE
                                        ================= */}

                                        <h2
                                            style={
                                                styles.documentTitle
                                            }
                                        >
                                            {document.title ||
                                                "Untitled Research Source"}
                                        </h2>


                                        {/* =================
                                            TOPIC
                                        ================= */}

                                        {document.topic && (

                                            <div
                                                style={
                                                    styles.topic
                                                }
                                            >

                                                <strong>
                                                    Research topic:
                                                </strong>{" "}

                                                {document.topic}

                                            </div>
                                        )}


                                        {/* =================
                                            SOURCE LINK
                                        ================= */}

                                        {document.url && (

                                            <a
                                                href={
                                                    document.url
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={
                                                    styles.link
                                                }
                                                className="documents-link"
                                            >

                                                Open Source

                                                <ExternalLink
                                                    size={16}
                                                />

                                            </a>
                                        )}


                                        {/* =================
                                            SUMMARY
                                        ================= */}

                                        {document.summary && (

                                            <div
                                                style={
                                                    styles.section
                                                }
                                            >

                                                <h3
                                                    style={
                                                        styles.sectionTitle
                                                    }
                                                >
                                                    Summary
                                                </h3>

                                                <p
                                                    style={
                                                        styles.sectionText
                                                    }
                                                >
                                                    {
                                                        document.summary
                                                    }
                                                </p>

                                            </div>
                                        )}


                                        {/* =================
                                            KEY POINTS
                                        ================= */}

                                        {Array.isArray(
                                            document.key_points
                                        ) &&
                                            document
                                                .key_points
                                                .length >
                                                0 && (

                                                <div
                                                    style={
                                                        styles.section
                                                    }
                                                >

                                                    <h3
                                                        style={
                                                            styles.sectionTitle
                                                        }
                                                    >
                                                        Key Points
                                                    </h3>

                                                    <ul
                                                        style={
                                                            styles.list
                                                        }
                                                    >

                                                        {document.key_points.map(
                                                            (
                                                                point,
                                                                pointIndex
                                                            ) => (

                                                                <li
                                                                    key={
                                                                        pointIndex
                                                                    }
                                                                >
                                                                    {
                                                                        point
                                                                    }
                                                                </li>

                                                            )
                                                        )}

                                                    </ul>

                                                </div>
                                            )}

                                    </div>

                                )
                            )}

                        </div>
                    )}

                </div>
            )}


            {/* =================================================
                ANIMATIONS + RESPONSIVE CSS
            ================================================= */}

            <style>
                {`

                    /* Loading animation */

                    .spin {
                        animation:
                            spin 1s linear infinite;
                    }

                    @keyframes spin {
                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }
                    }


                    /* Refresh button */

                    .documents-refresh:hover:not(:disabled) {
                        background: #1d4ed8 !important;
                        transform: translateY(-1px);
                    }


                    .documents-refresh:disabled {
                        opacity: 0.65;
                        cursor: not-allowed;
                    }


                    /* Document card */

                    .documents-card:hover {
                        transform: translateY(-4px);

                        box-shadow:
                            0 14px 32px
                            rgba(
                                37,
                                99,
                                235,
                                0.12
                            ) !important;

                        border-color: #bfdbfe !important;
                    }


                    /* Source link */

                    .documents-link:hover {
                        color: #1d4ed8 !important;
                    }


                    /* Search placeholder */

                    input::placeholder {
                        color: #94a3b8;
                    }


                    /* Search focus */

                    input:focus {
                        border-color: #2563eb !important;

                        box-shadow:
                            0 0 0 3px
                            rgba(
                                37,
                                99,
                                235,
                                0.10
                            );
                    }


                    /* Responsive grid */

                    @media (max-width: 900px) {

                        .documents-grid {
                            grid-template-columns:
                                1fr !important;
                        }

                    }


                    @media (max-width: 600px) {

                        .documents-page {
                            padding: 24px !important;
                        }

                    }

                `}
            </style>

        </div>
    );
}


// =========================================================
// LIGHT THEME STYLES
// =========================================================

const styles = {

    // =====================================================
    // CONTAINER
    // =====================================================

    container: {
        minHeight: "100%",
        width: "100%",

        boxSizing: "border-box",

        padding: "40px",

        background: "#ffffff",

        color: "#0f3b82",

        overflowX: "hidden",
        overflowY: "auto",
    },


    // =====================================================
    // HEADER
    // =====================================================

    header: {
        display: "flex",

        justifyContent:
            "space-between",

        alignItems: "flex-start",

        marginBottom: "30px",

        gap: "20px",
    },


    title: {
        margin: "0 0 8px",

        fontSize: "38px",

        fontWeight: "700",

        color: "#0f3b82",

        lineHeight: "1.2",
    },


    subtitle: {
        margin: 0,

        fontSize: "18px",

        color: "#5274a8",

        lineHeight: "1.5",
    },


    // =====================================================
    // REFRESH BUTTON
    // =====================================================

    refreshButton: {
        display: "flex",

        alignItems: "center",

        justifyContent:
            "center",

        gap: "9px",

        border: "none",

        borderRadius: "10px",

        padding: "13px 22px",

        background: "#2563eb",

        color: "#ffffff",

        fontSize: "15px",

        fontWeight: "600",

        cursor: "pointer",

        transition:
            "all 0.2s ease",

        whiteSpace: "nowrap",
    },


    // =====================================================
    // SEARCH
    // =====================================================

    searchContainer: {
        position: "relative",

        width: "100%",

        maxWidth: "840px",

        marginBottom: "22px",
    },


    searchIcon: {
        position: "absolute",

        left: "17px",

        top: "50%",

        transform:
            "translateY(-50%)",

        color: "#64748b",

        pointerEvents: "none",
    },


    searchInput: {
        width: "100%",

        boxSizing: "border-box",

        padding:
            "15px 18px 15px 50px",

        borderRadius: "12px",

        border:
            "1px solid #dbe3ef",

        background: "#f8fafc",

        color: "#0f3b82",

        fontSize: "16px",

        outline: "none",

        transition:
            "all 0.2s ease",
    },


    // =====================================================
    // ERROR
    // =====================================================

    error: {
        padding:
            "16px 18px",

        marginBottom: "25px",

        borderRadius: "12px",

        background: "#fef2f2",

        border:
            "1px solid #fecaca",

        color: "#b91c1c",
    },


    // =====================================================
    // LOADING
    // =====================================================

    center: {
        minHeight: "400px",

        display: "flex",

        flexDirection:
            "column",

        alignItems: "center",

        justifyContent:
            "center",

        gap: "15px",

        color: "#5274a8",

        fontSize: "16px",
    },


    // =====================================================
    // EMPTY STATE
    // =====================================================

    empty: {
        minHeight: "400px",

        display: "flex",

        flexDirection:
            "column",

        alignItems: "center",

        justifyContent:
            "center",

        textAlign: "center",

        padding: "40px",

        background: "#ffffff",

        border:
            "1px solid #dbe3ef",

        borderRadius: "18px",

        boxShadow:
            "0 6px 20px rgba(15, 59, 130, 0.05)",
    },


    emptyIcon: {
        width: "72px",

        height: "72px",

        display: "flex",

        alignItems: "center",

        justifyContent:
            "center",

        borderRadius: "18px",

        background: "#eff6ff",

        color: "#2563eb",

        marginBottom: "20px",
    },


    // =====================================================
    // COUNT
    // =====================================================

    count: {
        marginBottom: "20px",

        fontSize: "15px",

        color: "#5274a8",
    },


    // =====================================================
    // GRID
    // =====================================================

    grid: {
        display: "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(400px, 1fr))",

        gap: "24px",

        width: "100%",
    },


    // =====================================================
    // CARD
    // =====================================================

    card: {
        background: "#ffffff",

        border:
            "1px solid #dbe3ef",

        borderRadius: "18px",

        padding: "28px",

        boxSizing: "border-box",

        boxShadow:
            "0 6px 20px rgba(15, 59, 130, 0.06)",

        color: "#0f3b82",

        transition:
            "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
    },


    // =====================================================
    // ICON
    // =====================================================

    icon: {
        width: "52px",

        height: "52px",

        display: "flex",

        alignItems: "center",

        justifyContent:
            "center",

        borderRadius: "13px",

        background: "#eff6ff",

        color: "#2563eb",

        marginBottom: "18px",
    },


    // =====================================================
    // DOCUMENT TITLE
    // =====================================================

    documentTitle: {
        margin: "0 0 12px",

        fontSize: "21px",

        fontWeight: "700",

        color: "#0f3b82",

        lineHeight: "1.45",
    },


    // =====================================================
    // TOPIC
    // =====================================================

    topic: {
        marginBottom: "14px",

        fontSize: "14px",

        color: "#5274a8",

        lineHeight: "1.5",
    },


    // =====================================================
    // SOURCE LINK
    // =====================================================

    link: {
        display: "inline-flex",

        alignItems: "center",

        gap: "7px",

        marginBottom: "20px",

        color: "#2563eb",

        textDecoration: "none",

        fontSize: "14px",

        fontWeight: "600",

        transition:
            "color 0.2s ease",
    },


    // =====================================================
    // SECTIONS
    // =====================================================

    section: {
        marginTop: "18px",

        paddingTop: "18px",

        borderTop:
            "1px solid #e2e8f0",
    },


    sectionTitle: {
        margin: "0 0 9px",

        fontSize: "17px",

        fontWeight: "700",

        color: "#0f3b82",
    },


    sectionText: {
        margin: 0,

        fontSize: "15px",

        lineHeight: "1.7",

        color: "#475569",
    },


    // =====================================================
    // LIST
    // =====================================================

    list: {
        margin: 0,

        paddingLeft: "21px",

        color: "#475569",

        fontSize: "15px",

        lineHeight: "1.75",
    },


    // =====================================================
    // NO RESULTS
    // =====================================================

    noResults: {
        minHeight: "300px",

        display: "flex",

        flexDirection:
            "column",

        alignItems: "center",

        justifyContent:
            "center",

        textAlign: "center",

        background: "#ffffff",

        border:
            "1px solid #dbe3ef",

        borderRadius: "18px",

        color: "#64748b",

        padding: "40px",
    },
};

export default Documents;