# Pangandaran.ai — Full Project Documentation

Complete record from initiation to deployment.

---

## 1. Timeline

| Phase | Date | What Happened |
|---|---|---|
| **Planning** | Mar 11 | Analyzed requirements, reviewed previous chatbot project, generated UI mockup, wrote implementation plan |
| **Design Analysis** | Mar 11 | Received mobile design from management, identified 10 screens, 16 components, extracted color palette and typography |
| **Project Setup** | Mar 11 | User initialized Next.js 16 with App Router, installed Redux Toolkit + React-Redux |
| **Implementation** | Mar 12 | Built all 60 source files — design system, Redux store, components, pages, API routes |
| **Deployment Setup** | Mar 15 | Created Dockerfile, configured for HF Spaces, pushed to Hugging Face |

---

## 2. Planning Phase

### 2.1 Requirements

| Requirement | Detail |
|---|---|
| **Role** | Frontend Developer |
| **App Type** | LLM-RAG tourism chatbot for Pangandaran, West Java |
| **Framework** | Next.js (App Router) |
| **State** | Redux Toolkit |
| **Design** | Mobile-first (430px), centered on desktop as a phone frame |
| **Language** | Indonesian (Bahasa Indonesia) |

### 2.2 Design Analysis

Received a mobile design from upper management showing 10 screens:

| Screen | Key Elements |
|---|---|
| Splash | Full-bleed background, logo, tagline, CTA button |
| Home | Welcome card, category pills, destination carousel, recent route |
| Chatbot (Welcome) | Bot greeting, 5 template prompt cards |
| Chatbot (Conversation) | User/bot bubbles, typing indicator |
| Chatbot (Rich Response) | Horizontal destination cards inside chat |
| Search / Saved Routes | Search bar, saved route cards with ratings |
| Destination Detail | Hero image, description, map, sticky bottom bar |
| Profile | Avatar with initials, menu items, logout |

**Color palette extracted**: Light theme, primary teal `#00897B`, backgrounds `#FFFFFF`/`#F5F5F5`, text `#212121`/`#757575`.

---

## 3. Project Setup

### 3.1 Commands Run (by user)

```bash
npx create-next-app@latest ./
npm install @reduxjs/toolkit react-redux
```

### 3.2 Final Dependencies

```json
{
  "dependencies": {
    "@reduxjs/toolkit": "^2.11.2",
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-redux": "^9.2.0"
  },
  "devDependencies": {
    "babel-plugin-react-compiler": "1.0.0",
    "eslint": "^9",
    "eslint-config-next": "16.1.6"
  }
}
```

---

## 4. Implementation — File by File

### 4.1 Design System

#### [globals.css](file:///c:/src/pangandaran-ai_chatbot/src/app/globals.css) — Design tokens + reset

**What changed**: Replaced Next.js default CSS with full design system.

```diff
- :root { --background: #ffffff; --foreground: #171717; }
- @media (prefers-color-scheme: dark) { ... }
+ :root {
+   --primary: #00897B;
+   --bg-primary: #FFFFFF;
+   --bg-surface: #F5F5F5;
+   --text-primary: #212121;
+   --radius-md: 12px;
+   --space-md: 16px;
+   ... 30+ tokens
+ }
+ .appWrapper { ... mobile container centering ... }
+ .mobileContainer { max-width: 430px; box-shadow: ... }
+ @keyframes fadeIn, slideUp, slideInLeft, slideInRight, pulse
```

---

#### [layout.js](file:///c:/src/pangandaran-ai_chatbot/src/app/layout.js) — Root layout

**What changed**: Replaced Geist font with Inter, added StoreProvider and mobile container wrapper.

```diff
- import { Geist, Geist_Mono } from "next/font/google";
+ import { Inter } from 'next/font/google';
+ import StoreProvider from '@/store/StoreProvider';

  export default function RootLayout({ children }) {
    return (
-     <html lang="en">
-       <body>{children}</body>
+     <html lang="id">
+       <body>
+         <StoreProvider>
+           <div className="appWrapper">
+             <div className="mobileContainer">
+               {children}
+             </div>
+           </div>
+         </StoreProvider>
+       </body>
      </html>
    );
  }
```

---

### 4.2 Redux Store (7 files)

| File | Purpose | Key State |
|---|---|---|
| [store.js](file:///c:/src/pangandaran-ai_chatbot/src/store/store.js) | Combines 5 slices into one store | — |
| [StoreProvider.jsx](file:///c:/src/pangandaran-ai_chatbot/src/store/StoreProvider.jsx) | `"use client"` wrapper — bridges Server Components ↔ Redux | — |
| [chatSlice.js](file:///c:/src/pangandaran-ai_chatbot/src/store/chatSlice.js) | Chat conversation | `messages[]`, `loading`, `error` |
| [historySlice.js](file:///c:/src/pangandaran-ai_chatbot/src/store/historySlice.js) | Chat session history | `sessions[]` → localStorage |
| [faqSlice.js](file:///c:/src/pangandaran-ai_chatbot/src/store/faqSlice.js) | FAQ category filter | `categories[]`, `selectedCategory` |
| [routeSlice.js](file:///c:/src/pangandaran-ai_chatbot/src/store/routeSlice.js) | Saved destinations | `savedRoutes[]` → localStorage |
| [uiSlice.js](file:///c:/src/pangandaran-ai_chatbot/src/store/uiSlice.js) | UI toggles | `activeTab`, `sidebarOpen` |

**Actions created:**

| Slice | Actions |
|---|---|
| `chatSlice` | [addUserMessage(text)](file:///c:/src/pangandaran-ai_chatbot/src/store/chatSlice.js#26-35), [clearMessages()](file:///c:/src/pangandaran-ai_chatbot/src/store/chatSlice.js#35-39), [setError(msg)](file:///c:/src/pangandaran-ai_chatbot/src/store/chatSlice.js#39-42), `sendMessage()` (async thunk) |
| `historySlice` | [createSession()](file:///c:/src/pangandaran-ai_chatbot/src/store/historySlice.js#13-24), [switchSession(id)](file:///c:/src/pangandaran-ai_chatbot/src/store/historySlice.js#24-27), [deleteSession(id)](file:///c:/src/pangandaran-ai_chatbot/src/store/historySlice.js#27-34), [updateSessionTitle()](file:///c:/src/pangandaran-ai_chatbot/src/store/historySlice.js#34-42), [saveSessionMessages()](file:///c:/src/pangandaran-ai_chatbot/src/store/historySlice.js#42-50) |
| `faqSlice` | [selectCategory(id)](file:///c:/src/pangandaran-ai_chatbot/src/store/faqSlice.js#11-14), [clearCategory()](file:///c:/src/pangandaran-ai_chatbot/src/store/faqSlice.js#14-17) |
| `routeSlice` | [saveRoute(dest)](file:///c:/src/pangandaran-ai_chatbot/src/store/routeSlice.js#13-24), [removeRoute(id)](file:///c:/src/pangandaran-ai_chatbot/src/store/routeSlice.js#24-28), [markVisited(id)](file:///c:/src/pangandaran-ai_chatbot/src/store/routeSlice.js#28-35) |
| `uiSlice` | [setActiveTab(id)](file:///c:/src/pangandaran-ai_chatbot/src/store/uiSlice.js#10-13), [toggleSidebar()](file:///c:/src/pangandaran-ai_chatbot/src/store/uiSlice.js#13-16), [closeSidebar()](file:///c:/src/pangandaran-ai_chatbot/src/store/uiSlice.js#16-19) |

---

### 4.3 Components (16 components, 32 files)

#### Layout Components

| Component | File | What It Renders |
|---|---|---|
| [AppBar](file:///c:/src/pangandaran-ai_chatbot/src/components/layout/AppBar/AppBar.jsx) | + [.module.css](file:///c:/src/pangandaran-ai_chatbot/src/app/page.module.css) | Teal header — logo mode (🌊 Pangandaran.ai) or back-arrow mode |
| [BottomNav](file:///c:/src/pangandaran-ai_chatbot/src/components/layout/BottomNav/BottomNav.jsx) | + [.module.css](file:///c:/src/pangandaran-ai_chatbot/src/app/page.module.css) | 4-tab nav bar with SVG icons (Home, Search, Chatbot, Profile) |
| [StickyBottomBar](file:///c:/src/pangandaran-ai_chatbot/src/components/layout/StickyBottomBar/StickyBottomBar.jsx) | + [.module.css](file:///c:/src/pangandaran-ai_chatbot/src/app/page.module.css) | Price in IDR + teal CTA button (destination detail) |

#### Chat Components

| Component | File | What It Renders |
|---|---|---|
| [ChatBubbleBot](file:///c:/src/pangandaran-ai_chatbot/src/components/chat/ChatBubbleBot/ChatBubbleBot.jsx) | + [.module.css](file:///c:/src/pangandaran-ai_chatbot/src/app/page.module.css) | White left-aligned bubble + avatar. Parses `**bold**` and `•` bullets |
| [ChatBubbleUser](file:///c:/src/pangandaran-ai_chatbot/src/components/chat/ChatBubbleUser/ChatBubbleUser.jsx) | + [.module.css](file:///c:/src/pangandaran-ai_chatbot/src/app/page.module.css) | Teal right-aligned bubble |
| [TemplatePromptCard](file:///c:/src/pangandaran-ai_chatbot/src/components/chat/TemplatePromptCard/TemplatePromptCard.jsx) | + [.module.css](file:///c:/src/pangandaran-ai_chatbot/src/app/page.module.css) | FAQ suggestion card with teal bullet + staggered animation |
| [MessageInput](file:///c:/src/pangandaran-ai_chatbot/src/components/chat/MessageInput/MessageInput.jsx) | + [.module.css](file:///c:/src/pangandaran-ai_chatbot/src/app/page.module.css) | Auto-growing textarea + mic/attach/send icons |
| [DestinationCarousel](file:///c:/src/pangandaran-ai_chatbot/src/components/chat/DestinationCarousel/DestinationCarousel.jsx) | + [.module.css](file:///c:/src/pangandaran-ai_chatbot/src/app/page.module.css) | Horizontal scrollable destination cards in chat |

#### Card Components

| Component | File | What It Renders |
|---|---|---|
| [WelcomeCard](file:///c:/src/pangandaran-ai_chatbot/src/components/cards/WelcomeCard/WelcomeCard.jsx) | + [.module.css](file:///c:/src/pangandaran-ai_chatbot/src/app/page.module.css) | Teal gradient hero with greeting + 3 quick-action buttons |
| [DestinationCard](file:///c:/src/pangandaran-ai_chatbot/src/components/cards/DestinationCard/DestinationCard.jsx) | + [.module.css](file:///c:/src/pangandaran-ai_chatbot/src/app/page.module.css) | Vertical image card (title + reviews) |
| [SavedRouteCard](file:///c:/src/pangandaran-ai_chatbot/src/components/cards/SavedRouteCard/SavedRouteCard.jsx) | + [.module.css](file:///c:/src/pangandaran-ai_chatbot/src/app/page.module.css) | Horizontal card (thumbnail + stars + visit badge) |

#### UI Primitives

| Component | File | What It Renders |
|---|---|---|
| [CategoryPill](file:///c:/src/pangandaran-ai_chatbot/src/components/ui/CategoryPill/CategoryPill.jsx) | + [.module.css](file:///c:/src/pangandaran-ai_chatbot/src/app/page.module.css) | Toggle pill button (outlined ↔ filled) |
| [SearchBar](file:///c:/src/pangandaran-ai_chatbot/src/components/ui/SearchBar/SearchBar.jsx) | + [.module.css](file:///c:/src/pangandaran-ai_chatbot/src/app/page.module.css) | Search input + icon + clear button |
| [MapPreview](file:///c:/src/pangandaran-ai_chatbot/src/components/ui/MapPreview/MapPreview.jsx) | + [.module.css](file:///c:/src/pangandaran-ai_chatbot/src/app/page.module.css) | Coordinates display + Google Maps link |

#### Profile Components

| Component | File | What It Renders |
|---|---|---|
| [ProfileAvatar](file:///c:/src/pangandaran-ai_chatbot/src/components/profile/ProfileAvatar/ProfileAvatar.jsx) | + [.module.css](file:///c:/src/pangandaran-ai_chatbot/src/app/page.module.css) | Circle with initials + name |
| [ProfileMenuItem](file:///c:/src/pangandaran-ai_chatbot/src/components/profile/ProfileMenuItem/ProfileMenuItem.jsx) | + [.module.css](file:///c:/src/pangandaran-ai_chatbot/src/app/page.module.css) | Icon + label + chevron (red variant for logout) |

---

### 4.4 Pages (6 pages, 12 files)

| Route | File | Components Used | Redux |
|---|---|---|---|
| `/` | [page.js](file:///c:/src/pangandaran-ai_chatbot/src/app/page.js) | None (standalone) | — |
| `/home` | [page.js](file:///c:/src/pangandaran-ai_chatbot/src/app/home/page.js) | AppBar, BottomNav, WelcomeCard, CategoryPill, DestinationCard, SavedRouteCard | reads `faqSlice` |
| `/chatbot` | [page.js](file:///c:/src/pangandaran-ai_chatbot/src/app/chatbot/page.js) | AppBar, BottomNav, ChatBubbleBot, ChatBubbleUser, TemplatePromptCard, MessageInput, DestinationCarousel | reads/writes `chatSlice` |
| `/search` | [page.js](file:///c:/src/pangandaran-ai_chatbot/src/app/search/page.js) | AppBar, BottomNav, SearchBar, SavedRouteCard | reads `routeSlice` |
| `/destination/[id]` | [page.js](file:///c:/src/pangandaran-ai_chatbot/src/app/destination/%5Bid%5D/page.js) | AppBar, StickyBottomBar, MapPreview | writes `routeSlice` |
| `/profile` | [page.js](file:///c:/src/pangandaran-ai_chatbot/src/app/profile/page.js) | AppBar, BottomNav, ProfileAvatar, ProfileMenuItem | — |

---

### 4.5 API Routes (2 files)

| Endpoint | File | Method | What It Does |
|---|---|---|---|
| `/api/chat` | [route.js](file:///c:/src/pangandaran-ai_chatbot/src/app/api/chat/route.js) | POST | Mock RAG — keyword matching on user message → returns `{ content, destinations? }` with 1s delay |
| `/api/faqs` | [route.js](file:///c:/src/pangandaran-ai_chatbot/src/app/api/faqs/route.js) | GET | Returns FAQ categories + template prompts from static data |

---

### 4.6 Services, Data, Utilities (5 files)

| File | Functions |
|---|---|
| [api.js](file:///c:/src/pangandaran-ai_chatbot/src/services/api.js) | [sendChatMessage(messages)](file:///c:/src/pangandaran-ai_chatbot/src/services/api.js#8-27), [fetchFAQs()](file:///c:/src/pangandaran-ai_chatbot/src/services/api.js#28-41), [fetchDestination(id)](file:///c:/src/pangandaran-ai_chatbot/src/services/api.js#42-56) |
| [faqData.js](file:///c:/src/pangandaran-ai_chatbot/src/data/faqData.js) | Exports `faqCategories` (5 cats) + `templatePrompts` (5 prompts) |
| [destinations.js](file:///c:/src/pangandaran-ai_chatbot/src/data/destinations.js) | Exports `destinations` (7 destination objects) |
| [localStorage.js](file:///c:/src/pangandaran-ai_chatbot/src/utils/localStorage.js) | [loadFromStorage()](file:///c:/src/pangandaran-ai_chatbot/src/utils/localStorage.js#6-15), [saveToStorage()](file:///c:/src/pangandaran-ai_chatbot/src/utils/localStorage.js#16-24), [removeFromStorage()](file:///c:/src/pangandaran-ai_chatbot/src/utils/localStorage.js#25-33) |
| [formatDate.js](file:///c:/src/pangandaran-ai_chatbot/src/utils/formatDate.js) | [formatTimestamp()](file:///c:/src/pangandaran-ai_chatbot/src/utils/formatDate.js#5-12), [formatDate()](file:///c:/src/pangandaran-ai_chatbot/src/utils/formatDate.js#13-21), [formatRelativeDate()](file:///c:/src/pangandaran-ai_chatbot/src/utils/formatDate.js#22-36) |

---

## 5. Deployment Setup (Docker + HF Spaces)

### 5.1 Files Created

#### [Dockerfile](file:///c:/src/pangandaran-ai_chatbot/Dockerfile)

Multi-stage build for minimal production image:

| Stage | What It Does |
|---|---|
| `deps` | Installs `node_modules` from `package-lock.json` |
| `builder` | Copies source + `node_modules`, runs `npm run build` |
| `runner` | Copies only standalone output + `public/` + `.next/static/`. Runs as non-root user on port 7860 |

#### [.dockerignore](file:///c:/src/pangandaran-ai_chatbot/.dockerignore)

Excludes `node_modules`, `.next`, `.git`, `*.md`, `.env*.local` from Docker context.

#### [README.md](file:///c:/src/pangandaran-ai_chatbot/README.md)

YAML frontmatter for HF Spaces:
```yaml
sdk: docker
app_port: 7860
colorFrom: green
colorTo: green
emoji: 🌊
```

#### [next.config.mjs](file:///c:/src/pangandaran-ai_chatbot/next.config.mjs)

```diff
  const nextConfig = {
    reactCompiler: true,
+   output: 'standalone',     // Minimal server for Docker
+   compress: true,            // Gzip
+   images: { unoptimized: true, formats: ['image/webp'] },
  };
```

### 5.2 HF Spaces Deployment Steps

1. Created Space at `huggingface.co/spaces/rsam-66/tourism_chatbot_website`
2. Selected **Docker** SDK → **Blank** template → **CPU Basic** (Free)
3. Pushed code via Git:
   ```bash
   git remote add space https://huggingface.co/spaces/rsam-66/tourism_chatbot_website
   git push space master:main --force
   ```
4. Fixed `colorFrom: teal` → `green` (HF validation error)
5. Live at: **`https://rsam-66-tourism-chatbot-website.hf.space`**

---

## 6. Final File Count

| Category | JS/JSX | CSS | Total |
|---|---|---|---|
| Pages | 6 | 6 | 12 |
| Components | 16 | 16 | 32 |
| Store | 7 | — | 7 |
| API Routes | 2 | — | 2 |
| Services | 1 | — | 1 |
| Data | 2 | — | 2 |
| Utils | 2 | — | 2 |
| Config | 1 | 1 | 2 |
| Deploy | — | — | 2 |
| **Total** | **37** | **23** | **62** |

---

## 7. User Changes

| Change | File | What Was Modified |
|---|---|---|
| Profile name | [profile/page.js](file:///c:/src/pangandaran-ai_chatbot/src/app/profile/page.js) | `"Andy Maulana Yusuf"` → `"Lorem Ipsum"` |
