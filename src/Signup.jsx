import { useState } from "react";
import "./Signup.css";

function Signup({ onBack, onLogin, onSignupSuccess }) {
    const [form, setForm] = useState({
        name: "",
        age: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        emergencyContact: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !form.name ||
            !form.age ||
            !form.phone ||
            !form.email ||
            !form.password ||
            !form.confirmPassword
        ) {
            alert("Please fill all required fields.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Signup successful
        onSignupSuccess(form.name);
    };

    return (
        <div className="signup-page">

            <button
                className="signup-back"
                onClick={onBack}
            >
                ← Back
            </button>

            <div className="signup-card">

                <div className="signup-logo">
                    🚑
                </div>

                <h1>
                    Create Your RESQ Account
                </h1>

                <p className="signup-subtitle">
                    Register now for faster emergency assistance.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-row">

                        <div className="form-group">
                            <label>
                                Full Name *
                            </label>

                            <input
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                value={form.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Age *
                            </label>

                            <input
                                name="age"
                                type="number"
                                placeholder="Age"
                                value={form.age}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <div className="form-group">
                        <label>
                            Phone Number *
                        </label>

                        <input
                            name="phone"
                            type="tel"
                            placeholder="Enter phone number"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Email Address *
                        </label>

                        <input
                            name="email"
                            type="email"
                            placeholder="Enter email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Emergency Contact
                        </label>

                        <input
                            name="emergencyContact"
                            type="tel"
                            placeholder="Emergency contact number"
                            value={form.emergencyContact}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Password *
                        </label>

                        <input
                            name="password"
                            type="password"
                            placeholder="Create password"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Confirm Password *
                        </label>

                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        className="signup-main-btn"
                        type="submit"
                    >
                        CREATE ACCOUNT
                    </button>

                </form>

                <p className="login-link">
                    Already have an account?

                    <button onClick={onLogin}>
                        Login
                    </button>
                </p>

            </div>

        </div>
    );
}

export default Signup;