import { useState, useEffect } from "react";
import { useAuth } from "./Auth_Context";
import { useNavigate } from "react-router-dom";
import { getProducts, addProduct, updateProduct, deleteProduct } from "./Product_Service";

const emptyForm = { name: "", price: "", description: "", category: "", imageUrl: "", available: true };

const AdminPanel = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Redirect non-admins
    useEffect(() => {
        if (!isAdmin) navigate("/");
    }, [isAdmin]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const data = await getProducts();
        setProducts(data);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.price) return alert("Name and price are required.");
        setLoading(true);
        try {
            if (editingId) {
                await updateProduct(editingId, { ...form, price: Number(form.price) });
            } else {
                await addProduct({ ...form, price: Number(form.price) });
            }
            setForm(emptyForm);
            setEditingId(null);
            await loadProducts();
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setForm({ ...product });
        setEditingId(product.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        await deleteProduct(id);
        await loadProducts();
    };

    const handleCancel = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    return (
        <div style={styles.page}>
            <h1 style={styles.title}>ADMIN PANEL</h1>

            {/* FORM */}
            <div style={styles.formBox}>
                <h2 style={styles.formTitle}>{editingId ? "EDIT PRODUCT" : "ADD NEW PRODUCT"}</h2>
                <div style={styles.grid}>
                    {["name", "price", "description", "category", "imageUrl"].map(field => (
                        <input
                            key={field}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={form[field]}
                            onChange={e => setForm({ ...form, [field]: e.target.value })}
                            style={styles.input}
                        />
                    ))}
                    <label style={styles.toggle}>
                        <input
                            type="checkbox"
                            checked={form.available}
                            onChange={e => setForm({ ...form, available: e.target.checked })}
                        />
                        &nbsp; Available
                    </label>
                </div>
                <div style={styles.btnRow}>
                    <button onClick={handleSubmit} style={styles.btnPrimary} disabled={loading}>
                        {loading ? "SAVING..." : editingId ? "UPDATE" : "ADD PRODUCT"}
                    </button>
                    {editingId && (
                        <button onClick={handleCancel} style={styles.btnSecondary}>CANCEL</button>
                    )}
                </div>
            </div>

            {/* PRODUCT LIST */}
            <div style={styles.list}>
                {products.map(p => (
                    <div key={p.id} style={styles.row}>
                        <img src={p.imageUrl || "https://via.placeholder.com/60"} alt={p.name} style={styles.thumb} />
                        <div style={styles.rowInfo}>
                            <strong>{p.name}</strong>
                            <span style={{ color: "#666" }}> — ₱{p.price} | {p.category} | {p.available ? "✅ Available" : "❌ Sold Out"}</span>
                        </div>
                        <div style={styles.rowBtns}>
                            <button onClick={() => handleEdit(p)} style={styles.btnEdit}>EDIT</button>
                            <button onClick={() => handleDelete(p.id)} style={styles.btnDelete}>DELETE</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    page: { padding: "40px 8%", backgroundColor: "#F9F9F9", minHeight: "100vh" },
    title: { fontFamily: "'Oswald', sans-serif", fontSize: "48px", marginBottom: "30px" },
    formBox: { backgroundColor: "#fff", border: "3px solid #1A1A1A", padding: "30px", marginBottom: "40px", boxShadow: "8px 8px 0px #FFC72C" },
    formTitle: { fontFamily: "'Oswald', sans-serif", fontSize: "24px", marginBottom: "20px" },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
    input: { padding: "10px", border: "2px solid #1A1A1A", fontFamily: "'Public Sans', sans-serif", fontSize: "14px" },
    toggle: { display: "flex", alignItems: "center", fontFamily: "'Public Sans', sans-serif", fontWeight: "700" },
    btnRow: { display: "flex", gap: "15px", marginTop: "20px" },
    btnPrimary: { backgroundColor: "#FFC72C", border: "2px solid #1A1A1A", padding: "12px 30px", fontFamily: "'Public Sans', sans-serif", fontWeight: "900", cursor: "pointer", fontSize: "14px", boxShadow: "4px 4px 0px #1A1A1A" },
    btnSecondary: { backgroundColor: "#fff", border: "2px solid #1A1A1A", padding: "12px 30px", fontFamily: "'Public Sans', sans-serif", fontWeight: "900", cursor: "pointer" },
    list: { display: "flex", flexDirection: "column", gap: "15px" },
    row: { display: "flex", alignItems: "center", gap: "20px", backgroundColor: "#fff", border: "2px solid #1A1A1A", padding: "15px" },
    thumb: { width: "60px", height: "60px", objectFit: "cover", border: "2px solid #1A1A1A" },
    rowInfo: { flex: 1, fontFamily: "'Public Sans', sans-serif", fontSize: "14px" },
    rowBtns: { display: "flex", gap: "10px" },
    btnEdit: { backgroundColor: "#FFC72C", border: "2px solid #1A1A1A", padding: "8px 16px", fontWeight: "900", cursor: "pointer" },
    btnDelete: { backgroundColor: "#1A1A1A", color: "#FFC72C", border: "2px solid #1A1A1A", padding: "8px 16px", fontWeight: "900", cursor: "pointer" },
};

export default AdminPanel;