import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./Cart_Context";
import { useAuth } from "./Auth_Context";
import { placeOrder } from "./Order_Service";
import { imageMap } from "./assets/imageMap";
import { useState } from "react";

const Cart = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { cartItems, updateQty, clearCart } = useCart();
    const { currentUser } = useAuth();
    const [isPlacing, setIsPlacing] = useState(false);

    const orderType = state?.orderType || "Dine In";
    const deliveryAddress = state?.deliveryAddress || "";

    const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = subtotal * 0.12;
    const deliveryFee = orderType === "Delivery" ? 50 : 0;
    const total = subtotal + tax + deliveryFee;

    const handleConfirm = async () => {
        if (!currentUser) {
            alert("You must be logged in to place an order.");
            navigate("/auth");
            return;
        }

        if (isPlacing) return;
        setIsPlacing(true);

        try {
            await placeOrder(currentUser.uid, {
                items: cartItems.map(i => ({
                    id: i.id,
                    name: i.name,
                    price: i.price,
                    qty: i.qty,
                    imageUrl: i.imageUrl || "",
                })),
                orderType,
                deliveryAddress,
                subtotal,
                tax,
                deliveryFee,
                total,
            });

            clearCart();
            navigate("/", { state: { orderSuccess: true } });
        } catch (err) {
            console.error("Order failed:", err);
            alert(`Order failed: ${err.message || "Please try again."}`);
        } finally {
            setIsPlacing(false);
        }
    };

    const orderTypeIcon = { "Dine In": "🍽️", "Pick-Up": "🏃", "Delivery": "🛵" }[orderType] || "🛒";

    return (
        <div style={s.page}>
            {/* Left — Order Review */}
            <div style={s.left}>
                <button style={s.backBtn} onClick={() => navigate("/menu")}>
                    ← BACK TO MENU
                </button>

                <h1 style={s.pageTitle}>REVIEW YOUR ORDER</h1>

                <div style={s.typeBadge}>
                    <span style={s.typeIcon}>{orderTypeIcon}</span>
                    <span style={s.typeLabel}>{orderType.toUpperCase()}</span>
                    {orderType === "Delivery" && deliveryAddress && (
                        <span style={s.typeAddress}>— {deliveryAddress}</span>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    <div style={s.emptyWrap}>
                        <span style={{ fontSize: 48 }}>🛒</span>
                        <p style={s.emptyText}>Your cart is empty.</p>
                        <button style={s.goMenuBtn} onClick={() => navigate("/menu")}>
                            GO TO MENU
                        </button>
                    </div>
                ) : (
                    <div style={s.itemsList}>
                        {cartItems.map((item) => {
                            const imgSrc =
                                (typeof imageMap !== "undefined" && imageMap[item.name]) ||
                                item.imageUrl ||
                                "https://via.placeholder.com/64?text=?";
                            return (
                                <div key={item.id} style={s.item}>
                                    <img src={imgSrc} alt={item.name} style={s.itemImg} />
                                    <div style={s.itemInfo}>
                                        <p style={s.itemName}>{item.name}</p>
                                        <p style={s.itemUnit}>₱{item.price} each</p>
                                    </div>
                                    <div style={s.qtyBox}>
                                        <button style={s.qtyBtn} onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                                        <span style={s.qtyNum}>{item.qty}</span>
                                        <button style={s.qtyBtn} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                                    </div>
                                    <span style={s.itemTotal}>₱{(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Right — Summary & Confirm */}
            <div style={s.right}>
                <div style={s.summaryCard}>
                    <h2 style={s.summaryTitle}>ORDER SUMMARY</h2>

                    <div style={s.summaryRows}>
                        <div style={s.summaryRow}>
                            <span style={s.summaryLabel}>Subtotal</span>
                            <span style={s.summaryValue}>₱{subtotal.toFixed(2)}</span>
                        </div>
                        <div style={s.summaryRow}>
                            <span style={s.summaryLabel}>Tax (12%)</span>
                            <span style={s.summaryValue}>₱{tax.toFixed(2)}</span>
                        </div>
                        {orderType === "Delivery" && (
                            <div style={s.summaryRow}>
                                <span style={s.summaryLabel}>Delivery Fee</span>
                                <span style={s.summaryValue}>₱50.00</span>
                            </div>
                        )}
                        <div style={s.divider} />
                        <div style={{ ...s.summaryRow, alignItems: "baseline" }}>
                            <span style={s.totalLabel}>TOTAL</span>
                            <span style={s.totalValue}>₱{total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div style={s.recapBox}>
                        <span style={s.recapIcon}>{orderTypeIcon}</span>
                        <div>
                            <p style={s.recapType}>{orderType}</p>
                            {orderType === "Delivery" && deliveryAddress && (
                                <p style={s.recapAddr}>{deliveryAddress}</p>
                            )}
                            {orderType === "Pick-Up" && (
                                <p style={s.recapAddr}>Pick up at the counter when ready.</p>
                            )}
                            {orderType === "Dine In" && (
                                <p style={s.recapAddr}>Your order will be served at your table.</p>
                            )}
                        </div>
                    </div>

                    <button
                        style={{
                            ...s.confirmBtn,
                            opacity: cartItems.length === 0 || isPlacing ? 0.4 : 1,
                            cursor: cartItems.length === 0 || isPlacing ? "not-allowed" : "pointer",
                        }}
                        disabled={cartItems.length === 0 || isPlacing}
                        onClick={handleConfirm}
                    >
                        {isPlacing ? "PLACING ORDER..." : "CONFIRM ORDER ✓"}
                    </button>

                    <button style={s.cancelBtn} onClick={() => navigate("/menu")}>
                        Cancel & go back
                    </button>
                </div>
            </div>
        </div>
    );
};

const s = {
    page: {
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F5F5F5",
        fontFamily: "'Public Sans', sans-serif",
    },
    left: {
        flex: 1,
        padding: "48px 40px",
        borderRight: "3px solid #1A1A1A",
    },
    backBtn: {
        background: "none",
        border: "2px solid #1A1A1A",
        padding: "8px 16px",
        fontFamily: "'Public Sans', sans-serif",
        fontWeight: "900",
        fontSize: "12px",
        letterSpacing: "1px",
        cursor: "pointer",
        color: "#1A1A1A",
        marginBottom: "32px",
        boxShadow: "2px 2px 0 #1A1A1A",
    },
    pageTitle: {
        fontFamily: "'Oswald', sans-serif",
        fontSize: "42px",
        fontWeight: "900",
        color: "#1A1A1A",
        margin: "0 0 20px",
        textTransform: "uppercase",
    },
    typeBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        backgroundColor: "#FFC72C",
        border: "2.5px solid #1A1A1A",
        padding: "6px 16px",
        marginBottom: "32px",
        boxShadow: "3px 3px 0 #1A1A1A",
    },
    typeIcon: { fontSize: "16px" },
    typeLabel: {
        fontFamily: "'Oswald', sans-serif",
        fontWeight: "700",
        fontSize: "14px",
        color: "#1A1A1A",
        letterSpacing: "1px",
    },
    typeAddress: {
        fontFamily: "'Public Sans', sans-serif",
        fontWeight: "700",
        fontSize: "12px",
        color: "#555",
    },
    itemsList: { display: "flex", flexDirection: "column", gap: "0" },
    item: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px 0",
        borderBottom: "2px solid #e0e0e0",
    },
    itemImg: {
        width: "64px",
        height: "64px",
        objectFit: "cover",
        border: "2.5px solid #1A1A1A",
        flexShrink: 0,
    },
    itemInfo: { flex: 1, minWidth: 0 },
    itemName: {
        fontFamily: "'Oswald', sans-serif",
        fontSize: "16px",
        fontWeight: "700",
        color: "#1A1A1A",
        margin: "0 0 4px",
        textTransform: "uppercase",
    },
    itemUnit: {
        fontFamily: "'Public Sans', sans-serif",
        fontSize: "12px",
        color: "#888",
        margin: 0,
    },
    qtyBox: {
        display: "flex",
        alignItems: "center",
        border: "2.5px solid #1A1A1A",
        overflow: "hidden",
        flexShrink: 0,
    },
    qtyBtn: {
        backgroundColor: "#fff",
        border: "none",
        width: "30px",
        height: "34px",
        fontSize: "16px",
        fontWeight: "900",
        cursor: "pointer",
        fontFamily: "'Oswald', sans-serif",
    },
    qtyNum: {
        fontFamily: "'Oswald', sans-serif",
        fontSize: "14px",
        fontWeight: "900",
        width: "30px",
        textAlign: "center",
        borderLeft: "1px solid #1A1A1A",
        borderRight: "1px solid #1A1A1A",
        lineHeight: "34px",
    },
    itemTotal: {
        fontFamily: "'Oswald', sans-serif",
        fontSize: "18px",
        fontWeight: "900",
        color: "#1A1A1A",
        minWidth: "80px",
        textAlign: "right",
        flexShrink: 0,
    },
    emptyWrap: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "80px",
        gap: "16px",
    },
    emptyText: {
        fontFamily: "'Oswald', sans-serif",
        fontSize: "22px",
        color: "#aaa",
        margin: 0,
    },
    goMenuBtn: {
        backgroundColor: "#FFC72C",
        border: "3px solid #1A1A1A",
        boxShadow: "4px 4px 0 #1A1A1A",
        padding: "12px 28px",
        fontFamily: "'Oswald', sans-serif",
        fontWeight: "900",
        fontSize: "16px",
        cursor: "pointer",
        color: "#1A1A1A",
        marginTop: "8px",
    },
    right: {
        width: "360px",
        flexShrink: 0,
        padding: "48px 32px",
        backgroundColor: "#fff",
        borderLeft: "3px solid #1A1A1A",
    },
    summaryCard: {
        position: "sticky",
        top: "100px",
        display: "flex",
        flexDirection: "column",
        gap: "0",
    },
    summaryTitle: {
        fontFamily: "'Oswald', sans-serif",
        fontSize: "22px",
        fontWeight: "900",
        color: "#1A1A1A",
        margin: "0 0 24px",
        letterSpacing: "1px",
        borderBottom: "3px solid #1A1A1A",
        paddingBottom: "12px",
    },
    summaryRows: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" },
    summaryRow: { display: "flex", justifyContent: "space-between" },
    summaryLabel: { fontFamily: "'Public Sans', sans-serif", fontWeight: "700", fontSize: "13px", color: "#888" },
    summaryValue: { fontFamily: "'Oswald', sans-serif", fontSize: "15px", fontWeight: "700", color: "#1A1A1A" },
    divider: { borderTop: "2px dashed #1A1A1A", margin: "4px 0" },
    totalLabel: { fontFamily: "'Oswald', sans-serif", fontSize: "20px", fontWeight: "900", color: "#1A1A1A" },
    totalValue: { fontFamily: "'Oswald', sans-serif", fontSize: "28px", fontWeight: "900", color: "#1A1A1A" },
    recapBox: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        backgroundColor: "#fffdf0",
        border: "2px solid #1A1A1A",
        padding: "14px 16px",
        marginBottom: "24px",
    },
    recapIcon: { fontSize: "22px", flexShrink: 0 },
    recapType: {
        fontFamily: "'Oswald', sans-serif",
        fontWeight: "700",
        fontSize: "15px",
        color: "#1A1A1A",
        margin: "0 0 4px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    recapAddr: {
        fontFamily: "'Public Sans', sans-serif",
        fontSize: "12px",
        color: "#666",
        margin: 0,
        lineHeight: "1.4",
    },
    confirmBtn: {
        width: "100%",
        backgroundColor: "#FFC72C",
        border: "3px solid #1A1A1A",
        boxShadow: "4px 4px 0 #1A1A1A",
        padding: "18px",
        fontFamily: "'Oswald', sans-serif",
        fontWeight: "900",
        fontSize: "20px",
        letterSpacing: "1px",
        color: "#1A1A1A",
        marginBottom: "12px",
        transition: "transform 0.1s, box-shadow 0.1s",
    },
    cancelBtn: {
        width: "100%",
        background: "none",
        border: "none",
        fontFamily: "'Public Sans', sans-serif",
        fontWeight: "700",
        fontSize: "12px",
        color: "#aaa",
        cursor: "pointer",
        textDecoration: "underline",
        padding: "8px",
    },
};

export default Cart;