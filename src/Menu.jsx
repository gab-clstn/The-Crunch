import { useEffect, useRef, useState } from "react";
import { getProducts } from "./Product_Service";
import ProductCard from "./Menu_Card";
import Cart from "./Cart";
import { useCart } from "./Cart_Context";

const SECTION_ORDER = ["Flavs", "Chicken", "Meals", "Sides", "Drinks"];

const CartButton = ({ onOpen }) => {
    const { cartItems } = useCart();
    const totalQty = cartItems.reduce((sum, i) => sum + i.qty, 0);

    return (
        <button style={styles.cartBtn} onClick={onOpen}>
            🛒
            {totalQty > 0 && (
                <span style={styles.cartBadge}>{totalQty}</span>
            )}
        </button>
    );
};

const Menu = () => {
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);
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

    useEffect(() => {
        if (sortedCategories.length > 0 && !activeTab) {
            setActiveTab(sortedCategories[0]);
        }
    }, [sortedCategories]);

    const scrollToSection = (category) => {
        setActiveTab(category);
        const el = sectionRefs.current[category];
        if (el) {
            const offset = 60;
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            for (const cat of [...sortedCategories].reverse()) {
                const el = sectionRefs.current[cat];
                if (el && el.getBoundingClientRect().top <= 80) {
                    setActiveTab(cat);
                    break;
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [sortedCategories]);

    return (
        <div style={styles.page}>

            {/* ── HERO ── */}
            <section style={styles.hero}>
                <h1 style={styles.heroTitle}>
                    THE CRUNCH <span style={{ color: "#fff" }}>MENU</span>
                </h1>
                <p style={styles.heroSubtitle}>FRESHLY FRIED • BOLD FLAVOR • MAXIMUM CRUNCH</p>
            </section>

            {/* ── STICKY TABS ── */}
            <div style={styles.stickyTabs}>
                <div style={styles.tabsTrack}>
                    {sortedCategories.map((cat) => (
                        <button
                            key={cat}
                            style={{
                                ...styles.tab,
                                backgroundColor: activeTab === cat ? "#FFC72C" : "transparent",
                                color: activeTab === cat ? "#1A1A1A" : "#999",
                                borderBottom: activeTab === cat
                                    ? "3px solid #1A1A1A"
                                    : "3px solid transparent",
                                fontWeight: activeTab === cat ? "900" : "700",
                            }}
                            onClick={() => scrollToSection(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

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

            {/* ── CART BUTTON ── */}
            <CartButton onOpen={() => setCartOpen(true)} />

            {/* ── CART DRAWER ── */}
            <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
    );
};

const styles = {
    page: { backgroundColor: "#F9F9F9", minHeight: "100vh" },

    hero: {
        backgroundColor: "#FFC72C",
        padding: "60px 20px",
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

    stickyTabs: {
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "#1A1A1A",
        borderBottom: "3px solid #FFC72C",
    },
    tabsTrack: {
        display: "flex",
        overflowX: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px",
    },
    tab: {
        fontFamily: "'Oswald', sans-serif",
        fontSize: "14px",
        border: "none",
        borderBottom: "3px solid transparent",
        padding: "14px 22px",
        cursor: "pointer",
        transition: "all 0.2s",
        whiteSpace: "nowrap",
        flexShrink: 0,
        letterSpacing: "1px",
    },

    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "80px 20px",
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

    cartBtn: {
        position: "fixed",
        bottom: "28px",
        right: "28px",
        width: "58px",
        height: "58px",
        borderRadius: "50%",
        backgroundColor: "#FFC72C",
        border: "3px solid #1A1A1A",
        fontSize: "22px",
        cursor: "pointer",
        boxShadow: "4px 4px 0px #1A1A1A",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    cartBadge: {
        position: "absolute",
        top: "-6px",
        right: "-6px",
        backgroundColor: "#1A1A1A",
        color: "#FFC72C",
        fontFamily: "'Oswald', sans-serif",
        fontWeight: "900",
        fontSize: "11px",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid #FFC72C",
    },
};

export default Menu;