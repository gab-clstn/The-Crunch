// src/ErrorBoundary.jsx
// Catches any React render crash and shows a safe fallback UI
// instead of a blank/broken screen.
//
// Usage: Wrap your app in App.jsx:
//   <ErrorBoundary>
//     <YourRoutes />
//   </ErrorBoundary>

import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render shows the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log to console in dev; swap for a real logging service in prod
        console.error('[ErrorBoundary] Caught a render error:', error, errorInfo);
        this.setState({ errorInfo });

        // ── Optional: send to Firebase Crashlytics or Sentry
        // import { logEvent, getAnalytics } from 'firebase/analytics';
        // const analytics = getAnalytics();
        // logEvent(analytics, 'ui_error', {
        //   error_message: error.message,
        //   component_stack: errorInfo.componentStack,
        // });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={styles.container}>
                    <div style={styles.card}>
                        <div style={styles.icon}>⚠️</div>
                        <h2 style={styles.title}>Something went wrong</h2>
                        <p style={styles.message}>
                            The page ran into an unexpected error. This has been noted.
                        </p>

                        {/* Show error detail only in development */}
                        {import.meta.env.DEV && this.state.error && (
                            <details style={styles.details}>
                                <summary style={styles.summary}>Error details (dev only)</summary>
                                <pre style={styles.pre}>
                                    {this.state.error.toString()}
                                    {'\n\n'}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div style={styles.actions}>
                            <button onClick={this.handleReset} style={styles.btnPrimary}>
                                Try again
                            </button>
                            <button onClick={() => window.location.href = '/'} style={styles.btnSecondary}>
                                Go home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// ── Inline styles (no CSS file dependency — works even if CSS is broken)
const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        fontFamily: 'sans-serif',
        padding: '1rem',
    },
    card: {
        background: '#fff',
        borderRadius: '12px',
        padding: '2.5rem',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    },
    icon: {
        fontSize: '3rem',
        marginBottom: '1rem',
    },
    title: {
        fontSize: '1.4rem',
        fontWeight: '700',
        color: '#1a1a1a',
        margin: '0 0 0.5rem',
    },
    message: {
        color: '#666',
        lineHeight: 1.6,
        margin: '0 0 1.5rem',
    },
    details: {
        textAlign: 'left',
        marginBottom: '1.5rem',
        background: '#f4f4f4',
        borderRadius: '6px',
        padding: '0.75rem 1rem',
    },
    summary: {
        cursor: 'pointer',
        fontSize: '0.85rem',
        color: '#888',
    },
    pre: {
        fontSize: '0.75rem',
        color: '#c0392b',
        overflowX: 'auto',
        whiteSpace: 'pre-wrap',
        marginTop: '0.75rem',
    },
    actions: {
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'center',
    },
    btnPrimary: {
        background: '#e63946',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '0.65rem 1.4rem',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
    btnSecondary: {
        background: 'transparent',
        color: '#555',
        border: '1.5px solid #ddd',
        borderRadius: '8px',
        padding: '0.65rem 1.4rem',
        fontSize: '0.9rem',
        cursor: 'pointer',
    },
};

export default ErrorBoundary;