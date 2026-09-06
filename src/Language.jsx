import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Globe2,
    Check,
    Languages,
    Save,
    CheckCircle2,
} from "lucide-react";
import "./Language.css";

const languages = [
    {
        id: "en",
        name: "English",
        nativeName: "English",
        region: "Global",
    },
    {
        id: "te",
        name: "Telugu",
        nativeName: "తెలుగు",
        region: "తెలుగు",
    },
    {
        id: "hi",
        name: "Hindi",
        nativeName: "हिन्दी",
        region: "भारत",
    },
    {
        id: "ta",
        name: "Tamil",
        nativeName: "தமிழ்",
        region: "தமிழ்நாடு",
    },
    {
        id: "kn",
        name: "Kannada",
        nativeName: "ಕನ್ನಡ",
        region: "ಕರ್ನಾಟಕ",
    },
    {
        id: "ml",
        name: "Malayalam",
        nativeName: "മലയാളം",
        region: "കേരളം",
    },
    {
        id: "mr",
        name: "Marathi",
        nativeName: "मराठी",
        region: "महाराष्ट्र",
    },
    {
        id: "bn",
        name: "Bengali",
        nativeName: "বাংলা",
        region: "বাংলা",
    },
];

function Language({ onBack }) {
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [savedLanguage, setSavedLanguage] = useState("en");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const storedLanguage =
            localStorage.getItem("resqLanguage") || "en";

        setSelectedLanguage(storedLanguage);
        setSavedLanguage(storedLanguage);
    }, []);

    const handleSave = () => {
        localStorage.setItem("resqLanguage", selectedLanguage);

        setSavedLanguage(selectedLanguage);
        setSuccessMessage("Language changed successfully.");

        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);
    };

    const currentLanguage =
        languages.find(
            (language) => language.id === savedLanguage
        ) || languages[0];

    return (
        <div className="language-page">
            <header className="language-topbar">
                <button
                    className="language-back-btn"
                    onClick={onBack}
                    type="button"
                >
                    <ArrowLeft size={19} />
                    Back to Dashboard
                </button>

                <div className="language-header-title">
                    <div className="language-title-icon">
                        <Globe2 size={22} />
                    </div>

                    <div>
                        <h1>Language</h1>
                        <p>
                            Choose your preferred RESQ application
                            language
                        </p>
                    </div>
                </div>

                <div className="language-current">
                    <Languages size={17} />
                    {currentLanguage.name}
                </div>
            </header>

            <main className="language-main">
                <section className="language-intro">
                    <div>
                        <span>LANGUAGE PREFERENCES</span>
                        <h2>Choose a language you are comfortable with.</h2>

                        <p>
                            Your selected language preference will be
                            remembered on this device.
                        </p>
                    </div>

                    <div className="language-globe">
                        <Globe2 size={39} />
                    </div>
                </section>

                {successMessage && (
                    <div className="language-success">
                        <CheckCircle2 size={19} />
                        {successMessage}
                    </div>
                )}

                <section className="language-selection-card">
                    <div className="language-selection-header">
                        <div>
                            <span>AVAILABLE LANGUAGES</span>
                            <h3>Select your preferred language</h3>
                        </div>

                        <p>{languages.length} languages available</p>
                    </div>

                    <div className="language-grid">
                        {languages.map((language) => {
                            const isSelected =
                                selectedLanguage === language.id;

                            return (
                                <button
                                    type="button"
                                    key={language.id}
                                    className={`language-card ${isSelected ? "selected" : ""
                                        }`}
                                    onClick={() => {
                                        setSelectedLanguage(
                                            language.id
                                        );
                                        setSuccessMessage("");
                                    }}
                                >
                                    <div className="language-card-top">
                                        <div className="language-letter">
                                            {language.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div
                                            className={`language-check ${isSelected
                                                    ? "visible"
                                                    : ""
                                                }`}
                                        >
                                            <Check size={16} />
                                        </div>
                                    </div>

                                    <div className="language-card-content">
                                        <span>
                                            {language.nativeName}
                                        </span>

                                        <h4>{language.name}</h4>

                                        <p>{language.region}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="language-save-section">
                        <div className="language-selected-summary">
                            <span>Selected Language</span>

                            <strong>
                                {
                                    languages.find(
                                        (language) =>
                                            language.id ===
                                            selectedLanguage
                                    )?.nativeName
                                }
                            </strong>
                        </div>

                        <button
                            type="button"
                            className="language-save-btn"
                            onClick={handleSave}
                        >
                            <Save size={17} />
                            Save Language
                        </button>
                    </div>
                </section>

                <section className="language-info-card">
                    <div className="language-info-icon">
                        <Languages size={22} />
                    </div>

                    <div>
                        <h3>RESQ Language Support</h3>

                        <p>
                            Your language preference is saved locally.
                            Full application translations can be added
                            gradually without changing your selected
                            preference.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Language;