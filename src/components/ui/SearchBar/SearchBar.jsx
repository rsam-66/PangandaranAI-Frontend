'use client';

import styles from './SearchBar.module.css';

export default function SearchBar({ value, onChange, placeholder = 'Cari disini...' }) {
    return (
        <div className={styles.container}>
            <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#757575" strokeWidth="2" />
                <path d="M21 21L16.5 16.5" stroke="#757575" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
                className={styles.input}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            {value && (
                <button className={styles.clearBtn} onClick={() => onChange('')} aria-label="Clear search">
                    ✕
                </button>
            )}
        </div>
    );
}
