import { destinations } from '@/data/destinations';

/**
 * Dynamic Sitemap Generator — tells Google which pages exist on your site.
 * 
 * HOW IT WORKS:
 * Next.js automatically serves this as /sitemap.xml when you export a default function.
 * Google's crawler reads this file to discover and index your pages.
 *
 * WHEN TO UPDATE:
 * - If you add new static routes (e.g. /about, /contact), add them to `staticRoutes`
 * - If you connect to a CMS or the backend has a "list all" endpoint,
 *   you can fetch destination IDs dynamically instead of using static data
 *
 * DEPLOYMENT:
 * - Replace 'https://pangandaran.ai' with your actual production domain
 * - After deploying, submit the sitemap URL to Google Search Console:
 *   https://search.google.com/search-console → Sitemaps → Add "https://yourdomain.com/sitemap.xml"
 */

// TODO: Replace with your actual deployed domain
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pangandaran.ai';

export default function sitemap() {
    // Static pages that always exist
    const staticRoutes = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/home`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/home/destinations`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/chatbot`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    // Dynamic pages — one entry per destination from static data
    // TODO: If the backend has a "list all destinations" endpoint,
    // fetch IDs here instead for a complete sitemap
    const destinationRoutes = destinations.map((dest) => ({
        url: `${BASE_URL}/destination/${dest.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    return [...staticRoutes, ...destinationRoutes];
}
