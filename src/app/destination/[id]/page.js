'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { saveRoute, removeRoute } from '@/store/routeSlice';
import { destinations } from '@/data/destinations';
import { reviews, destinationFaqs } from '@/data/reviewsData';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import StickyBottomBar from '@/components/layout/StickyBottomBar/StickyBottomBar';
import styles from './page.module.css';

/**
 * Placeholder fallback for destinations not found in any data source.
 * Uses the URL ID to generate a human-readable title.
 */
function buildPlaceholder(id) {
    const title = id
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
        id,
        title,
        image: '/images/default-image.webp',
        description: 'Informasi tentang tempat ini belum tersedia. Silakan kunjungi lokasi secara langsung atau tanyakan kepada chatbot Pangandaran.ai untuk informasi lebih lanjut.',
        rating: 0,
        reviews: 0,
        photos: 0,
        price: null,
        location: null,
        address: null,
    };
}

export default function DestinationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState(false);
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);
    const savedRoutes = useSelector((state) => state.routes.savedRoutes);

    const isSaved = destination && savedRoutes.some((r) => r.id === destination.id);

    useEffect(() => {
        const id = params.id;

        // 1. Try static data first
        const staticMatch = destinations.find((d) => d.id === id);
        if (staticMatch) {
            setDestination(staticMatch);
            setLoading(false);
            return;
        }

        // 2. Try sessionStorage (set by DestinationCard before navigation)
        try {
            const cached = sessionStorage.getItem(`dest_${id}`);
            if (cached) {
                setDestination(JSON.parse(cached));
                setLoading(false);
                return;
            }
        } catch { /* sessionStorage unavailable — continue */ }

        // 3. Fallback: generate placeholder from URL ID
        setDestination(buildPlaceholder(id));
        setLoading(false);
    }, [params.id]);

    if (loading) {
        return (
            <div className="pageContent">
                <div className={styles.hero}>
                    <Skeleton width="100%" height="280px" borderRadius="0" />
                </div>
                <div className={styles.content} style={{ padding: 16 }}>
                    <Skeleton width="70%" height="24px" />
                    <Skeleton width="40%" height="14px" />
                    <Skeleton width="100%" height="80px" borderRadius="var(--radius-md)" />
                </div>
            </div>
        );
    }



    const handleToggleSave = () => {
        if (isSaved) {
            dispatch(removeRoute(destination.id));
        } else {
            dispatch(saveRoute(destination));
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: destination.title, url: window.location.href });
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const full = Math.floor(rating);
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < full ? styles.starFull : styles.starEmpty}>★</span>
            );
        }
        return stars;
    };

    const mapUrl = destination.location
        ? `https://www.google.com/maps?q=${destination.location.lat},${destination.location.lng}`
        : '#';

    return (
        <>
            <div className="pageContent">
                {/* Hero Image */}
                <div className={styles.hero}>
                    <div
                        className={styles.heroImage}
                        style={{
                            backgroundImage: `url(${destination.image || '/images/default-image.webp'})`,
                        }}
                    />
                    <div className={styles.heroNav}>
                        <button className={styles.navBtn} onClick={() => router.back()}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <button className={styles.navBtn} onClick={handleShare}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 6L12 2L8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 2V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        </button>
                    </div>
                </div>

                <div className={styles.content}>
                    {/* Title & Rating */}
                    <div className={styles.titleBlock}>
                        <div className={styles.titleRow}>
                            <h1 className={styles.title}>{destination.title}</h1>
                            <span className={styles.photoCountInline}>+{destination.photos || 0} Photos</span>
                        </div>
                        <div className={styles.ratingRow}>
                            <span className={styles.stars}>{renderStars(destination.rating || 0)}</span>
                            <span className={styles.reviewCount}>{destination.reviews} ulasan</span>
                        </div>
                    </div>

                    {/* Tentang */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Tentang</h3>
                        <p className={`${styles.description} ${expanded ? styles.expanded : ''}`}>
                            {destination.description || 'Informasi tentang tempat ini belum tersedia. Silakan kunjungi lokasi secara langsung atau tanyakan kepada chatbot Pangandaran.ai untuk informasi lebih lanjut.'}
                        </p>
                        <button
                            className={styles.readMore}
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? 'Tutup' : 'Read all'}
                        </button>
                    </section>

                    {/* Lokasi */}
                    {destination.location && (
                        <section className={styles.section}>
                            <div className={styles.locationHeader}>
                                <div>
                                    <h3 className={styles.sectionTitle}>Lokasi bepergian anda</h3>
                                    <p className={styles.locationSub}>Lihat lokasi di map</p>
                                </div>
                                <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={styles.openMapBtn}>
                                    Buka Map
                                </a>
                            </div>
                            {/* Address Card */}
                            <div className={styles.addressCard}>
                                <div className={styles.addressIcon}>📍</div>
                                <div>
                                    <p className={styles.addressName}>{destination.title}</p>
                                    {destination.address && (
                                        <p className={styles.addressDetail}>{destination.address}</p>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Photos */}
                    <section className={styles.section}>
                        <div className={styles.photoGrid}>
                            <div
                                className={styles.photoItem}
                                style={{ backgroundImage: `url(${destination.image || '/images/default-image.webp'})` }}
                            />
                            <div
                                className={styles.photoItem}
                                style={{ backgroundImage: `url(${destination.image || '/images/default-image.webp'})` }}
                            />
                        </div>
                        <button className={styles.outlineBtn}>
                            See all +{destination.photos || 0} photos
                        </button>
                    </section>

                    {/* Ulasan */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Ulasan</h3>
                        <p className={styles.ratingBig}>
                            {destination.rating || 0} <span className={styles.ratingTotal}>({destination.reviews} ulasan)</span>
                        </p>

                        <div className={styles.reviewList}>
                            {reviews.map((review) => (
                                <div key={review.id} className={styles.reviewCard}>
                                    <div className={styles.reviewHeader}>
                                        <div className={styles.reviewAvatar}>
                                            {review.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className={styles.reviewMeta}>
                                            <span className={styles.reviewName}>{review.name}</span>
                                            <span className={styles.reviewDate}>📅 {review.date}</span>
                                        </div>
                                    </div>
                                    <div className={styles.reviewStars}>{renderStars(review.rating)}</div>
                                    <p className={styles.reviewTitle}>{review.title}</p>
                                    <p className={styles.reviewText}>{review.text}</p>
                                </div>
                            ))}
                        </div>

                        <button className={styles.outlineBtn}>
                            See all +17 Reviews
                        </button>
                    </section>

                    {/* FAQ */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>F.A.Q Tentang {destination.title}</h3>
                        <div className={styles.faqList}>
                            {destinationFaqs.map((faq, i) => (
                                <div key={i} className={styles.faqItem}>
                                    <p className={styles.faqText}>{faq}</p>
                                </div>
                            ))}
                        </div>
                        <button className={styles.outlineBtn}>
                            Lihat Semua Pertanyaan
                        </button>
                    </section>
                </div>
            </div>

            <StickyBottomBar
                price={destination.price}
                ctaLabel={isSaved ? '✓ Tersimpan' : 'Simpan ke rute'}
                onCta={handleToggleSave}
            />
        </>
    );
}
