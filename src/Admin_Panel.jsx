import { useState, useEffect } from "react";
import { useAuth } from "./Auth_Context";
import { useNavigate } from "react-router-dom";
import { getProducts, addProduct, updateProduct, deleteProduct } from "./Product_Service";
import { subscribeToAllOrders, updateOrderStatus } from "./Order_Service";

const PH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%23aaa'%3E?%3C/text%3E%3C/svg%3E";

const emptyForm = {
    name: "", price: "", description: "", category: "",
    imageUrl: "", imageFile: null, available: true
};

const STATUS_FLOW = ["Pending", "Preparing", "Ready", "Delivered"];

const STATUS_STYLES = {
    Pending: { bg: "#fff8e1", color: "#f59e0b", border: "#f59e0b" },
    Preparing: { bg: "#e0f2fe", color: "#0284c7", border: "#0284c7" },
    Ready: { bg: "#dcfce7", color: "#16a34a", border: "#16a34a" },
    Delivered: { bg: "#f3f4f6", color: "#6b7280", border: "#9ca3af" },
};

const STATUS_ICONS = {
    Pending: "🕐",
    Preparing: "👨‍🍳",
    Ready: "✅",
    Delivered: "📦",
};

/* ─── Orders Tab ─── */
const OrdersTab = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [updating, setUpdating] = useState(null);
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        const unsubscribe = subscribeToAllOrders((data) => {
            setOrders(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            await updateOrderStatus(orderId, newStatus);
        } catch (err) {
            alert("Failed to update status: " + err.message);
        } finally {
            setUpdating(null);
        }
    };

    const formatDate = (ts) => {
        if (!ts) return "—";
        const d = ts.toDate ? ts.toDate() : new Date(ts);
        return d.toLocaleDateString("en-PH", {
            month: "short", day: "numeric", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    };

    const orderTypeIcon = { "Dine In": "🍽️", "Pick-Up": "🏃", "Delivery": "🛵" };

    const filtered = filterStatus === "All" ? orders : orders.filter(o => o.status === filterStatus);
    const counts = STATUS_FLOW.reduce((acc, s) => {
        acc[s] = orders.filter(o => o.status === s).length;
        return acc;
    }, {});

    if (loading) return (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
            <span style={{ fontSize: 36 }}>⏳</span>
            <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: "18px", color: "#aaa", marginTop: 12 }}>Loading orders...</p>
        </div>
    );

    return (
        <div>
            <div style={o.summaryRow}>
                {STATUS_FLOW.map(s => {
                    const st = STATUS_STYLES[s];
                    return (
                        <div key={s} style={{ ...o.summaryCard, backgroundColor: st.bg, border: `2.5px solid ${st.border}`, boxShadow: `4px 4px 0 ${st.border}` }}>
                            <span style={{ fontSize: 28 }}>{STATUS_ICONS[s]}</span>
                            <span style={{ ...o.summaryCount, color: st.color }}>{counts[s]}</span>
                            <span style={{ ...o.summaryLabel, color: st.color }}>{s.toUpperCase()}</span>
                        </div>
                    );
                })}
            </div>

            <div style={o.filterRow}>
                {["All", ...STATUS_FLOW].map(s => (
                    <button key={s} style={{ ...o.filterPill, backgroundColor: filterStatus === s ? "#FFC72C" : "#fff", boxShadow: filterStatus === s ? "2px 2px 0 #1A1A1A" : "2px 2px 0 #ccc" }} onClick={() => setFilterStatus(s)}>
                        {s} {s !== "All" && `(${counts[s]})`}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa" }}>
                    <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: "20px" }}>No orders found</p>
                </div>
            ) : (
                <div style={o.list}>
                    {filtered.map(order => {
                        const st = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;
                        const expanded = expandedId === order.id;
                        const currentIdx = STATUS_FLOW.indexOf(order.status);

                        return (
                            <div key={order.id} style={o.card}>
                                <div style={o.cardTop}>
                                    <div style={o.cardTopLeft}>
                                        <span style={{ ...o.statusBadge, backgroundColor: st.bg, color: st.color, border: `2px solid ${st.border}` }}>
                                            {STATUS_ICONS[order.status]} {order.status?.toUpperCase()}
                                        </span>
                                        <span style={o.orderId}>#{order.id.slice(0, 8).toUpperCase()}</span>
                                        <span style={o.orderDate}>{formatDate(order.createdAt)}</span>
                                    </div>
                                    <div style={o.cardTopRight}>
                                        <span style={o.orderType}>{orderTypeIcon[order.orderType] || "🛒"} {order.orderType}</span>
                                        <span style={o.orderTotal}>₱{order.total?.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div style={o.itemPreview}>
                                    {order.items?.slice(0, 4).map((item, i) => (
                                        <div key={i} style={o.previewItem}>
                                            <img src={item.imageUrl || PH} alt={item.name} style={o.previewImg} onError={e => { e.target.src = PH; }} />
                                            <span style={o.previewName}>{item.name}</span>
                                            <span style={o.previewQty}>×{item.qty}</span>
                                        </div>
                                    ))}
                                    {order.items?.length > 4 && <span style={o.moreItems}>+{order.items.length - 4} more</span>}
                                </div>

                                {expanded && (
                                    <div style={o.expandedSection}>
                                        <div style={o.expandedDivider} />
                                        <div style={o.fullItemsList}>
                                            {order.items?.map((item, i) => (
                                                <div key={i} style={o.fullItem}>
                                                    <img src={item.imageUrl || PH} alt={item.name} style={o.fullItemImg} onError={e => { e.target.src = PH; }} />
                                                    <span style={o.fullItemName}>{item.name}</span>
                                                    <span style={o.fullItemQty}>×{item.qty}</span>
                                                    <span style={o.fullItemPrice}>₱{(item.price * item.qty).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={o.breakdown}>
                                            <div style={o.bRow}><span style={o.bLabel}>Subtotal</span><span style={o.bVal}>₱{order.subtotal?.toFixed(2)}</span></div>
                                            {order.deliveryFee > 0 && <div style={o.bRow}><span style={o.bLabel}>Delivery Fee</span><span style={o.bVal}>₱{order.deliveryFee?.toFixed(2)}</span></div>}
                                            {order.deliveryAddress && (
                                                <div style={{ ...o.bRow, marginTop: 6 }}>
                                                    <span style={o.bLabel}>Address</span>
                                                    <span style={{ ...o.bVal, fontSize: 12, maxWidth: 220, textAlign: "right" }}>{order.deliveryAddress}</span>
                                                </div>
                                            )}
                                            <div style={o.bDivider} />
                                            <div style={o.bRow}>
                                                <span style={{ ...o.bLabel, fontFamily: "'Oswald', sans-serif", fontSize: 16, color: "#1A1A1A" }}>TOTAL</span>
                                                <span style={{ ...o.bVal, fontSize: 20, fontWeight: 900 }}>₱{order.total?.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: 10 }}>
                                            <p style={{
                                                fontFamily: "'Oswald', sans-serif",
                                                fontSize: "16px",
                                                fontWeight: "900",
                                                margin: "0 0 4px",
                                                color: "#1A1A1A"
                                            }}>
                                                {order.customerName || "GUEST"}
                                            </p>

                                            <p style={o.userIdLabel}>
                                                User ID: <span style={o.userIdVal}>{order.userId}</span>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div style={o.cardFooter}>
                                    <button style={o.detailsBtn} onClick={() => setExpandedId(expanded ? null : order.id)}>
                                        {expanded ? "▲ HIDE DETAILS" : "▼ VIEW DETAILS"}
                                    </button>
                                    <div style={o.statusBtns}>
                                        {STATUS_FLOW.map((s, idx) => {
                                            const isActive = order.status === s;
                                            const isPast = idx < currentIdx;
                                            return (
                                                <button
                                                    key={s}
                                                    disabled={isActive || updating === order.id}
                                                    onClick={() => handleStatusChange(order.id, s)}
                                                    style={{
                                                        ...o.statusBtn,
                                                        backgroundColor: isActive ? STATUS_STYLES[s].bg : isPast ? "#f5f5f5" : "#fff",
                                                        color: isActive ? STATUS_STYLES[s].color : isPast ? "#ccc" : "#555",
                                                        border: isActive ? `2px solid ${STATUS_STYLES[s].border}` : "2px solid #e0e0e0",
                                                        fontWeight: isActive ? "900" : "700",
                                                        cursor: isActive || updating === order.id ? "default" : "pointer",
                                                        opacity: updating === order.id ? 0.5 : 1,
                                                    }}
                                                >
                                                    {STATUS_ICONS[s]} {s}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

/* ─── Main Admin Panel ─── */
const AdminPanel = () => {
    const { isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Products");
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    useEffect(() => {
        if (!authLoading && !isAdmin) navigate("/");
    }, [isAdmin, authLoading]);

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = async () => {
        const data = await getProducts();
        setProducts(data);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadError("");
        const localUrl = URL.createObjectURL(file);
        setForm(prev => ({ ...prev, imageUrl: localUrl, imageFile: file }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.price) return alert("Name and price are required.");
        setLoading(true);
        setUploadError("");
        try {
            let finalImageUrl = form.imageUrl;
            if (form.imageFile) {
                const formData = new FormData();
                formData.append("image", form.imageFile);
                formData.append("name", form.name);
                const res = await fetch("/upload-image", { method: "POST", body: formData });
                if (res.ok) {
                    const json = await res.json();
                    if (json.ok && json.path) { finalImageUrl = json.path; }
                    else { setUploadError("Upload failed: " + (json.error || "unknown error")); setLoading(false); return; }
                } else { setUploadError(`Upload failed: server responded ${res.status}`); setLoading(false); return; }
            }
            const payload = { ...form, price: Number(form.price), imageUrl: finalImageUrl };
            delete payload.imageFile;
            if (editingId) { await updateProduct(editingId, payload); }
            else { await addProduct(payload); }
            setForm(emptyForm);
            setEditingId(null);
            await loadProducts();
        } catch (err) {
            setUploadError("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setForm({ ...product, imageFile: null });
        setEditingId(product.id);
        setUploadError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        await deleteProduct(id);
        await loadProducts();
    };

    const handleCancel = () => { setForm(emptyForm); setEditingId(null); setUploadError(""); };

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.title}>ADMIN PANEL</h1>
                <div style={styles.tabs}>
                    {["Products", "Orders"].map(tab => (
                        <button key={tab} style={{ ...styles.tab, backgroundColor: activeTab === tab ? "#FFC72C" : "#fff", boxShadow: activeTab === tab ? "3px 3px 0 #1A1A1A" : "2px 2px 0 #ccc", color: activeTab === tab ? "#1A1A1A" : "#888" }} onClick={() => setActiveTab(tab)}>
                            {tab === "Products" ? "🛍️" : "📋"} {tab.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === "Products" && (
                <>
                    <div style={styles.formBox}>
                        <h2 style={styles.formTitle}>{editingId ? "EDIT PRODUCT" : "ADD NEW PRODUCT"}</h2>
                        <div style={styles.grid}>
                            {["name", "price", "description", "category"].map(field => (
                                <input key={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} style={styles.input} />
                            ))}
                            <div style={styles.uploadBox} onClick={() => document.getElementById("imgUpload").click()}
                                onMouseEnter={e => { const ov = e.currentTarget.querySelector(".upload-overlay"); if (ov) ov.style.opacity = "1"; }}
                                onMouseLeave={e => { const ov = e.currentTarget.querySelector(".upload-overlay"); if (ov) ov.style.opacity = "0"; }}
                            >
                                {form.imageUrl ? (
                                    <>
                                        <img src={form.imageUrl} alt="preview" style={styles.uploadPreview} />
                                        <div className="upload-overlay" style={styles.uploadOverlay}>
                                            <span style={{ fontSize: "22px" }}>📷</span>
                                            <p style={styles.uploadOverlayText}>CHANGE IMAGE</p>
                                        </div>
                                    </>
                                ) : (
                                    <div style={styles.uploadPlaceholder}>
                                        <span style={{ fontSize: "32px" }}>📁</span>
                                        <p style={styles.uploadText}>CLICK TO UPLOAD IMAGE</p>
                                        <p style={styles.uploadHint}>PNG, JPG, WEBP supported</p>
                                    </div>
                                )}
                                <input id="imgUpload" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                            </div>
                            <label style={styles.toggle}>
                                <input type="checkbox" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} />
                                &nbsp; Available
                            </label>
                        </div>
                        {uploadError && <div style={styles.errorBox}>⚠️ {uploadError}</div>}
                        <div style={styles.btnRow}>
                            <button onClick={handleSubmit} style={styles.btnPrimary} disabled={loading}>{loading ? "SAVING..." : editingId ? "UPDATE" : "ADD PRODUCT"}</button>
                            {editingId && <button onClick={handleCancel} style={styles.btnSecondary}>CANCEL</button>}
                        </div>
                    </div>

                    <div style={styles.list}>
                        {products.map(p => (
                            <div key={p.id} style={styles.row}>
                                <img src={p.imageUrl || PH} alt={p.name} style={styles.thumb} onError={e => { e.target.src = PH; }} />
                                <div style={styles.rowInfo}>
                                    <strong>{p.name}</strong>
                                    <span style={{ color: "#666" }}> — ₱{p.price} | {p.category} | {p.available ? "✅ Available" : "❌ Sold Out"}</span>
                                    {p.imageUrl && <div style={styles.urlPreview}>{p.imageUrl}</div>}
                                </div>
                                <div style={styles.rowBtns}>
                                    <button onClick={() => handleEdit(p)} style={styles.btnEdit}>EDIT</button>
                                    <button onClick={() => handleDelete(p.id)} style={styles.btnDelete}>DELETE</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {activeTab === "Orders" && <OrdersTab />}
        </div>
    );
};

const styles = {
    page: { padding: "40px 8%", backgroundColor: "#F9F9F9", minHeight: "100vh" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "16px" },
    title: { fontFamily: "'Oswald', sans-serif", fontSize: "48px", margin: 0 },
    tabs: { display: "flex", gap: "10px" },
    tab: { padding: "10px 24px", border: "2.5px solid #1A1A1A", fontFamily: "'Oswald', sans-serif", fontWeight: "900", fontSize: "15px", cursor: "pointer", letterSpacing: "0.5px" },
    formBox: { backgroundColor: "#fff", border: "3px solid #1A1A1A", padding: "30px", marginBottom: "40px", boxShadow: "8px 8px 0px #FFC72C" },
    formTitle: { fontFamily: "'Oswald', sans-serif", fontSize: "24px", marginBottom: "20px" },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
    input: { padding: "10px", border: "2px solid #1A1A1A", fontFamily: "'Public Sans', sans-serif", fontSize: "14px", outline: "none" },
    toggle: { display: "flex", alignItems: "center", fontFamily: "'Public Sans', sans-serif", fontWeight: "700" },
    uploadBox: { gridColumn: "span 2", position: "relative", border: "2.5px dashed #1A1A1A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: "200px", height: "200px", backgroundColor: "#fafafa", overflow: "hidden", justifySelf: "center" },
    uploadPreview: { width: "100%", height: "140px", objectFit: "cover", display: "block" },
    uploadOverlay: { position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s", pointerEvents: "none" },
    uploadOverlayText: { fontFamily: "'Public Sans', sans-serif", fontWeight: "900", fontSize: "12px", color: "#fff", letterSpacing: "1px", margin: "6px 0 0" },
    uploadPlaceholder: { textAlign: "center", padding: "20px", pointerEvents: "none" },
    uploadText: { fontFamily: "'Public Sans', sans-serif", fontWeight: "900", fontSize: "13px", letterSpacing: "1px", margin: "8px 0 4px", color: "#1A1A1A" },
    uploadHint: { fontFamily: "'Public Sans', sans-serif", fontSize: "11px", color: "#aaa", margin: 0 },
    errorBox: { marginTop: "12px", padding: "10px 14px", backgroundColor: "#fff0f0", border: "2px solid #e74c3c", fontFamily: "'Public Sans', sans-serif", fontSize: "13px", fontWeight: "700", color: "#c0392b" },
    btnRow: { display: "flex", gap: "15px", marginTop: "20px" },
    btnPrimary: { backgroundColor: "#FFC72C", border: "2px solid #1A1A1A", padding: "12px 30px", fontFamily: "'Public Sans', sans-serif", fontWeight: "900", cursor: "pointer", fontSize: "14px", boxShadow: "4px 4px 0px #1A1A1A" },
    btnSecondary: { backgroundColor: "#fff", border: "2px solid #1A1A1A", padding: "12px 30px", fontFamily: "'Public Sans', sans-serif", fontWeight: "900", cursor: "pointer" },
    list: { display: "flex", flexDirection: "column", gap: "15px" },
    row: { display: "flex", alignItems: "center", gap: "20px", backgroundColor: "#fff", border: "2px solid #1A1A1A", padding: "15px" },
    thumb: { width: "60px", height: "60px", objectFit: "cover", border: "2px solid #1A1A1A", flexShrink: 0 },
    rowInfo: { flex: 1, fontFamily: "'Public Sans', sans-serif", fontSize: "14px" },
    urlPreview: { fontFamily: "monospace", fontSize: "11px", color: "#999", marginTop: "3px", wordBreak: "break-all" },
    rowBtns: { display: "flex", gap: "10px" },
    btnEdit: { backgroundColor: "#FFC72C", border: "2px solid #1A1A1A", padding: "8px 16px", fontWeight: "900", cursor: "pointer", fontFamily: "'Public Sans', sans-serif" },
    btnDelete: { backgroundColor: "#1A1A1A", color: "#FFC72C", border: "2px solid #1A1A1A", padding: "8px 16px", fontWeight: "900", cursor: "pointer", fontFamily: "'Public Sans', sans-serif" },
};

const o = {
    summaryRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" },
    summaryCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "20px 12px", borderRadius: "4px" },
    summaryCount: { fontFamily: "'Oswald', sans-serif", fontSize: "36px", fontWeight: "900", lineHeight: 1 },
    summaryLabel: { fontFamily: "'Public Sans', sans-serif", fontWeight: "900", fontSize: "11px", letterSpacing: "1px" },
    filterRow: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" },
    filterPill: { padding: "7px 16px", border: "2px solid #1A1A1A", fontFamily: "'Public Sans', sans-serif", fontWeight: "900", fontSize: "12px", cursor: "pointer", letterSpacing: "0.5px" },
    list: { display: "flex", flexDirection: "column", gap: "16px" },
    card: { backgroundColor: "#fff", border: "2.5px solid #1A1A1A", boxShadow: "4px 4px 0 #1A1A1A", overflow: "hidden" },
    cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "14px 18px 10px", borderBottom: "1.5px solid #f0f0f0", flexWrap: "wrap", gap: "8px" },
    cardTopLeft: { display: "flex", flexDirection: "column", gap: "5px" },
    cardTopRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px" },
    statusBadge: { display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 12px", fontFamily: "'Public Sans', sans-serif", fontWeight: "900", fontSize: "11px", letterSpacing: "0.5px", alignSelf: "flex-start" },
    orderId: { fontFamily: "monospace", fontSize: "11px", color: "#aaa", fontWeight: "700" },
    orderDate: { fontFamily: "'Public Sans', sans-serif", fontSize: "11px", color: "#bbb", fontWeight: "600" },
    orderType: { fontFamily: "'Public Sans', sans-serif", fontWeight: "700", fontSize: "12px", color: "#555" },
    orderTotal: { fontFamily: "'Oswald', sans-serif", fontSize: "22px", fontWeight: "900", color: "#1A1A1A" },
    itemPreview: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 18px", flexWrap: "wrap" },
    previewItem: { display: "flex", alignItems: "center", gap: "6px" },
    previewImg: { width: "34px", height: "34px", objectFit: "cover", border: "1.5px solid #1A1A1A" },
    previewName: { fontFamily: "'Public Sans', sans-serif", fontWeight: "700", fontSize: "12px", color: "#1A1A1A" },
    previewQty: { fontFamily: "'Oswald', sans-serif", fontSize: "12px", color: "#888", marginRight: "4px" },
    moreItems: { fontFamily: "'Public Sans', sans-serif", fontSize: "11px", color: "#aaa", fontWeight: "700" },
    expandedSection: { padding: "0 18px 16px" },
    expandedDivider: { borderTop: "2px dashed #e0e0e0", margin: "0 0 14px" },
    fullItemsList: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" },
    fullItem: { display: "flex", alignItems: "center", gap: "10px", padding: "7px 0", borderBottom: "1px solid #f5f5f5" },
    fullItemImg: { width: "40px", height: "40px", objectFit: "cover", border: "2px solid #1A1A1A", flexShrink: 0 },
    fullItemName: { flex: 1, fontFamily: "'Oswald', sans-serif", fontSize: "13px", fontWeight: "700", color: "#1A1A1A" },
    fullItemQty: { fontFamily: "'Public Sans', sans-serif", fontSize: "12px", color: "#888", fontWeight: "700" },
    fullItemPrice: { fontFamily: "'Oswald', sans-serif", fontSize: "14px", fontWeight: "900", color: "#1A1A1A", minWidth: "64px", textAlign: "right" },
    breakdown: { backgroundColor: "#fafafa", border: "1.5px solid #e0e0e0", padding: "12px 14px", display: "flex", flexDirection: "column", gap: "6px" },
    bRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    bLabel: { fontFamily: "'Public Sans', sans-serif", fontSize: "12px", color: "#888", fontWeight: "700" },
    bVal: { fontFamily: "'Oswald', sans-serif", fontSize: "13px", fontWeight: "700", color: "#1A1A1A" },
    bDivider: { borderTop: "1.5px dashed #ccc", margin: "4px 0" },
    userIdLabel: { fontFamily: "monospace", fontSize: "11px", color: "#bbb", margin: 0 },
    userIdVal: { color: "#aaa" },
    cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderTop: "2px solid #f0f0f0", backgroundColor: "#fafafa", flexWrap: "wrap", gap: "10px" },
    detailsBtn: { background: "none", border: "none", fontFamily: "'Public Sans', sans-serif", fontWeight: "900", fontSize: "11px", color: "#888", cursor: "pointer", letterSpacing: "0.5px", padding: 0, flexShrink: 0 },
    statusBtns: { display: "flex", gap: "8px", flexWrap: "wrap" },
    statusBtn: { padding: "7px 14px", fontFamily: "'Public Sans', sans-serif", fontSize: "12px", letterSpacing: "0.3px", transition: "all 0.15s" },
};

export default AdminPanel;