// src/firebase/errorHandler.js
// Centralised Firebase error handler for Auth, Firestore, and Orders.
// Import handleFirebaseError() anywhere you catch a Firebase error.

// ── Auth Errors ───────────────────────────────────────────────────────────────
const AUTH_ERRORS = {
    'auth/user-not-found': 'No account found with that email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many failed attempts. Please wait and try again.',
    'auth/user-disabled': 'This account has been disabled. Contact support.',
    'auth/network-request-failed': 'Network error. Check your connection and retry.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
    'auth/requires-recent-login': 'Please sign out and sign in again to continue.',
};

// ── Firestore / Orders Errors ─────────────────────────────────────────────────
const FIRESTORE_ERRORS = {
    'permission-denied': 'You do not have permission to do that.',
    'not-found': 'The requested data could not be found.',
    'already-exists': 'This record already exists.',
    'unavailable': 'Service is temporarily unavailable. Please retry.',
    'deadline-exceeded': 'The request took too long. Please try again.',
    'resource-exhausted': 'Too many requests. Please slow down and retry.',
    'unauthenticated': 'You must be signed in to do that.',
    'cancelled': 'The operation was cancelled.',
    'data-loss': 'Unexpected data error. Please contact support.',
};

// ── Cart / Checkout Errors ────────────────────────────────────────────────────
const CART_ERRORS = {
    ITEM_OUT_OF_STOCK: 'Sorry, this item is currently out of stock.',
    CART_EMPTY: 'Your cart is empty. Add items before checking out.',
    INVALID_QUANTITY: 'Please enter a valid quantity.',
    ORDER_FAILED: 'Your order could not be placed. Please try again.',
};

// ── Main Handler ──────────────────────────────────────────────────────────────

/**
 * Returns a human-readable error message for any Firebase or app error.
 *
 * @param {Error | { code?: string, message?: string } | string} error
 * @returns {string} User-facing message
 *
 * @example
 * try {
 *   await signInWithEmailAndPassword(auth, email, password);
 * } catch (err) {
 *   const msg = handleFirebaseError(err);
 *   setError(msg);
 * }
 */
export const handleFirebaseError = (error) => {
    // Custom app-level string codes (e.g. from Cart_Service.js)
    if (typeof error === 'string') {
        return CART_ERRORS[error] ?? `Unexpected error: ${error}`;
    }

    const code = error?.code ?? '';

    // Auth errors
    if (code.startsWith('auth/')) {
        return AUTH_ERRORS[code] ?? `Authentication error: ${error.message}`;
    }

    // Firestore errors
    if (FIRESTORE_ERRORS[code]) {
        return FIRESTORE_ERRORS[code];
    }

    // Network / generic
    if (error?.message?.toLowerCase().includes('network')) {
        return 'Network error. Check your connection and retry.';
    }

    // Fallback
    return error?.message
        ? `Error: ${error.message}`
        : 'An unexpected error occurred. Please try again.';
};


// ── Retry Helper ──────────────────────────────────────────────────────────────

/**
 * Retries an async Firebase operation up to `maxAttempts` times.
 * Useful for Firestore reads/writes that may fail due to 'unavailable'.
 *
 * @param {() => Promise<T>} fn            Async function to retry
 * @param {number}           maxAttempts   Default: 3
 * @param {number}           delayMs       Delay between attempts (default: 1000ms)
 * @returns {Promise<T>}
 *
 * @example
 * const order = await withRetry(() => getDoc(orderRef));
 */
export const withRetry = async (fn, maxAttempts = 3, delayMs = 1000) => {
    let lastError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            const retryable = ['unavailable', 'deadline-exceeded', 'resource-exhausted'];

            if (!retryable.includes(err?.code) || attempt === maxAttempts) {
                throw err;
            }

            console.warn(`[Firebase] Attempt ${attempt} failed (${err.code}). Retrying in ${delayMs}ms...`);
            await new Promise((res) => setTimeout(res, delayMs * attempt)); // exponential-ish backoff
        }
    }

    throw lastError;
};