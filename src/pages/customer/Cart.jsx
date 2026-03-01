import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { submitOrder } from "../../services/Cart_Service";
import { useAuth } from "../../context/Auth_Context";
import { useCart } from "../../context/Cart_Context";

const Cart = () => { // Remove the ({ cartItems }) part
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    const { cartItems, clearCart } = useCart(); // NOW pull it from context here
    const navigate = useNavigate();

    // 1. Calculations
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0);
    const deliveryFee = cartItems.length > 0 ? 45 : 0;
    const finalTotal = subtotal + deliveryFee;

    // 2. Handle Checkout Logic
    const handleCheckout = async () => {
        if (!currentUser) return alert("Please login first!");

        setLoading(true);
        try {
            const orderId = await placeOrder(currentUser, cartItems, finalTotal);
            alert(`Order Placed! ID: ${orderId}`);
            clearCart();
            navigate("/orders"); // Send them to the new orders page!
        } catch (error) {
            alert("Checkout failed.");
        } finally {
            setLoading(false);
        }
    };

    // 3. Empty State UI
    if (!cartItems || cartItems.length === 0) {
        return (
            <div style={styles.page}>
                <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <h1 style={styles.title}>YOUR CART IS <span style={{ color: '#FFC72C' }}>EMPTY</span></h1>
                    <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: '700' }}>Looks like you haven't added any crunch yet!</p>
                    <Link to="/menu">
                        <button style={{ ...styles.checkoutBtn, width: 'auto', marginTop: '20px' }}>GO TO MENU</button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div className="container">
                <h1 style={styles.title}>YOUR <span style={{ color: '#FFC72C' }}>ORDER</span></h1>
                <div style={styles.layout}>
                    {/* List of Items */}
                    <div style={styles.itemsSection}>
                        {cartItems.map((item) => (
                            <div key={item.id} style={styles.cartItem}>
                                <div style={styles.itemInfo}>
                                    <h3 style={styles.itemName}>{item.name}</h3>
                                    <p style={styles.itemPrice}>₱{item.price} x {item.qty}</p>
                                </div>
                                <div style={styles.itemTotal}>₱{item.price * item.qty}</div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Card */}
                    <div style={styles.summaryCard}>
                        <h2 style={styles.summaryTitle}>RECEIPT</h2>
                        <div style={styles.summaryRow}>
                            <span>SUBTOTAL</span>
                            <span>₱{subtotal}</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>DELIVERY</span>
                            <span>₱{deliveryFee}</span>
                        </div>
                        <div style={{ ...styles.summaryRow, marginTop: '20px', borderTop: '2px solid #1A1A1A', paddingTop: '10px' }}>
                            <span style={styles.totalLabel}>TOTAL</span>
                            <span style={styles.totalAmount}>₱{finalTotal}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            style={{
                                ...styles.checkoutBtn,
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? "not-allowed" : "pointer"
                            }}
                        >
                            {loading ? "PROCESSING..." : "CONFIRM ORDER"}
                        </button>

                        <Link to="/menu" style={styles.backToMenu}>← BACK TO MENU</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { backgroundColor: "#F9F9F9", minHeight: "100vh", padding: "40px 0" },
    title: { fontFamily: "'Oswald', sans-serif", fontSize: "48px", marginBottom: "40px", color: "#1A1A1A" },
    layout: { display: "grid", gridTemplateColumns: "1fr 350px", gap: "40px", alignItems: "start" },

    // Item Styling
    itemsSection: { display: "flex", flexDirection: "column", gap: "15px" },
    cartItem: {
        backgroundColor: "#fff",
        border: "3px solid #1A1A1A",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "6px 6px 0px #eee"
    },
    itemName: { fontFamily: "'Oswald', sans-serif", margin: 0, fontSize: "22px", textTransform: "uppercase" },
    itemPrice: { margin: "5px 0 0 0", color: "#666", fontWeight: "700" },

    // Qty Controls
    qtyControls: { display: "flex", alignItems: "center", gap: "15px", border: "2px solid #1A1A1A", padding: "5px 10px" },
    qtyBtn: { background: "none", border: "none", fontSize: "20px", fontWeight: "900", cursor: "pointer" },
    qtyText: { fontFamily: "'Oswald', sans-serif", fontSize: "18px" },
    itemTotal: { fontFamily: "'Oswald', sans-serif", fontSize: "22px", fontWeight: "bold" },

    // Summary Styling
    summaryCard: {
        backgroundColor: "#FFC72C",
        border: "3px solid #1A1A1A",
        padding: "30px",
        boxShadow: "10px 10px 0px #1A1A1A",
    },
    summaryTitle: { fontFamily: "'Oswald', sans-serif", fontSize: "24px", marginBottom: "20px", borderBottom: "2px solid #1A1A1A", paddingBottom: "10px" },
    summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: "10px", fontFamily: "'Public Sans', sans-serif", fontWeight: "700" },
    totalLabel: { fontFamily: "'Oswald', sans-serif", fontSize: "24px" },
    totalAmount: { fontFamily: "'Oswald', sans-serif", fontSize: "24px" },

    checkoutBtn: {
        width: "100%", backgroundColor: "#1A1A1A", color: "#FFC72C",
        border: "none", padding: "18px", marginTop: "25px",
        fontFamily: "'Oswald', sans-serif", fontSize: "18px", fontWeight: "bold",
        cursor: "pointer", transition: "0.2s"
    },
    backToMenu: {
        display: "block", textAlign: "center", marginTop: "20px",
        color: "#1A1A1A", fontWeight: "900", fontSize: "13px", textDecoration: "none"
    }
};

export default Cart;