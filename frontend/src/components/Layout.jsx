import Sidebar from "./Sidebar";

export default function Layout({ children }) {
    const email = localStorage.getItem("user_email");
    const username = email ? email.split("@")[0] : "User";


    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <header className="top-header">
                    <div className="header-search">
                        <input type="text" placeholder="Search..." className="glass-input" />
                    </div>
                    <div className="user-profile">
                        <div className="user-info">
                            <h1>{username}</h1>
                            <span className="user-status">Online</span>
                        </div>
                        <div className="user-avatar" />
                    </div>
                </header>
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
}