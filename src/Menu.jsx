import { useEffect, useState } from "react";
import { getProducts } from "./Product_Service";
import ProductCard from "./Menu_Card";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { useCart } from "./Cart_Context";

const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const productData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    setProducts(productData);
};

const Menu = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            setProducts(data);
        };
        fetchProducts();
    }, []);

    return (
        <div style={styles.page}>
            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>THE CRUNCH <span style={{ color: '#fff' }}>MENU</span></h1>
                    <p style={styles.heroSubtitle}>FRESHLY FRIED • BOLD FLAVOR • MAXIMUM CRUNCH</p>
                </div>
            </section>

            <div style={styles.container}>
                <div style={styles.grid}>
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { backgroundColor: "#F9F9F9", minHeight: "100vh" },
    hero: {
        backgroundColor: "#FFC72C",
        padding: "80px 20px",
        textAlign: "center",
        borderBottom: "5px solid #1A1A1A",
    },
    heroTitle: {
        fontFamily: "'Oswald', sans-serif",
        fontSize: "72px",
        margin: 0,
        color: "#1A1A1A",
        lineHeight: "1",
    },
    heroSubtitle: {
        fontFamily: "'Public Sans', sans-serif",
        fontWeight: "900",
        fontSize: "18px",
        letterSpacing: "4px",
        marginTop: "10px",
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "60px 20px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "40px",
    },
};

export default Menu;
