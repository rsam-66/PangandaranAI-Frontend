import { destinations as staticDestinations } from '@/data/destinations';
import AppBar from '@/components/layout/AppBar/AppBar';
import BottomNav from '@/components/layout/BottomNav/BottomNav';
import DestinationCard from '@/components/cards/DestinationCard/DestinationCard';
import styles from './page.module.css';

// Render on every request (not at build time) so BACKEND_URL is always available
export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL;

const CATEGORY_LABELS = {
    hotel: 'Penginapan',
    wisata: 'Wisata',
    'tempat-penting': 'Rute & Tempat Penting',
};

/**
 * Fetch data directly from backend (server-side — no proxy needed).
 * Maps backend format to frontend DestinationCard format.
 */
async function fetchCategory(type) {
    const res = await fetch(`${BACKEND_URL}/data/${type}`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const json = await res.json();
    return (json.data || json || []).map((item) => ({
        id: item.data_id || item.id?.toString(),
        title: item.name,
        image: item.image_url || '/images/default-image.webp',
        description: item.description || '',
        url: item.url || '',
        reviews: 0,
        rating: 0,
        price: 0,
        category: type,
    }));
}

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const query = params?.q || '';
    const category = params?.category || '';

    let destinations = [];

    try {
        if (category === 'hotel') {
            destinations = await fetchCategory('hotel');
        } else if (category === 'wisata') {
            destinations = await fetchCategory('wisata');
        } else if (category === 'tempat-penting') {
            destinations = await fetchCategory('tempat-penting');
        } else {
            const [wisata, hotel] = await Promise.all([
                fetchCategory('wisata'),
                fetchCategory('hotel'),
            ]);
            destinations = [...wisata, ...hotel];
        }

        if (query) {
            const q = query.toLowerCase();
            destinations = destinations.filter((d) =>
                d.title?.toLowerCase().includes(q) ||
                d.description?.toLowerCase().includes(q)
            );
        }
    } catch (error) {
        console.warn('API failed, fallback static:', error);
        destinations = staticDestinations;

        if (query) {
            const q = query.toLowerCase();
            destinations = destinations.filter((d) =>
                d.title?.toLowerCase().includes(q)
            );
        }
    }

    const pageTitle = category
        ? CATEGORY_LABELS[category] || 'Semua Destinasi'
        : query
            ? `Hasil: "${query}"`
            : 'Semua Destinasi';

    return (
        <>
            <AppBar showBack title={pageTitle} />

            <main className="pageContent">
                <div className={styles.page}>
                    <p className={styles.resultCount}>
                        {destinations.length} destinasi ditemukan
                    </p>

                    <div className={styles.grid}>
                        {destinations.length > 0 ? (
                            destinations.map((dest) => (
                                <DestinationCard key={dest.id} destination={dest} />
                            ))
                        ) : (
                            <p className={styles.loadingText}>
                                {query ? `Tidak ditemukan "${query}"` : 'Tidak ada data'}
                            </p>
                        )}
                    </div>
                </div>
            </main>

            <BottomNav />
        </>
    );
}