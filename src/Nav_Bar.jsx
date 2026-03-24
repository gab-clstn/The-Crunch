import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./Auth_Context";
import { logout } from "./Auth_Service";

const Navbar = () => {
    const { currentUser, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/auth");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.innerContainer}>
                <div style={styles.logoGroup} onClick={() => navigate("/")}>
                    <span style={styles.logoThe}>THE</span>
                    <span style={styles.logoCrunch}>CRUNCH</span>
                </div>

                <div style={styles.links}>
                    <Link style={styles.link} to="/">HOME</Link>
                    <Link style={styles.link} to="/menu">MENU</Link>

                    {/* Only show MY ORDERS when logged in */}
                    {currentUser && (
                        <Link style={styles.link} to="/orders">MY ORDERS</Link>
                    )}

                    {currentUser ? (
                        <div style={styles.userGroup}>
                            <span style={styles.userLabel}>
                                HI, {currentUser.name?.toUpperCase() || currentUser.email?.split("@")[0].toUpperCase()}
                            </span>
                            <button onClick={handleLogout} style={styles.logoutBtn}>LOGOUT</button>
                        </div>
                    ) : (
                        <Link style={styles.link} to="/auth">LOGIN / SIGN UP</Link>
                    )}

                    {isAdmin && (
                        <Link style={styles.adminLink} to="/admin">ADMIN</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: "#FFC72C",
        borderBottom: "5px solid #1A1A1A",
        display: "flex",
        justifyContent: "center",
    },
    innerContainer: {
        width: "100%",
        maxWidth: "1200px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        boxSizing: "border-box",
    },
    logoGroup: { display: "flex", flexDirection: "column", lineHeight: "0.8", cursor: "pointer" },
    logoThe: { fontFamily: "'Public Sans', sans-serif", fontSize: "12px", fontWeight: "900", color: "#1A1A1A", letterSpacing: "2px" },
    logoCrunch: { fontFamily: "'Oswald', sans-serif", fontSize: "32px", fontWeight: "bold", color: "#1A1A1A", fontStyle: "italic" },
    links: { display: "flex", alignItems: "center", gap: "40px" },
    link: { textDecoration: "none", color: "#1A1A1A", fontFamily: "'Public Sans', sans-serif", fontWeight: "800", fontSize: "14px", letterSpacing: "1px" },
    adminLink: {
        textDecoration: "none",
        color: "#fff",
        backgroundColor: "#e63946",
        fontFamily: "'Public Sans', sans-serif",
        fontWeight: "900",
        fontSize: "13px",
        padding: "6px 14px",
        border: "2px solid #1A1A1A",
        boxShadow: "3px 3px 0px #1A1A1A",
    },
    userLabel: { fontFamily: "'Oswald', sans-serif", fontSize: "14px", color: "#1A1A1A", borderRight: "2px solid #1A1A1A", paddingRight: "15px", marginRight: "15px" },
    logoutBtn: { background: "none", border: "none", fontFamily: "'Public Sans', sans-serif", fontWeight: "900", fontSize: "12px", cursor: "pointer", textDecoration: "underline", color: "#1A1A1A" },
    userGroup: { display: "flex", alignItems: "center" },
};

export default Navbar;