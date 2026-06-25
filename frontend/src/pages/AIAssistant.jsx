import { useState } from "react";
import Layout from "../components/Layout";
import { analyzeEmergency } from "../api/ai";
import { createReport } from "../api/reports";
import {
    FaRobot,
    FaPaperPlane,
    FaSpinner,
    FaExclamationTriangle,
    FaCheck,
    FaClipboardCheck,
    FaSave,
} from "react-icons/fa";

export default function AIAssistant() {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Checked items tracker for first-aid steps
    const [checkedSteps, setCheckedSteps] = useState({});
    const [savingReport, setSavingReport] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleAnalyze = async () => {
        if (!message.trim()) return;
        setLoading(true);
        setResponse(null);
        setCheckedSteps({});
        setSaveSuccess(false);

        try {
            const res = await analyzeEmergency(message);
            // Parse response if it's a string
            const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
            setResponse(data);
        } catch (error) {
            console.error("AI Analysis failed", error);
            alert("Failed to analyze emergency details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStep = (index) => {
        setCheckedSteps(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleSaveAsReport = async () => {
        if (!response) return;

        try {
            setSavingReport(true);
            const severityMapping = {
                CRITICAL: "CRITICAL",
                HIGH: "HIGH",
                MEDIUM: "MEDIUM",
                LOW: "LOW"
            };

            const reportSeverity = severityMapping[response.priority.toUpperCase()] || "MEDIUM";
            const firstAidText = response.first_aid ? response.first_aid.map((step, i) => `${i+1}. ${step}`).join("\n") : "";

            await createReport({
                title: `AI Assist: ${response.emergency_type}`,
                description: `Emergency Description:\n"${message}"\n\nAI Summary:\n${response.summary}\n\nRecommended First Aid:\n${firstAidText}`,
                emergency_type: response.emergency_type || "Other",
                severity: reportSeverity,
                location: "Main Campus (AI Log)",
            });

            setSaveSuccess(true);
            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        } catch (error) {
            console.error("Failed to save report from AI", error);
            alert("Failed to save report.");
        } finally {
            setSavingReport(false);
        }
    };

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1>AI Emergency Assistant</h1>
                    <p className="text-dim">Describe the emergency situation, and Gemini AI will provide immediate medical guidance.</p>
                </div>
                <div className="ai-status">
                    <span className="pulse-dot" />
                    System Active
                </div>
            </div>

            <div className="ai-interface mt-4">
                <div className="chat-container glass" style={{ height: "auto", minHeight: "550px" }}>
                    <div className="chat-history" style={{ paddingBottom: "10px" }}>
                        {!response && !loading && (
                            <div className="chat-placeholder" style={{ padding: "60px 0" }}>
                                <FaRobot className="ghost-icon" style={{ animation: "pulse 3s infinite" }} />
                                <p style={{ fontSize: "1.1rem" }}>Describe the condition (e.g. 'fainted student', 'fire in kitchen') to get instant, step-by-step first-aid guidance.</p>
                            </div>
                        )}
                        
                        {loading && (
                            <div className="chat-bubble ai text-center" style={{ width: "100%", maxWidth: "100%", alignSelf: "center", padding: "40px" }}>
                                <FaSpinner className="spin" size={32} color="var(--secondary)" />
                                <p style={{ marginTop: "12px", color: "var(--text-bright)", fontWeight: "500" }}>Analyzing emergency details with Gemini AI...</p>
                                <p className="text-dim" style={{ fontSize: "0.85rem" }}>Generating structured first-aid steps and safety recommendations.</p>
                            </div>
                        )}

                        {response && (
                            <div className="ai-response-card" style={{
                                width: "100%",
                                animation: "fadeIn 0.5s ease-out",
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px"
                            }}>
                                {/* Header Panel */}
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: "1px solid var(--border)",
                                    paddingBottom: "14px",
                                    flexWrap: "wrap",
                                    gap: "12px"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <FaRobot size={24} color="var(--secondary)" />
                                        <h2 style={{ fontSize: "1.5rem", margin: 0 }}>{response.emergency_type}</h2>
                                    </div>
                                    <span className="badge" style={{
                                        fontSize: "0.85rem",
                                        padding: "6px 14px",
                                        background: response.priority === 'CRITICAL' ? 'rgba(255,51,68,0.15)' : 
                                                    response.priority === 'HIGH' ? 'rgba(255,153,0,0.15)' : 'rgba(0,242,254,0.1)',
                                        color: response.priority === 'CRITICAL' ? '#ff3344' : 
                                               response.priority === 'HIGH' ? '#ff9900' : 'var(--secondary)',
                                        fontWeight: "800",
                                        border: `1px solid ${
                                            response.priority === 'CRITICAL' ? 'rgba(255,51,68,0.3)' : 
                                            response.priority === 'HIGH' ? 'rgba(255,153,0,0.3)' : 'rgba(0,242,254,0.2)'
                                        }`
                                    }}>
                                        PRIORITY: {response.priority}
                                    </span>
                                </div>

                                {/* Summary */}
                                <div style={{ fontSize: "1.05rem", color: "var(--text-main)", lineHeight: "1.6" }}>
                                    <p>{response.summary}</p>
                                </div>

                                {/* First Aid Checklist */}
                                <div>
                                    <h3 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", color: "var(--text-bright)" }}>
                                        <FaClipboardCheck color="var(--secondary)" /> First-Aid Actions Checklist
                                    </h3>
                                    <p className="text-dim" style={{ fontSize: "0.85rem", marginBottom: "12px" }}>
                                        Follow these steps sequentially. Check them off as you perform each action:
                                    </p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        {response.first_aid && response.first_aid.map((step, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => handleToggleStep(idx)}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: "12px",
                                                    background: checkedSteps[idx] ? "rgba(16, 185, 129, 0.05)" : "rgba(255, 255, 255, 0.02)",
                                                    border: `1px solid ${checkedSteps[idx] ? "rgba(16, 185, 129, 0.2)" : "var(--border)"}`,
                                                    padding: "14px 16px",
                                                    borderRadius: "10px",
                                                    cursor: "pointer",
                                                    transition: "var(--transition)"
                                                }}
                                            >
                                                <div style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    border: `2px solid ${checkedSteps[idx] ? "#10b981" : "var(--text-dim)"}`,
                                                    borderRadius: "4px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    background: checkedSteps[idx] ? "#10b981" : "transparent",
                                                    flexShrink: 0,
                                                    marginTop: "2px",
                                                    transition: "var(--transition)"
                                                }}>
                                                    {checkedSteps[idx] && <FaCheck size={10} color="#fff" />}
                                                </div>
                                                <span style={{
                                                    fontSize: "0.95rem",
                                                    color: checkedSteps[idx] ? "var(--text-dim)" : "var(--text-main)",
                                                    textDecoration: checkedSteps[idx] ? "line-through" : "none",
                                                    transition: "var(--transition)"
                                                }}>
                                                    {step}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Warning Disclaimer */}
                                <div style={{
                                    background: "rgba(255, 77, 77, 0.05)",
                                    border: "1px solid rgba(255, 77, 77, 0.15)",
                                    color: "var(--primary)",
                                    borderRadius: "12px",
                                    padding: "16px",
                                    fontSize: "0.85rem",
                                    display: "flex",
                                    gap: "12px",
                                    lineHeight: "1.5"
                                }}>
                                    <FaExclamationTriangle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                                    <div>
                                        <strong>Medical Disclaimer:</strong> {response.disclaimer}
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                                    <button
                                        onClick={handleSaveAsReport}
                                        disabled={savingReport || saveSuccess}
                                        className="btn-primary"
                                        style={{
                                            background: saveSuccess ? "#10b981" : "linear-gradient(135deg, var(--secondary), #00a8cc)",
                                            boxShadow: saveSuccess ? "0 4px 15px rgba(16,185,129,0.3)" : "0 4px 15px rgba(0,242,254,0.3)",
                                            padding: "10px 20px"
                                        }}
                                    >
                                        {savingReport ? <FaSpinner className="spin" /> : saveSuccess ? (
                                            <>
                                                <FaCheck /> Saved as Incident Report!
                                            </>
                                        ) : (
                                            <>
                                                <FaSave /> Log as Incident Report
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="chat-input-wrapper">
                        <textarea
                            className="chat-textarea"
                            rows="2"
                            placeholder="Describe the emergency here (e.g., 'A person has collapsed and is unresponsive...')"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            className={`send-btn ${!message.trim() || loading ? 'disabled' : ''}`}
                            onClick={handleAnalyze}
                            disabled={!message.trim() || loading}
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}