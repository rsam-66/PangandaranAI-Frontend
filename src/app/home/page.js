'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { destinations as staticDestinations } from '@/data/destinations';
import { fetchWisata, fetchHotels } from '@/services/api';
import AppBar from '@/components/layout/AppBar/AppBar';
import WelcomeCard from '@/components/cards/WelcomeCard/WelcomeCard';
import DestinationCard from '@/components/cards/DestinationCard/DestinationCard';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import styles from './page.module.css';

/* Dynamic imports for below-fold components — reduces initial JS bundle & TBT */
const BottomNav = dynamic(() => import('@/components/layout/BottomNav/BottomNav'), { ssr: false });
const SavedRouteCard = dynamic(() => import('@/components/cards/SavedRouteCard/SavedRouteCard'));

/**
 * Home page — main landing page after login.
 * Displays a hero welcome card, popular destinations from the API,
 * and a "recently visited" route section.
 *
 * Data fetching: Loads wisata + hotel data from the backend API on mount.
 * Fallback: If the API is unavailable, falls back to static destination data.
 */
export default function HomePage() {
    const router = useRouter();
    const [apiDestinations, setApiDestinations] = useState([]);
    const [loading, setLoading] = useState(true);

    /** Fetch destination data from backend API on component mount */
    useEffect(() => {
        let cancelled = false;

        async function loadData() {
            setLoading(true);
            try {
                const [wisata, hotel] = await Promise.all([
                    fetchWisata(1, 3),
                    fetchHotels(1, 3),
                ]);
                if (!cancelled) {
                    setApiDestinations([...(wisata.data || []), ...(hotel.data || [])]);
                }
            } catch (error) {
                console.warn('API fetch failed, falling back to static data:', error);
                if (!cancelled) {
                    setApiDestinations(staticDestinations);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadData();
        return () => { cancelled = true; };
    }, []);

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
                            <button
                                className={styles.seeAll}
                                onClick={() => router.push('/home/destinations')}
                            >
                                Lihat Semua
                            </button>
                        </div>
                        <div className={styles.destinationScroll}>
                            {loading ? (
                                /* Skeleton placeholders matching DestinationCard dimensions */
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className={styles.skeletonCard}>
                                        <Skeleton width="160px" height="110px" borderRadius="var(--radius-md) var(--radius-md) 0 0" />
                                        <div className={styles.skeletonInfo}>
                                            <Skeleton width="120px" height="14px" />
                                            <Skeleton width="80px" height="11px" />
                                        </div>
                                    </div>
                                ))
                            ) : apiDestinations.length > 0 ? (
                                <>
                                    {apiDestinations.map((dest) => (
                                        <DestinationCard key={dest.id} destination={dest} />
                                    ))}
                                    {/* "See All" card at the end of the scroll */}
                                    <div
                                        className={styles.seeAllCard}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => router.push('/home/destinations')}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') router.push('/home/destinations');
                                        }}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>Lihat Semua</span>
                                    </div>
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
