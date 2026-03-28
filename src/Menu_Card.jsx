import React, { useState } from "react";
import { useCart } from "./useCart";
import { imageMap } from "./assets/imageMap";

const ProductCard = ({ product }) => {
    const { name, price, description, imageUrl, available } = product;
    const { addToCart } = useCart();
    const [qty, setQty] = useState(0);
    const [added, setAdded] = useState(false);

    const imageSrc = imageMap[name] || imageUrl || "https://via.placeholder.com/300x200?text=No+Image";

    const handleAdd = () => {
        if (qty === 0) return;
        for (let i = 0; i < qty; i++) addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
        setQty(0);
    };

    return (
        <div style={{
            ...styles.card,
            opacity: available ? 1 : 0.6,
            filter: available ? "none" : "grayscale(1)",
        }}>
            <div style={styles.imageContainer}>
                <img src={imageSrc} alt={name} style={styles.image} />
                <div style={styles.priceBadge}>₱{price}</div>
            </div>

            <div style={styles.info}>
                <h3 style={styles.name}>{name}</h3>
                <p style={styles.description}>{description}</p>

                {available ? (
                    <div style={styles.bottomRow}>
                        <div style={styles.qtyRow}>
                            <button style={styles.qtyBtn} onClick={() => setQty(q => Math.max(0, q - 1))}>−</button>
                            <span style={styles.qtyNum}>{qty}</span>
                            <button style={styles.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
                        </div>
                        <button
                            style={{
                                ...styles.button,
                                backgroundColor: added ? "#1A1A1A" : qty === 0 ? "#ccc" : "#FFC72C",
                                color: added ? "#FFC72C" : "#1A1A1A",
                                cursor: qty === 0 ? "not-allowed" : "pointer",
                                boxShadow: qty === 0 ? "none" : "3px 3px 0px #1A1A1A",
                            }}
                            onClick={handleAdd}
                            disabled={qty === 0}
                        >
                            {added ? "✓ ADDED!" : "+ ADD TO ORDER"}
                        </button>
                    </div>
                ) : (
                    <button style={{ ...styles.button, backgroundColor: "#ccc", cursor: "not-allowed", marginTop: "auto" }}>
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
        boxShadow: "6px 6px 0px #FFC72C",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },
    imageContainer: {
        position: "relative",
        height: "220px",
        borderBottom: "3px solid #1A1A1A",
        backgroundColor: "#f0f0f0",
        flexShrink: 0,
    },
    image: { width: "100%", height: "100%", objectFit: "cover" },
    priceBadge: {
        position: "absolute",
        bottom: "-3px",
        left: "-3px",
        backgroundColor: "#1A1A1A",
        color: "#FFC72C",
        padding: "5px 12px",
        fontFamily: "'Oswald', sans-serif",
        fontSize: "18px",
        fontWeight: "bold",
        border: "3px solid #1A1A1A",
        borderLeft: "none",
        borderBottom: "none",
    },
    info: {
        padding: "14px 16px 16px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
    },
    name: {
        fontFamily: "'Oswald', sans-serif",
        fontSize: "20px",
        textTransform: "uppercase",
        margin: "0 0 4px 0",
        color: "#1A1A1A",
    },
    description: {
        fontFamily: "'Public Sans', sans-serif",
        fontSize: "13px",
        color: "#666",
        marginBottom: "12px",
        flex: 1,
    },
    bottomRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginTop: "auto",
    },
    qtyRow: {
        display: "flex",
        alignItems: "center",
        border: "2px solid #1A1A1A",
        overflow: "hidden",
        flexShrink: 0,
    },
    qtyBtn: {
        backgroundColor: "#fff",
        border: "none",
        width: "28px",
        height: "36px",
        fontSize: "16px",
        fontWeight: "900",
        cursor: "pointer",
        fontFamily: "'Oswald', sans-serif",
    },
    qtyNum: {
        fontFamily: "'Oswald', sans-serif",
        fontSize: "15px",
        fontWeight: "900",
        width: "28px",
        textAlign: "center",
        borderLeft: "1px solid #1A1A1A",
        borderRight: "1px solid #1A1A1A",
        lineHeight: "36px",
    },
    button: {
        flex: 1,
        border: "2px solid #1A1A1A",
        padding: "10px",
        fontFamily: "'Public Sans', sans-serif",
        fontWeight: "900",
        fontSize: "13px",
        transition: "background 0.2s",
    },
};

export default ProductCard;