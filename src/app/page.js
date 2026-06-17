'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';

export default function SplashPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // If the user has already seen the splash this session (e.g. they refreshed),
    // skip straight to /home without replaying the animation.
    if (sessionStorage.getItem('hasSeenSplash')) {
      router.replace('/home');
      return;
    }

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  const handleStart = () => {
    sessionStorage.setItem('hasSeenSplash', '1');
    router.push('/home');
  };

  return (
    <div className={styles.wrapper}>
      {/* Splash Screen */}
      <div className={`${styles.splashScreen} ${!showSplash ? styles.splashHidden : ''}`}>
        <div className={styles.splashContent}>
          <Image
            src="/images/logo_white.svg"
            alt="Pangandaran.ai"
            width={260}
            height={80}
            priority
            className={styles.splashLogoImage}
          />
        </div>
      </div>

      {/* Get Started Screen */}
      <div className={`${styles.splash} ${showSplash ? styles.getStartedHidden : ''}`}>
        <div className={styles.bgImage}>
          <Image
            src="/images/get-started.webp"
            alt=""
            fill
            priority
            sizes="430px"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
        <div className={styles.overlay} />

        <div className={styles.content}>
          <div className={styles.logoArea}>
            <Image
              src="/images/logo_white.svg"
              alt="Pangandaran.ai"
              width={240}
              height={73}
              priority
              className={styles.logoImage}
            />
          </div>

          <div className={styles.bottomCard}>
            <h2 className={styles.tagline}>
              <em>Teman Pintar Jelajah</em>
              <br />
              <strong>Pangandaran</strong>
            </h2>
            <button className={styles.cta} onClick={handleStart}>
              Mulai Percakapan
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

