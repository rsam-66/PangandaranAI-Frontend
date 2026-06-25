'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './Pagination.module.css';

/**
 * URL-based pagination component.
 * Navigates by updating the `p` search param while preserving
 * existing params (q, category).
 *
 * @param {Object} props
 * @param {number} props.currentPage - Current page number (1-indexed)
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.totalItems - Total items across all pages
 */
export default function Pagination({ currentPage, totalPages, totalItems }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    /** Build URL with updated page param */
    const goToPage = (page) => {
        const params = new URLSearchParams(searchParams.toString());
        if (page <= 1) {
            params.delete('p');
        } else {
            params.set('p', page.toString());
        }
        const qs = params.toString();
        router.push(`/home/destinations${qs ? `?${qs}` : ''}`);
    };

    /** Generate page numbers with ellipsis for large ranges */
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible + 2) {
            // Show all pages if small enough
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Always show first page
            pages.push(1);

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Adjust range to always show `maxVisible` middle pages
            if (currentPage <= 3) {
                end = Math.min(maxVisible, totalPages - 1);
            } else if (currentPage >= totalPages - 2) {
                start = Math.max(totalPages - maxVisible + 1, 2);
            }

            if (start > 2) pages.push('...');
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < totalPages - 1) pages.push('...');

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav className={styles.pagination} aria-label="Navigasi halaman">
            {/* Previous button */}
            <button
                className={`${styles.pageBtn} ${currentPage <= 1 ? styles.disabled : ''}`}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label="Halaman sebelumnya"
            >
                <span className={styles.arrow}>‹</span>
            </button>

            {/* Page numbers */}
            {pageNumbers.map((item, idx) =>
                item === '...' ? (
                    <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
                        …
                    </span>
                ) : (
                    <button
                        key={item}
                        className={`${styles.pageBtn} ${item === currentPage ? styles.active : ''}`}
                        onClick={() => item !== currentPage && goToPage(item)}
                        aria-label={`Halaman ${item}`}
                        aria-current={item === currentPage ? 'page' : undefined}
                    >
                        {item}
                    </button>
                )
            )}

            {/* Next button */}
            <button
                className={`${styles.pageBtn} ${currentPage >= totalPages ? styles.disabled : ''}`}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label="Halaman berikutnya"
            >
                <span className={styles.arrow}>›</span>
            </button>
        </nav>
    );
}
