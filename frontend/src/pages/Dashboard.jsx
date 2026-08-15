import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Rocket,
    Loader2,
} from "lucide-react";

import styles from "./Dashboard.module.css";


function Dashboard() {

    const navigate = useNavigate();

    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressText, setProgressText] = useState(
        "Preparing research..."
    );


    // =========================================================
    // START RESEARCH
    // =========================================================

    const handleResearch = async () => {

        if (!topic.trim()) {
            alert("Please enter a research topic.");
            return;
        }


        setLoading(true);
        setProgress(10);
        setProgressText("Searching the web...");


        /*
         * Frontend progress indicator.
         *
         * The actual backend pipeline runs as one API request,
         * so these percentages visually represent the stages
         * while the backend is processing the research.
         */

        const progressTimer = setInterval(() => {

            setProgress((currentProgress) => {

                if (currentProgress < 25) {

                    setProgressText(
                        "Searching the web..."
                    );

                    return 25;
                }


                if (currentProgress < 50) {

                    setProgressText(
                        "Reading and summarizing sources..."
                    );

                    return 50;
                }


                if (currentProgress < 75) {

                    setProgressText(
                        "Generating research report..."
                    );

                    return 75;
                }


                if (currentProgress < 90) {

                    setProgressText(
                        "Reviewing research report..."
                    );

                    return 90;
                }


                return currentProgress;

            });

        }, 2500);


        try {

            // =================================================
            // BACKEND REQUEST
            // =================================================

            const response = await fetch(
                "http://127.0.0.1:8000/research/start",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },

                    body: JSON.stringify({
                        topic: topic.trim(),
                    }),
                }
            );


            // =================================================
            // CHECK RESPONSE
            // =================================================

            if (!response.ok) {

                let errorMessage =
                    "Failed to generate research report.";

                try {

                    const errorData =
                        await response.json();

                    if (errorData?.detail) {
                        errorMessage =
                            errorData.detail;
                    }

                } catch {
                    // Ignore JSON parsing error
                }

                throw new Error(errorMessage);
            }


            // =================================================
            // GET RESULT
            // =================================================

            const data = await response.json();

            console.log(
                "Research completed:",
                data
            );


            // =================================================
            // COMPLETE PROGRESS
            // =================================================

            clearInterval(progressTimer);

            setProgress(100);
            setProgressText(
                "Research completed successfully!"
            );


            // =================================================
            // OPEN REPORT
            // =================================================

            setTimeout(() => {

                if (data?.report_id) {

                    navigate(
                        `/report/${data.report_id}`
                    );

                } else {

                    console.error(
                        "Report ID missing from response:",
                        data
                    );

                    setLoading(false);
                    setProgress(0);
                    setProgressText(
                        "Unable to open the generated report."
                    );

                }

            }, 700);


        } catch (error) {

            clearInterval(progressTimer);

            console.error(
                "Research error:",
                error
            );


            setLoading(false);
            setProgress(0);

            setProgressText(
                "Research could not be completed."
            );


            alert(
                error.message ||
                "Unable to generate the research report. Please check that the backend is running."
            );

        }

    };


    // =========================================================
    // DASHBOARD UI
    // =========================================================

    return (

        <div className={styles.dashboard}>


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className={styles.header}>

                <h1>
                    Dashboard
                </h1>

                <p>
                    Welcome back <span>👋</span>
                </p>

            </div>


            {/* =================================================
                RESEARCH CARD
            ================================================= */}

            <div className={styles.researchCard}>

                <div className={styles.cardContent}>


                    {/* TITLE */}

                    <h2>
                        AI Research Assistant
                    </h2>


                    {/* DESCRIPTION */}

                    <p
                        className={
                            styles.description
                        }
                    >
                        Enter a topic to generate an
                        AI-powered research report.
                    </p>


                    {/* =================================================
                        TOPIC INPUT
                    ================================================= */}

                    <textarea
                        className={
                            styles.topicInput
                        }
                        value={topic}
                        onChange={(e) =>
                            setTopic(e.target.value)
                        }
                        placeholder="Example: Artificial Intelligence in Healthcare"
                        rows={7}
                        disabled={loading}
                    />


                    {/* =================================================
                        BUTTON / PROGRESS AREA
                    ================================================= */}

                    {!loading ? (

                        <button
                            type="button"
                            className={
                                styles.researchButton
                            }
                            onClick={
                                handleResearch
                            }
                        >

                            <Rocket size={21} />

                            <span>
                                Start Research
                            </span>

                        </button>

                    ) : (

                        /*
                         * IMPORTANT:
                         *
                         * The progress replaces the button.
                         *
                         * Therefore it appears in exactly the
                         * same visible area and does not push the
                         * page downward.
                         */

                        <div
                            className={
                                styles.progressContainer
                            }
                        >


                            {/* PROGRESS HEADER */}

                            <div
                                className={
                                    styles.progressHeader
                                }
                            >

                                <div
                                    className={
                                        styles.progressInfo
                                    }
                                >

                                    <Loader2
                                        size={20}
                                        className={
                                            styles.spinner
                                        }
                                    />

                                    <div>

                                        <h3>
                                            Researching...
                                        </h3>

                                        <p>
                                            {progressText}
                                        </p>

                                    </div>

                                </div>


                                <span
                                    className={
                                        styles.progressPercentage
                                    }
                                >
                                    {progress}%
                                </span>

                            </div>


                            {/* PROGRESS BAR */}

                            <div
                                className={
                                    styles.progressTrack
                                }
                            >

                                <div
                                    className={
                                        styles.progressBar
                                    }
                                    style={{
                                        width:
                                            `${progress}%`,
                                    }}
                                />

                            </div>


                            {/* SMALL STATUS */}

                            <div
                                className={
                                    styles.progressStatus
                                }
                            >

                                <span>
                                    ResearchOS is working
                                    on your report
                                </span>

                                <span>
                                    Please wait...
                                </span>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}


export default Dashboard;