import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getReports, createReport } from "../api/reports";
import { analyzeEmergency } from "../api/ai";
import {
    FaFileInvoice,
    FaDownload,
    FaFilter,
    FaSearch,
    FaSpinner,
    FaPlus,
    FaTimes,
    FaMapMarkerAlt,
    FaRobot,
    FaCheck,
    FaExclamationCircle,
} from "react-icons/fa";

export default function Reports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters and Search
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");
    const [severityFilter, setSeverityFilter] = useState("All");

    // Modal state for manually reporting an incident
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportTitle, setReportTitle] = useState("");
    const [reportType, setReportType] = useState("Medical");
    const [reportSeverity, setReportSeverity] = useState("MEDIUM");
    const [reportDescription, setReportDescription] = useState("");
    const [reportLocation, setReportLocation] = useState("");
    const [reportImageUrl, setReportImageUrl] = useState("");
    const [fetchingLocation, setFetchingLocation] = useState(false);
    const [submittingReport, setSubmittingReport] = useState(false);

    // Modal state for detailed report view
    const [selectedReport, setSelectedReport] = useState(null);
    const [aiGuidance, setAiGuidance] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            setLoading(true);
            const res = await getReports();
            setReports(res.data.results || res.data || []);
        } catch (error) {
            console.error("Failed to load reports", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenReportModal = () => {
        setReportTitle("");
        setReportType("Medical");
        setReportSeverity("MEDIUM");
        setReportDescription("");
        setReportLocation("");
        setReportImageUrl("");
        setShowReportModal(true);
    };

    const handleFetchLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported by your browser");
            return;
        }

        setFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(6);
                const lng = position.coords.longitude.toFixed(6);
                setReportLocation(`${lat}, ${lng}`);
                setFetchingLocation(false);
            },
            (error) => {
                console.error(error);
                setReportLocation("37.7749, -122.4194"); // default SF
                setFetchingLocation(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const handleSubmitReport = async (e) => {
        e.preventDefault();

        if (!reportTitle.trim()) {
            alert("Title is required");
            return;
        }
        if (!reportDescription.trim()) {
            alert("Description is required");
            return;
        }

        try {
            setSubmittingReport(true);
            await createReport({
                title: reportTitle.trim(),
                description: reportDescription.trim(),
                emergency_type: reportType,
                severity: reportSeverity,
                location: reportLocation.trim() || "Main Campus",
                image_url: reportImageUrl.trim() || null,
            });

            setShowReportModal(false);
            loadReports();
        } catch (error) {
            console.error("Failed to create report", error);
            alert("Failed to submit emergency report.");
        } finally {
            setSubmittingReport(false);
        }
    };

    const handleViewDetails = (report) => {
        setSelectedReport(report);
        setAiGuidance(null);
    };

    const handleGenerateAI = async (description) => {
        try {
            setLoadingAI(true);
            const res = await analyzeEmergency(description);
            setAiGuidance(res.data);
        } catch (error) {
            console.error("AI Generation failed", error);
            alert("Failed to generate AI guidance. Please try again.");
        } finally {
            setLoadingAI(false);
        }
    };

    const handleExportPDF = (report) => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Emergency Incident Report - #EP-${report.id}</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1a1a24; background: #fff; line-height: 1.6; }
                        .header { border-bottom: 3px solid #ff4d4d; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
                        .title { font-size: 26px; font-weight: bold; color: #111; margin: 0; }
                        .meta { margin-top: 5px; font-size: 14px; color: #555; }
                        .section { margin-bottom: 30px; background: #f9f9fc; padding: 20px; border-radius: 8px; border-left: 5px solid #ff4d4d; }
                        .section-title { font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #ff4d4d; border-bottom: 1px solid #ddd; padding-bottom: 4px; text-transform: uppercase; }
                        .content { font-size: 16px; }
                        .badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-weight: bold; text-transform: uppercase; font-size: 12px; }
                        .badge-critical { background: #ffebeb; color: #d41c2b; border: 1px solid #d41c2b; }
                        .badge-high { background: #fff4e6; color: #ff9900; border: 1px solid #ff9900; }
                        .badge-medium { background: #eaf5ff; color: #0088cc; border: 1px solid #0088cc; }
                        .badge-low { background: #ebfffa; color: #00b386; border: 1px solid #00b386; }
                        img { max-width: 100%; max-height: 350px; border-radius: 6px; margin-top: 10px; border: 1px solid #ddd; }
                        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div>
                            <h1 class="title">${report.title}</h1>
                            <div class="meta">
                                Incident ID: #EP-00${report.id} | Reported on: ${new Date(report.created_at).toLocaleString()}
                            </div>
                        </div>
                        <span class="badge badge-${report.severity?.toLowerCase()}">${report.severity}</span>
                    </div>

                    <div class="section" style="border-left-color: #00e5ff;">
                        <div class="section-title" style="color: #0088cc;">Incident Overview</div>
                        <table style="width: 100%; font-size: 15px;">
                            <tr>
                                <td style="width: 30%; font-weight: bold; padding: 6px 0;">Emergency Type:</td>
                                <td style="padding: 6px 0;">${report.emergency_type}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold; padding: 6px 0;">Location GPS / Address:</td>
                                <td style="padding: 6px 0;">${report.location}</td>
                            </tr>
                        </table>
                    </div>

                    <div class="section">
                        <div class="section-title">Incident Details</div>
                        <div class="content">${report.description.replace(/\n/g, "<br/>")}</div>
                        ${report.image_url ? `<div><img src="${report.image_url}"/></div>` : ""}
                    </div>

                    <div class="footer">
                        EmergencyConnect AI Security Dispatch Center • Confidential Report File
                    </div>

                    <script>
                        window.onload = function() {
                            window.print();
                            window.close();
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    // Filter logic
    const filteredReports = reports.filter((report) => {
        const matchesSearch =
            report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.location?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = typeFilter === "All" || report.emergency_type === typeFilter;
        const matchesSeverity = severityFilter === "All" || report.severity === severityFilter;

        return matchesSearch && matchesType && matchesSeverity;
    });

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1>Incident Reports</h1>
                    <p className="text-dim">History of emergency alerts, system activities, and reports database.</p>
                </div>
                <button className="btn-primary" onClick={handleOpenReportModal}>
                    <FaPlus /> Manual Report
                </button>
            </div>

            <div className="filters-bar glass mb-4" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div className="search-box" style={{ flex: 1, minWidth: "250px" }}>
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search reports by title, desc, location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <FaFilter className="text-dim" />
                    <select
                        className="input"
                        style={{ width: "160px", background: "#161821", border: "1px solid var(--border)", color: "white", padding: "8px 12px" }}
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Medical">Medical</option>
                        <option value="Fire">Fire</option>
                        <option value="Crime">Crime</option>
                        <option value="Accident">Accident</option>
                        <option value="Other">Other</option>
                    </select>

                    <select
                        className="input"
                        style={{ width: "160px", background: "#161821", border: "1px solid var(--border)", color: "white", padding: "8px 12px" }}
                        value={severityFilter}
                        onChange={(e) => setSeverityFilter(e.target.value)}
                    >
                        <option value="All">All Severities</option>
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="CRITICAL">CRITICAL</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center p-5">
                    <FaSpinner className="spin" size={32} color="var(--primary)" />
                    <p className="text-dim mt-2">Loading reports history...</p>
                </div>
            ) : (
                <div className="card glass reports-table-card" style={{ overflowX: "auto" }}>
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>Report ID</th>
                                <th>Incident Title</th>
                                <th>Type</th>
                                <th>Date / Time</th>
                                <th>Location</th>
                                <th>Severity</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.length > 0 ? (
                                filteredReports.map((report) => (
                                    <tr key={report.id}>
                                        <td>#EP-00{report.id}</td>
                                        <td className="fw-600">{report.title}</td>
                                        <td>{report.emergency_type}</td>
                                        <td>{new Date(report.created_at).toLocaleString()}</td>
                                        <td>
                                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                                <FaMapMarkerAlt size={10} color="var(--secondary)" />
                                                {report.location}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${
                                                report.severity === 'CRITICAL' ? 'badge-emergency' : 
                                                report.severity === 'HIGH' ? 'badge-emergency' : 'badge-dim'
                                            }`} style={{
                                                background: report.severity === 'CRITICAL' ? 'rgba(255,51,68,0.15)' : 
                                                            report.severity === 'HIGH' ? 'rgba(255,153,0,0.15)' : 'rgba(255,255,255,0.05)',
                                                color: report.severity === 'CRITICAL' ? '#ff3344' : 
                                                       report.severity === 'HIGH' ? '#ff9900' : 'var(--text-dim)'
                                            }}>
                                                {report.severity}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn-text-sm" onClick={() => handleViewDetails(report)}>
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center text-dim" style={{ padding: "40px" }}>
                                        No emergency incident reports found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Manual Report Modal */}
            {showReportModal && (
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
                        maxWidth: "600px",
                        padding: "32px",
                        borderRadius: "20px",
                        maxHeight: "90vh",
                        overflowY: "auto",
                        position: "relative",
                        border: "1px solid var(--border)"
                    }}>
                        <button className="icon-btn" onClick={() => setShowReportModal(false)} style={{
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

                        <form onSubmit={handleSubmitReport}>
                            <h2 style={{ marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
                                Report Emergency Incident
                            </h2>

                            <div className="form-group">
                                <label className="label">Incident Title</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g. Person fainted in chemistry lab"
                                    value={reportTitle}
                                    onChange={(e) => setReportTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                <div className="form-group">
                                    <label className="label">Emergency Type</label>
                                    <select
                                        className="input"
                                        style={{ background: "#161821", border: "1px solid var(--border)", color: "white" }}
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value)}
                                    >
                                        <option value="Medical">Medical</option>
                                        <option value="Fire">Fire</option>
                                        <option value="Crime">Crime</option>
                                        <option value="Accident">Accident</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="label">Severity Level</label>
                                    <select
                                        className="input"
                                        style={{ background: "#161821", border: "1px solid var(--border)", color: "white" }}
                                        value={reportSeverity}
                                        onChange={(e) => setReportSeverity(e.target.value)}
                                    >
                                        <option value="LOW">LOW</option>
                                        <option value="MEDIUM">MEDIUM</option>
                                        <option value="HIGH">HIGH</option>
                                        <option value="CRITICAL">CRITICAL</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label">Location Coordinates / Address</label>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="e.g. Building A, Room 302"
                                        value={reportLocation}
                                        onChange={(e) => setReportLocation(e.target.value)}
                                        required
                                        style={{ flex: 1 }}
                                    />
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={handleFetchLocation}
                                        style={{ padding: "10px 16px", flexShrink: 0 }}
                                        disabled={fetchingLocation}
                                    >
                                        {fetchingLocation ? <FaSpinner className="spin" /> : <FaMapMarkerAlt />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label">Detailed Description</label>
                                <textarea
                                    className="textarea"
                                    rows="4"
                                    placeholder="Describe the incident in detail so first responders are informed."
                                    value={reportDescription}
                                    onChange={(e) => setReportDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Image URL (Optional Attachment)</label>
                                <input
                                    type="url"
                                    className="input"
                                    placeholder="https://example.com/image.jpg"
                                    value={reportImageUrl}
                                    onChange={(e) => setReportImageUrl(e.target.value)}
                                />
                            </div>

                            <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
                                <button
                                    type="button"
                                    className="btn-secondary full-width"
                                    onClick={() => setShowReportModal(false)}
                                    disabled={submittingReport}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary full-width"
                                    disabled={submittingReport}
                                >
                                    {submittingReport ? <FaSpinner className="spin" /> : "Submit Report"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Detailed View Modal */}
            {selectedReport && (
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
                        maxWidth: "650px",
                        padding: "32px",
                        borderRadius: "20px",
                        maxHeight: "90vh",
                        overflowY: "auto",
                        position: "relative",
                        border: "1px solid var(--border)"
                    }}>
                        <button className="icon-btn" onClick={() => setSelectedReport(null)} style={{
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
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", gap: "12px" }}>
                                <div>
                                    <span className="text-dim" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>
                                        Incident Report #EP-00{selectedReport.id}
                                    </span>
                                    <h2 style={{ marginTop: "4px" }}>{selectedReport.title}</h2>
                                </div>
                                <span className={`badge ${
                                    selectedReport.severity === 'CRITICAL' ? 'badge-emergency' : 'badge-dim'
                                }`} style={{
                                    fontSize: "0.85rem",
                                    padding: "6px 14px",
                                    background: selectedReport.severity === 'CRITICAL' ? 'rgba(255,51,68,0.15)' : 'rgba(255,255,255,0.05)',
                                    color: selectedReport.severity === 'CRITICAL' ? '#ff3344' : 'var(--text-dim)'
                                }}>
                                    {selectedReport.severity}
                                </span>
                            </div>

                            <div style={{
                                background: "rgba(255,255,255,0.02)",
                                padding: "16px",
                                borderRadius: "12px",
                                border: "1px solid var(--border)",
                                marginBottom: "20px",
                                fontSize: "0.9rem",
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "16px"
                            }}>
                                <div>
                                    <span className="text-dim block">Incident Type</span>
                                    <strong className="block mt-1">{selectedReport.emergency_type}</strong>
                                </div>
                                <div>
                                    <span className="text-dim block">Location GPS</span>
                                    <strong className="block mt-1" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        <FaMapMarkerAlt size={12} color="var(--secondary)" />
                                        {selectedReport.location}
                                    </strong>
                                </div>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <span className="text-dim block">Report Date / Time</span>
                                    <strong className="block mt-1">{new Date(selectedReport.created_at).toLocaleString()}</strong>
                                </div>
                            </div>

                            <div style={{ marginBottom: "24px" }}>
                                <h4 style={{ marginBottom: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "4px" }}>
                                    Incident Description
                                </h4>
                                <p style={{ fontSize: "0.95rem", whiteSpace: "pre-wrap", color: "var(--text-main)" }}>
                                    {selectedReport.description}
                                </p>
                                {selectedReport.image_url && (
                                    <div style={{ marginTop: "16px" }}>
                                        <img
                                            src={selectedReport.image_url}
                                            alt="Incident Snapshot"
                                            style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "10px", border: "1px solid var(--border)" }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Integrated AI Assistant Section inside Details View */}
                            <div className="ai-guide-panel" style={{
                                background: "rgba(0, 242, 254, 0.03)",
                                border: "1px dashed rgba(0, 242, 254, 0.2)",
                                borderRadius: "14px",
                                padding: "20px",
                                marginBottom: "24px"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                    <h4 style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--secondary)", margin: 0 }}>
                                        <FaRobot /> AI First-Aid Guidance
                                    </h4>
                                    {!aiGuidance && !loadingAI && (
                                        <button
                                            type="button"
                                            className="btn-text-sm"
                                            onClick={() => handleGenerateAI(selectedReport.description)}
                                            style={{ color: "var(--secondary)", border: "1px solid rgba(0, 242, 254, 0.3)", padding: "4px 10px", borderRadius: "6px" }}
                                        >
                                            Generate Guide
                                        </button>
                                    )}
                                </div>

                                {loadingAI && (
                                    <div className="text-center p-3">
                                        <FaSpinner className="spin" color="var(--secondary)" />
                                        <p className="text-dim mt-1" style={{ fontSize: "0.8rem" }}>Analyzing description & generating medical guidance...</p>
                                    </div>
                                )}

                                {aiGuidance && (
                                    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
                                        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                                            <span style={{ fontSize: "0.85rem", background: "rgba(0, 242, 254, 0.1)", color: "var(--secondary)", padding: "2px 8px", borderRadius: "4px", fontWeight: "600" }}>
                                                {aiGuidance.emergency_type}
                                            </span>
                                            <span style={{ fontSize: "0.85rem", background: "rgba(255, 77, 77, 0.1)", color: "var(--primary)", padding: "2px 8px", borderRadius: "4px", fontWeight: "600" }}>
                                                PRIORITY: {aiGuidance.priority}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: "0.85rem", marginBottom: "12px", fontStyle: "italic", color: "var(--text-dim)" }}>
                                            {aiGuidance.summary}
                                        </p>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                            {aiGuidance.first_aid && aiGuidance.first_aid.map((step, idx) => (
                                                <div key={idx} style={{ display: "flex", gap: "8px", fontSize: "0.85rem", alignItems: "flex-start" }}>
                                                    <span style={{ background: "var(--secondary)", color: "var(--bg-deep)", width: "16px", height: "16px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "bold", flexShrink: 0, marginTop: "2px" }}>
                                                        {idx + 1}
                                                    </span>
                                                    <span>{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{
                                            marginTop: "12px",
                                            background: "rgba(255,77,77,0.05)",
                                            border: "1px solid rgba(255,77,77,0.1)",
                                            borderRadius: "8px",
                                            padding: "8px 12px",
                                            fontSize: "0.75rem",
                                            color: "var(--primary)",
                                            display: "flex",
                                            gap: "8px"
                                        }}>
                                            <FaExclamationCircle style={{ marginTop: "2px", flexShrink: 0 }} />
                                            <span>{aiGuidance.disclaimer}</span>
                                        </div>
                                    </div>
                                )}

                                {!aiGuidance && !loadingAI && (
                                    <p className="text-dim" style={{ fontSize: "0.8rem", margin: 0 }}>
                                        No guidance generated yet. Click 'Generate Guide' to analyze this incident description with AI.
                                    </p>
                                )}
                            </div>

                            <div style={{ display: "flex", gap: "16px" }}>
                                <button
                                    type="button"
                                    className="btn-secondary full-width"
                                    onClick={() => setSelectedReport(null)}
                                >
                                    Close Details
                                </button>
                                <button
                                    type="button"
                                    className="btn-primary full-width"
                                    onClick={() => handleExportPDF(selectedReport)}
                                    style={{ background: "linear-gradient(135deg, var(--secondary), #00a8cc)", boxShadow: "0 4px 15px rgba(0,242,254,0.3)" }}
                                >
                                    <FaDownload /> Export PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}