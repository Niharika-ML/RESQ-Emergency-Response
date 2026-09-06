import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Map,
    MapPin,
    Navigation,
    Hospital,
    Ambulance,
    Pill,
    LocateFixed,
    Phone,
    Route,
    Clock3,
    ShieldCheck,
    ExternalLink,
} from "lucide-react";
import "./EmergencyRoute.css";

function EmergencyRoute({ onBack }) {
    const [location, setLocation] = useState(null);
    const [status, setStatus] = useState(
        "Detect your location to start emergency navigation."
    );

    const detectLocation = () => {
        if (!navigator.geolocation) {
            setStatus("Geolocation is not supported by your browser.");
            return;
        }

        setStatus("Detecting your current location...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });

                setStatus(
                    "Your live location has been detected successfully."
                );
            },
            () => {
                setStatus(
                    "Location access denied. Please allow browser location permission."
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    useEffect(() => {
        detectLocation();
    }, []);

    const openGoogleMaps = (destination) => {
        if (!location) {
            alert("Please detect your location first.");
            return;
        }

        const url =
            `https://www.google.com/maps/dir/?api=1` +
            `&origin=${location.latitude},${location.longitude}` +
            `&destination=${encodeURIComponent(destination)}` +
            `&travelmode=driving`;

        window.open(url, "_blank");
    };

    const searchGoogleMaps = (query) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            query
        )}`;

        window.open(url, "_blank");
    };

    return (
        <div className="emergency-route-page">

            {/* HEADER */}
            <header className="emergency-route-header">

                <button
                    className="emergency-back-btn"
                    onClick={onBack}
                >
                    <ArrowLeft size={19} />
                    Back to Dashboard
                </button>

                <div className="emergency-title">
                    <div className="emergency-title-icon">
                        <Map size={23} />
                    </div>

                    <div>
                        <h1>Emergency Route</h1>
                        <p>Fast navigation to emergency assistance</p>
                    </div>
                </div>

                <a
                    href="tel:108"
                    className="call-108-btn"
                >
                    <Phone size={17} />
                    Emergency 108
                </a>

            </header>

            {/* HERO */}
            <section className="emergency-route-hero">

                <div className="emergency-hero-content">

                    <span className="route-status-tag">
                        <ShieldCheck size={15} />
                        RESQ SMART NAVIGATION
                    </span>

                    <h2>
                        Find the fastest
                        <span> emergency route.</span>
                    </h2>

                    <p>
                        RESQ uses your current location to help you navigate
                        quickly to hospitals, ambulances and nearby emergency
                        services.
                    </p>

                    <div className="hero-route-buttons">

                        <button
                            onClick={detectLocation}
                            className="detect-location-btn"
                        >
                            <LocateFixed size={18} />
                            Detect My Location
                        </button>

                        <button
                            onClick={() =>
                                openGoogleMaps("nearest hospital")
                            }
                            className="nearest-hospital-btn"
                        >
                            <Hospital size={18} />
                            Nearest Hospital
                        </button>

                    </div>

                </div>

                <div className="route-map-visual">

                    <div className="map-grid"></div>

                    <div className="map-road road-one"></div>
                    <div className="map-road road-two"></div>

                    <div className="map-point user-point">
                        <div className="point-pulse"></div>
                        <MapPin size={25} />
                    </div>

                    <div className="map-point hospital-point">
                        <Hospital size={21} />
                    </div>

                    <div className="map-route-line"></div>

                    <div className="map-distance-card">
                        <Route size={17} />
                        <div>
                            <strong>Emergency Route</strong>
                            <span>Fastest navigation</span>
                        </div>
                    </div>

                </div>

            </section>

            {/* LOCATION */}
            <section className="current-location-section">

                <div className="route-section-heading">

                    <div>
                        <span>LOCATION</span>
                        <h3>Your Current Position</h3>
                    </div>

                    <button
                        className="refresh-location-btn"
                        onClick={detectLocation}
                    >
                        <LocateFixed size={17} />
                        Refresh
                    </button>

                </div>

                <div className="current-location-card">

                    <div className="current-location-icon">
                        <MapPin size={26} />
                    </div>

                    <div className="current-location-info">
                        <strong>{status}</strong>

                        {location && (
                            <div className="location-coordinates">
                                <span>
                                    Lat: {location.latitude.toFixed(6)}
                                </span>

                                <span>
                                    Lng: {location.longitude.toFixed(6)}
                                </span>
                            </div>
                        )}
                    </div>

                </div>

            </section>

            {/* DESTINATIONS */}
            <section className="destination-section">

                <div className="route-section-heading">

                    <div>
                        <span>EMERGENCY DESTINATIONS</span>
                        <h3>Where do you need to go?</h3>
                    </div>

                </div>

                <div className="destination-grid">

                    {/* HOSPITAL */}
                    <article className="destination-card hospital-card">

                        <div className="destination-top">
                            <div className="destination-icon">
                                <Hospital size={27} />
                            </div>

                            <span className="destination-label">
                                MEDICAL CARE
                            </span>
                        </div>

                        <h4>Nearest Hospital</h4>

                        <p>
                            Find hospitals near your current location and
                            start emergency navigation.
                        </p>

                        <div className="destination-meta">
                            <span>
                                <Clock3 size={15} />
                                Fastest route
                            </span>
                        </div>

                        <button
                            onClick={() =>
                                openGoogleMaps("nearest hospital")
                            }
                        >
                            <Navigation size={17} />
                            Navigate to Hospital
                        </button>

                    </article>

                    {/* AMBULANCE */}
                    <article className="destination-card ambulance-destination">

                        <div className="destination-top">
                            <div className="destination-icon">
                                <Ambulance size={27} />
                            </div>

                            <span className="destination-label">
                                EMERGENCY TRANSPORT
                            </span>
                        </div>

                        <h4>Nearby Ambulance</h4>

                        <p>
                            Search for nearby ambulance services and contact
                            emergency transport immediately.
                        </p>

                        <div className="destination-meta">
                            <span>
                                <Ambulance size={15} />
                                Emergency assistance
                            </span>
                        </div>

                        <button
                            onClick={() =>
                                searchGoogleMaps("ambulance near me")
                            }
                        >
                            <Navigation size={17} />
                            Find Ambulance
                        </button>

                    </article>

                    {/* PHARMACY */}
                    <article className="destination-card pharmacy-destination">

                        <div className="destination-top">
                            <div className="destination-icon">
                                <Pill size={27} />
                            </div>

                            <span className="destination-label">
                                MEDICINES
                            </span>
                        </div>

                        <h4>Nearby Pharmacy</h4>

                        <p>
                            Locate nearby pharmacies when emergency medicines
                            or medical supplies are needed.
                        </p>

                        <div className="destination-meta">
                            <span>
                                <Pill size={15} />
                                Medicine availability
                            </span>
                        </div>

                        <button
                            onClick={() =>
                                searchGoogleMaps("pharmacy near me")
                            }
                        >
                            <Navigation size={17} />
                            Find Pharmacy
                        </button>

                    </article>

                </div>

            </section>

            {/* QUICK ACTIONS */}
            <section className="quick-route-section">

                <div className="route-section-heading">
                    <div>
                        <span>QUICK ACTIONS</span>
                        <h3>Emergency shortcuts</h3>
                    </div>
                </div>

                <div className="quick-route-grid">

                    <button
                        onClick={() =>
                            openGoogleMaps("nearest hospital")
                        }
                    >
                        <div>
                            <Hospital size={21} />
                        </div>

                        <span>
                            <strong>Hospital Route</strong>
                            <small>Navigate to nearest hospital</small>
                        </span>

                        <ExternalLink size={17} />
                    </button>

                    <button
                        onClick={() =>
                            searchGoogleMaps("ambulance near me")
                        }
                    >
                        <div>
                            <Ambulance size={21} />
                        </div>

                        <span>
                            <strong>Ambulance</strong>
                            <small>Find nearby ambulance</small>
                        </span>

                        <ExternalLink size={17} />
                    </button>

                    <button
                        onClick={() =>
                            searchGoogleMaps("pharmacy near me")
                        }
                    >
                        <div>
                            <Pill size={21} />
                        </div>

                        <span>
                            <strong>Pharmacy</strong>
                            <small>Find nearby medicines</small>
                        </span>

                        <ExternalLink size={17} />
                    </button>

                    <a href="tel:108">
                        <div>
                            <Phone size={21} />
                        </div>

                        <span>
                            <strong>Emergency 108</strong>
                            <small>Call emergency services</small>
                        </span>

                        <Phone size={17} />
                    </a>

                </div>

            </section>

            {/* SAFETY */}
            <section className="route-safety">

                <ShieldCheck size={22} />

                <div>
                    <strong>Emergency Safety Reminder</strong>
                    <p>
                        If this is a life-threatening emergency, call 108
                        immediately and follow instructions from emergency
                        responders.
                    </p>
                </div>

            </section>

        </div>
    );
}

export default EmergencyRoute;