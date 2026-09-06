import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Ambulance,
    MapPin,
    Navigation,
    Phone,
    Clock3,
    CheckCircle2,
    Radio,
    ShieldCheck,
} from "lucide-react";
import "./AmbulancesRoute.css";

function AmbulancesRoute({ ambulance, onBack }) {
    const [location, setLocation] = useState(null);
    const [tracking, setTracking] = useState(false);
    const [status, setStatus] = useState("Driver is preparing");
    const [distance, setDistance] = useState("--");
    const [eta, setEta] = useState(ambulance?.eta || "4 min");

    useEffect(() => {
        if (!navigator.geolocation) {
            setStatus("Location is not supported by this browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                setLocation(currentLocation);
            },
            () => {
                setStatus("Unable to access your location");
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    }, []);

    useEffect(() => {
        if (!tracking) return;

        const timer = setTimeout(() => {
            setStatus("Ambulance is on the way");
        }, 2500);

        return () => clearTimeout(timer);
    }, [tracking]);

    const openNavigation = () => {
        if (!location) {
            alert("📍 Please allow location access first.");
            return;
        }

        const destination = ambulance?.destination || "Government General Hospital";

        const url = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${encodeURIComponent(
            destination
        )}&travelmode=driving`;

        window.open(url, "_blank");
    };

    const openCurrentLocation = () => {
        if (!location) {
            alert("📍 Your location is not available yet.");
            return;
        }

        const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
        window.open(url, "_blank");
    };

    const callDriver = () => {
        if (!ambulance?.phone) {
            alert("📞 Driver phone number is not available.");
            return;
        }

        window.location.href = `tel:${ambulance.phone}`;
    };

    const startTracking = () => {
        setTracking(true);
        setStatus("Request accepted • Ambulance is moving");

        setTimeout(() => {
            setStatus("Ambulance is on the way");
        }, 3000);
    };

    const calculateDemoDistance = () => {
        if (!location) return;

        const value = (Math.random() * 2 + 0.5).toFixed(1);
        setDistance(`${value} km`);

        const minutes = Math.max(2, Math.round(Number(value) * 3));
        setEta(`${minutes} min`);
    };

    return (
        <div className="ambulance-route-page">

            {/* HEADER */}
            <header className="route-header">
                <button className="route-back-btn" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back
                </button>

                <div className="route-header-title">
                    <div className="route-header-icon">
                        <Navigation size={22} />
                    </div>

                    <div>
                        <h1>Ambulance Route</h1>
                        <p>Live emergency ambulance tracking</p>
                    </div>
                </div>

                <div className="live-indicator">
                    <span className="live-dot"></span>
                    LIVE
                </div>
            </header>

            {/* MAIN */}
            <main className="route-main">

                {/* LEFT SIDE */}
                <section className="route-left">

                    {/* MAP CARD */}
                    <div className="map-card">

                        <div className="map-background">

                            <div className="map-road road-one"></div>
                            <div className="map-road road-two"></div>
                            <div className="map-road road-three"></div>

                            <div className="map-water"></div>

                            <div className="map-location user-location">
                                <div className="location-pulse"></div>
                                <MapPin size={28} />
                                <span>You</span>
                            </div>

                            <div className="map-location ambulance-location">
                                <div className="ambulance-map-icon">
                                    <Ambulance size={25} />
                                </div>
                                <span>Ambulance</span>
                            </div>

                            <div className="route-line"></div>

                            <div className="destination-marker">
                                <MapPin size={27} />
                                <span>Hospital</span>
                            </div>

                            <div className="map-overlay">
                                <div>
                                    <Radio size={17} />
                                    <span>Live route monitoring</span>
                                </div>
                            </div>
                        </div>

                        <div className="map-actions">
                            <button onClick={openCurrentLocation}>
                                <MapPin size={18} />
                                My Location
                            </button>

                            <button onClick={openNavigation}>
                                <Navigation size={18} />
                                Open Navigation
                            </button>
                        </div>
                    </div>

                    {/* ROUTE STATUS */}
                    <div className="route-status-card">

                        <div className="status-heading">
                            <div className="status-icon">
                                <CheckCircle2 size={21} />
                            </div>

                            <div>
                                <h2>{status}</h2>
                                <p>Emergency response team is connected</p>
                            </div>
                        </div>

                        <div className="progress-wrapper">
                            <div className="progress-track">
                                <div
                                    className={`progress-fill ${tracking ? "moving" : ""
                                        }`}
                                ></div>
                            </div>

                            <div className="progress-labels">
                                <span>Requested</span>
                                <span>Accepted</span>
                                <span>On the way</span>
                                <span>Arrived</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* RIGHT SIDE */}
                <aside className="route-right">

                    {/* AMBULANCE CARD */}
                    <div className="driver-card">

                        <div className="driver-card-top">
                            <div className="driver-avatar">
                                <Ambulance size={30} />
                            </div>

                            <div className="driver-info">
                                <span className="small-label">
                                    Assigned Ambulance
                                </span>

                                <h2>
                                    {ambulance?.driver || "Emergency Driver"}
                                </h2>

                                <p>
                                    {ambulance?.number ||
                                        "Ambulance vehicle"}
                                </p>
                            </div>

                            <div className="verified-badge">
                                <ShieldCheck size={17} />
                            </div>
                        </div>

                        <div className="vehicle-details">

                            <div className="vehicle-detail">
                                <span>Type</span>
                                <strong>
                                    {ambulance?.type || "Emergency Care"}
                                </strong>
                            </div>

                            <div className="vehicle-detail">
                                <span>Rating</span>
                                <strong>
                                    ⭐ {ambulance?.rating || "4.9"}
                                </strong>
                            </div>

                            <div className="vehicle-detail">
                                <span>ETA</span>
                                <strong>{eta}</strong>
                            </div>

                        </div>

                        <div className="driver-actions">

                            <button
                                className="call-driver-btn"
                                onClick={callDriver}
                            >
                                <Phone size={18} />
                                Call Driver
                            </button>

                            <button
                                className={`track-btn ${tracking ? "active" : ""
                                    }`}
                                onClick={startTracking}
                            >
                                <Radio size={18} />
                                {tracking
                                    ? "Tracking Active"
                                    : "Start Tracking"}
                            </button>

                        </div>
                    </div>

                    {/* ETA CARD */}
                    <div className="eta-card">

                        <div className="eta-icon">
                            <Clock3 size={22} />
                        </div>

                        <div>
                            <span>Estimated Arrival</span>
                            <strong>{eta}</strong>
                            <p>Ambulance reaching your location</p>
                        </div>
                    </div>

                    {/* DISTANCE CARD */}
                    <div className="distance-card">

                        <div>
                            <span>Current Distance</span>
                            <strong>{distance}</strong>
                        </div>

                        <button onClick={calculateDemoDistance}>
                            <Navigation size={17} />
                            Refresh
                        </button>
                    </div>

                    {/* EMERGENCY NOTE */}
                    <div className="emergency-note">

                        <div className="note-icon">
                            🚨
                        </div>

                        <div>
                            <h3>Emergency Response</h3>
                            <p>
                                Keep your phone available. The ambulance
                                team may contact you for additional details.
                            </p>
                        </div>

                    </div>

                </aside>
            </main>
        </div>
    );
}

export default AmbulanceRoute;