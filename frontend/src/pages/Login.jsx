import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaShieldAlt,
    FaEnvelope,
    FaLock,
    FaArrowRight,
} from "react-icons/fa";

import { loginUser } from "../api/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            navigate("/");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            setLoading(true);

            const response = await loginUser({
                email,
                password,
            });

            localStorage.setItem(
                "access_token",
                response.data.access_token
            );

            localStorage.setItem(
                "user_email",
                response.data.email
            );

            navigate("/");
        } catch (error) {
            console.error(error);
            setErrorMsg(
                error.response?.data?.error ||
                "Invalid email or password"
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

                    <h1>Welcome Back</h1>

                    <p className="text-dim">
                        Sign in to your EmergencyConnect-AI account
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

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
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
                            {loading
                                ? "Signing In..."
                                : (
                                    <>
                                        Sign In <FaArrowRight />
                                    </>
                                )}
                        </button>
                    </div>
                </form>

                <div className="auth-footer">
                    <p className="text-dim">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="auth-link"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}