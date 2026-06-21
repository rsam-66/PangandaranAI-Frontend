import { destinations as staticDestinations } from '@/data/destinations';
import AppBar from '@/components/layout/AppBar/AppBar';
import WelcomeCard from '@/components/cards/WelcomeCard/WelcomeCard';
import DestinationCard from '@/components/cards/DestinationCard/DestinationCard';
import SavedRouteCard from '@/components/cards/SavedRouteCard/SavedRouteCard';
import BottomNav from '@/components/layout/BottomNav/BottomNav';
import HomeDestinationScroll from './HomeDestinationScroll';
import styles from './page.module.css';

/**
 * Home page — Server Component (RSC).
 *
 * Renders to HTML on the server so the browser shows content immediately,
 * rather than waiting for ~340KB of JS to parse first. Interactive pieces
 * (WelcomeCard, DestinationCard, BottomNav) are still client components
 * that hydrate after the shell is visible.
 *
 * Data fetching happens server-side via the BACKEND_URL env var (no proxy
 * needed since we're already on the server).
 */

const BACKEND_URL = process.env.BACKEND_URL;

/**
 * Map backend data item to frontend destination format.
 * Mirrors the mapping logic from services/api.js.
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

/** Fetch destination data directly from the backend (server-side). */
async function fetchDestinations() {
    if (!BACKEND_URL) return staticDestinations.slice(0, 6);

    try {
        const [wisataRes, hotelRes] = await Promise.all([
            fetch(`${BACKEND_URL}/data/wisata?page=1&limit=3`, {
                next: { revalidate: 300 }, // cache for 5 minutes
                headers: { 'ngrok-skip-browser-warning': 'true' },
            }),
            fetch(`${BACKEND_URL}/data/hotel?page=1&limit=3`, {
                next: { revalidate: 300 },
                headers: { 'ngrok-skip-browser-warning': 'true' },
            }),
        ]);

        if (!wisataRes.ok || !hotelRes.ok) throw new Error('API response not ok');

        const [wisata, hotel] = await Promise.all([wisataRes.json(), hotelRes.json()]);

        return [
            ...(wisata.data || []).map((i) => mapToDestination(i, 'beaches')),
            ...(hotel.data || []).map((i) => mapToDestination(i, 'hotels')),
        ];
    } catch (error) {
        console.warn('[Home RSC] API fetch failed, using static data:', error.message);
        return staticDestinations.slice(0, 6);
    }
}

export default async function HomePage() {
    const apiDestinations = await fetchDestinations();
    const recentDestination = staticDestinations[0];

    return (
        <>
            <AppBar />
            <main className="pageContent">
                <div className={styles.page}>
                    {/* Hero welcome card with search + category pills */}
                    <WelcomeCard />

                    {/* Popular destinations — horizontal scrollable cards */}
                    <section className={styles.section} aria-label="Destinasi populer">
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                Destinasi Populer di Kab. Pangandaran
                            </h2>
                            <HomeDestinationScroll variant="seeAllButton" />
                        </div>
                        <div className={styles.destinationScroll}>
                            {apiDestinations.length > 0 ? (
                                <>
                                    {apiDestinations.map((dest) => (
                                        <DestinationCard key={dest.id} destination={dest} />
                                    ))}
                                    {/* "See All" card at the end of the scroll */}
                                    <HomeDestinationScroll variant="seeAllCard" />
                                </>
                            ) : (
                                <p className={styles.loadingText}>Tidak ada data</p>
                            )}
                        </div>
                    </section>

                    {/* Recently visited route */}
                    <section className={styles.section} aria-label="Rute terakhir">
                        <h2 className={styles.sectionTitle}>Rute Terakhir Dikunjungi</h2>
                        <SavedRouteCard
                            destination={{
                                ...recentDestination,
                                rating: recentDestination.rating,
                                reviews: recentDestination.reviews,
                                visited: true,
                            }}
                        />
                    </section>
                </div>
            </main>
            <BottomNav />
        </>
    );
}
