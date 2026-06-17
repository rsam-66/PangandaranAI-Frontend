'use client';

import styles from './CategoryPill.module.css';

export default function CategoryPill({ label, active = false, onClick }) {
    return (
        <button
            className={`${styles.pill} ${active ? styles.active : ''}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
}
