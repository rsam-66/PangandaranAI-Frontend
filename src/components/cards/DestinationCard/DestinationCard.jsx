"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { saveRoute, removeRoute } from "@/store/routeSlice";
import styles from "./DestinationCard.module.css";

/**
 * Destination card component for the horizontal scroll section.
 * Displays a thumbnail image, title, review count, and a save/bookmark button.
 * Navigates to the destination detail page on click.
 *
 * @param {Object} props
 * @param {Object} props.destination - Destination data (id, title, image, reviews)
 */
export default function DestinationCard({ destination }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const savedRoutes = useSelector((state) => state.routes.savedRoutes);
  const { id, title, image, reviews } = destination;

  /** Check if this destination is already saved */
  const isSaved = savedRoutes.some((r) => r.id === id);

  /** Format review count with 'k' suffix for thousands */
  const formatReviews = (count) => {
    if (count >= 1000) return `${(count / 1000).toFixed(0)}k ulasan`;
    return `${count} ulasan`;
  };

  /** Toggle save/unsave — stops event from navigating to detail page */
  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (isSaved) {
      dispatch(removeRoute(id));
    } else {
      dispatch(saveRoute(destination));
    }
  };

  /** Save destination data to sessionStorage so the detail page can access it,
   *  even for API-fetched destinations not present in static data. */
  const navigateToDetail = () => {
    sessionStorage.setItem(`dest_${id}`, JSON.stringify(destination));
    router.push(`/destination/${id}`);
  };

  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={navigateToDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigateToDetail();
      }}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={image || "/images/default-image.webp"}
          alt={title || "Destinasi"}
          fill
          sizes="160px"
          className={styles.image}
        />
        {/* Save/bookmark button */}
        <button
          className={`${styles.saveBtn} ${isSaved ? styles.saved : ""}`}
          onClick={handleSaveClick}
          aria-label={isSaved ? "Hapus dari rute" : "Simpan ke rute"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isSaved ? "currentColor" : "none"}
          >
            <path
              d="M19 21L12 16L5 21V5C5 3.9 5.9 3 7 3H17C18.1 3 19 3.9 19 5V21Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className={styles.info}>
        <h4 className={styles.title}>{title}</h4>
        <span className={styles.reviews}>{formatReviews(reviews)}</span>
      </div>
    </div>
  );
}
