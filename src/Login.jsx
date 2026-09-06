import { useState } from "react";
import "./Auth.css";

function Login({ onBack, onSignup, onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        onLogin(email);
    };

    return (
        <div className="auth-page">

            <button className="back-btn" onClick={onBack}>
                ← Back
            </button>

            <div className="auth-card">

                <div className="auth-logo">
                    🚑
                </div>

                <h1>Welcome Back</h1>

                <p className="auth-subtitle">
                    Login to your RESQ account
                </p>

                <form onSubmit={handleLogin}>

                    <label>Email Address</label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit" className="auth-main-btn">
                        LOGIN
                    </button>

                </form>

                <div className="divider">
                    OR
                </div>

                <p className="signup-text">
                    Don't have an account?
                    <button onClick={onSignup}>
                        Sign Up
                    </button>
                </p>

            </div>

        </div>
    );
}

export default Login;