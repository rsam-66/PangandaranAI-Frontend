import { destinations as staticDestinations } from '@/data/destinations';
import AppBar from '@/components/layout/AppBar/AppBar';
import BottomNav from '@/components/layout/BottomNav/BottomNav';
import DestinationCard from '@/components/cards/DestinationCard/DestinationCard';
import Pagination from '@/components/ui/Pagination/Pagination';
import styles from './page.module.css';

const ITEMS_PER_PAGE = 20;

// Render on every request (not at build time) so BACKEND_URL is always available
export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL;

const CATEGORY_LABELS = {
    hotel: 'Penginapan',
    wisata: 'Wisata',
    'tempat-penting': 'Rute & Tempat Penting',
    'paket-wisata': 'Paket Wisata',
};

/**
 * Fetch ALL data for a category by paginating through the backend.
 * Uses page=1,2,3... with limit=50 until all records are retrieved.
 * Maps backend format to frontend DestinationCard format.
 */
async function fetchCategory(type) {
    const PAGE_SIZE = 10;
    let allItems = [];
    let page = 1;

    while (true) {
        const res = await fetch(
            `${BACKEND_URL}/data/${type}?page=${page}&limit=${PAGE_SIZE}`,
            {
                next: { revalidate: 3600 }, // Cache for 1 hour
                headers: { 'ngrok-skip-browser-warning': 'true' },
            }
        );
        if (!res.ok) throw new Error(`Failed: ${res.status}`);

        const json = await res.json();
        const items = json.data || json || [];
        allItems = allItems.concat(items);

        // Stop when we got fewer items than the page size (last page)
        if (items.length < PAGE_SIZE) break;

        page++;
        // Safety cap — never fetch more than 10 pages (500 items)
        if (page > 10) break;
    }

    return allItems.map((item) => ({
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

/**
 * Safe wrapper — returns empty array if a single endpoint fails,
 * so one broken table doesn't crash the entire search.
 */
async function safeFetchCategory(type) {
    try {
        return await fetchCategory(type);
    } catch (err) {
        console.warn(`[Destinations] Failed to fetch ${type}:`, err.message);
        return [];
    }
}

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const query = params?.q || '';
    const category = params?.category || '';
    const currentPage = Math.max(1, parseInt(params?.p || '1', 10));

    let destinations = [];

    try {
        if (category === 'hotel') {
            destinations = await fetchCategory('hotel');
        } else if (category === 'wisata') {
            destinations = await fetchCategory('wisata');
        } else if (category === 'tempat-penting') {
            destinations = await fetchCategory('tempat-penting');
        } else if (category === 'paket-wisata') {
            destinations = await fetchCategory('paket-wisata');
        } else {
            const [wisata, hotel, tempatPenting, paketWisata] = await Promise.all([
                safeFetchCategory('wisata'),
                safeFetchCategory('hotel'),
                safeFetchCategory('tempat-penting'),
                safeFetchCategory('paket-wisata'),
            ]);
            destinations = [...wisata, ...hotel, ...tempatPenting, ...paketWisata];
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

    // --- Pagination logic ---
    const totalItems = destinations.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const safePage = Math.min(currentPage, totalPages || 1);
    const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
    const paginatedDestinations = destinations.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    return (
        <>
            <AppBar showBack title={pageTitle} />

            <main className="pageContent">
                <div className={styles.page}>
                    <p className={styles.resultCount}>
                        {totalItems} destinasi ditemukan
                        {totalPages > 1 && ` — Halaman ${safePage} dari ${totalPages}`}
                    </p>

                    <div className={styles.grid}>
                        {paginatedDestinations.length > 0 ? (
                            paginatedDestinations.map((dest) => (
                                <DestinationCard key={dest.id} destination={dest} />
                            ))
                        ) : (
                            <p className={styles.loadingText}>
                                {query ? `Tidak ditemukan "${query}"` : 'Tidak ada data'}
                            </p>
                        )}
                    </div>

                    <Pagination
                        currentPage={safePage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                    />
                </div>
            </main>

            <BottomNav />
        </>
    );
}