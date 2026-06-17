'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import AppBar from '@/components/layout/AppBar/AppBar';
import SearchBar from '@/components/ui/SearchBar/SearchBar';
import SavedRouteCard from '@/components/cards/SavedRouteCard/SavedRouteCard';
import styles from './page.module.css';

/* Dynamic import for below-fold component — reduces initial JS bundle */
const BottomNav = dynamic(() => import('@/components/layout/BottomNav/BottomNav'), { ssr: false });

/**
 * Saved Routes page.
 * Displays only the user's bookmarked destinations (from Redux routeSlice).
 * Shows an empty state if nothing has been saved yet.
 */
export default function SearchPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const savedRoutes = useSelector((state) => state.routes.savedRoutes);

    /* Hydration guard — server renders with empty Redux store, but client may
       have persisted routes. Deferring until after mount prevents the mismatch
       error without changing any rendering logic. */
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => { setHasMounted(true); }, []);

    const routes = hasMounted ? savedRoutes : [];

    const filtered = searchQuery
        ? routes.filter((r) =>
            r.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : routes;

    return (
        <>
            <AppBar />
            <main className="pageContent">
                <div className={styles.page}>
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Cari rute tersimpan..."
                    />

                    <h2 className={styles.heading}>Daftar rute yang disimpan</h2>

                    {routes.length === 0 ? (
                        <p className={styles.emptyText}>Belum ada rute yang disimpan.</p>
                    ) : (
                        <>
                            <div className={styles.routeList}>
                                {filtered.map((route, index) => (
                                    <SavedRouteCard
                                        key={route.id}
                                        destination={route}
                                        priority={index === 0}
                                        onClick={() => {
                                            sessionStorage.setItem(`dest_${route.id}`, JSON.stringify(route));
                                            router.push(`/destination/${route.id}`);
                                        }}
                                    />
                                ))}
                            </div>

                            {filtered.length === 0 && searchQuery && (
                                <p className={styles.emptyText}>Tidak ada rute ditemukan</p>
                            )}
                        </>
                    )}
                </div>
            </main>
            <BottomNav />
        </>
    );
}
