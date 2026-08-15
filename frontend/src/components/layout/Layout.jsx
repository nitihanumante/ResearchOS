import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
    return (
        <div
            style={{
                display: "flex",
                width: "100%",
                height: "100vh",
                minHeight: 0,
                background: "#0b1120",
                overflow: "hidden",
            }}
        >
            {/* =========================
                SIDEBAR
            ========================== */}

            <Sidebar />

            {/* =========================
                MAIN CONTENT
            ========================== */}

            <main
                style={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: 0,
                    height: "100vh",

                    background: "#0b1120",

                    overflowY: "auto",
                    overflowX: "hidden",

                    boxSizing: "border-box",
                }}
            >
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;