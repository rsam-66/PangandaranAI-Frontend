/**
 * Server-side API proxy route.
 * Forwards all requests to the backend — eliminates CORS since
 * the browser only talks to the Next.js server (same-origin).
 *
 * Supports GET, POST, and DELETE methods.
 * Passes through Authorization headers for authenticated requests.
 *
 * Backend URL is read from BACKEND_URL env var (server-side only).
 */

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(request, { params }) {
    const { path } = await params;
    const pathStr = path.join('/');

    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const url = `${BACKEND_URL}/${pathStr}${query ? `?${query}` : ''}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                ...(request.headers.get('authorization')
                    ? { Authorization: request.headers.get('authorization') }
                    : {}),
            },
            // Only cache data endpoints (tourist info), NOT user-specific endpoints like /sessions
            ...(pathStr.startsWith('data/')
                ? { next: { revalidate: 3600 } }    // Cache tourist data for 1 hour
                : { cache: 'no-store' }              // Never cache session/chat/auth endpoints
            ),
        });

        clearTimeout(timeout);

        const data = await response.json();
        return Response.json(data, { status: response.status });

    } catch (err) {
        clearTimeout(timeout);

        console.error('Proxy fetch error:', err);

        return Response.json(
            { error: 'Backend request timeout or failed' },
            { status: 504 }
        );
    }
}

export async function POST(request, { params }) {
    const { path } = await params;
    const pathStr = path.join('/');
    const url = `${BACKEND_URL}/${pathStr}`;

    // Safely handle empty body (e.g. /auth sends no body)
    let body = null;
    try {
        const text = await request.text();
        body = text ? text : null;
    } catch {
        body = null;
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            ...(request.headers.get('authorization')
                ? { Authorization: request.headers.get('authorization') }
                : {}),
        },
        ...(body ? { body } : {}),
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
}

export async function DELETE(request, { params }) {
    const { path } = await params;
    const pathStr = path.join('/');
    const url = `${BACKEND_URL}/${pathStr}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            ...(request.headers.get('authorization')
                ? { Authorization: request.headers.get('authorization') }
                : {}),
        },
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
}
