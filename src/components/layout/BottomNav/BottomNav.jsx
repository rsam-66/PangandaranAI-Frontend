"use client";

import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "@/store/uiSlice";
import styles from "./BottomNav.module.css";

const tabs = [
  {
    id: "home",
    label: "Home",
    path: "/home",
    iconLight: "/images/home-light.svg",
    iconTeal: "/images/home-teal.svg",
  },
  {
    id: "search",
    label: "Saved",
    path: "/search",
    iconLight: "/images/bookmark-light.svg",
    iconTeal: "/images/bookmark-teal.svg",
  },
  {
    id: "chatbot",
    label: "Chatbot",
    path: "/chatbot",
    iconLight: "/images/chatbot-light.svg",
    iconTeal: "/images/chatbot-teal.svg",
  },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.ui.activeTab);

  const handleTabClick = (tab) => {
    dispatch(setActiveTab(tab.id));
    router.push(tab.path);
  };

  // Determine active tab from pathname
  const currentTab =
    tabs.find((t) => pathname.startsWith(t.path))?.id || activeTab;

  return (
    <nav className={styles.bottomNav}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`${styles.tab} ${isActive ? styles.active : ""}`}
            onClick={() => handleTabClick(tab)}
            aria-label={tab.label}
          >
            <span className={styles.icon}>
              <img
                src={isActive ? tab.iconTeal : tab.iconLight}
                alt={tab.label}
                width={24}
                height={24}
              />
            </span>
            <span className={styles.label}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
