'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

/**
 * Client-side interactive elements for the home page destination section.
 * Extracted from the RSC home page so navigation (useRouter) works.
 *
 * @param {Object} props
 * @param {'seeAllButton' | 'seeAllCard'} props.variant - Which element to render
 */
export default function HomeDestinationScroll({ variant }) {
    const router = useRouter();

    if (variant === 'seeAllButton') {
        return (
            <button
                className={styles.seeAll}
                onClick={() => router.push('/home/destinations')}
            >
                Lihat Semua
            </button>
        );
    }

    if (variant === 'seeAllCard') {
        return (
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
        );
    }

    return null;
}
