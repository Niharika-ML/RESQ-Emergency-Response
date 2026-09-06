import { useEffect, useState } from "react";
import {
    ArrowLeft,
    MapPin,
    Navigation,
    Phone,
    Ambulance,
    Clock3,
    ShieldCheck,
} from "lucide-react";
import "./AmbulancesRoute.css";

function AmbulancesRoute({ ambulance, onBack }) {
    const [location, setLocation] = useState(null);
    const [locationStatus, setLocationStatus] =
        useState("Detecting your location...");

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationStatus("Geolocation is not supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });

                setLocationStatus("Your live location is detected.");
            },
            () => {
                setLocationStatus(
                    "Unable to detect your location. Please allow location access."
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    }, []);

    const openDirections = () => {
        if (!location) {
            alert("Please wait until your location is detected.");
            return;
        }

        const destination =
            ambulance?.latitude && ambulance?.longitude
                ? `${ambulance.latitude},${ambulance.longitude}`
                : "16.5062,80.6480";

        window.open(
            `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${destination}&travelmode=driving`,
            "_blank"
        );
    };

    const callDriver = () => {
        if (ambulance?.phone) {
            window.location.href = `tel:${ambulance.phone}`;
        } else {
            alert("Driver contact number is not available.");
        }
    };

    return (
        <div className="ambulance-route-page">
            <header className="route-header">
                <button className="route-back-btn" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back
                </button>

                <div className="route-brand">
                    <div className="route-brand-icon">
                        <Ambulance size={24} />
                    </div>

                    <div>
                        <h1>RESQ</h1>
                        <span>Emergency Response</span>
                    </div>
                </div>

                <div className="route-status">
                    <span className="status-dot"></span>
                    Tracking Active
                </div>
            </header>

            <main className="route-content">
                <section className="route-title-section">
                    <div>
                        <p className="route-eyebrow">
                            EMERGENCY TRANSPORT
                        </p>

                        <h2>Ambulance Route</h2>

                        <p>
                            Track your assigned ambulance and navigate
                            to the emergency destination.
                        </p>
                    </div>

                    <div className="live-badge">
                        <span></span>
                        LIVE
                    </div>
                </section>

                <section className="route-grid">
                    <div className="map-card">
                        <div className="map-placeholder">
                            <div className="map-pattern"></div>

                            <div className="map-route-line"></div>

                            <div className="map-pin user-pin">
                                <MapPin size={24} />
                            </div>

                            <div className="map-pin ambulance-pin">
                                <Ambulance size={24} />
                            </div>

                            <div className="map-label user-label">
                                Your Location
                            </div>

                            <div className="map-label ambulance-label">
                                Ambulance
                            </div>

                            <button
                                className="map-navigation-btn"
                                onClick={openDirections}
                            >
                                <Navigation size={18} />
                                Open Google Maps
                            </button>
                        </div>
                    </div>

                    <div className="route-details-card">
                        <div className="details-heading">
                            <div className="details-icon">
                                <Ambulance size={24} />
                            </div>

                            <div>
                                <h3>
                                    {ambulance?.driver ||
                                        "Assigned Ambulance"}
                                </h3>

                                <p>
                                    {ambulance?.vehicle ||
                                        "Emergency Ambulance"}
                                </p>
                            </div>
                        </div>

                        <div className="route-info-list">
                            <div className="route-info-item">
                                <div className="info-icon">
                                    <Clock3 size={19} />
                                </div>

                                <div>
                                    <span>Estimated Arrival</span>
                                    <strong>
                                        {ambulance?.eta || "4 min"}
                                    </strong>
                                </div>
                            </div>

                            <div className="route-info-item">
                                <div className="info-icon">
                                    <MapPin size={19} />
                                </div>

                                <div>
                                    <span>Distance</span>
                                    <strong>
                                        {ambulance?.distance || "1.2 km"}
                                    </strong>
                                </div>
                            </div>

                            <div className="route-info-item">
                                <div className="info-icon">
                                    <ShieldCheck size={19} />
                                </div>

                                <div>
                                    <span>Service Type</span>
                                    <strong>
                                        {ambulance?.type ||
                                            "Emergency Care"}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="location-status">
                            <MapPin size={17} />
                            <span>{locationStatus}</span>
                        </div>

                        {location && (
                            <div className="coordinates">
                                <span>
                                    Latitude:{" "}
                                    {location.latitude.toFixed(6)}
                                </span>

                                <span>
                                    Longitude:{" "}
                                    {location.longitude.toFixed(6)}
                                </span>
                            </div>
                        )}

                        <div className="route-actions">
                            <button
                                className="primary-route-btn"
                                onClick={openDirections}
                            >
                                <Navigation size={19} />
                                Start Navigation
                            </button>

                            <button
                                className="call-driver-btn"
                                onClick={callDriver}
                            >
                                <Phone size={19} />
                                Call Driver
                            </button>
                        </div>
                    </div>
                </section>

                <section className="tracking-card">
                    <div className="tracking-left">
                        <div className="tracking-icon">
                            <ShieldCheck size={22} />
                        </div>

                        <div>
                            <h3>Emergency tracking enabled</h3>
                            <p>
                                RESQ is monitoring this emergency
                                session.
                            </p>
                        </div>
                    </div>

                    <div className="tracking-progress">
                        <div className="progress-step active">
                            <span>1</span>
                            <small>Request</small>
                        </div>

                        <div className="progress-line active"></div>

                        <div className="progress-step active">
                            <span>2</span>
                            <small>Assigned</small>
                        </div>

                        <div className="progress-line active"></div>

                        <div className="progress-step">
                            <span>3</span>
                            <small>On Route</small>
                        </div>

                        <div className="progress-line"></div>

                        <div className="progress-step">
                            <span>4</span>
                            <small>Arrived</small>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AmbulancesRoute;