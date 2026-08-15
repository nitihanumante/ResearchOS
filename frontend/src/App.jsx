import { BrowserRouter, Routes, Route } from "react-router-dom";

// ==============================
// PAGES
// ==============================

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Documents from "./pages/Documents";
import History from "./pages/History";
import Report from "./pages/Report";
import Settings from "./pages/Settings";

// ==============================
// MAIN LAYOUT
// ==============================

import Layout from "./components/layout/Layout";


function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* =================================
                    MAIN APPLICATION LAYOUT
                    Sidebar + Header + Page Content
                ================================== */}

                <Route element={<Layout />}>

                    {/* Dashboard */}
                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    {/* Analytics */}
                    <Route
                        path="/analytics"
                        element={<Analytics />}
                    />

                    {/* Documents */}
                    <Route
                        path="/documents"
                        element={<Documents />}
                    />

                    {/* History */}
                    <Route
                        path="/history"
                        element={<History />}
                    />

                    {/* Individual Research Report */}
                    <Route
                        path="/report/:reportId"
                        element={<Report />}
                    />

                    {/* Settings */}
                    <Route
                        path="/settings"
                        element={<Settings />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;