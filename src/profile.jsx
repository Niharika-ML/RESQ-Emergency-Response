import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Calendar,
    Droplets,
    HeartPulse,
    ShieldPlus,
    Camera,
    Pencil,
    Save,
    X,
    CheckCircle2,
} from "lucide-react";
import "./Profile.css";

function Profile({ userName = "User", onBack, onProfileUpdate }) {
    const fileInputRef = useRef(null);

    const defaultProfile = {
        fullName: userName || "User",
        age: "",
        phone: "",
        email: "",
        bloodGroup: "",
        emergencyContact: "",
        allergies: "",
        medicalNotes: "",
        photo: "",
    };

    const [profile, setProfile] = useState(defaultProfile);
    const [formData, setFormData] = useState(defaultProfile);
    const [editing, setEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem("resqProfile");

            if (savedProfile) {
                const parsedProfile = JSON.parse(savedProfile);

                const completeProfile = {
                    ...defaultProfile,
                    ...parsedProfile,
                };

                setProfile(completeProfile);
                setFormData(completeProfile);
            } else {
                setProfile(defaultProfile);
                setFormData(defaultProfile);
            }
        } catch (error) {
            console.error("Unable to load profile:", error);
        }
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrorMessage("");
        setSuccessMessage("");
    };

    const handlePhotoSelect = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setErrorMessage("Please select a valid image.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setErrorMessage("Profile image must be smaller than 2 MB.");
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            setFormData((previous) => ({
                ...previous,
                photo: reader.result,
            }));
        };

        reader.readAsDataURL(file);
    };

    const validateProfile = () => {
        if (!formData.fullName.trim()) {
            return "Please enter your full name.";
        }

        if (
            formData.age &&
            (Number(formData.age) < 1 || Number(formData.age) > 120)
        ) {
            return "Please enter a valid age.";
        }

        if (
            formData.phone &&
            !/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ""))
        ) {
            return "Please enter a valid 10-digit phone number.";
        }

        if (
            formData.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            return "Please enter a valid email address.";
        }

        if (
            formData.emergencyContact &&
            !/^[6-9]\d{9}$/.test(
                formData.emergencyContact.replace(/\s/g, "")
            )
        ) {
            return "Please enter a valid emergency contact number.";
        }

        return "";
    };

    const handleSave = () => {
        const validationError = validateProfile();

        if (validationError) {
            setErrorMessage(validationError);
            setSuccessMessage("");
            return;
        }

        const updatedProfile = {
            ...formData,
            fullName: formData.fullName.trim(),
        };

        localStorage.setItem(
            "resqProfile",
            JSON.stringify(updatedProfile)
        );

        setProfile(updatedProfile);
        setFormData(updatedProfile);
        setEditing(false);
        setErrorMessage("");
        setSuccessMessage("Profile updated successfully.");

        if (onProfileUpdate) {
            onProfileUpdate(updatedProfile);
        }

        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);
    };

    const handleCancel = () => {
        setFormData(profile);
        setEditing(false);
        setErrorMessage("");
        setSuccessMessage("");
    };

    const getInitial = () => {
        const name = formData.fullName || profile.fullName || "U";
        return name.charAt(0).toUpperCase();
    };

    return (
        <div className="profile-page">
            <header className="profile-topbar">
                <button
                    className="profile-back-btn"
                    onClick={onBack}
                    type="button"
                >
                    <ArrowLeft size={19} />
                    Back to Dashboard
                </button>

                <div className="profile-topbar-title">
                    <div className="profile-title-icon">
                        <User size={21} />
                    </div>

                    <div>
                        <h1>My Profile</h1>
                        <p>Manage your personal and emergency information</p>
                    </div>
                </div>

                <div className="profile-secure-badge">
                    <ShieldPlus size={17} />
                    RESQ Profile
                </div>
            </header>

            <main className="profile-main">
                <section className="profile-hero-card">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">
                            {formData.photo ? (
                                <img
                                    src={formData.photo}
                                    alt="Profile"
                                />
                            ) : (
                                <span>{getInitial()}</span>
                            )}
                        </div>

                        {editing && (
                            <button
                                className="profile-camera-btn"
                                type="button"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                            >
                                <Camera size={17} />
                            </button>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handlePhotoSelect}
                        />
                    </div>

                    <div className="profile-hero-info">
                        <span className="profile-small-label">
                            RESQ MEMBER
                        </span>

                        <h2>{profile.fullName || "User"}</h2>

                        <p>
                            Keep your emergency information updated so it
                            can be quickly accessed when required.
                        </p>
                    </div>

                    {!editing && (
                        <button
                            className="profile-edit-btn"
                            onClick={() => {
                                setEditing(true);
                                setSuccessMessage("");
                                setErrorMessage("");
                            }}
                            type="button"
                        >
                            <Pencil size={17} />
                            Edit Profile
                        </button>
                    )}
                </section>

                {successMessage && (
                    <div className="profile-success-message">
                        <CheckCircle2 size={19} />
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="profile-error-message">
                        {errorMessage}
                    </div>
                )}

                <section className="profile-content-grid">
                    <div className="profile-form-card">
                        <div className="profile-section-heading">
                            <div>
                                <span>PERSONAL INFORMATION</span>
                                <h3>Your Details</h3>
                            </div>
                        </div>

                        <div className="profile-form-grid">
                            <div className="profile-field">
                                <label>
                                    <User size={15} />
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="profile-field">
                                <label>
                                    <Calendar size={15} />
                                    Age
                                </label>

                                <input
                                    type="number"
                                    name="age"
                                    min="1"
                                    max="120"
                                    value={formData.age}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    placeholder="Enter your age"
                                />
                            </div>

                            <div className="profile-field">
                                <label>
                                    <Phone size={15} />
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    maxLength="10"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    placeholder="10-digit mobile number"
                                />
                            </div>

                            <div className="profile-field">
                                <label>
                                    <Mail size={15} />
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="profile-field">
                                <label>
                                    <Droplets size={15} />
                                    Blood Group
                                </label>

                                <select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    disabled={!editing}
                                >
                                    <option value="">
                                        Select blood group
                                    </option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>

                            <div className="profile-field">
                                <label>
                                    <HeartPulse size={15} />
                                    Emergency Contact
                                </label>

                                <input
                                    type="tel"
                                    name="emergencyContact"
                                    maxLength="10"
                                    value={formData.emergencyContact}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    placeholder="Emergency mobile number"
                                />
                            </div>
                        </div>

                        <div className="profile-medical-section">
                            <div className="profile-field profile-full-field">
                                <label>Known Allergies</label>

                                <textarea
                                    name="allergies"
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    placeholder="Example: Penicillin, peanuts..."
                                />
                            </div>

                            <div className="profile-field profile-full-field">
                                <label>Medical Notes</label>

                                <textarea
                                    name="medicalNotes"
                                    value={formData.medicalNotes}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    placeholder="Add important medical information..."
                                />
                            </div>
                        </div>

                        {editing && (
                            <div className="profile-form-actions">
                                <button
                                    className="profile-cancel-btn"
                                    type="button"
                                    onClick={handleCancel}
                                >
                                    <X size={17} />
                                    Cancel
                                </button>

                                <button
                                    className="profile-save-btn"
                                    type="button"
                                    onClick={handleSave}
                                >
                                    <Save size={17} />
                                    Save Profile
                                </button>
                            </div>
                        )}
                    </div>

                    <aside className="profile-side-card">
                        <div className="profile-side-icon">
                            <HeartPulse size={28} />
                        </div>

                        <span>EMERGENCY PROFILE</span>

                        <h3>Your details matter during emergencies.</h3>

                        <p>
                            Blood group, emergency contact, allergies and
                            medical notes can help provide faster,
                            safer assistance.
                        </p>

                        <div className="profile-side-details">
                            <div>
                                <span>Blood Group</span>
                                <strong>
                                    {profile.bloodGroup || "Not added"}
                                </strong>
                            </div>

                            <div>
                                <span>Emergency Contact</span>
                                <strong>
                                    {profile.emergencyContact ||
                                        "Not added"}
                                </strong>
                            </div>

                            <div>
                                <span>Allergies</span>
                                <strong>
                                    {profile.allergies || "None added"}
                                </strong>
                            </div>
                        </div>
                    </aside>
                </section>
            </main>
        </div>
    );
}

export default Profile;