import { useEffect, useRef, useState } from "react";
import { getProducts } from "./Product_Service";
import ProductCard from "./Menu_Card";

const SECTION_ORDER = ["Flavs", "Chicken", "Meals", "Sides", "Drinks"];

const Menu = () => {
    const [products, setProducts] = useState([]);
    const sectionRefs = useRef({});

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            const sorted = data.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds);
            setProducts(sorted);
        };
        fetchProducts();
    }, []);

    const grouped = products.reduce((acc, product) => {
        const cat = product.category || "Other";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
    }, {});

    const sortedCategories = Object.keys(grouped).sort(
        (a, b) => SECTION_ORDER.indexOf(a) - SECTION_ORDER.indexOf(b)
    );

    return (
        <div style={styles.page}>

            {/* ── HERO ── */}
            <section style={styles.hero}>
                <h1 style={styles.heroTitle}>
                    THE CRUNCH <span style={{ color: "#fff" }}>MENU</span>
                </h1>
                <p style={styles.heroSubtitle}>FRESHLY FRIED • BOLD FLAVOR • MAXIMUM CRUNCH</p>
            </section>

            {/* ── MENU SECTIONS ── */}
            <div style={styles.container}>
                {sortedCategories.map((category) => {
                    const items = grouped[category];

                    return (
                        <div
                            key={category}
                            ref={(el) => (sectionRefs.current[category] = el)}
                            style={styles.section}
                        >
                            <div style={styles.categoryHeader}>
                                <span style={styles.categoryLine} />
                                <h2 style={styles.categoryTitle}>{category}</h2>
                                <span style={styles.categoryLine} />
                            </div>

                            <div style={{
                                ...styles.grid,
                                gridTemplateColumns: items.length === 1
                                    ? "minmax(0, 360px)"
                                    : items.length === 2
                                    ? "repeat(2, 1fr)"
                                    : "repeat(3, 1fr)",
                            }}>
                                {items.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const styles = {
    page: { backgroundColor: "#F9F9F9", minHeight: "100vh" },

    hero: {
        backgroundColor: "#FFC72C",
        padding: "60px 0",
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
        color: "#1A1A1A",
    },

    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "80px 0",
    },

    section: {
        marginBottom: "80px",
    },

    categoryHeader: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "80px",
    },
    categoryTitle: {
        fontFamily: "'Oswald', sans-serif",
        fontSize: "22px",
        fontWeight: "900",
        color: "#1A1A1A",
        backgroundColor: "#FFC72C",
        padding: "4px 18px",
        border: "3px solid #1A1A1A",
        whiteSpace: "nowrap",
        margin: 0,
        textTransform: "uppercase",
    },
    categoryLine: {
        flex: 1,
        height: "3px",
        backgroundColor: "#1A1A1A",
    },

    grid: {
        display: "grid",
        gap: "70px",
    },
};

export default Menu;