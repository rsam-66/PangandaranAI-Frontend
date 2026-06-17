/**
 * API service layer
 * Communicates with the RAG backend (FastAPI)
 */

const BASE_URL = '/api/proxy';
const AUTH_KEY = 'pangandaran_auth_token';


// ---- Auth helpers ----

/** Get stored token from localStorage */
export function getStoredToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_KEY);
}

/** Save token to localStorage */
export function storeToken(token) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH_KEY, token);
}

/** Build auth headers */
function authHeaders() {
    const token = getStoredToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

// ---- Auth ----

/**
 * Request a new anonymous user token
 * POST /auth → { user_token: "uuid" }
 */
export async function authenticate() {
    const response = await fetch(`${BASE_URL}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`Auth failed: ${response.status}`);
    }

    const data = await response.json();
    storeToken(data.user_token);
    return data.user_token;
}

// ---- Check Backend Health ----

export async function checkBackendHealth() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s

    try {
        const response = await fetch(`${BASE_URL}/sessions`, {
            headers: authHeaders(),
            signal: controller.signal,
        });
        clearTimeout(timeout);
        return { ok: response.ok, status: response.status };
    } catch (err) {
        clearTimeout(timeout);
        return { ok: false, status: 0, error: err.message };
    }
}

// ---- Sessions ----

/**
 * List all sessions for the current user
 * GET /sessions
 */
export async function fetchSessions() {
    const response = await fetch(`${BASE_URL}/sessions`, {
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch sessions: ${response.status}`);
    }

    return response.json();
}

/**
 * Create a new chat session
 * POST /sessions { title }
 */
export async function createSessionAPI(title = 'New Chat') {
    const response = await fetch(`${BASE_URL}/sessions`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ title }),
    });

    if (!response.ok) {
        throw new Error(`Failed to create session: ${response.status}`);
    }

    return response.json();
}

/**
 * Delete a session
 * DELETE /sessions/{id}
 */
export async function deleteSessionAPI(sessionId) {
    const response = await fetch(`${BASE_URL}/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete session: ${response.status}`);
    }

    return response.json();
}

// ---- Messages ----

/**
 * Get message history for a session
 * GET /sessions/{id}/messages?limit=20
 */
export async function fetchMessages(sessionId, limit = 20) {
    const response = await fetch(
        `${BASE_URL}/sessions/${sessionId}/messages?limit=${limit}`,
        { headers: authHeaders() }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
    }

    return response.json();
}

// ---- Chat ----

/**
 * Send a chat message within a session (RAG)
 * POST /sessions/{id}/chat { question }
 * Returns { answer, sources }
 */
export async function sendSessionChat(sessionId, question) {
    const response = await fetch(`${BASE_URL}/sessions/${sessionId}/chat`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ question }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `Chat error: ${response.status}`);
    }

    return response.json();
}

/**
 * Simple chat without session (no auth needed)
 * POST /chat { question }
 */
export async function sendSimpleChat(question) {
    const response = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
    });

    if (!response.ok) {
        throw new Error(`Chat error: ${response.status}`);
    }

    return response.json();
}

// ---- Data Endpoints ----

/**
 * Map backend data item to frontend destination format.
 * Backend: { data_id, name, url, image_url, description? }
 * Frontend: { id, title, image, description, url, reviews, rating, price, category }
 */
function mapToDestination(item, category = 'beaches') {
    return {
        id: item.data_id || item.id?.toString(),
        title: item.name,
        image: item.image_url || '/images/default-image.webp',
        description: item.description || '',
        url: item.url || '',
        reviews: 0,
        rating: 0,
        price: 0,
        category,
    };
}

/**
 * Generic paginated data fetch
 * GET /data/{type}?page=1&limit=10
 */
async function fetchDataEndpoint(type, page = 1, limit = 10) {
    const response = await fetch(
        `${BASE_URL}/data/${type}?page=${page}&limit=${limit}`,
        { headers: { 'Content-Type': 'application/json' } }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch ${type}: ${response.status}`);
    }

    return response.json();
}

/**
 * Fetch wisata (tourist spots) from the backend.
 * Maps backend data to frontend DestinationCard format.
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @returns {Promise<{data: Object[], total: number, page: number}>}
 */
export async function fetchWisata(page = 1, limit = 10) {
    const result = await fetchDataEndpoint('wisata', page, limit);
    return {
        ...result,
        data: (result.data || []).map((item) => mapToDestination(item, 'beaches')),
    };
}

/**
 * Fetch hotels from the backend.
 * Maps backend data to frontend DestinationCard format.
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @returns {Promise<{data: Object[], total: number, page: number}>}
 */
export async function fetchHotels(page = 1, limit = 10) {
    const result = await fetchDataEndpoint('hotel', page, limit);
    return {
        ...result,
        data: (result.data || []).map((item) => mapToDestination(item, 'hotels')),
    };
}

/**
 * Fetch paket wisata (tour packages) from the backend.
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @returns {Promise<{data: Object[], total: number, page: number}>}
 */
export async function fetchPaketWisata(page = 1, limit = 10) {
    const result = await fetchDataEndpoint('paket-wisata', page, limit);
    return {
        ...result,
        data: (result.data || []).map((item) => mapToDestination(item, 'beaches')),
    };
}

/**
 * Fetch tempat penting (important places) from the backend.
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @returns {Promise<{data: Object[], total: number, page: number}>}
 */
export async function fetchTempatPenting(page = 1, limit = 10) {
    const result = await fetchDataEndpoint('tempat-penting', page, limit);
    return {
        ...result,
        data: (result.data || []).map((item) => mapToDestination(item, 'beaches')),
    };
}

/**
 * Fetch harga tiket (ticket prices) — returns raw backend format.
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @returns {Promise<Object>} Raw paginated response from backend
 */
export async function fetchHargaTiket(page = 1, limit = 10) {
    return fetchDataEndpoint('harga-tiket', page, limit);
}

/**
 * Fetch nomor penting (emergency numbers) — returns raw backend format.
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @returns {Promise<Object>} Raw paginated response from backend
 */
export async function fetchNomorPenting(page = 1, limit = 10) {
    return fetchDataEndpoint('nomor-penting', page, limit);
}

/**
 * Fetch transportasi (transportation info) — returns raw backend format.
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @returns {Promise<Object>} Raw paginated response from backend
 */
export async function fetchTransportasi(page = 1, limit = 10) {
    return fetchDataEndpoint('transportasi', page, limit);
}
