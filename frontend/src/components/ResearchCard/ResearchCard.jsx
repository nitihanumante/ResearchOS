import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, FileText } from "lucide-react";

import { startResearch } from "../../services/api";

import styles from "./ResearchCard.module.css";


function ResearchCard() {

    const navigate = useNavigate();

    const [topic, setTopic] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [result, setResult] = useState(null);


    const [steps, setSteps] = useState([
        {
            id: "search",
            title: "Searching the web",
            description: "Waiting to start",
            status: "pending",
        },
        {
            id: "reader",
            title: "Collecting documents",
            description: "Waiting to start",
            status: "pending",
        },
        {
            id: "writer",
            title: "Building research report",
            description: "Waiting to start",
            status: "pending",
        },
        {
            id: "critic",
            title: "Reviewing research",
            description: "Waiting to start",
            status: "pending",
        },
    ]);


    const updateStep = (id, status, description) => {

        setSteps((currentSteps) =>
            currentSteps.map((step) =>
                step.id === id
                    ? {
                        ...step,
                        status,
                        description,
                    }
                    : step
            )
        );

    };


    const start = async () => {

        if (!topic.trim()) {

            setError("Please enter a research topic.");

            return;
        }


        setError("");

        setResult(null);

        setLoading(true);


        // ==========================================
        // RESET STEPS
        // ==========================================

        setSteps([
            {
                id: "search",
                title: "Searching the web",
                description: "Finding relevant research sources...",
                status: "active",
            },
            {
                id: "reader",
                title: "Collecting documents",
                description: "Waiting to start",
                status: "pending",
            },
            {
                id: "writer",
                title: "Building research report",
                description: "Waiting to start",
                status: "pending",
            },
            {
                id: "critic",
                title: "Reviewing research",
                description: "Waiting to start",
                status: "pending",
            },
        ]);


        try {

            // ==========================================
            // CALL BACKEND
            // ==========================================

            const data = await startResearch(topic.trim());


            // ==========================================
            // SEARCH COMPLETED
            // ==========================================

            updateStep(
                "search",
                "completed",
                data?.documents
                    ? `${data.documents.length} sources processed`
                    : "Research sources found"
            );


            // ==========================================
            // DOCUMENTS
            // ==========================================

            updateStep(
                "reader",
                "completed",
                data?.documents
                    ? `${data.documents.length} documents processed`
                    : "Documents processed"
            );


            // ==========================================
            // REPORT
            // ==========================================

            updateStep(
                "writer",
                "completed",
                "Research report generated"
            );


            // ==========================================
            // REVIEW
            // ==========================================

            updateStep(
                "critic",
                "completed",
                data?.review
                    ? "Quality review completed"
                    : "Research review completed"
            );


            // ==========================================
            // SAVE RESULT
            // ==========================================

            setResult(data);


        } catch (err) {

            console.error(
                "Research failed:",
                err
            );


            setError(
                err?.response?.data?.detail ||
                err?.message ||
                "Research failed. Please make sure the backend is running."
            );


            setSteps((currentSteps) =>
                currentSteps.map((step) => {

                    if (step.status === "active") {

                        return {
                            ...step,
                            status: "failed",
                            description: "Research step failed",
                        };

                    }

                    return step;

                })
            );

        } finally {

            setLoading(false);

        }

    };


    const viewReport = () => {

        if (!result?.report_id) {

            setError(
                "Report ID is missing. Please try the research again."
            );

            return;
        }


        navigate(
            `/report/${result.report_id}`
        );

    };


    return (

        <div className={styles.card}>

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className={styles.header}>

                <h2>
                    AI Research Assistant
                </h2>

                <p>
                    Enter a topic to generate an AI-powered
                    research report.
                </p>

            </div>


            {/* ==========================================
                TOPIC INPUT
            ========================================== */}

            <textarea
                value={topic}
                onChange={(event) =>
                    setTopic(event.target.value)
                }
                placeholder="Example: Artificial Intelligence in Healthcare"
                disabled={loading}
            />


            {/* ==========================================
                START BUTTON
            ========================================== */}

            <button
                onClick={start}
                disabled={loading}
            >

                <Rocket
                    size={18}
                    style={{
                        verticalAlign: "middle",
                        marginRight: "8px",
                    }}
                />

                {loading
                    ? "Researching..."
                    : "Start Research"}

            </button>


            {/* ==========================================
                ERROR
            ========================================== */}

            {error && (

                <div className={styles.error}>

                    <strong>
                        Research Error
                    </strong>

                    <p>
                        {error}
                    </p>

                </div>

            )}


            {/* ==========================================
                PROGRESS
            ========================================== */}

            {(loading || result) && (

                <div className={styles.progress}>

                    <h3>
                        Research Progress
                    </h3>


                    {steps.map((step) => (

                        <div
                            key={step.id}
                            className={`${styles.step} ${styles[step.status]}`}
                        >

                            {/* ICON */}

                            <div className={styles.icon}>

                                {step.status === "completed"
                                    ? "✓"
                                    : step.status === "failed"
                                        ? "!"
                                        : step.status === "active"
                                            ? "•"
                                            : "○"
                                }

                            </div>


                            {/* TEXT */}

                            <div style={{ flex: 1 }}>

                                <strong>
                                    {step.title}
                                </strong>

                                <p>
                                    {step.description}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}


            {/* ==========================================
                RESULT
            ========================================== */}

            {result && (

                <div className={styles.result}>

                    <h3>
                        🎉 Research completed successfully!
                    </h3>

                    <p>
                        Your research report has been generated.
                    </p>


                    {/* REPORT ID */}

                    {result.report_id && (

                        <div className={styles.reportId}>

                            <span>
                                Report ID
                            </span>

                            <code>
                                {result.report_id}
                            </code>

                        </div>

                    )}


                    {/* VIEW REPORT */}

                    <button
                        className={styles.viewButton}
                        onClick={viewReport}
                        disabled={!result.report_id}
                    >

                        <FileText
                            size={18}
                            style={{
                                marginRight: "8px",
                            }}
                        />

                        View Report

                    </button>

                </div>

            )}

        </div>

    );

}


export default ResearchCard;