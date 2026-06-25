import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getTips } from "../api/tips";
import {
    FaBookMedical,
    FaLifeRing,
    FaHeartbeat,
    FaFire,
    FaSearch,
    FaTimes,
    FaBookOpen,
    FaNotesMedical,
} from "react-icons/fa";

export default function Tips() {
    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTip, setSelectedTip] = useState(null);

    useEffect(() => {
        loadTips();
    }, []);

    const loadTips = async () => {
        try {
            setLoading(true);
            const res = await getTips();
            // Handle both paginated results and direct array list
            setTips(res.data.results || res.data || []);
        } catch (error) {
            console.error("Failed to load tips", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to assign icons based on keywords in title
    const getTipIcon = (title) => {
        const t = title.toLowerCase();
        if (t.includes("cpr") || t.includes("heart") || t.includes("cardio")) return <FaHeartbeat color="#ff4d5a" />;
        if (t.includes("burn") || t.includes("fire")) return <FaFire color="#ff9900" />;
        if (t.includes("chok") || t.includes("breath")) return <FaLifeRing color="#00e5ff" />;
        return <FaNotesMedical color="#a78bfa" />;
    };

    const filteredTips = tips.filter((tip) => {
        return (
            tip.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tip.tip?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1>Safety Tips & Guides</h1>
                    <p className="text-dim">Essential knowledge, quick guides, and first-aid recommendations.</p>
                </div>
                <div className="icon-group">
                    <FaBookMedical className="header-icon" style={{ fontSize: "2rem", color: "var(--secondary)" }} />
                </div>
            </div>

            <div className="filters-bar glass mb-4">
                <div className="search-box" style={{ width: "100%", maxWidth: "400px" }}>
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search safety guides (e.g. CPR)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center p-5">
                    <p className="text-dim">Loading safety tips...</p>
                </div>
            ) : (
                <div className="grid-cols-2 mt-4">
                    {filteredTips.length > 0 ? (
                        filteredTips.map((tip) => (
                            <div className="card glass tip-card" key={tip.id} style={{ display: "flex", gap: "20px" }}>
                                <div className="tip-icon" style={{
                                    fontSize: "1.5rem",
                                    width: "56px",
                                    height: "56px",
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0
                                }}>
                                    {getTipIcon(tip.title)}
                                </div>
                                <div className="tip-content" style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: "1.2rem", color: "var(--text-bright)" }}>{tip.title}</h3>
                                    <p className="text-dim mt-2" style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        fontSize: "0.9rem",
                                        lineHeight: "1.5"
                                    }}>
                                        {tip.tip}
                                    </p>
                                    <button className="btn-text" onClick={() => setSelectedTip(tip)} style={{ marginTop: "12px" }}>
                                        Read step-by-step →
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="card glass text-center" style={{ gridColumn: '1 / -1', padding: "40px" }}>
                            <p className="text-dim">No safety tips found matching your search.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Read More Detailed Tip Modal */}
            {selectedTip && (
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
                        border: "1px solid var(--border)",
                        boxShadow: "0 10px 30px rgba(0, 242, 254, 0.1)"
                    }}>
                        <button className="icon-btn" onClick={() => setSelectedTip(null)} style={{
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

                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "14px" }}>
                                <div style={{ fontSize: "1.5rem" }}>
                                    {getTipIcon(selectedTip.title)}
                                </div>
                                <h2 style={{ fontSize: "1.4rem", margin: 0 }}>{selectedTip.title}</h2>
                            </div>

                            <div style={{ marginBottom: "24px" }}>
                                <h4 style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--secondary)", marginBottom: "12px" }}>
                                    <FaBookOpen /> Action Steps
                                </h4>
                                <div style={{
                                    fontSize: "1rem",
                                    lineHeight: "1.6",
                                    color: "var(--text-main)",
                                    background: "rgba(255,255,255,0.01)",
                                    padding: "16px",
                                    borderRadius: "12px",
                                    border: "1px solid var(--border)",
                                    whiteSpace: "pre-wrap"
                                }}>
                                    {selectedTip.tip}
                                </div>
                            </div>

                            <button
                                type="button"
                                className="btn-secondary full-width"
                                onClick={() => setSelectedTip(null)}
                            >
                                Close Guide
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}