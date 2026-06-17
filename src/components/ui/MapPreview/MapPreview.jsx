'use client';

import styles from './MapPreview.module.css';

export default function MapPreview({ lat, lng, label = 'Buka Map' }) {
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

    return (
        <div className={styles.container}>
            <div className={styles.mapPlaceholder}>
                <span className={styles.pinIcon}>📍</span>
                <span className={styles.coords}>
                    {lat?.toFixed(4)}, {lng?.toFixed(4)}
                </span>
            </div>
            <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.openBtn}
            >
                {label}
            </a>
        </div>
    );
}
