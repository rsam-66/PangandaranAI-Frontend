/**
 * Robots.txt Generator — tells search engine crawlers which pages to index.
 *
 * HOW IT WORKS:
 * Next.js automatically serves this as /robots.txt when you export a default function.
 * Every search engine (Google, Bing, etc.) reads this before crawling your site.
 *
 * RULES:
 * - "allow: '/'"  → crawlers CAN index everything by default
 * - "disallow: '/api/'"  → crawlers should NOT index API routes (not useful for users)
 * - "disallow: '/search'"  → saved routes are personal, not public content
 *
 * DEPLOYMENT:
 * - Replace 'https://pangandaran.ai' with your actual production domain
 * - The sitemap URL at the bottom tells Google where to find your sitemap
 */

// TODO: Replace with your actual deployed domain
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pangandaran.ai';

export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',       // API proxy routes — not for humans
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
