import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
    FaThLarge, 
    FaAddressBook, 
    FaFileAlt, 
    FaLightbulb, 
    FaRobot, 
    FaSignOutAlt,
    FaShieldAlt
} from "react-icons/fa";

const navItems = [
    { name: "Dashboard", path: "/", icon: <FaThLarge /> },
    { name: "Contacts", path: "/contacts", icon: <FaAddressBook /> },
    { name: "Reports", path: "/reports", icon: <FaFileAlt /> },
    { name: "Safety Tips", path: "/tips", icon: <FaLightbulb /> },
    { name: "AI Assistant", path: "/ai", icon: <FaRobot /> },
];

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_email");
        navigate("/login");
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">
                    <FaShieldAlt />
                </div>
                <div className="logo-text">
                    <span className="brand">Emergency</span>
                    <span className="subbrand">Connect AI</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-text">{item.name}</span>
                        {location.pathname === item.path && <div className="active-indicator" />}
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

// Add styles here or in a separate CSS file. Let's add them to index.css or a new Sidebar.css.
// I'll add them to index.css since I'm aiming for a cohesive design system there.
