import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div style={styles.hero}>
            <div style={styles.content}>
                {/* The "Crunch" Tagline */}
                <div style={styles.badge}>BEST BONELESS IN TOWN</div>
                
                <h1 style={styles.title}>
                    CRISPY. <br />
                    BOLD. <br />
                    <span style={styles.highlight}>UNFORGETTABLE.</span>
                </h1>

                <p style={styles.subtitle}>
                    Experience premium boneless fried chicken crafted with 
                    our signature double-crunch batter.
                </p>

                <div style={styles.buttonGroup}>
                    <Link to="/menu">
                        <button style={styles.primaryBtn}>ORDER NOW</button>
                    </Link>
                    <Link to="/menu">
                        <button style={styles.secondaryBtn}>VIEW FULL MENU</button>
                    </Link>
                </div>
            </div>

            {/* Visual Decoration: A slanted black bar at the bottom */}
            <div style={styles.slantedBar}></div>
        </div>
    );
};

const styles = {
    hero: {
        height: "90vh",
        backgroundColor: "#FFC72C", // Signature Yellow
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        padding: "0 20px",
    },
    content: {
        maxWidth: "800px",
        zIndex: 2,
    },
    badge: {
        backgroundColor: "#1A1A1A",
        color: "#FFC72C",
        padding: "8px 20px",
        fontFamily: "'Public Sans', sans-serif",
        fontWeight: "900",
        fontSize: "14px",
        letterSpacing: "3px",
        display: "inline-block",
        marginBottom: "20px",
        transform: "rotate(-2deg)", // Edgy tilt
    },
    title: {
        fontFamily: "'Oswald', sans-serif",
        fontSize: "clamp(60px, 10vw, 100px)", // Responsive sizing
        fontWeight: "900",
        lineHeight: "0.9",
        color: "#1A1A1A",
        margin: "0 0 20px 0",
    },
    highlight: {
        color: "#fff",
        textShadow: "4px 4px 0px #1A1A1A",
    },
    subtitle: {
        fontFamily: "'Public Sans', sans-serif",
        fontSize: "18px",
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: "40px",
        maxWidth: "500px",
        marginInline: "auto",
    },
    buttonGroup: {
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    primaryBtn: {
        backgroundColor: "#1A1A1A",
        color: "#FFC72C",
        padding: "18px 40px",
        border: "none",
        fontFamily: "'Oswald', sans-serif",
        fontSize: "20px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "8px 8px 0px #fff",
        transition: "transform 0.1s",
    },
    secondaryBtn: {
        backgroundColor: "transparent",
        color: "#1A1A1A",
        padding: "18px 40px",
        border: "3px solid #1A1A1A",
        fontFamily: "'Oswald', sans-serif",
        fontSize: "20px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background 0.2s",
    },
    slantedBar: {
        position: "absolute",
        bottom: "-50px",
        left: 0,
        width: "100%",
        height: "150px",
        backgroundColor: "#1A1A1A",
        transform: "skewY(-3deg)",
        zIndex: 1,
    }
};

export default Home;