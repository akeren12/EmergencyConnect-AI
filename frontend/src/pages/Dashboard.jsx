import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getContacts } from "../api/contacts";
import { getReports, createReport } from "../api/reports";
import {
    FaFileMedical,
    FaExclamationTriangle,
    FaUserFriends,
    FaBolt,
    FaSpinner,
    FaMapMarkerAlt,
    FaTimes,
    FaCheckCircle,
} from "react-icons/fa";

export default function Dashboard() {
    const email = localStorage.getItem("user_email");
    const username = email ? email.split("@")[0] : "User";

    // Dashboard data states
    const [contactsCount, setContactsCount] = useState(0);
    const [reportsCount, setReportsCount] = useState(0);
    const [recentReports, setRecentReports] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    // SOS Modal states
    const [showSOSModal, setShowSOSModal] = useState(false);
    const [sosType, setSosType] = useState("Medical");
    const [sosDescription, setSosDescription] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [locationText, setLocationText] = useState("Fetching GPS coordinates...");
    const [sendingSOS, setSendingSOS] = useState(false);
    const [sosSuccess, setSosSuccess] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoadingData(true);
            const contactsRes = await getContacts();
            const reportsRes = await getReports();

            const contactsList = contactsRes.data.results || contactsRes.data || [];
            const reportsList = reportsRes.data.results || reportsRes.data || [];

            setContactsCount(contactsList.length);
            setReportsCount(reportsList.length);

            // Sort reports descending by created_at or id to show recent first
            const sortedReports = [...reportsList].sort((a, b) => {
                return new Date(b.created_at || b.id) - new Date(a.created_at || a.id);
            });
            setRecentReports(sortedReports.slice(0, 3));
        } catch (error) {
            console.error("Failed to load dashboard statistics", error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleOpenSOS = () => {
        setShowSOSModal(true);
        setSosSuccess(false);
        setSosDescription("");
        setSosType("Medical");
        setLocationText("Fetching GPS coordinates...");
        setLatitude(null);
        setLongitude(null);

        // Fetch location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude.toFixed(6);
                    const lng = position.coords.longitude.toFixed(6);
                    setLatitude(lat);
                    setLongitude(lng);
                    setLocationText(`GPS: ${lat}, ${lng}`);
                },
                (error) => {
                    console.error("Geolocation failed:", error);
                    setLocationText("Location access denied. Using campus default.");
                    setLatitude("37.7749");
                    setLongitude("-122.4194");
                },
                { enableHighAccuracy: true, timeout: 8000 }
            );
        } else {
            setLocationText("Geolocation not supported. Using default.");
            setLatitude("37.7749");
            setLongitude("-122.4194");
        }
    };

    const handleSendSOS = async (e) => {
        e.preventDefault();
        setSendingSOS(true);
        try {
            const finalLocation = latitude && longitude ? `${latitude}, ${longitude}` : "Unknown Location";
            await createReport({
                title: `SOS ALERT: ${sosType.toUpperCase()}`,
                description: sosDescription.trim() || `Urgent ${sosType} assistance requested via emergency SOS dashboard alert.`,
                emergency_type: sosType,
                severity: "CRITICAL",
                location: finalLocation,
            });

            setSosSuccess(true);
            // Refresh stats
            loadDashboardData();
            setTimeout(() => {
                setShowSOSModal(false);
                setSosSuccess(false);
            }, 2500);
        } catch (error) {
            console.error("Failed to submit SOS alert", error);
            alert("Error broadcasting SOS. Please call emergency numbers directly.");
        } finally {
            setSendingSOS(false);
        }
    };

    return (
        <Layout>
            <div className="dashboard-header">
                <div>
                    <h1>Welcome back, {username}</h1>
                    <p className="text-dim">Your safety is our priority. Everything is under control.</p>
                </div>
                <button className="btn-primary" onClick={handleOpenSOS} style={{
                    background: "linear-gradient(135deg, #ff3344, #d41c2b)",
                    animation: "pulse-sos 2s infinite"
                }}>
                    <FaExclamationTriangle />
                    <span>EMERGENCY SOS</span>
                </button>
            </div>

            <div className="grid-cols-3 mt-4">
                <div className="card glass">
                    <div className="card-icon-wrapper red">
                        <FaUserFriends />
                    </div>
                    <h3>{loadingData ? <FaSpinner className="spin" /> : `${contactsCount} Contacts`}</h3>
                    <p className="text-dim">Trusted emergency contacts</p>
                </div>

                <div className="card glass">
                    <div className="card-icon-wrapper cyan">
                        <FaFileMedical />
                    </div>
                    <h3>{loadingData ? <FaSpinner className="spin" /> : `${reportsCount} Reports`}</h3>
                    <p className="text-dim">Past emergency incidents</p>
                </div>

                <div className="card glass">
                    <div className="card-icon-wrapper gold">
                        <FaBolt />
                    </div>
                    <h3>AI Ready</h3>
                    <p className="text-dim">Analysis system active</p>
                </div>
            </div>

            <div className="dashboard-main mt-4">
                <div className="card glass full-width">
                    <h2>Recent Activity</h2>
                    <div className="activity-list mt-3">
                        {loadingData ? (
                            <div className="text-center p-3">
                                <FaSpinner className="spin" /> Loading activities...
                            </div>
                        ) : recentReports.length > 0 ? (
                            recentReports.map((report) => (
                                <div key={report.id} className="activity-item" style={{
                                    borderLeft: `4px solid ${report.severity === 'CRITICAL' ? '#ff3344' : report.severity === 'HIGH' ? '#ff9900' : '#00e5ff'}`
                                }}>
                                    <div className="activity-indicator" style={{
                                        background: report.severity === 'CRITICAL' ? '#ff3344' : report.severity === 'HIGH' ? '#ff9900' : '#00e5ff'
                                    }} />
                                    <div className="activity-info">
                                        <span className="activity-title">{report.title}</span>
                                        <span className="activity-time">
                                            {report.location} • {new Date(report.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className={`badge ${
                                        report.severity === 'CRITICAL' ? 'badge-emergency' : 'badge-dim'
                                    }`}>
                                        {report.severity}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-dim p-4">
                                No recent activities found.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick SOS Modal */}
            {showSOSModal && (
                <div className="modal-overlay" style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(7, 8, 13, 0.8)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                    animation: "fadeIn 0.3s ease-out"
                }}>
                    <div className="modal-content glass" style={{
                        width: "90%",
                        maxWidth: "500px",
                        padding: "32px",
                        borderRadius: "20px",
                        position: "relative",
                        boxShadow: "0 10px 30px rgba(255, 51, 68, 0.2)",
                        border: "1px solid rgba(255, 51, 68, 0.3)"
                    }}>
                        <button className="icon-btn" onClick={() => setShowSOSModal(false)} style={{
                            position: "absolute",
                            top: "20px",
                            right: "20px",
                            background: "transparent",
                            border: "none",
                            color: "var(--text-dim)",
                            cursor: "pointer"
                        }}>
                            <FaTimes size={18} />
                        </button>

                        {sosSuccess ? (
                            <div className="text-center p-4">
                                <FaCheckCircle size={64} color="#10b981" style={{ marginBottom: "16px", filter: "drop-shadow(0 0 10px rgba(16,185,129,0.4))" }} />
                                <h2 style={{ color: "#10b981" }}>SOS Broadcasted!</h2>
                                <p className="text-dim mt-2">Emergency contacts and medical services are being notified with your details.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSendSOS}>
                                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                                    <div className="logo-icon large" style={{
                                        background: "linear-gradient(135deg, #ff3344, #d41c2b)",
                                        boxShadow: "0 0 20px rgba(255, 51, 68, 0.4)",
                                        marginBottom: "12px"
                                    }}>
                                        <FaExclamationTriangle />
                                    </div>
                                    <h2>Trigger SOS Alert</h2>
                                    <p className="text-dim mt-1">This will dispatch urgent alerts immediately.</p>
                                </div>

                                <div className="form-group">
                                    <label className="label">Emergency Type</label>
                                    <select
                                        className="input"
                                        style={{ background: "#161821", border: "1px solid var(--border)", color: "white" }}
                                        value={sosType}
                                        onChange={(e) => setSosType(e.target.value)}
                                    >
                                        <option value="Medical">Medical Emergency</option>
                                        <option value="Fire">Fire / Smoke</option>
                                        <option value="Crime">Crime / Theft / Violence</option>
                                        <option value="Accident">Accident / Collision</option>
                                        <option value="Other">Other Urgent Assistance</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="label">Quick Description (Optional)</label>
                                    <textarea
                                        className="textarea"
                                        rows="3"
                                        placeholder="Describe the condition, e.g., 'Severe bleeding', 'Shortness of breath'"
                                        value={sosDescription}
                                        onChange={(e) => setSosDescription(e.target.value)}
                                    />
                                </div>

                                <div className="form-group" style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    background: "rgba(255,255,255,0.02)",
                                    padding: "12px",
                                    borderRadius: "10px",
                                    border: "1px solid var(--border)",
                                    marginBottom: "24px"
                                }}>
                                    <FaMapMarkerAlt color="#00e5ff" style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>
                                        {locationText}
                                    </span>
                                </div>

                                <div style={{ display: "flex", gap: "16px" }}>
                                    <button
                                        type="button"
                                        className="btn-secondary full-width"
                                        onClick={() => setShowSOSModal(false)}
                                        disabled={sendingSOS}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary full-width"
                                        disabled={sendingSOS}
                                        style={{
                                            background: "linear-gradient(135deg, #ff3344, #d41c2b)",
                                            boxShadow: "0 4px 15px rgba(255, 51, 68, 0.4)"
                                        }}
                                    >
                                        {sendingSOS ? <FaSpinner className="spin" /> : "Send SOS"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    );
}