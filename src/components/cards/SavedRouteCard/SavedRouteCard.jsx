'use client';

import Image from 'next/image';
import styles from './SavedRouteCard.module.css';

/**
 * Saved route card — horizontal layout with thumbnail, title, rating, and visit status.
 * Used on the search page and home page "Rute Terakhir" section.
 *
 * @param {Object} props
 * @param {Object} props.destination - Route data (title, image, rating, reviews, address, visited, savedAt)
 * @param {Function} [props.onClick] - Click handler to navigate to detail page
 * @param {boolean} [props.priority] - Whether to preload the image (for LCP optimization)
 */
export default function SavedRouteCard({ destination, onClick, priority = false }) {
    const { title, image, rating, reviews, category, visited, savedAt, address } = destination;

    /** Render 5 stars, filled up to the rating value */
    const renderStars = (rating) => {
        const stars = [];
        const full = Math.floor(rating);
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < full ? styles.starFull : styles.starEmpty}>
                    ★
                </span>
            );
        }
        return stars;
    };

    /** Format review count — adds 'k+' suffix for thousands */
    const formatReviews = (count) => {
        if (count >= 1000) return `${(count / 1000).toFixed(0)}k+ reviews`;
        return `${count} Ulasan`;
    };

    /** Format ISO date string to localized Indonesian date */
    const formatSavedDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return `Ditambahkan pada ${date.toLocaleDateString('id-ID', options)}`;
    };

    return (
        <button className={styles.card} onClick={onClick}>
            <div className={styles.thumbnail}>
                <Image
                    src={image || '/images/default-image.webp'}
                    alt={title || 'Rute'}
                    fill
                    sizes="80px"
                    priority={priority}
                    className={styles.image}
                />
            </div>
            <div className={styles.info}>
                <h4 className={styles.title}>{title}</h4>
                <div className={styles.ratingRow}>
                    <span className={styles.stars}>{renderStars(rating || 0)}</span>
                    <span className={styles.reviews}>{formatReviews(reviews || 0)}</span>
                </div>
                {address && (
                    <span className={styles.address}>{address}</span>
                )}
                {visited !== undefined && (
                    <span className={visited ? styles.visitedBadge : styles.notVisitedBadge}>
                        {visited ? 'Sudah dikunjungi' : 'Belum dikunjungi'}
                    </span>
                )}
                {savedAt && (
                    <span className={styles.savedDate}>{formatSavedDate(savedAt)}</span>
                )}
            </div>
        </button>
    );
}
