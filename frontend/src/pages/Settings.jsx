import { useEffect, useState } from "react";
import {
    User,
    Bell,
    Palette,
    Shield,
    Save,
    Sun,
} from "lucide-react";

import styles from "./Settings.module.css";

function Settings() {
    // =========================================
    // PROFILE
    // =========================================

    const [name, setName] = useState(() => {
        return (
            localStorage.getItem("researchos-name") ||
            "Niti"
        );
    });

    const [email, setEmail] = useState(() => {
        return (
            localStorage.getItem("researchos-email") ||
            "niti@example.com"
        );
    });


    // =========================================
    // NOTIFICATIONS
    // =========================================

    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem(
            "researchos-notifications"
        );

        return saved === null
            ? true
            : saved === "true";
    });


    // =========================================
    // SAVE MESSAGE
    // =========================================

    const [saved, setSaved] = useState(false);


    // =========================================
    // KEEP LIGHT THEME
    // =========================================

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            "light"
        );

        localStorage.setItem(
            "researchos-theme",
            "light"
        );
    }, []);


    // =========================================
    // SAVE SETTINGS
    // =========================================

    const handleSave = () => {

        localStorage.setItem(
            "researchos-name",
            name
        );

        localStorage.setItem(
            "researchos-email",
            email
        );

        localStorage.setItem(
            "researchos-notifications",
            notifications
        );


        // Show in-page success message
        setSaved(true);


        // Hide message after 2.5 seconds
        setTimeout(() => {
            setSaved(false);
        }, 2500);
    };


    // =========================================
    // UI
    // =========================================

    return (
        <div className={styles.page}>

            {/* =================================
                HEADER
            ================================= */}

            <div className={styles.header}>

                <h1 className={styles.title}>
                    Settings
                </h1>

                <p className={styles.subtitle}>
                    Manage your ResearchOS preferences
                </p>

            </div>


            {/* =================================
                PROFILE
            ================================= */}

            <section className={styles.card}>

                <div className={styles.sectionHeader}>

                    <div className={styles.sectionIcon}>
                        <User size={22} />
                    </div>

                    <div>

                        <h2 className={styles.sectionTitle}>
                            Profile
                        </h2>

                        <p className={styles.sectionSubtitle}>
                            Manage your personal information
                        </p>

                    </div>

                </div>


                {/* NAME */}

                <div className={styles.field}>

                    <label className={styles.label}>
                        Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        className={styles.input}
                        placeholder="Enter your name"
                    />

                </div>


                {/* EMAIL */}

                <div className={styles.field}>

                    <label className={styles.label}>
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className={styles.input}
                        placeholder="Enter your email"
                    />

                </div>

            </section>


            {/* =================================
                NOTIFICATIONS
            ================================= */}

            <section className={styles.card}>

                <div className={styles.sectionHeader}>

                    <div className={styles.sectionIcon}>
                        <Bell size={22} />
                    </div>

                    <div>

                        <h2 className={styles.sectionTitle}>
                            Notifications
                        </h2>

                        <p className={styles.sectionSubtitle}>
                            Control your research notifications
                        </p>

                    </div>

                </div>


                <div className={styles.settingRow}>

                    <div className={styles.settingInfo}>

                        <h3 className={styles.settingTitle}>
                            Research notifications
                        </h3>

                        <p className={styles.settingDescription}>
                            Receive notifications when your
                            research is completed.
                        </p>

                    </div>


                    {/* TOGGLE */}

                    <button
                        type="button"
                        className={`${styles.toggle} ${
                            notifications
                                ? styles.toggleActive
                                : ""
                        }`}
                        onClick={() => {
                            setNotifications(
                                !notifications
                            );

                            // Remove old save message
                            setSaved(false);
                        }}
                        aria-label="Toggle research notifications"
                        aria-pressed={notifications}
                    >

                        <span
                            className={`${styles.toggleKnob} ${
                                notifications
                                    ? styles.toggleKnobActive
                                    : ""
                            }`}
                        />

                    </button>

                </div>

            </section>


            {/* =================================
                APPEARANCE
            ================================= */}

            <section className={styles.card}>

                <div className={styles.sectionHeader}>

                    <div className={styles.sectionIcon}>
                        <Palette size={22} />
                    </div>

                    <div>

                        <h2 className={styles.sectionTitle}>
                            Appearance
                        </h2>

                        <p className={styles.sectionSubtitle}>
                            Customize the ResearchOS interface
                        </p>

                    </div>

                </div>


                <div className={styles.settingRow}>

                    <div className={styles.settingInfo}>

                        <h3 className={styles.settingTitle}>
                            Light Mode
                        </h3>

                        <p className={styles.settingDescription}>
                            ResearchOS currently uses the
                            light interface.
                        </p>

                    </div>


                    <div className={styles.lightModeBadge}>

                        <Sun size={18} />

                        <span>
                            Light
                        </span>

                    </div>

                </div>

            </section>


            {/* =================================
                SECURITY
            ================================= */}

            <section className={styles.card}>

                <div className={styles.sectionHeader}>

                    <div className={styles.sectionIcon}>
                        <Shield size={22} />
                    </div>

                    <div>

                        <h2 className={styles.sectionTitle}>
                            Security
                        </h2>

                        <p className={styles.sectionSubtitle}>
                            Information about your data
                        </p>

                    </div>

                </div>


                <div className={styles.securityBox}>

                    <div className={styles.securityDot} />

                    <p>
                        Your ResearchOS data and research
                        reports are stored securely.
                    </p>

                </div>

            </section>


            {/* =================================
                SAVE SETTINGS
            ================================= */}

            <div className={styles.saveContainer}>

                <button
                    type="button"
                    className={styles.saveButton}
                    onClick={handleSave}
                >

                    <Save size={19} />

                    <span>
                        Save Settings
                    </span>

                </button>


                {/* =================================
                    SUCCESS MESSAGE
                ================================= */}

                {saved && (
                    <div className={styles.savedMessage}>
                        ✓ Settings saved successfully
                    </div>
                )}

            </div>

        </div>
    );
}

export default Settings;