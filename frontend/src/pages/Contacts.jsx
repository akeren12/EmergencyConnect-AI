import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getContacts, deleteContact, createContact, updateContact } from "../api/contacts";
import {
    FaPlus,
    FaPhoneAlt,
    FaUserEdit,
    FaTrash,
    FaSpinner,
    FaTimes,
    FaUserPlus,
} from "react-icons/fa";

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state variables
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [relationship, setRelationship] = useState("Family");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            setLoading(true);
            const res = await getContacts();
            setContacts(res.data.results || res.data || []);
        } catch (error) {
            console.error("Failed to load contacts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this emergency contact?")) {
            return;
        }

        try {
            await deleteContact(id);
            loadContacts();
        } catch (error) {
            console.error("Failed to delete contact", error);
            alert("Failed to delete contact. Please try again.");
        }
    };

    const handleOpenAddModal = () => {
        setModalMode("add");
        setEditingId(null);
        setName("");
        setPhone("");
        setRelationship("Family");
        setShowModal(true);
    };

    const handleOpenEditModal = (contact) => {
        setModalMode("edit");
        setEditingId(contact.id);
        setName(contact.name || "");
        setPhone(contact.phone_number || "");
        setRelationship(contact.relationship || "Family");
        setShowModal(true);
    };

    const handleSubmitContact = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Contact name is required");
            return;
        }
        if (!phone.trim()) {
            alert("Phone number is required");
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                name: name.trim(),
                phone_number: phone.trim(),
                relationship: relationship
            };

            if (modalMode === "add") {
                await createContact(payload);
            } else {
                await updateContact(editingId, payload);
            }

            setShowModal(false);
            loadContacts();
        } catch (error) {
            console.error("Failed to save contact", error);
            alert(error.response?.data?.error || "Failed to save contact details.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1>Emergency Contacts</h1>
                    <p className="text-dim">Manage trusted contacts notified in case of emergency broadcast.</p>
                </div>

                <button className="btn-primary" onClick={handleOpenAddModal}>
                    <FaPlus />
                    <span>Add Contact</span>
                </button>
            </div>

            {loading ? (
                <div className="text-center p-5">
                    <FaSpinner className="spin" size={32} color="var(--primary)" />
                    <p className="text-dim mt-2">Loading emergency contacts...</p>
                </div>
            ) : (
                <div className="grid-cols-3 mt-4">
                    {contacts.length > 0 ? (
                        contacts.map((contact) => (
                            <div key={contact.id} className="card glass contact-card">
                                <div className="contact-avatar" style={{
                                    background: "linear-gradient(135deg, rgba(255, 77, 77, 0.1), rgba(0, 242, 254, 0.1))",
                                    color: "var(--text-bright)",
                                    fontWeight: "800"
                                }}>
                                    {contact.name?.charAt(0).toUpperCase() || "?"}
                                </div>

                                <div className="contact-details">
                                    <h3>{contact.name || "Unknown Contact"}</h3>
                                    <p className="relation" style={{
                                        color: "var(--secondary)",
                                        fontSize: "0.85rem",
                                        fontWeight: "600",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                        marginTop: "4px"
                                    }}>{contact.relationship || "N/A"}</p>
                                    <p className="phone" style={{ marginTop: "8px" }}>
                                        <FaPhoneAlt size={12} style={{ marginRight: "6px" }} />
                                        {contact.phone_number || "No Phone"}
                                    </p>
                                </div>

                                <div className="contact-actions">
                                    <button
                                        className="icon-btn"
                                        title="Edit"
                                        onClick={() => handleOpenEditModal(contact)}
                                    >
                                        <FaUserEdit />
                                    </button>

                                    <button
                                        className="icon-btn delete"
                                        title="Delete"
                                        onClick={() => handleDelete(contact.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="card glass text-center" style={{ gridColumn: "1 / -1", padding: "40px" }}>
                            <p className="text-dim">No trusted contacts registered. Add emergency contacts to keep them informed.</p>
                            <button className="btn-secondary mt-3" onClick={handleOpenAddModal}>
                                <FaPlus /> Add Contact Now
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Add / Edit Contact Modal */}
            {showModal && (
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
                        maxWidth: "450px",
                        padding: "32px",
                        borderRadius: "20px",
                        position: "relative",
                        boxShadow: "0 10px 30px rgba(0, 242, 254, 0.15)",
                        border: "1px solid rgba(0, 242, 254, 0.2)"
                    }}>
                        <button className="icon-btn" onClick={() => setShowModal(false)} style={{
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

                        <form onSubmit={handleSubmitContact}>
                            <div style={{ textAlign: "center", marginBottom: "24px" }}>
                                <div className="logo-icon large" style={{
                                    background: "linear-gradient(135deg, var(--secondary), #00a8cc)",
                                    boxShadow: "0 0 20px rgba(0, 242, 254, 0.3)",
                                    marginBottom: "12px"
                                }}>
                                    <FaUserPlus />
                                </div>
                                <h2>{modalMode === "add" ? "Add Trusted Contact" : "Edit Trusted Contact"}</h2>
                                <p className="text-dim mt-1">
                                    {modalMode === "add" ? "Add details of your emergency notifier" : "Update notifier contact credentials"}
                                </p>
                            </div>

                            <div className="form-group">
                                <label className="label">Full Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g. John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="input"
                                    placeholder="e.g. +1 234-567-890"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Relationship</label>
                                <select
                                    className="input"
                                    style={{ background: "#161821", border: "1px solid var(--border)", color: "white" }}
                                    value={relationship}
                                    onChange={(e) => setRelationship(e.target.value)}
                                >
                                    <option value="Family">Family Member</option>
                                    <option value="Friend">Friend</option>
                                    <option value="Doctor">Doctor / Physician</option>
                                    <option value="Neighbor">Neighbor</option>
                                    <option value="Spouse">Spouse / Partner</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
                                <button
                                    type="button"
                                    className="btn-secondary full-width"
                                    onClick={() => setShowModal(false)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary full-width"
                                    disabled={submitting}
                                    style={{
                                        background: "linear-gradient(135deg, var(--secondary), #00c6ff)",
                                        boxShadow: "0 4px 15px rgba(0, 242, 254, 0.3)"
                                    }}
                                >
                                    {submitting ? <FaSpinner className="spin" /> : "Save Contact"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}