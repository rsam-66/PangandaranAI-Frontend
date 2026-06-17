# Comprehensive Black Box Testing Plan: Pangandaran.ai

This document outlines an exhaustive suite of black box tests for the Pangandaran.ai frontend application. It covers functional testing, edge cases, usability, and error handling from the end-user's perspective.

---

## 1. Authentication & Session Management

| ID | Test Case | Steps | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- |
| **AUTH-01** | Initial Token Generation | Open app in Incognito mode. Check Network tab. | `/api/proxy/auth` is called successfully. `pangandaran_auth_token` is saved in localStorage. | |
| **AUTH-02** | Token Persistence | Refresh the page multiple times. | No new `/auth` requests are made. The existing token in localStorage is reused. | |
| **AUTH-03** | Invalid Token Handling | Manually alter the token in localStorage to an invalid string, then refresh. | App should detect the 401 Unauthorized error from the backend and automatically request a new valid token. | |
| **AUTH-04** | Chat Session Creation | Navigate to Chatbot page. Click "New Chat". | A new session is created on the backend. The chat UI clears, ready for a new conversation. | |

---

## 2. Global Navigation (UI/UX)

| ID | Test Case | Steps | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- |
| **NAV-01** | Bottom Nav Routing | Click Home, Saved, Chatbot, and Profile sequentially. | URL updates correctly. Content changes instantly. Active icon is highlighted in teal. | |
| **NAV-02** | AppBar Back Button | From Home, go to a Destination Detail page, then click the top-left `<` (Back) button. | User is navigated back to the exact previous page (Home) without losing state. | |
| **NAV-03** | Mobile Responsiveness | Resize browser window to mobile width (375px) and tablet width (768px). | UI elements (cards, bottom nav, chat bubbles) scale correctly without horizontal scrolling or overlapping text. | |

---

## 3. Home Page Features

| ID | Test Case | Steps | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- |
| **HOME-01** | Category: Penginapan | Click "Penginapan" button on the hero card. | Navigates to `/home/destinations?category=hotel`. Shows hotel data. | |
| **HOME-02** | Category: Rute | Click "Rute" button. | Navigates to `/home/destinations?category=tempat-penting`. Shows route data. | |
| **HOME-03** | Category: Wisata | Click "Wisata" button. | Navigates to `/home/destinations?category=wisata`. Shows tourist spots. | |
| **HOME-04** | Save Destination | Click the bookmark icon on a popular destination card. | Icon fills. Data is saved to the Redux store. Navigating to the "Saved" tab shows this destination. | |
| **HOME-05** | Unsave Destination | Click a filled bookmark icon on the home page. | Icon hollows out. Destination is removed from the "Saved" tab. | |
| **HOME-06** | "Lihat Semua" Link | Click "Lihat Semua" next to Popular Destinations. | Navigates to the full grid view (`/home/destinations`). | |
| **HOME-07** | Recent Route Display | View the bottom of the home page. | "Rute Terakhir Dikunjungi" displays the most recently interacted/viewed static route. | |

---

## 4. Search & Filtering System

| ID | Test Case | Steps | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- |
| **SRCH-01** | Standard Search | Type "pantai" and press Enter. | URL becomes `?q=pantai`. Title says `Hasil: "pantai"`. Results are filtered to match. | |
| **SRCH-02** | Case Insensitivity | Search for "PAnTAi". | Should return the exact same results as "pantai". | |
| **SRCH-03** | Empty Search | Submit an empty search bar. | Ignores submission, stays on current page. | |
| **SRCH-04** | Whitespace Search | Type "   " (only spaces) and submit. | Ignores submission or strips whitespace and treats as empty. | |
| **SRCH-05** | No Results Found | Search for "Gunung Everest". | Grid displays "Tidak ditemukan 'Gunung Everest'". No crash. | |
| **SRCH-06** | Long String Search | Search for a 200-character random string. | UI handles long text gracefully. Shows "Tidak ditemukan..." without breaking the layout. | |
| **SRCH-07** | XSS Prevention | Type `<script>alert(1)</script>` into search and submit. | The text is treated as a literal string. No alert box appears. React escapes the input safely. | |

---

## 5. Destination Detail Page

| ID | Test Case | Steps | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- |
| **DTL-01** | Data Rendering | Click a destination card. Observe the detail page. | Title, hero image, description, rating (stars), and review count render correctly. | |
| **DTL-02** | Save from Detail | Click "Simpan ke Rute" on the detail page. | Button state changes to "Tersimpan". Redux state updates. | |
| **DTL-03** | Missing Image Fallback | Force the API to return a destination with `image_url: null`. | Page uses `/images/default-image.webp` instead of showing a broken image link. | |
| **DTL-04** | Map Redirection | Click "Lihat di Peta". | Opens Google Maps (or relevant map service) in a new tab using the destination coordinates/URL. | |

---

## 6. Chatbot Assistant (Pangandaran.ai)

| ID | Test Case | Steps | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- |
| **CHAT-01** | Standard Q&A | Type "Di mana letak Pantai Pangandaran?" and send. | Message appears on the right. Loading dot animation appears. Bot replies on the left. | |
| **CHAT-02** | Markdown Parsing | Trigger a bot response containing bold text (`**text**`) and lists (`- item`). | Bot bubble renders actual bold text and bullet points, not raw asterisks. | |
| **CHAT-03** | Auto-Link Detection | Trigger a response containing `https://mypangandaran.com`. | URL is rendered as a clickable blue link that opens in a new tab (`target="_blank"`). | |
| **CHAT-04** | Prompt Templates | On a new chat, click the "Rekomendasi Pantai" chip. | The text populates the input and sends automatically. | |
| **CHAT-05** | Send via Enter Key | Type a message and press the `Enter` key on the keyboard. | Message sends. (Shift+Enter should add a new line, if supported). | |
| **CHAT-06** | Rapid Fire Inputs | Type and click Send 5 times very rapidly. | App disables the send button while loading to prevent duplicate API spamming, or queues them safely. | |
| **CHAT-07** | Long Chat Scroll | Send enough messages to fill the screen. | The chat container becomes scrollable. Sending a new message auto-scrolls to the bottom. | |
| **CHAT-08** | Session History Switch | Open the sidebar menu, click a chat from yesterday. | The main chat window replaces current messages with the history of the selected session. | |

---

## 7. Speech-to-Text (Mic Input)

| ID | Test Case | Steps | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- |
| **MIC-01** | Happy Path | Click Mic icon, allow browser permission, say "Halo", click Mic again to stop. | "Halo" appears in the chat input box. | |
| **MIC-02** | Permission Denied | Block microphone access in browser settings, then click Mic. | App shows an alert or UI message indicating microphone access is denied. Doesn't crash. | |
| **MIC-03** | Continuous Listening | Click Mic, speak a long sentence over 10 seconds. | Input box updates dynamically as the user speaks. | |

---

## 8. Error Handling & Edge Cases

| ID | Test Case | Steps | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- |
| **ERR-01** | Backend Offline (Data) | Stop backend server. Navigate to `/home/destinations`. | UI shows static fallback data without crashing. A warning is logged in the console. | |
| **ERR-02** | Backend Offline (Chat) | Stop backend server. Send a chat message. | Bot responds with a generic error bubble (e.g., "Maaf, sistem sedang sibuk"). App does not crash. | |
| **ERR-03** | 404 Page Not Found | Manually type a non-existent URL: `/home/xyz123`. | App displays a custom or Next.js default 404 Not Found page, retaining the app layout. | |
| **ERR-04** | Network Timeout | Throttling network to "Slow 3G" in DevTools, fetch destinations. | Loading text/spinner ("Memuat data...") is visible until the slow request finishes. | |
