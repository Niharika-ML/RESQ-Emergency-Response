import { useEffect, useState } from "react";
import "./Ambulances.css";

function Ambulances({ onBack, onRoute }) {
    const [location, setLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(true);
    const [requestedId, setRequestedId] = useState(null);
    const [search, setSearch] = useState("");

    const ambulances = [
        {
            id: 1,
            driver: "Ravi Kumar",
            number: "AP 16 AB 4521",
            type: "Advanced Life Support",
            shortType: "ALS",
            distance: "1.2 km",
            eta: "4 min",
            rating: "4.9",
            hospital: "Government General Hospital",
            equipment: "ICU • Oxygen • ECG",
        },
        {
            id: 2,
            driver: "Suresh Reddy",
            number: "AP 16 CD 7812",
            type: "Basic Life Support",
            shortType: "BLS",
            distance: "2.1 km",
            eta: "7 min",
            rating: "4.8",
            hospital: "Manipal Hospital",
            equipment: "Oxygen • First Aid",
        },
        {
            id: 3,
            driver: "Kiran Rao",
            number: "AP 16 EF 2934",
            type: "Emergency Care",
            shortType: "Emergency",
            distance: "3.4 km",
            eta: "10 min",
            rating: "4.7",
            hospital: "Andhra Hospitals",
            equipment: "Oxygen • Monitor • Stretcher",
        },
    ];

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });

                setLocationLoading(false);
            },
            () => {
                setLocationLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    }, []);

    const handleRequest = (ambulance) => {
        setRequestedId(ambulance.id);

        alert(
            `🚑 Ambulance Request Sent!\n\n` +
            `Driver: ${ambulance.driver}\n` +
            `Ambulance: ${ambulance.number}\n` +
            `ETA: ${ambulance.eta}\n\n` +
            `Please stay at your current location.`
        );
    };

    const handleRoute = (ambulance) => {
        if (onRoute) {
            onRoute(ambulance);
            return;
        }

        if (!location) {
            alert("Please allow location access first.");
            return;
        }

        const url =
            `https://www.google.com/maps/dir/?api=1` +
            `&origin=${location.latitude},${location.longitude}` +
            `&destination=${location.latitude},${location.longitude}`;

        window.open(url, "_blank");
    };

    const handleCallDriver = (ambulance) => {
        alert(
            `📞 Connecting to ${ambulance.driver}...\n\n` +
            `Ambulance: ${ambulance.number}`
        );
    };

    const filteredAmbulances = ambulances.filter((ambulance) => {
        const text = search.toLowerCase();

        return (
            ambulance.driver.toLowerCase().includes(text) ||
            ambulance.number.toLowerCase().includes(text) ||
            ambulance.type.toLowerCase().includes(text)
        );
    });

    return (
        <div className="ambulances-page">

            {/* HEADER */}
            <header className="ambulances-header">

                <button className="back-button" onClick={onBack}>
                    ←
                    <span>Dashboard</span>
                </button>

                <div className="header-main">

                    <div className="header-icon">
                        🚑
                    </div>

                    <div>
                        <p className="eyebrow">
                            RESQ EMERGENCY NETWORK
                        </p>

                        <h1>Nearby Ambulances</h1>

                        <p className="header-description">
                            Find and request the nearest available ambulance
                            during an emergency.
                        </p>
                    </div>

                </div>

                <div className="location-pill">

                    <span
                        className={
                            location
                                ? "location-dot active"
                                : "location-dot"
                        }
                    ></span>

                    <span>
                        {location
                            ? "Live location detected"
                            : locationLoading
                                ? "Detecting location..."
                                : "Location unavailable"}
                    </span>

                </div>

            </header>

            {/* CONTENT */}
            <main className="ambulances-content">

                {/* EMERGENCY BANNER */}
                <section className="emergency-banner">

                    <div className="banner-left">

                        <div className="warning-icon">
                            🚨
                        </div>

                        <div>
                            <span className="banner-label">
                                EMERGENCY ASSISTANCE
                            </span>

                            <h2>
                                Need an ambulance immediately?
                            </h2>

                            <p>
                                Choose an available ambulance below or
                                call emergency services directly.
                            </p>
                        </div>

                    </div>

                    <button
                        className="call-108-button"
                        onClick={() =>
                            (window.location.href = "tel:108")
                        }
                    >
                        <span>📞</span>
                        Call 108
                    </button>

                </section>

                {/* LOCATION */}
                <section className="current-location-card">

                    <div className="location-card-icon">
                        📍
                    </div>

                    <div className="location-details">

                        <span>Your current location</span>

                        <strong>
                            {location
                                ? `${location.latitude.toFixed(
                                    5
                                )}, ${location.longitude.toFixed(5)}`
                                : "Waiting for location permission..."}
                        </strong>

                    </div>

                    {location && (
                        <button
                            className="open-map-button"
                            onClick={() => {
                                const url =
                                    `https://www.google.com/maps/search/?api=1` +
                                    `&query=${location.latitude},${location.longitude}`;

                                window.open(url, "_blank");
                            }}
                        >
                            View on Map →
                        </button>
                    )}

                </section>

                {/* TITLE + SEARCH */}
                <section className="ambulances-toolbar">

                    <div>
                        <p className="section-label">
                            AVAILABLE NOW
                        </p>

                        <h2>
                            Ambulances Near You
                        </h2>

                        <p>
                            {filteredAmbulances.length} ambulance
                            {filteredAmbulances.length !== 1
                                ? "s"
                                : ""}{" "}
                            available
                        </p>
                    </div>

                    <div className="search-box">

                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search ambulance or driver..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </section>

                {/* AMBULANCE CARDS */}
                <section className="ambulance-grid">

                    {filteredAmbulances.map((ambulance) => (

                        <article
                            className={`ambulance-card ${requestedId === ambulance.id
                                    ? "requested"
                                    : ""
                                }`}
                            key={ambulance.id}
                        >

                            {/* CARD TOP */}
                            <div className="card-top">

                                <div className="ambulance-visual">
                                    <span>🚑</span>
                                </div>

                                <div className="availability">
                                    <span className="green-dot"></span>
                                    Available
                                </div>

                            </div>

                            {/* TYPE */}
                            <div className="ambulance-title">

                                <div>

                                    <h3>
                                        {ambulance.type}
                                    </h3>

                                    <p>
                                        {ambulance.number}
                                    </p>

                                </div>

                                <div className="type-badge">
                                    {ambulance.shortType}
                                </div>

                            </div>

                            {/* DRIVER */}
                            <div className="driver-section">

                                <div className="driver-avatar">
                                    {ambulance.driver.charAt(0)}
                                </div>

                                <div className="driver-details">

                                    <span>DRIVER</span>

                                    <strong>
                                        {ambulance.driver}
                                    </strong>

                                    <small>
                                        ★ {ambulance.rating} rating
                                    </small>

                                </div>

                                <button
                                    className="call-driver"
                                    onClick={() =>
                                        handleCallDriver(
                                            ambulance
                                        )
                                    }
                                >
                                    📞
                                </button>

                            </div>

                            {/* STATS */}
                            <div className="stats-row">

                                <div className="stat">

                                    <span className="stat-icon">
                                        📍
                                    </span>

                                    <div>
                                        <small>
                                            Distance
                                        </small>

                                        <strong>
                                            {ambulance.distance}
                                        </strong>
                                    </div>

                                </div>

                                <div className="stat">

                                    <span className="stat-icon">
                                        ⏱
                                    </span>

                                    <div>
                                        <small>
                                            Estimated arrival
                                        </small>

                                        <strong>
                                            {ambulance.eta}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                            {/* EQUIPMENT */}
                            <div className="equipment">

                                <span>✓</span>

                                {ambulance.equipment}

                            </div>

                            {/* HOSPITAL */}
                            <div className="hospital-row">

                                <span>🏥</span>

                                <div>
                                    <small>
                                        Assigned facility
                                    </small>

                                    <strong>
                                        {ambulance.hospital}
                                    </strong>
                                </div>

                            </div>

                            {/* ACTIONS */}
                            {requestedId === ambulance.id ? (

                                <div className="request-success">

                                    <div className="success-icon">
                                        ✓
                                    </div>

                                    <div>
                                        <strong>
                                            Ambulance Requested
                                        </strong>

                                        <span>
                                            Driver is being notified
                                        </span>
                                    </div>

                                </div>

                            ) : (

                                <button
                                    className="request-button"
                                    onClick={() =>
                                        handleRequest(
                                            ambulance
                                        )
                                    }
                                >
                                    Request Ambulance
                                    <span>→</span>
                                </button>

                            )}

                            <button
                                className="route-button"
                                onClick={() =>
                                    handleRoute(ambulance)
                                }
                            >
                                🗺️ View Route & Track
                            </button>

                        </article>

                    ))}

                </section>

                {/* NO RESULTS */}
                {filteredAmbulances.length === 0 && (

                    <div className="no-results">

                        <div>🚑</div>

                        <h3>
                            No ambulances found
                        </h3>

                        <p>
                            Try searching with another driver name,
                            ambulance number or type.
                        </p>

                    </div>

                )}

                {/* SAFETY INFO */}
                <section className="safety-section">

                    <div className="safety-card">

                        <div className="safety-icon">
                            🛡️
                        </div>

                        <div>
                            <h3>
                                Emergency Priority
                            </h3>

                            <p>
                                Emergency requests are handled with
                                priority. For life-threatening situations,
                                call 108 immediately.
                            </p>
                        </div>

                    </div>

                    <div className="safety-card">

                        <div className="safety-icon">
                            📡
                        </div>

                        <div>
                            <h3>
                                Live Tracking
                            </h3>

                            <p>
                                Once an ambulance is assigned, RESQ can
                                provide route and tracking information.
                            </p>
                        </div>

                    </div>

                </section>

            </main>

            {/* FOOTER */}
            <footer className="ambulance-footer">
                <strong>RESQ</strong>
                <span>Emergency assistance when every second matters.</span>
            </footer>

        </div>
    );
}

export default Ambulances;