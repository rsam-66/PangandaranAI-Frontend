import AppBar from '@/components/layout/AppBar/AppBar';
import BottomNav from '@/components/layout/BottomNav/BottomNav';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import styles from './page.module.css';

/**
 * Destinations page loading fallback (Next.js Suspense boundary).
 *
 * Displayed immediately while the async Destinations RSC resolves
 * its server-side data fetch. Shows an animated spinner with
 * "Memuat data..." text and skeleton card placeholders.
 */
export default function DestinationsLoading() {
    return (
        <>
            <AppBar showBack title="Semua Destinasi" />

            <main className="pageContent">
                <div className={styles.page}>
                    <Skeleton width="140px" height="14px" />

                    {/* Centered loading spinner */}
                    <LoadingSpinner
                        message="Memuat data..."
                        size="md"
                        fullPage
                        testId="destinations-loading-spinner"
                    />

                    {/* Skeleton grid preview */}
                    <div className={styles.grid}>
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton
                                key={i}
                                width="100%"
                                height="180px"
                                borderRadius="var(--radius-md)"
                            />
                        ))}
                    </div>
                </div>
            </main>

            <BottomNav />
        </>
    );
}
