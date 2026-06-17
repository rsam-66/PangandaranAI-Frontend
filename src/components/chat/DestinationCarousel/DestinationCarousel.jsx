'use client';

import { useRouter } from 'next/navigation';
import styles from './DestinationCarousel.module.css';

export default function DestinationCarousel({ destinations }) {
    const router = useRouter();

    if (!destinations || destinations.length === 0) return null;

    const handleClick = (id) => {
        router.push(`/destination/${id}`);
    };

    const formatReviews = (count) => {
        if (count >= 1000) return `${(count / 1000).toFixed(0)}k ulasan`;
        return `${count} ulasan`;
    };

    return (
        <div className={styles.carousel}>
            <div className={styles.scrollContainer}>
                {destinations.map((dest) => (
                    <button
                        key={dest.id}
                        className={styles.card}
                        onClick={() => handleClick(dest.id)}
                    >
                        <div className={styles.imageWrapper}>
                            <div
                                className={styles.image}
                                style={{
                                    backgroundImage: `url(${dest.image || '/images/default-image.webp'})`,
                                }}
                            />
                        </div>
                        <div className={styles.info}>
                            <h4 className={styles.title}>{dest.title}</h4>
                            <span className={styles.reviews}>{formatReviews(dest.reviews)}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
