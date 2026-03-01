import React from "react";
import { useCart } from "../../context/Cart_Context"; // 1. Import the hook

const ProductCard = ({ product }) => {
    // Mapping from your Firebase fields:
    const { name, price, description, imageUrl, available, category } = product;

    // 2. Access the addToCart function from our context
    const { addToCart } = useCart();

    const handleAddClick = () => {
        addToCart(product);
        // Optional: You could add a small "Added!" toast or alert here
    };

    return (
        <div style={{
            ...styles.card,
            opacity: available ? 1 : 0.6,
            filter: available ? "none" : "grayscale(1)"
        }}>
            <div style={styles.imageContainer}>
                <div style={styles.categoryBadge}>{category}</div>

                <img
                    src={imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={name}
                    style={styles.image}
                />

                <div style={styles.priceBadge}>₱{price}</div>
            </div>

            <div style={styles.info}>
                <h3 style={styles.name}>{name}</h3>
                <p style={styles.description}>{description}</p>

                {available ? (
                    <button
                        style={styles.button}
                        onClick={() => addToCart(product)}
                        onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
                        onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                        + ADD TO ORDER
                    </button>
                ) : (
                    <button style={{ ...styles.button, backgroundColor: "#ccc", cursor: "not-allowed" }}>
                        SOLD OUT
                    </button>
                )}
            </div>
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: "#fff",
        border: "3px solid #1A1A1A",
        boxShadow: "10px 10px 0px #FFC72C",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative"
    },
    imageContainer: {
        position: "relative",
        height: "220px",
        borderBottom: "3px solid #1A1A1A",
        backgroundColor: "#f0f0f0"
    },
    image: { width: "100%", height: "100%", objectFit: "cover" },
    categoryBadge: {
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "#1A1A1A",
        color: "#fff",
        padding: "4px 10px",
        fontSize: "12px",
        fontWeight: "900",
        zIndex: 2,
        textTransform: "uppercase"
    },
    priceBadge: {
        position: "absolute",
        bottom: "-3px",
        left: "-3px",
        backgroundColor: "#1A1A1A",
        color: "#FFC72C",
        padding: "8px 15px",
        fontFamily: "'Oswald', sans-serif",
        fontSize: "22px",
        fontWeight: "bold",
        border: "3px solid #1A1A1A",
        borderLeft: "none",
        borderBottom: "none"
    },
    info: { padding: "20px", marginTop: "10px" },
    name: {
        fontFamily: "'Oswald', sans-serif",
        fontSize: "26px",
        textTransform: "uppercase",
        margin: "0 0 5px 0",
        color: "#1A1A1A",
    },
    description: {
        fontFamily: "'Public Sans', sans-serif",
        fontSize: "14px",
        color: "#666",
        marginBottom: "20px",
        minHeight: "40px"
    },
    button: {
        width: "100%",
        backgroundColor: "#FFC72C",
        border: "2px solid #1A1A1A",
        padding: "12px",
        fontFamily: "'Public Sans', sans-serif",
        fontWeight: "900",
        cursor: "pointer",
        fontSize: "14px",
        transition: "transform 0.1s",
        boxShadow: "4px 4px 0px #1A1A1A", // Gives it a 3D crunchy look
        active: {
            transform: "translate(2px, 2px)",
            boxShadow: "none"
        }
    },
};

export default ProductCard;