import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./Auth_Context";
import { logout } from "./Auth_Service";
import { useCart } from "./Cart_Context";

const Navbar = () => {
    const { currentUser, isAdmin } = useAuth(); // ✅ added isAdmin
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/auth");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const { cartItems } = useCart();
    const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

    return (
        <nav style={styles.nav}>
            <div style={styles.logoGroup} onClick={() => navigate("/")}>
                <span style={styles.logoThe}>THE</span>
                <span style={styles.logoCrunch}>CRUNCH</span>
            </div>

            <div style={styles.links}>
                <Link style={styles.link} to="/">HOME</Link>
                <Link style={styles.link} to="/menu">MENU</Link>

                {/* ✅ Only visible to admins */}
                {isAdmin && (
                    <Link style={styles.adminLink} to="/admin">ADMIN</Link>
                )}

                {currentUser ? (
                    <div style={styles.userGroup}>
                        <span style={styles.userLabel}>HI, {currentUser.name?.toUpperCase()}</span>
                        <button onClick={handleLogout} style={styles.logoutBtn}>LOGOUT</button>
                    </div>
                ) : (
                    <Link style={styles.link} to="/auth">LOGIN / SIGN UP</Link>
                )}

                <Link style={styles.cartLink} to="/cart">
                    CART <span style={styles.cartBadge}>{totalItems}</span>
                </Link>
            </div>
        </nav>
    );
};

const styles = {
    // ... all your existing styles unchanged ...
    nav: {
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "#FFC72C",
        padding: "15px 8%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "5px solid #1A1A1A",
    },
    logoGroup: { display: "flex", flexDirection: "column", lineHeight: "0.8", cursor: "pointer" },
    logoThe: { fontFamily: "'Public Sans', sans-serif", fontSize: "14px", fontWeight: "900", color: "#1A1A1A", letterSpacing: "2px" },
    logoCrunch: { fontFamily: "'Oswald', sans-serif", fontSize: "32px", fontWeight: "bold", color: "#1A1A1A", fontStyle: "italic" },
    links: { display: "flex", alignItems: "center", gap: "40px" },
    link: { textDecoration: "none", color: "#1A1A1A", fontFamily: "'Public Sans', sans-serif", fontWeight: "800", fontSize: "14px", letterSpacing: "1px" },

    // ✅ New admin link style — red to stand out
    adminLink: {
        textDecoration: "none",
        color: "#fff",
        backgroundColor: "#e63946",
        fontFamily: "'Public Sans', sans-serif",
        fontWeight: "900",
        fontSize: "13px",
        letterSpacing: "1px",
        padding: "6px 14px",
        border: "2px solid #1A1A1A",
        boxShadow: "3px 3px 0px #1A1A1A",
    },

    cartLink: { textDecoration: "none", backgroundColor: "#1A1A1A", color: "#FFC72C", padding: "10px 20px", borderRadius: "4px", fontFamily: "'Oswald', sans-serif", fontWeight: "bold", fontSize: "16px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "4px 4px 0px rgba(0,0,0,0.2)" },
    cartBadge: { backgroundColor: "#FFC72C", color: "#1A1A1A", padding: "2px 8px", borderRadius: "2px", fontSize: "12px" },
    userLabel: { fontFamily: "'Oswald', sans-serif", fontSize: "14px", color: "#1A1A1A", borderRight: "2px solid #1A1A1A", paddingRight: "15px", marginRight: "15px" },
    logoutBtn: { background: "none", border: "none", fontFamily: "'Public Sans', sans-serif", fontWeight: "900", fontSize: "12px", cursor: "pointer", textDecoration: "underline", color: "#1A1A1A" },
    userGroup: { display: "flex", alignItems: "center" },
};

export default Navbar;