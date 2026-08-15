import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    FileText,
    Loader2,
    ExternalLink,
    CheckCircle,
    AlertTriangle,
    Lightbulb,
    Award,
} from "lucide-react";

import { getReport } from "../services/api";
import styles from "./Report.module.css";


function Report() {

    const { reportId } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // LOAD REPORT
    // =========================================================

    useEffect(() => {

        const loadReport = async () => {

            try {

                setLoading(true);
                setError("");

                const data = await getReport(reportId);

                console.log("Report loaded:", data);

                setReport(data);

            } catch (err) {

                console.error(
                    "Failed to load report:",
                    err
                );

                setError(
                    err.response?.data?.detail ||
                    "Failed to load the research report."
                );

            } finally {

                setLoading(false);

            }

        };


        if (reportId) {

            loadReport();

        } else {

            setLoading(false);

            setError(
                "No report ID was provided."
            );

        }

    }, [reportId]);


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className={styles.center}>

                <Loader2
                    size={42}
                    className={styles.spinner}
                />

                <h2>
                    Loading Research Report
                </h2>

                <p>
                    Please wait while the report
                    is being loaded...
                </p>

            </div>
        );

    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (
            <div className={styles.center}>

                <FileText size={50} />

                <h2>
                    Unable to Load Report
                </h2>

                <p>
                    {error}
                </p>

                <button
                    className={styles.backButton}
                    onClick={() =>
                        navigate("/history")
                    }
                >
                    <ArrowLeft size={18} />

                    Back to History
                </button>

            </div>
        );

    }


    // =========================================================
    // NOT FOUND
    // =========================================================

    if (!report) {

        return (
            <div className={styles.center}>

                <FileText size={50} />

                <h2>
                    Report Not Found
                </h2>

                <p>
                    The requested research report
                    could not be found.
                </p>

                <button
                    className={styles.backButton}
                    onClick={() =>
                        navigate("/history")
                    }
                >
                    <ArrowLeft size={18} />

                    Back to History
                </button>

            </div>
        );

    }


    // =========================================================
    // DATA
    // =========================================================

    const documents = Array.isArray(
        report.documents
    )
        ? report.documents
        : [];


    /*
        The updated CriticAgent returns:

        {
            score,
            rating,
            strengths,
            weaknesses,
            suggestions,
            review
        }
    */

    const review =
        report.review &&
        typeof report.review === "object"
            ? report.review
            : null;


    const score = review
        ? Number(review.score) || 0
        : 0;


    const rating = review?.rating ||
        "Not Available";


    const strengths =
        Array.isArray(review?.strengths)
            ? review.strengths
            : [];


    const weaknesses =
        Array.isArray(review?.weaknesses)
            ? review.weaknesses
            : [];


    const suggestions =
        Array.isArray(review?.suggestions)
            ? review.suggestions
            : [];


    const reviewText =
        review?.review || "";


    // =========================================================
    // SCORE COLOR / CLASS
    // =========================================================

    const getScoreClass = () => {

        if (score >= 90) {
            return styles.scoreExcellent;
        }

        if (score >= 75) {
            return styles.scoreGood;
        }

        if (score >= 60) {
            return styles.scoreAverage;
        }

        return styles.scorePoor;

    };


    // =========================================================
    // MAIN UI
    // =========================================================

    return (

        <div className={styles.container}>

            {/* =================================================
                HEADER
            ================================================= */}

            <header className={styles.header}>

                <button
                    className={styles.backButton}
                    onClick={() =>
                        navigate("/history")
                    }
                >

                    <ArrowLeft size={18} />

                    Back to History

                </button>


                <div className={styles.titleSection}>

                    <div className={styles.icon}>
                        <FileText size={30} />
                    </div>


                    <div className={styles.titleContent}>

                        <h1>
                            {report.topic ||
                                "Research Report"}
                        </h1>


                        {report.report_id && (

                            <p>

                                <strong>
                                    Report ID:
                                </strong>{" "}

                                {report.report_id}

                            </p>

                        )}


                        {report.created_at && (

                            <p>

                                <strong>
                                    Created:
                                </strong>{" "}

                                {new Date(
                                    report.created_at
                                ).toLocaleString()}

                            </p>

                        )}

                    </div>

                </div>

            </header>


            {/* =================================================
                QUALITY SCORE
            ================================================= */}

            {review && (

                <section className={styles.qualityCard}>

                    <div className={styles.qualityHeader}>

                        <div>

                            <div
                                className={
                                    styles.qualityTitle
                                }
                            >

                                <Award size={22} />

                                Research Quality

                            </div>

                            <p
                                className={
                                    styles.qualitySubtitle
                                }
                            >
                                AI-powered evaluation of
                                your research report
                            </p>

                        </div>


                        <div
                            className={
                                `${styles.scoreCircle} ${getScoreClass()}`
                            }
                        >

                            <span>
                                {score}
                            </span>

                            <small>
                                /100
                            </small>

                        </div>

                    </div>


                    <div
                        className={
                            styles.scoreProgressBackground
                        }
                    >

                        <div
                            className={
                                `${styles.scoreProgress} ${getScoreClass()}`
                            }
                            style={{
                                width: `${score}%`,
                            }}
                        />

                    </div>


                    <div
                        className={
                            styles.ratingRow
                        }
                    >

                        <span>
                            Overall Rating
                        </span>

                        <strong
                            className={
                                getScoreClass()
                            }
                        >
                            {rating}
                        </strong>

                    </div>

                </section>

            )}


            {/* =================================================
                RESEARCH REPORT
            ================================================= */}

            <section className={styles.card}>

                <div className={styles.cardHeader}>

                    <div>

                        <h2>
                            Research Report
                        </h2>

                        <p
                            className={
                                styles.cardSubtitle
                            }
                        >
                            AI-generated research analysis
                        </p>

                    </div>


                    <div
                        className={
                            styles.cardIcon
                        }
                    >
                        <FileText size={20} />
                    </div>

                </div>


                <div
                    className={
                        styles.reportContent
                    }
                >

                    {typeof report.report ===
                    "string" ? (

                        <div
                            className={
                                styles.reportText
                            }
                        >
                            {report.report}
                        </div>

                    ) : (

                        <pre>
                            {JSON.stringify(
                                report.report,
                                null,
                                2
                            )}
                        </pre>

                    )}

                </div>

            </section>


            {/* =================================================
                CRITIC REVIEW
            ================================================= */}

            {review && (

                <section className={styles.card}>

                    <div className={styles.cardHeader}>

                        <div>

                            <h2>
                                Critic Review
                            </h2>

                            <p
                                className={
                                    styles.cardSubtitle
                                }
                            >
                                AI quality assessment
                            </p>

                        </div>


                        <div
                            className={
                                styles.reviewBadge
                            }
                        >
                            ✓ Reviewed
                        </div>

                    </div>


                    {reviewText && (

                        <div
                            className={
                                styles.reviewSummary
                            }
                        >
                            {reviewText}
                        </div>

                    )}


                    {/* STRENGTHS */}

                    {strengths.length > 0 && (

                        <div
                            className={
                                styles.reviewSection
                            }
                        >

                            <div
                                className={
                                    styles.reviewSectionTitle
                                }
                            >

                                <CheckCircle
                                    size={18}
                                />

                                Strengths

                            </div>


                            <ul>

                                {strengths.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <li key={index}>
                                            {item}
                                        </li>

                                    )
                                )}

                            </ul>

                        </div>

                    )}


                    {/* WEAKNESSES */}

                    {weaknesses.length > 0 && (

                        <div
                            className={
                                styles.reviewSection
                            }
                        >

                            <div
                                className={
                                    styles.reviewSectionTitle
                                }
                            >

                                <AlertTriangle
                                    size={18}
                                />

                                Weaknesses

                            </div>


                            <ul>

                                {weaknesses.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <li key={index}>
                                            {item}
                                        </li>

                                    )
                                )}

                            </ul>

                        </div>

                    )}


                    {/* SUGGESTIONS */}

                    {suggestions.length > 0 && (

                        <div
                            className={
                                styles.reviewSection
                            }
                        >

                            <div
                                className={
                                    styles.reviewSectionTitle
                                }
                            >

                                <Lightbulb
                                    size={18}
                                />

                                Suggestions

                            </div>


                            <ul>

                                {suggestions.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <li key={index}>
                                            {item}
                                        </li>

                                    )
                                )}

                            </ul>

                        </div>

                    )}

                </section>

            )}


            {/* =================================================
                RESEARCH SOURCES
            ================================================= */}

            <section className={styles.card}>

                <div
                    className={
                        styles.sourcesHeader
                    }
                >

                    <div>

                        <h2>
                            Research Sources
                        </h2>

                        <p
                            className={
                                styles.sourceCount
                            }
                        >
                            {documents.length}{" "}
                            {documents.length === 1
                                ? "source"
                                : "sources"}{" "}
                            processed
                        </p>

                    </div>


                    <div
                        className={
                            styles.sourceBadge
                        }
                    >
                        {documents.length}
                    </div>

                </div>


                {documents.length > 0 ? (

                    <div
                        className={
                            styles.sources
                        }
                    >

                        {documents.map(
                            (
                                document,
                                index
                            ) => {

                                const title =
                                    typeof document ===
                                    "string"
                                        ? document
                                        : document.title ||
                                          "Untitled Source";


                                const url =
                                    typeof document ===
                                    "string"
                                        ? ""
                                        : document.url ||
                                          "";


                                const summary =
                                    typeof document ===
                                    "string"
                                        ? ""
                                        : document.summary ||
                                          "";


                                const keyPoints =
                                    typeof document ===
                                    "string"
                                        ? []
                                        : Array.isArray(
                                              document.key_points
                                          )
                                        ? document.key_points
                                        : [];


                                return (

                                    <article
                                        className={
                                            styles.sourceCard
                                        }
                                        key={
                                            document.url ||
                                            index
                                        }
                                    >

                                        <div
                                            className={
                                                styles.sourceTop
                                            }
                                        >

                                            <div
                                                className={
                                                    styles.sourceNumber
                                                }
                                            >

                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}

                                            </div>


                                            <div
                                                className={
                                                    styles.sourceTitleArea
                                                }
                                            >

                                                <h3>
                                                    {title}
                                                </h3>


                                                {url && (

                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={
                                                            styles.sourceUrl
                                                        }
                                                    >

                                                        {url}

                                                        <ExternalLink
                                                            size={13}
                                                        />

                                                    </a>

                                                )}

                                            </div>

                                        </div>


                                        {/* SUMMARY */}

                                        {summary && (

                                            <div
                                                className={
                                                    styles.summarySection
                                                }
                                            >

                                                <h4>
                                                    Summary
                                                </h4>

                                                <p>
                                                    {summary}
                                                </p>

                                            </div>

                                        )}


                                        {/* KEY POINTS */}

                                        {keyPoints.length >
                                            0 && (

                                            <div
                                                className={
                                                    styles.keyPointsSection
                                                }
                                            >

                                                <h4>
                                                    Key Points
                                                </h4>


                                                <ul>

                                                    {keyPoints.map(
                                                        (
                                                            point,
                                                            pointIndex
                                                        ) => (

                                                            <li
                                                                key={
                                                                    pointIndex
                                                                }
                                                            >
                                                                {point}
                                                            </li>

                                                        )
                                                    )}

                                                </ul>

                                            </div>

                                        )}


                                        {/* SOURCE FOOTER */}

                                        {url && (

                                            <div
                                                className={
                                                    styles.sourceFooter
                                                }
                                            >

                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={
                                                        styles.openSourceButton
                                                    }
                                                >

                                                    Open Source

                                                    <ExternalLink
                                                        size={14}
                                                    />

                                                </a>

                                            </div>

                                        )}

                                    </article>

                                );

                            }
                        )}

                    </div>

                ) : (

                    <div
                        className={
                            styles.emptyText
                        }
                    >

                        <FileText size={34} />

                        <p>
                            No research sources were
                            saved for this report.
                        </p>

                    </div>

                )}

            </section>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div className={styles.footer}>

                <button
                    className={
                        styles.footerBackButton
                    }
                    onClick={() =>
                        navigate("/history")
                    }
                >

                    <ArrowLeft size={17} />

                    Return to Research History

                </button>

            </div>

        </div>
    );
}


export default Report;