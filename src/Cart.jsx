import { useCart } from "./Cart_Context";

const Cart = ({ isOpen, onClose }) => {
    const { cartItems, updateQty, clearCart } = useCart();

    const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <>
            {/* Backdrop */}
            <div
                style={{
                    ...styles.backdrop,
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? "all" : "none",
                }}
                onClick={onClose}
            />

            {/* Drawer */}
            <div style={{
                ...styles.drawer,
                transform: isOpen ? "translateX(0)" : "translateX(100%)",
            }}>
                {/* Header */}
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.headerTitle}>Your Order</h2>
                        <p style={styles.headerSub}>
                            {cartItems.length === 0
                                ? "Nothing here yet!"
                                : `${cartItems.reduce((s, i) => s + i.qty, 0)} items`}
                        </p>
                    </div>
                    <button style={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                {/* Items */}
                <div style={styles.items}>
                    {cartItems.length === 0 ? (
                        <div style={styles.empty}>
                            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🍗</div>
                            <p style={styles.emptyText}>Add something delicious!</p>
                        </div>
                    ) : (
                        cartItems.map((item) => {
                            // Build subtitle from flavor + addons + spicy
                            const details = [
                                item.flavor,
                                item.isSpicy && "Spicy",
                                ...(item.addons?.length ? item.addons : []),
                            ].filter(Boolean).join(" · ");

                            return (
                                <div key={item.id} style={styles.item}>
                                    <div style={styles.itemInfo}>
                                        <div style={styles.itemName}>
                                            {item.displayName || item.name}
                                        </div>
                                        {details ? (
                                            <div style={styles.itemDetails}>{details}</div>
                                        ) : null}
                                        <div style={styles.itemPrice}>
                                            ₱{item.price * item.qty}
                                        </div>
                                    </div>
                                    <div style={styles.itemQtyRow}>
                                        <button
                                            style={styles.qBtn}
                                            onClick={() => updateQty(item.id, item.qty - 1)}
                                        >−</button>
                                        <span style={styles.qNum}>{item.qty}</span>
                                        <button
                                            style={styles.qBtn}
                                            onClick={() => updateQty(item.id, item.qty + 1)}
                                        >+</button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div style={styles.footer}>
                        <div style={styles.totalRow}>
                            <span style={styles.totalLabel}>Total</span>
                            <span style={styles.totalAmount}>₱{total}</span>
                        </div>
                        <button style={styles.orderBtn}>PLACE ORDER</button>
                        <button style={styles.clearBtn} onClick={clearCart}>
                            Clear order
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

const styles = {
    backdrop: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 200,
        transition: "opacity 0.3s",
    },
    drawer: {
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "380px",
        maxWidth: "95vw",
        backgroundColor: "#FFF8E7",
        zIndex: 201,
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: "-8px 0 32px rgba(0,0,0,0.18)",
        borderLeft: "3px solid #F5A623",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "24px 20px 16px",
        borderBottom: "2px solid #F5A62333",
        backgroundColor: "#F5A623",
    },
    headerTitle: {
        fontFamily: "'Nunito', sans-serif",
        fontWeight: "900",
        fontSize: "22px",
        color: "#3D1C00",
        margin: 0,
    },
    headerSub: {
        fontFamily: "'Nunito', sans-serif",
        fontWeight: "700",
        fontSize: "12px",
        color: "#7B2000",
        margin: "2px 0 0",
    },
    closeBtn: {
        background: "rgba(0,0,0,0.1)",
        border: "none",
        borderRadius: "50%",
        width: "32px",
        height: "32px",
        fontSize: "14px",
        cursor: "pointer",
        color: "#3D1C00",
        fontWeight: "900",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    items: {
        flex: 1,
        overflowY: "auto",
        padding: "16px 20px",
    },
    empty: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "200px",
    },
    emptyText: {
        fontFamily: "'Nunito', sans-serif",
        fontWeight: "700",
        fontSize: "14px",
        color: "#B08050",
        margin: 0,
    },
    item: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid #F5A62322",
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontFamily: "'Nunito', sans-serif",
        fontWeight: "800",
        fontSize: "14px",
        color: "#3D1C00",
    },
    // ← NEW: shows "K-Style · Spicy · Kimchi" under the name
    itemDetails: {
        fontFamily: "'Nunito', sans-serif",
        fontWeight: "700",
        fontSize: "11px",
        color: "#C8340B",
        marginTop: "2px",
    },
    itemPrice: {
        fontFamily: "'Nunito', sans-serif",
        fontWeight: "700",
        fontSize: "13px",
        color: "#9E6B3A",
        marginTop: "3px",
    },
    itemQtyRow: {
        display: "flex",
        alignItems: "center",
        border: "2px solid #C8340B",
        borderRadius: "8px",
        overflow: "hidden",
        marginLeft: "12px",
    },
    qBtn: {
        backgroundColor: "#fff",
        border: "none",
        width: "30px",
        height: "30px",
        fontSize: "16px",
        fontWeight: "900",
        cursor: "pointer",
        color: "#C8340B",
        fontFamily: "'Nunito', sans-serif",
    },
    qNum: {
        fontFamily: "'Nunito', sans-serif",
        fontSize: "14px",
        fontWeight: "900",
        width: "28px",
        textAlign: "center",
        borderLeft: "1px solid #C8340B33",
        borderRight: "1px solid #C8340B33",
        lineHeight: "30px",
        color: "#3D1C00",
    },
    footer: {
        padding: "16px 20px 24px",
        borderTop: "2px solid #F5A62333",
    },
    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: "14px",
    },
    totalLabel: {
        fontFamily: "'Nunito', sans-serif",
        fontWeight: "800",
        fontSize: "14px",
        color: "#9E6B3A",
        letterSpacing: "2px",
        textTransform: "uppercase",
    },
    totalAmount: {
        fontFamily: "'Nunito', sans-serif",
        fontWeight: "900",
        fontSize: "28px",
        color: "#C8340B",
    },
    orderBtn: {
        width: "100%",
        backgroundColor: "#C8340B",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        padding: "14px",
        fontFamily: "'Nunito', sans-serif",
        fontWeight: "900",
        fontSize: "15px",
        letterSpacing: "2px",
        cursor: "pointer",
        marginBottom: "10px",
        boxShadow: "0 4px 14px rgba(200,52,11,0.35)",
    },
    clearBtn: {
        width: "100%",
        backgroundColor: "transparent",
        color: "#B08050",
        border: "none",
        padding: "8px",
        fontFamily: "'Nunito', sans-serif",
        fontWeight: "700",
        fontSize: "12px",
        cursor: "pointer",
        textDecoration: "underline",
    },
};

export default Cart;