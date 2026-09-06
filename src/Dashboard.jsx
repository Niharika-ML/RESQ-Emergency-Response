import { useState } from "react";
import "./Dashboard.css";

function Dashboard({
    userName,
    onLogout,
    onHospitals,
    onMedicineStore,
    onAmbulance,
    onRoute,
    onProfile,
    onLanguage,
    onHistory,
    onHowWorks,
    onAbout,
}) {
    const [location, setLocation] = useState(null);

    const [locationMessage, setLocationMessage] = useState(
        "Your location has not been detected yet."
    );

    const [activeMenu, setActiveMenu] = useState("dashboard");

    // =========================================================
    // LIVE LOCATION
    // =========================================================

    const detectLocation = () => {
        if (!navigator.geolocation) {
            setLocationMessage(
                "Your browser does not support location services."
            );
            return;
        }

        setLocationMessage("Detecting your live location...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setLocation({
                    latitude,
                    longitude,
                });

                setLocationMessage(
                    "Your live location has been detected successfully."
                );
            },
            (error) => {
                console.error("Location error:", error);

                setLocationMessage(
                    "Location access was denied. Please allow location permission."
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    // =========================================================
    // OPEN CURRENT LOCATION IN GOOGLE MAPS
    // =========================================================

    const openMap = () => {
        if (!location) {
            detectLocation();
            return;
        }

        const mapUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

        window.open(mapUrl, "_blank");
    };

    // =========================================================
    // SIDEBAR NAVIGATION
    // =========================================================

    const handleMenu = (menu, callback) => {
        setActiveMenu(menu);

        if (callback) {
            callback();
        }
    };

    // =========================================================
    // EMERGENCY / SOS
    // =========================================================

    const handleSOS = () => {
        setActiveMenu("emergency");

        alert(
            "🚨 EMERGENCY REQUEST ACTIVATED!\n\nYour location will be used to find nearby ambulance assistance."
        );

        if (onAmbulance) {
            onAmbulance();
        }
    };

    // =========================================================
    // DASHBOARD
    // =========================================================

    const goToDashboard = () => {
        setActiveMenu("dashboard");
    };

    return (
        <div className="resq-dashboard">

            {/* =====================================================
                SIDEBAR
            ====================================================== */}

            <aside className="resq-sidebar">

                {/* BRAND */}

                <div className="resq-brand">
                    <div className="brand-icon">🚑</div>

                    <div>
                        <h2>RESQ</h2>
                        <span>Emergency Care</span>
                    </div>
                </div>

                {/* MAIN MENU */}

                <div className="sidebar-label">
                    MAIN MENU
                </div>

                <nav className="sidebar-navigation">

                    {/* DASHBOARD */}

                    <button
                        type="button"
                        className={`sidebar-link ${activeMenu === "dashboard"
                                ? "active"
                                : ""
                            }`}
                        onClick={goToDashboard}
                    >
                        <span>🏠</span>
                        <span>Dashboard</span>
                    </button>

                    {/* EMERGENCY */}

                    <button
                        type="button"
                        className={`sidebar-link emergency-link ${activeMenu === "emergency"
                                ? "active"
                                : ""
                            }`}
                        onClick={handleSOS}
                    >
                        <span>🆘</span>
                        <span>Emergency / SOS</span>
                    </button>

                    {/* AMBULANCES */}

                    <button
                        type="button"
                        className={`sidebar-link ${activeMenu === "ambulance"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            handleMenu(
                                "ambulance",
                                onAmbulance
                            )
                        }
                    >
                        <span>🚑</span>
                        <span>Nearby Ambulances</span>
                    </button>

                    {/* HOSPITALS */}

                    <button
                        type="button"
                        className={`sidebar-link ${activeMenu === "hospitals"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            handleMenu(
                                "hospitals",
                                onHospitals
                            )
                        }
                    >
                        <span>🏥</span>
                        <span>Nearby Hospitals</span>
                    </button>

                    {/* EMERGENCY ROUTE */}

                    <button
                        type="button"
                        className={`sidebar-link ${activeMenu === "route"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            handleMenu(
                                "route",
                                onRoute
                            )
                        }
                    >
                        <span>🗺️</span>
                        <span>Emergency Route</span>
                    </button>

                    {/* MEDICINE */}

                    <button
                        type="button"
                        className={`sidebar-link ${activeMenu === "medicine"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            handleMenu(
                                "medicine",
                                onMedicineStore
                            )
                        }
                    >
                        <span>💊</span>
                        <span>Medicine Store</span>
                    </button>

                    {/* ACCOUNT */}

                    <div className="sidebar-label second-label">
                        ACCOUNT
                    </div>

                    {/* HISTORY */}

                    <button
                        type="button"
                        className={`sidebar-link ${activeMenu === "history"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            handleMenu(
                                "history",
                                onHistory
                            )
                        }
                    >
                        <span>📋</span>
                        <span>Emergency History</span>
                    </button>

                    {/* PROFILE */}

                    <button
                        type="button"
                        className={`sidebar-link ${activeMenu === "profile"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            handleMenu(
                                "profile",
                                onProfile
                            )
                        }
                    >
                        <span>👤</span>
                        <span>My Profile</span>
                    </button>

                    {/* LANGUAGE */}

                    <button
                        type="button"
                        className={`sidebar-link ${activeMenu === "language"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            handleMenu(
                                "language",
                                onLanguage
                            )
                        }
                    >
                        <span>🌐</span>
                        <span>Language</span>
                    </button>

                    {/* HOW RESQ WORKS */}

                    <button
                        type="button"
                        className={`sidebar-link ${activeMenu === "howWorks"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            handleMenu(
                                "howWorks",
                                onHowWorks
                            )
                        }
                    >
                        <span>❓</span>
                        <span>How RESQ Works</span>
                    </button>

                    {/* ABOUT */}

                    <button
                        type="button"
                        className={`sidebar-link ${activeMenu === "about"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            handleMenu(
                                "about",
                                onAbout
                            )
                        }
                    >
                        <span>ℹ️</span>
                        <span>About RESQ</span>
                    </button>

                </nav>

                {/* SIDEBAR BOTTOM */}

                <div className="sidebar-bottom">

                    <div className="sidebar-support">

                        <div className="support-icon">
                            🛡️
                        </div>

                        <div>
                            <strong>Stay Safe</strong>

                            <small>
                                Help is always nearby.
                            </small>
                        </div>

                    </div>

                    {/* LOGOUT */}

                    <button
                        type="button"
                        className="logout-button"
                        onClick={onLogout}
                    >
                        🚪 Logout
                    </button>

                </div>

            </aside>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <main className="resq-main">

                {/* =================================================
                    HEADER
                ================================================== */}

                <header className="dashboard-header">

                    <div>

                        <p className="header-tag">
                            EMERGENCY ASSISTANCE PLATFORM
                        </p>

                        <h1>
                            Welcome to RESQ,{" "}
                            <span>
                                {userName || "User"}
                            </span>{" "}
                            👋
                        </h1>

                        <p className="header-subtitle">
                            Emergency assistance when every second matters.
                        </p>

                    </div>

                    <div className="header-profile">

                        <button
                            type="button"
                            className="notification"
                            onClick={() =>
                                alert(
                                    "🔔 RESQ Notifications\n\nYou are safe. Emergency services are ready when needed."
                                )
                            }
                            aria-label="Notifications"
                        >
                            🔔
                        </button>

                        <button
                            type="button"
                            className="profile-avatar"
                            onClick={() =>
                                handleMenu(
                                    "profile",
                                    onProfile
                                )
                            }
                            aria-label="Open profile"
                        >
                            {(userName || "U")
                                .charAt(0)
                                .toUpperCase()}
                        </button>

                    </div>

                </header>

                {/* =================================================
                    SOS CARD
                ================================================== */}

                <section className="sos-card">

                    <div className="sos-text">

                        <span className="sos-badge">
                            🚨 EMERGENCY RESPONSE
                        </span>

                        <h2>
                            Need an ambulance right now?
                        </h2>

                        <p>
                            Press the SOS button to request emergency
                            assistance from nearby available ambulances.
                        </p>

                        <button
                            type="button"
                            className="sos-button"
                            onClick={handleSOS}
                        >
                            🆘 REQUEST AMBULANCE
                        </button>

                    </div>

                    <div className="sos-illustration">
                        🚑
                    </div>

                </section>

                {/* =================================================
                    LOCATION
                ================================================== */}

                <section className="location-card">

                    <div className="location-left">

                        <div className="location-icon">
                            📍
                        </div>

                        <div>

                            <span className="card-label">
                                CURRENT LOCATION
                            </span>

                            <h2>
                                Your Live Location
                            </h2>

                            <p>
                                {locationMessage}
                            </p>

                            {location && (
                                <div className="coordinates">

                                    <span>
                                        Latitude:{" "}
                                        <strong>
                                            {location.latitude.toFixed(6)}
                                        </strong>
                                    </span>

                                    <span>
                                        Longitude:{" "}
                                        <strong>
                                            {location.longitude.toFixed(6)}
                                        </strong>
                                    </span>

                                </div>
                            )}

                        </div>

                    </div>

                    <div className="location-actions">

                        <button
                            type="button"
                            className="detect-button"
                            onClick={detectLocation}
                        >
                            📍 Detect Location
                        </button>

                        <button
                            type="button"
                            className="map-button"
                            onClick={openMap}
                        >
                            🗺️ Open in Maps
                        </button>

                    </div>

                </section>

                {/* =================================================
                    QUICK ACCESS
                ================================================== */}

                <section className="services-section">

                    <div className="section-title">

                        <div>

                            <span>
                                QUICK ACCESS
                            </span>

                            <h2>
                                Emergency Services
                            </h2>

                        </div>

                        <p>
                            Get help quickly with RESQ.
                        </p>

                    </div>

                    <div className="service-grid">

                        {/* AMBULANCE */}

                        <button
                            type="button"
                            className="service-card ambulance"
                            onClick={() =>
                                handleMenu(
                                    "ambulance",
                                    onAmbulance
                                )
                            }
                        >

                            <div className="service-icon">
                                🚑
                            </div>

                            <div className="service-content">

                                <h3>
                                    Nearby Ambulances
                                </h3>

                                <p>
                                    Find available ambulances near your
                                    current location.
                                </p>

                            </div>

                            <span className="service-arrow">
                                →
                            </span>

                        </button>

                        {/* HOSPITAL */}

                        <button
                            type="button"
                            className="service-card hospital"
                            onClick={() =>
                                handleMenu(
                                    "hospitals",
                                    onHospitals
                                )
                            }
                        >

                            <div className="service-icon">
                                🏥
                            </div>

                            <div className="service-content">

                                <h3>
                                    Nearby Hospitals
                                </h3>

                                <p>
                                    Find hospitals, emergency departments
                                    and specialists.
                                </p>

                            </div>

                            <span className="service-arrow">
                                →
                            </span>

                        </button>

                        {/* ROUTE */}

                        <button
                            type="button"
                            className="service-card route"
                            onClick={() =>
                                handleMenu(
                                    "route",
                                    onRoute
                                )
                            }
                        >

                            <div className="service-icon">
                                🗺️
                            </div>

                            <div className="service-content">

                                <h3>
                                    Emergency Route
                                </h3>

                                <p>
                                    Find the fastest route to emergency
                                    care.
                                </p>

                            </div>

                            <span className="service-arrow">
                                →
                            </span>

                        </button>

                        {/* MEDICINE */}

                        <button
                            type="button"
                            className="service-card medicine"
                            onClick={() =>
                                handleMenu(
                                    "medicine",
                                    onMedicineStore
                                )
                            }
                        >

                            <div className="service-icon">
                                💊
                            </div>

                            <div className="service-content">

                                <h3>
                                    Medicine Store
                                </h3>

                                <p>
                                    Search medicines and nearby pharmacies.
                                </p>

                            </div>

                            <span className="service-arrow">
                                →
                            </span>

                        </button>

                    </div>

                </section>

                {/* =================================================
                    STATUS
                ================================================== */}

                <section className="status-section">

                    <div className="status-card">

                        <div className="status-icon">
                            🟢
                        </div>

                        <div>

                            <span>
                                RESQ NETWORK
                            </span>

                            <h3>
                                Emergency assistance available
                            </h3>

                            <p>
                                RESQ is ready to help you find emergency
                                services.
                            </p>

                        </div>

                    </div>

                    <div className="status-card">

                        <div className="status-icon">
                            🏥
                        </div>

                        <div>

                            <span>
                                HOSPITAL SUPPORT
                            </span>

                            <h3>
                                Nearby emergency care
                            </h3>

                            <p>
                                Locate hospitals and emergency departments.
                            </p>

                        </div>

                    </div>

                </section>

                {/* =================================================
                    HOW IT WORKS
                ================================================== */}

                <section className="how-section">

                    <div className="section-title">

                        <div>

                            <span>
                                HOW IT WORKS
                            </span>

                            <h2>
                                Emergency assistance in 4 steps
                            </h2>

                        </div>

                    </div>

                    <div className="steps-grid">

                        {/* STEP 1 */}

                        <div className="step-card">

                            <div className="step-number">
                                01
                            </div>

                            <div className="step-icon">
                                🆘
                            </div>

                            <h3>
                                Press SOS
                            </h3>

                            <p>
                                Request emergency ambulance assistance
                                with one tap.
                            </p>

                        </div>

                        {/* STEP 2 */}

                        <div className="step-card">

                            <div className="step-number">
                                02
                            </div>

                            <div className="step-icon">
                                📍
                            </div>

                            <h3>
                                Location Shared
                            </h3>

                            <p>
                                Your current location identifies the
                                emergency pickup point.
                            </p>

                        </div>

                        {/* STEP 3 */}

                        <div className="step-card">

                            <div className="step-number">
                                03
                            </div>

                            <div className="step-icon">
                                🚑
                            </div>

                            <h3>
                                Ambulance Responds
                            </h3>

                            <p>
                                A nearby available ambulance can respond
                                to the request.
                            </p>

                        </div>

                        {/* STEP 4 */}

                        <div className="step-card">

                            <div className="step-number">
                                04
                            </div>

                            <div className="step-icon">
                                🏥
                            </div>

                            <h3>
                                Reach Hospital
                            </h3>

                            <p>
                                Follow the emergency route to suitable
                                medical care.
                            </p>

                        </div>

                    </div>

                </section>

                {/* =================================================
                    FOOTER
                ================================================== */}

                <footer className="dashboard-footer">

                    <div>

                        <strong>
                            🚑 RESQ
                        </strong>

                        <p>
                            Emergency assistance when every second matters.
                        </p>

                    </div>

                    <span>
                        RESQ • Emergency Care Platform
                    </span>

                </footer>

            </main>

        </div>
    );
}

export default Dashboard;