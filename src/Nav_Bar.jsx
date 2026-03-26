import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./Auth_Context";
import { logout } from "./Auth_Service";
import { useState } from "react";

const Navbar = () => {
    const { currentUser, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/auth");
            setMobileMenuOpen(false);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .navbar-links { display: none !important; }
                    .navbar-hamburger { display: flex !important; }
                }
                @media (min-width: 769px) {
                    .navbar-hamburger { display: none !important; }
                    .navbar-mobile-menu { display: none !important; }
                }
            `}</style>
            <nav style={styles.nav}>
                <div style={styles.innerContainer}>
                <div style={styles.logoGroup} onClick={() => { navigate("/"); setMobileMenuOpen(false); }}>
                    <span style={styles.logoThe}>THE</span>
                    <span style={styles.logoCrunch}>CRUNCH</span>
                </div>

                {/* Hamburger button for mobile */}
                <button
                    className="navbar-hamburger"
                    style={styles.hamburger}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span style={{...styles.hamburgerLine, transform: mobileMenuOpen ? 'rotate(45deg) translate(10px, 10px)' : 'none'}}></span>
                    <span style={{...styles.hamburgerLine, opacity: mobileMenuOpen ? 0 : 1}}></span>
                    <span style={{...styles.hamburgerLine, transform: mobileMenuOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none'}}></span>
                </button>

                {/* Desktop links */}
                <div className="navbar-links" style={styles.links}>
                    <Link style={styles.link} to="/">HOME</Link>
                    <Link style={styles.link} to="/menu">MENU</Link>

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

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="navbar-mobile-menu" style={styles.mobileMenu}>
                        <Link style={styles.mobileLink} to="/" onClick={() => setMobileMenuOpen(false)}>HOME</Link>
                        <Link style={styles.mobileLink} to="/menu" onClick={() => setMobileMenuOpen(false)}>MENU</Link>

                        {currentUser && (
                            <Link style={styles.mobileLink} to="/orders" onClick={() => setMobileMenuOpen(false)}>MY ORDERS</Link>
                        )}

                        {currentUser ? (
                            <>
                                <span style={styles.mobileUserLabel}>
                                    {currentUser.name?.toUpperCase() || currentUser.email?.split("@")[0].toUpperCase()}
                                </span>
                                <button onClick={handleLogout} style={styles.mobileLogoutBtn}>LOGOUT</button>
                            </>
                        ) : (
                            <Link style={styles.mobileLink} to="/auth" onClick={() => setMobileMenuOpen(false)}>LOGIN / SIGN UP</Link>
                        )}

                        {isAdmin && (
                            <Link style={styles.mobileAdminLink} to="/admin" onClick={() => setMobileMenuOpen(false)}>ADMIN</Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
        </>
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
        position: "relative",
    },
    logoGroup: { display: "flex", flexDirection: "column", lineHeight: "0.8", cursor: "pointer" },
    logoThe: { fontFamily: "'Public Sans', sans-serif", fontSize: "12px", fontWeight: "900", color: "#1A1A1A", letterSpacing: "2px" },
    logoCrunch: { fontFamily: "'Oswald', sans-serif", fontSize: "32px", fontWeight: "bold", color: "#1A1A1A", fontStyle: "italic" },
    links: { display: "flex", alignItems: "center", gap: "clamp(12px, 2vw, 28px)" },
    link: { textDecoration: "none", color: "#1A1A1A", fontFamily: "'Public Sans', sans-serif", fontWeight: "800", fontSize: "14px", letterSpacing: "1px" },
    hamburger: {
        display: "none",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        width: "40px",
        height: "30px",
        flexDirection: "column",
        justifyContent: "space-around",
    },
    hamburgerLine: {
        width: "28px",
        height: "3px",
        backgroundColor: "#1A1A1A",
        transition: "transform 0.3s, opacity 0.3s",
    },
    mobileMenu: {
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        backgroundColor: "#FFC72C",
        borderBottom: "3px solid #1A1A1A",
        display: "flex",
        flexDirection: "column",
        gap: "0",
        padding: "15px 20px",
        boxSizing: "border-box",
    },
    mobileLink: {
        textDecoration: "none",
        color: "#1A1A1A",
        fontFamily: "'Public Sans', sans-serif",
        fontWeight: "800",
        fontSize: "14px",
        padding: "12px 0",
        borderBottom: "1px solid rgba(26, 26, 26, 0.1)",
    },
    mobileUserLabel: {
        fontFamily: "'Oswald', sans-serif",
        fontSize: "13px",
        color: "#1A1A1A",
        padding: "12px 0",
        borderBottom: "1px solid rgba(26, 26, 26, 0.1)",
        fontWeight: "700",
    },
    mobileLogoutBtn: {
        background: "none",
        border: "none",
        fontFamily: "'Public Sans', sans-serif",
        fontWeight: "900",
        fontSize: "12px",
        cursor: "pointer",
        textDecoration: "underline",
        color: "#1A1A1A",
        padding: "12px 0",
        textAlign: "left",
    },
    mobileAdminLink: {
        textDecoration: "none",
        color: "#fff",
        backgroundColor: "#e63946",
        fontFamily: "'Public Sans', sans-serif",
        fontWeight: "900",
        fontSize: "12px",
        padding: "10px 14px",
        border: "2px solid #1A1A1A",
        boxShadow: "3px 3px 0px #1A1A1A",
        marginTop: "10px",
        display: "inline-block",
    },
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