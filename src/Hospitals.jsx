import { useState } from "react";
import "./Hospitals.css";

const hospitals = [
    {
        name: "Manipal Hospital Vijayawada",
        address: "Tadepalli / Vijayawada",
        lat: 16.4844754,
        lng: 80.6169548,
        specialists: ["Emergency", "Cardiology", "Neurology", "Orthopedics"],
        emergency: "24/7 Emergency",
        phone: "0866-3500000",
    },
    {
        name: "Aayush Hospitals",
        address: "Sri Ramachandra Nagar, Kanuru",
        lat: 16.5175,
        lng: 80.6751,
        specialists: ["Emergency", "Cardiology", "General Medicine", "Pediatrics"],
        emergency: "24/7 Emergency",
        phone: "0866-2544444",
    },
    {
        name: "Kamineni Hospitals",
        address: "Tadigadapa, Vijayawada",
        lat: 16.4957,
        lng: 80.7036,
        specialists: ["Emergency", "Cardiology", "Neurology", "General Surgery"],
        emergency: "24/7 Emergency",
        phone: "0866-2466666",
    },
    {
        name: "CREST Hospital",
        address: "Currency Nagar, Kanuru",
        lat: 16.5102768,
        lng: 80.6728334,
        specialists: ["Gastroenterology", "Gynecology", "Emergency", "Multi-Speciality"],
        emergency: "24/7 Emergency",
        phone: "0866-2999999",
    },
];

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function Hospitals({ onBack }) {
    const [location, setLocation] = useState(null);
    const [message, setMessage] = useState(
        "Detect your location to find the nearest hospitals."
    );

    const detectLocation = () => {
        if (!navigator.geolocation) {
            setMessage("Your browser does not support location.");
            return;
        }

        setMessage("📍 Detecting your live location...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                setLocation({ lat, lng });
                setMessage("✅ Live location detected.");
            },
            () => {
                setMessage(
                    "❌ Location permission denied. Please allow location access."
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    const getDistance = (hospital) => {
        if (!location) return null;

        return calculateDistance(
            location.lat,
            location.lng,
            hospital.lat,
            hospital.lng
        );
    };

    const navigateTo = (hospital) => {
        if (!location) {
            alert("Please detect your live location first.");
            return;
        }

        const url =
            `https://www.google.com/maps/dir/?api=1` +
            `&origin=${location.lat},${location.lng}` +
            `&destination=${hospital.lat},${hospital.lng}` +
            `&travelmode=driving`;

        window.open(url, "_blank");
    };

    const callHospital = (phone) => {
        window.location.href = `tel:${phone}`;
    };

    const sortedHospitals = [...hospitals].sort((a, b) => {
        if (!location) return 0;

        return getDistance(a) - getDistance(b);
    });

    return (
        <div className="hospitals-page">

            <header className="hospital-header">

                <button className="back-btn" onClick={onBack}>
                    ← Back
                </button>

                <div>
                    <h1>🏥 Nearby Hospitals</h1>
                    <p>
                        Find the nearest emergency hospital and navigate instantly.
                    </p>
                </div>

            </header>

            <section className="hospital-location">

                <div>
                    <h2>📍 Your Current Location</h2>
                    <p>{message}</p>

                    {location && (
                        <small>
                            GPS: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                        </small>
                    )}
                </div>

                <button
                    className="detect-btn"
                    onClick={detectLocation}
                >
                    📍 Detect My Location
                </button>

            </section>

            <div className="hospital-title">
                <h2>
                    {location
                        ? "Nearest Hospitals"
                        : "Hospitals Available"}
                </h2>

                <span>
                    {hospitals.length} hospitals
                </span>
            </div>

            <div className="hospital-list">

                {sortedHospitals.map((hospital, index) => {

                    const distance = getDistance(hospital);

                    return (
                        <div className="hospital-card" key={hospital.name}>

                            <div className="hospital-top">

                                <div className="hospital-icon">
                                    🏥
                                </div>

                                <div className="hospital-name">

                                    {location && index === 0 && (
                                        <span className="nearest-badge">
                                            ⭐ NEAREST
                                        </span>
                                    )}

                                    <h2>{hospital.name}</h2>

                                    <p>📍 {hospital.address}</p>

                                </div>

                            </div>

                            <div className="hospital-info">

                                <div className="info-box">
                                    <span>📏</span>
                                    <div>
                                        <small>Distance</small>
                                        <strong>
                                            {distance
                                                ? `${distance.toFixed(1)} km`
                                                : "Detect location"}
                                        </strong>
                                    </div>
                                </div>

                                <div className="info-box">
                                    <span>🚑</span>
                                    <div>
                                        <small>Emergency</small>
                                        <strong>{hospital.emergency}</strong>
                                    </div>
                                </div>

                            </div>

                            <div className="specialists">

                                <h3>👨‍⚕️ Specialists</h3>

                                <div className="specialist-list">

                                    {hospital.specialists.map((specialist) => (
                                        <span key={specialist}>
                                            {specialist}
                                        </span>
                                    ))}

                                </div>

                            </div>

                            <div className="hospital-actions">

                                <button
                                    className="navigate-btn"
                                    onClick={() => navigateTo(hospital)}
                                >
                                    🗺️ Navigate
                                </button>

                                <button
                                    className="call-btn"
                                    onClick={() => callHospital(hospital.phone)}
                                >
                                    📞 Call
                                </button>

                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}

export default Hospitals;