import styles from './LoadingSpinner.module.css';

/**
 * Premium loading spinner with animated dual-ring and pulsing text.
 * Used as a loading indicator while data is being fetched.
 *
 * @param {Object} props
 * @param {string} [props.message='Memuat data...'] - Loading text shown below the spinner
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Spinner size variant
 * @param {boolean} [props.fullPage=false] - Whether to center vertically in the viewport
 * @param {string} [props.className] - Additional CSS class
 * @param {string} [props.testId] - data-testid attribute for testing
 */
export default function LoadingSpinner({
    message = 'Memuat data...',
    size = 'md',
    fullPage = false,
    className = '',
    testId,
}) {
    const sizeClass = size !== 'md' ? styles[size] : '';

    return (
        <div
            className={`${styles.wrapper} ${fullPage ? styles.fullPage : ''} ${className}`}
            role="status"
            aria-label={message}
            {...(testId ? { 'data-testid': testId } : {})}
        >
            <div className={`${styles.spinnerContainer} ${sizeClass}`}>
                <div className={styles.ring} />
                <div className={styles.ringInner} />
                <div className={styles.dot} />
            </div>
            {message && (
                <p className={styles.text}>{message}</p>
            )}
        </div>
    );
}
