import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaShieldAlt,
    FaEnvelope,
    FaLock,
    FaUser,
    FaArrowRight,
} from "react-icons/fa";

import { registerUser } from "../api/auth";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            navigate("/");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        try {
            setLoading(true);

            await registerUser({
                email,
                password,
            });

            setSuccessMsg("Registration successful! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error(error);
            setErrorMsg(
                error.response?.data?.error ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass">
                <div className="auth-header">
                    <div className="logo-icon large">
                        <FaShieldAlt />
                    </div>

                    <h1>Create Account</h1>

                    <p className="text-dim">
                        Secure your emergency dashboard
                    </p>
                </div>

                {errorMsg && (
                    <div className="alert-danger" style={{
                        background: "rgba(255, 77, 77, 0.15)",
                        border: "1px solid var(--primary)",
                        color: "var(--primary)",
                        padding: "12px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                        fontSize: "0.9rem",
                        textAlign: "center",
                        fontWeight: "500"
                    }}>
                        {errorMsg}
                    </div>
                )}

                {successMsg && (
                    <div className="alert-success" style={{
                        background: "rgba(16, 185, 129, 0.15)",
                        border: "1px solid #10b981",
                        color: "#10b981",
                        padding: "12px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                        fontSize: "0.9rem",
                        textAlign: "center",
                        fontWeight: "500"
                    }}>
                        {successMsg}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label className="label">
                            Full Name
                        </label>

                        <div className="input-with-icon">
                            <FaUser className="input-icon" />

                            <input
                                type="text"
                                className="input"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label">
                            Email Address
                        </label>

                        <div className="input-with-icon">
                            <FaEnvelope className="input-icon" />

                            <input
                                type="email"
                                className="input"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label">
                            Password
                        </label>

                        <div className="input-with-icon">
                            <FaLock className="input-icon" />

                            <input
                                type="password"
                                className="input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-actions">
                        <button
                            type="submit"
                            className="btn-primary full-width"
                            disabled={loading}
                        >
                            {loading ? (
                                "Creating Account..."
                            ) : (
                                <>
                                    Sign Up <FaArrowRight />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="auth-footer">
                    <p className="text-dim">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="auth-link"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}