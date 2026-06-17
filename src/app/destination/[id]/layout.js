/**
 * SEO metadata for destination detail pages.
 * Uses generateMetadata to create dynamic titles based on the destination ID.
 *
 * Resolution order:
 * 1. Static data (destinations.js) — exact match with full description
 * 2. Fallback — converts the URL ID to a human-readable title
 *    (e.g. "pantai-pangandaran" → "Pantai Pangandaran")
 */

import { destinations } from '@/data/destinations';

/** Generate unique metadata for each destination page */
export async function generateMetadata({ params }) {
    const { id } = await params;
    const dest = destinations.find((d) => d.id === id);

    if (dest) {
        return {
            title: `${dest.title} — Pangandaran.ai`,
            description: `Informasi lengkap tentang ${dest.title} di Pangandaran. Lihat ulasan, lokasi, dan tips wisata.`,
            openGraph: {
                title: `${dest.title} — Pangandaran.ai`,
                description: `Informasi lengkap tentang ${dest.title} di Pangandaran.`,
                type: 'article',
            },
        };
    }

    // Fallback: convert URL slug to a readable title for API-fetched destinations
    const readableTitle = id
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
        title: `${readableTitle} — Pangandaran.ai`,
        description: `Detail destinasi ${readableTitle} di Kabupaten Pangandaran.`,
        openGraph: {
            title: `${readableTitle} — Pangandaran.ai`,
            description: `Detail destinasi ${readableTitle} di Kabupaten Pangandaran.`,
            type: 'article',
        },
    };
}

export default function DestinationLayout({ children }) {
    return children;
}
