import AppBar from '@/components/layout/AppBar/AppBar';
import BottomNav from '@/components/layout/BottomNav/BottomNav';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import styles from './page.module.css';

/**
 * Home page loading fallback (Next.js Suspense boundary).
 *
 * Displayed immediately while the async HomePage RSC resolves its
 * server-side data fetch. This ensures the user sees a responsive
 * UI with a spinner ("Memuat data...") even on slow/timeout networks,
 * fulfilling the ERR-04 test requirement.
 */
export default function HomeLoading() {
    return (
        <>
            <AppBar />
            <main className="pageContent">
                <div className={styles.page}>
                    {/* Welcome card skeleton */}
                    <Skeleton
                        width="100%"
                        height="180px"
                        borderRadius="var(--radius-md)"
                    />

                    {/* Popular destinations section skeleton */}
                    <section className={styles.section} aria-label="Memuat destinasi">
                        <div className={styles.sectionHeader}>
                            <Skeleton width="220px" height="20px" />
                            <Skeleton width="70px" height="16px" />
                        </div>

                        {/* Loading spinner with message */}
                        <LoadingSpinner
                            message="Memuat data..."
                            size="md"
                            testId="loading-spinner"
                        />

                        {/* Skeleton destination cards */}
                        <div className={styles.destinationScroll}>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={styles.skeletonCard}>
                                    <Skeleton
                                        width="160px"
                                        height="100px"
                                        borderRadius="0"
                                    />
                                    <div className={styles.skeletonInfo}>
                                        <Skeleton width="120px" height="14px" />
                                        <Skeleton width="80px" height="12px" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recent route section skeleton */}
                    <section className={styles.section} aria-label="Memuat rute">
                        <Skeleton width="200px" height="20px" />
                        <Skeleton
                            width="100%"
                            height="100px"
                            borderRadius="var(--radius-md)"
                        />
                    </section>
                </div>
            </main>
            <BottomNav />
        </>
    );
}
