'use client';

import styles from './StickyBottomBar.module.css';

export default function StickyBottomBar({ price, ctaLabel = 'Simpan ke rute', onCta }) {
    const formatPrice = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className={styles.bar}>
            <div className={styles.priceSection}>
                <span className={styles.price}>{formatPrice(price)}</span>
            </div>
            <button className={styles.cta} onClick={onCta}>
                {ctaLabel}
            </button>
        </div>
    );
}
