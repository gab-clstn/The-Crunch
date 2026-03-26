import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Auth_Context";

const ProtectedRoute = ({ children }) => {
    const { currentUser, isAdmin, loading } = useAuth();

    if (loading) {
        return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/auth" replace />;
    }

    if (!isAdmin) {
        return (
            <div style={styles.container}>
                <div style={styles.message}>
                    <h2>Access Denied</h2>
                    <p>You don't have permission to access this page. Admin access is required.</p>
                </div>
            </div>
        );
    }

    return children;
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        backgroundColor: "#F9F9F9"
    },
    message: {
        textAlign: "center",
        padding: "40px",
        border: "3px solid #1A1A1A",
        backgroundColor: "#fff",
        boxShadow: "12px 12px 0px #FFC72C",
        maxWidth: "500px"
    }
};

export default ProtectedRoute;
