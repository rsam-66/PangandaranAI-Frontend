"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./WelcomeCard.module.css";

/**
 * WelcomeCard — hero section on the home page.
 * Contains a working search bar and category filter buttons.
 * Search navigates to /home/destinations?q=...
 * Category buttons navigate to /home/destinations?category=...
 *
 * @param {Object} props
 * @param {string} [props.userName] - User's name for personalized greeting (optional)
 */
export default function WelcomeCard({ userName = "" }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const greeting = userName
    ? `Hai, selamat datang ${userName}`
    : "Hai, selamat datang";

  /** Navigate to destinations page with search query */
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/home/destinations?q=${encodeURIComponent(query.trim())}`);
    }
  };

  /** Navigate to destinations page filtered by category */
  const handleCategory = (category) => {
    router.push(`/home/destinations?category=${category}`);
  };

  return (
    <div className={styles.card}>
      {/* Background covering entire card — uses <Image priority> for LCP preloading */}
      <div className={styles.bgImage}>
        <Image
          src="/images/beach-image.webp"
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={60}
          sizes="430px"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      </div>
      <div className={styles.overlay} />

      {/* Text area */}
      <div className={styles.imageArea}>
        <div className={styles.textContent}>
          <h2 className={styles.greeting}>
            <span>{greeting}</span>
            <br />
            <strong>di Pangandaran.ai</strong>
          </h2>
          <p className={styles.tagline}>Teman Pintar Jelajah Pangandaran</p>
        </div>
      </div>

      {/* Search bar — real input */}
      <form className={styles.searchBar} onSubmit={handleSearch} role="search">
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Cari wisata, penginapan, restoran ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className={styles.searchButton} aria-label="Cari">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#333" strokeWidth="2" />
            <path
              d="M21 21L16.5 16.5"
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </form>

      {/* Category buttons */}
      <div className={styles.categoryRow}>
        <button
          className={styles.categoryBtn}
          onClick={() => handleCategory("hotel")}
        >
          <img
            src="/images/penginapan-icon.svg"
            alt=""
            className={styles.categoryIcon}
          />
          <span>Penginapan</span>
        </button>
        <button
          className={styles.categoryBtn}
          onClick={() => handleCategory("tempat-penting")}
        >
          <img
            src="/images/destinasi-icon.svg"
            alt=""
            className={styles.categoryIcon}
          />
          <span>Rute</span>
        </button>
        <button
          className={styles.categoryBtn}
          onClick={() => handleCategory("wisata")}
        >
          <img
            src="/images/hiburan-icon.svg"
            alt=""
            className={styles.categoryIcon}
          />
          <span>Wisata</span>
        </button>
      </div>
    </div>
  );
}
