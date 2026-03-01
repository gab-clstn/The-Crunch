import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../../services/Auth_Service";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.name, formData.email, formData.password);
            }
            navigate("/"); // Go home after success
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>{isLogin ? "WELCOME BACK" : "JOIN THE CRUNCH"}</h2>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    {!isLogin && (
                        <input 
                            style={styles.input} 
                            placeholder="FULL NAME" 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    )}
                    <input 
                        style={styles.input} 
                        type="email" 
                        placeholder="EMAIL ADDRESS" 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                    <input 
                        style={styles.input} 
                        type="password" 
                        placeholder="PASSWORD" 
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                    
                    <button type="submit" style={styles.submitBtn}>
                        {isLogin ? "LOG IN" : "CREATE ACCOUNT"}
                    </button>
                </form>

                <p style={styles.toggleText}>
                    {isLogin ? "New to The Crunch?" : "Already a member?"}
                    <span 
                        style={styles.toggleLink} 
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? " SIGN UP" : " LOG IN"}
                    </span>
                </p>
            </div>
        </div>
    );
};

const styles = {
    page: {
        height: "90vh", display: "flex", justifyContent: "center", 
        alignItems: "center", backgroundColor: "#F9F9F9"
    },
    card: {
        width: "100%", maxWidth: "400px", backgroundColor: "#fff",
        padding: "40px", border: "3px solid #1A1A1A",
        boxShadow: "12px 12px 0px #FFC72C", // Matches the Menu Card style
    },
    title: {
        fontFamily: "'Oswald', sans-serif", fontSize: "32px",
        textAlign: "center", marginBottom: "30px", color: "#1A1A1A"
    },
    form: { display: "flex", flexDirection: "column", gap: "15px" },
    
    input: {
        padding: "15px", border: "2px solid #1A1A1A",
        fontFamily: "'Public Sans', sans-serif", fontWeight: "700",
        outline: "none", fontSize: "14px"
    },
    submitBtn: {
        backgroundColor: "#1A1A1A", color: "#FFC72C", padding: "15px",
        border: "none", fontFamily: "'Oswald', sans-serif",
        fontSize: "18px", fontWeight: "bold", cursor: "pointer",
        marginTop: "10px", transition: "0.2s"
    },
    toggleText: {
        textAlign: "center", marginTop: "20px",
        fontFamily: "'Public Sans', sans-serif", fontSize: "14px", fontWeight: "700"
    },
    toggleLink: { color: "#FFC72C", cursor: "pointer", textDecoration: "underline" }
};

export default Auth;