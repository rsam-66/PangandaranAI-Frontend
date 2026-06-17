"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./AppBar.module.css";

export default function AppBar({
  title = "Pangandaran.ai",
  showBack = false,
  onBack,
  rightAction,
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header className={`${styles.appBar} ${showBack ? styles.appBarBack : ""}`}>
      <div className={styles.left}>
        {showBack ? (
          <button
            className={styles.backBtn}
            onClick={handleBack}
            aria-label="Go back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <div className={styles.spacer} />
        )}
      </div>

      {/* Center logo or title */}
      <div className={styles.center}>
        {showBack ? (
          title && <h1 className={styles.title}>{title}</h1>
        ) : (
          <Image
            src="/images/logo_green.svg"
            alt="Pangandaran.ai"
            width={140}
            height={32}
            priority
            className={styles.logoImage}
          />
        )}
      </div>

      {/* <div className={styles.right}>
                {rightAction || (
                    <button className={styles.iconBtn} aria-label="Notifications">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
            </div> */}
    </header>
  );
}
