import styles from './Skeleton.module.css';

/**
 * Reusable skeleton loader — pulsing gray placeholder.
 * Use while content is being fetched to reduce CLS and improve perceived speed.
 *
 * @param {Object} props
 * @param {string} [props.width='100%'] - CSS width
 * @param {string} [props.height='16px'] - CSS height
 * @param {string} [props.borderRadius='var(--radius-sm)'] - CSS border-radius
 * @param {string} [props.className] - Additional CSS class
 */
export default function Skeleton({
    width = '100%',
    height = '16px',
    borderRadius = 'var(--radius-sm)',
    className = '',
}) {
    return (
        <div
            className={`${styles.skeleton} ${className}`}
            style={{ width, height, borderRadius }}
            aria-hidden="true"
        />
    );
}
