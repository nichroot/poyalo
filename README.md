<div align="center">

# POYALO (പോയാലോ?)

### *Story-First Travel Companion • Comic-Book Lore, Deterministic Trip Validation & 3D WebGL World*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-poyaloo.vercel.app-1B3FFF?style=for-the-badge&logo=vercel&logoColor=white)](https://poyaloo.vercel.app)
[![Platform](https://img.shields.io/badge/Platform-Mobile--First%20PWA-10B981?style=for-the-badge&logo=pwa&logoColor=white)](https://poyaloo.vercel.app)
[![3D Engine](https://img.shields.io/badge/3D%20Engine-Three.js%20WebGL-FF5722?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Styling](https://img.shields.io/badge/UI-Neo--Brutalist%20Comic%20Strips-FBBF24?style=for-the-badge&logoColor=111827)](./docs/DESIGN_SYSTEM.md)
[![License](https://img.shields.io/badge/License-MIT-111827?style=for-the-badge)](#license)

<br />

<img src="./public/cover.png" alt="POYALO Hero Banner" width="100%" style="border-radius: 16px; border: 2.5px solid #111827; box-shadow: 6px 6px 0px #111827;" />

<br /><br />

> *"Every place has a comic story. Every plan gets a reality check. Every journey has a 3D world to explore."*

</div>

---

## 🧭 Overview

**POYALO** (*"Shall we go?"* in Malayalam) is an offline-first, story-driven travel Progressive Web Application (PWA). POYALO pairs graphic-novel lore, deterministic client-side itinerary validation, immigration compliance automation, and an interactive 3D WebGL exploration world.

Traditional travel apps fall into two traps: boring spreadsheet itineraries that hallucinate impossible transit times, and dry Wikipedia-style tourism text that travelers skip. 

POYALO flips this paradigm:
1. **Stories are Comics:** History is told through multi-panel graphic novel strips with 4 personality tone dials (Roast, Professor, Storyteller, Kid) and era time-travel sliders.
2. **Plans are Reality-Checked:** Code-based deterministic validation checks operating hours, transit physics, solar golden hours, and the strict 180-day passport validity rule locally in under 50ms.
3. **Destinations are Explorables:** A 320m × 320m in-browser 3D WebGL sandbox lets travelers scout landmarks, discover cultural relics, and parkour across monuments before packing their bags.

---

## 🌐 Live Production & Demo

- **Production App:** [https://poyaloo.vercel.app](https://poyaloo.vercel.app)
- **GitHub Repository:** [https://github.com/nichroot/poyalo](https://github.com/nichroot/poyalo)
- **Installable PWA:** Open on iOS Safari (*"Add to Home Screen"*) or Android Chrome (*"Install App"*) for a native 60fps offline experience.

---

## ⚡ The Five Core Pillars

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           POYALO PWA                                             │
├──────────────────────────────────┬────────────────────────────────┬──────────────────────────────┤
│         PLAN & VERIFY            │        STORY & CULTURE         │       3D WORLD & PLAY        │
├──────────────────────────────────┼────────────────────────────────┼──────────────────────────────┤
│ • AI Multi-Day Trip Planner      │ • Graphic-Novel Comic Box      │ • 320m x 320m 3D WebGL World │
│ • Deterministic Reality Check    │ • 4 Tone Dials (Roast/Kid/...) │ • Multi-Touch Touch Joystick │
│ • SunCalc Golden Hour Physics    │ • Era Time Machine (1800s/Now) │ • Responsive Jump Buffer     │
│ • 180-Day Passport Widget        │ • Web Speech & Audio Synth     │ • Turbo Dash Sprint (3.5s)   │
│ • Reactive Boarding Pass Studio  │ • Cultural Myth Pointer        │ • Landmark Discovery (+150P) │
│ • Visa Compatibility Matcher     │ • "Suggest Myth to Admin" Form │ • Procedural 3D Monuments    │
│ • 30-Second Visa Stress Quiz     │ • Worldwide City Databases     │ • Day / Sunset / Night Light │
└──────────────────────────────────┴────────────────────────────────┴──────────────────────────────┘
```

### 1. 🤖 AI Multi-Day Planner & Deterministic Reality Check
- **Global Destination Support:** Prompts for any destination worldwide (*"3 days in Tokyo"*, *"Weekend in Paris"*, *"4 days in Rome"*, *"Dubai Heritage Trail"*).
- **Zero API Key Leakage:** Client code runs completely key-free with zero bundling of API secrets. Connects to serverless edge functions or falls back seamlessly to the built-in deterministic engine.
- **SunCalc Solar Physics:** Automatically calculates local sunset golden-hour times and highlights scenic sunset spots in the daily timeline.
- **1-Click Entry Verification:** Direct link into immigration validation for the destination country.

### 2. 🎨 Graphic-Novel Comic Story Box
- **Graphic Novel Visuals:** Hard black borders (`2.5px solid #111827`), neo-brutalist offset drop shadows (`4px 4px 0px #111827`), speech bubbles with directional tails, narrative caption boxes, and sound decals (`"SWOOSH!"`, `"YALLA!"`, `"KAPOW!"`).
- **4-Way Tone Dial:**
  - 🎓 **Professor:** Archival schematics, trade history, and rigorous chronological facts.
  - 🎬 **Storyteller:** Cinematic prose, dramatic noir lighting, and character-driven drama.
  - 🔥 **Roast:** Witty satire exposing tourist traps, overhyped queues, and cultural ironies.
  - 🧒 **Kid:** Fun Saturday-morning cartoon strips with adventurous mascots.
- **Era Time Machine:** Shift between Ancient/Heritage (1800s), Golden Era (1950s), and Modern Cyber eras to see how landmarks evolved.
- **Voice Narration & Web Audio Synth:** Real-time speech synthesis reads comic panels aloud with modulated character voice pitch and custom audio effects.

### 3. 💡 Cultural Myth Pointer
- **Worldwide Myth Debunking:** Unpacks travel myths vs local realities across Tokyo, Paris, Rome, Dubai, Bangkok, New York, and worldwide destinations.
- **Categorized Insight Chips:** Cultural etiquette, financial norms, culinary customs, and safety tips.
- **"Suggest Myth to Admin" Modal:** Travelers can submit new local myths directly to the platform with local persistence and queued review.

### 4. 🎮 "VG World" 3D WebGL Metaverse
- **In-Browser Three.js Engine:** Zero plugins, instant loading on mobile and desktop browsers.
- **Mobile Multi-Touch Ergonomics:**
  - **Virtual Touch Joystick:** 128px outer base, 56px thumb target ($\ge 48\text{px}$ invariant), 8px dead zone, active glow scaling, and 4-way directional indicators (▲▼◀▶).
  - **Independent Jump Buffer:** 240ms jump buffer allows simultaneous running, turning, and jumping on phones with zero dropped inputs.
  - **Turbo Dash (`⚡ DASH`):** On-screen mobile sprint button (or `Shift` on desktop) providing a 3.5s 1.8x speed surge with cartoon sound effects.
- **Procedural Architectural Landmarks:**
  - *Burj Khalifa:* 6 tiered setback towers, cyan glowing LED balcony rings, entrance glass lobby, and a pulsating red aircraft warning beacon.
  - *Dubai Frame:* Gold lattice diagonal crossbars and translucent cyan skybridge observation floor.
  - *Burj Al Arab:* Cantilevered circular helipad disk with yellow 'H' markings, exoskeleton truss arches, and causeway pier.
  - *Museum of the Future:* Landscaped green park mound hill podium and calligraphic window accent slits.
  - *Ain Dubai:* Rotating giant observation wheel with 12 glowing observation capsules.
- **Proactive Landmark Discovery:** Approaching any landmark within 9.5m triggers celebration chimes, a comic discovery badge, and awards +150 XP towards your session explorer score.
- **Zero VRAM Leak Invariant:** Clean scene traversal with `.dispose()` calls on all geometries and materials during unmount.

### 5. 🛂 POYALO Visa Concierge & Boarding Pass Studio
- **180-Day Passport Expiry Home Screen Widget:**
  - Evaluates the strict international 6-month passport validity invariant.
  - Visual color-coded validity meter, live days countdown, and copyable advisory text.
  - One-tap sync with the Boarding Pass.
- **Interactive Boarding Pass Studio:**
  - Neo-brutalist flight card with mobile vertical tear line, circular punch notches, and barcode decals.
  - Real-time editable passenger name, origin, destination, seat, flight number, and date.
  - **Official 180-Day Immigration Security Seal:** Dynamically stamps `PASSPORT COMPLIANT (180+ DAYS)` with verified green badge.
- **Visa Compatibility Matcher:**
  - Cross-matches passport nationality and residency status into Visa-Free, Visa on Arrival, eVisa, or Embassy Required.
- **30-Second Visa Stress Quiz:**
  - Playful 5-step quiz measuring deadline pressure, missing documents, appointment availability, and itinerary complexity with actionable recommendations.

---

## 🛠️ Architecture & Tech Stack

```
                                  POYALO ARCHITECTURE
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   React 18 + Vite                                      │
│  ┌───────────────────────┐  ┌────────────────────────┐  ┌───────────────────────────┐  │
│  │   Itinerary Planner   │  │   Comic Story Box      │  │      VG World 3D          │  │
│  │  • AI Multi-Day Gen   │  │  • 4 Tone Dials        │  │  • Three.js WebGL Engine  │  │
│  │  • Deterministic Rules│  │  • Era Time Machine    │  │  • Mobile Touch Joystick  │  │
│  │  • SunCalc Physics    │  │  • Web Speech Narration│  │  • Landmark Discovery XP │  │
│  └───────────┬───────────┘  └───────────┬────────────┘  └─────────────┬─────────────┘  │
│              │                          │                             │                │
│              ▼                          ▼                             ▼                │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                        State Management & Audio Synthesizer                       │  │
│  │   • Offline Web Audio API Engine (Jump, Bounce, Boost, Chimes, Doppler Jet)      │  │
│  │   • LocalStorage Caching (Passport Sync, Itinerary Score, Custom Key)            │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 Backend / Serverless                                   │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │  /api/generate-plan (Vercel Serverless Function)                                 │  │
│  │  • Secure process.env.GEMINI_API_KEY isolation (never leaked to client)          │  │
│  │  • Gemini 1.5 Flash / 2.0 Flash with verified place grounding                    │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

| Technology | Role |
| :--- | :--- |
| **React 18 & TypeScript** | Component architecture, strict typing, and memory-safe refs |
| **Vite 5** | High-speed production bundling and PWA asset optimization |
| **Three.js** | 3D WebGL rendering, lighting, camera physics, and procedural geometry |
| **Tailwind CSS** | Neo-brutalist styling, chunky borders, and flat hard drop shadows |
| **SunCalc** | Offline astronomical solar physics for golden hour calculations |
| **Web Audio API** | 100% offline synthesizer for sound effects (chimes, jet engines, bounces) |
| **Web Speech API** | In-browser speech synthesis for audio comic book narration |
| **Canvas Confetti** | Celebratory particles for quizzes and boarding pass achievements |
| **Google Gemini API** | AI trip planning, worldwide comic story generation, and myth debunking |

---

## 🎨 Design System & Neo-Brutalist Guidelines

POYALO adheres to strict visual rules defined in [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md):

1. **No Blurry Soft Shadows:** Elevation is strictly expressed via hard flat offsets: `shadow-[4px_4px_0px_#111827]`.
2. **Heavy Outlines:** All borders are chunky and deliberate: `border-2` or `border-[2.5px] #111827`.
3. **Warm Newsprint Canvas:** High-contrast retro canvas with warm cream paper (`#FDFBF7`) and deep ink black (`#111827`).
4. **Smartphone-First Ergonomics:** All touch targets are $\ge 48\text{px}$. Boarding passes stack vertically with tear perforations on mobile screens (375px+).
5. **Comic Decals & Action Decals:** Speech bubbles with directional pointers, narrative captions, and sound decals (`WHOOSH!`, `BOUNCE!`, `ZOOM!`).

---

## 🚀 Local Development Setup

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/nichroot/poyalo.git
cd poyalo

# 2. Install dependencies
bun install

# 3. Start development server
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
# Typecheck and build optimized bundle
bun run build

# Preview production build locally
bun run preview
```

### Environment Variables (Optional)

The app works **100% offline** with built-in verified city databases and deterministic engines. To enable live Google Gemini AI calls:

Create a `.env.local` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Security Note:** `GEMINI_API_KEY` is only accessed on the serverless proxy (`api/generate-plan.ts`). It is never exposed in client bundles. Users can also enter their own key in the in-app `ApiKeyModal` (stored exclusively in browser `localStorage`).

---

## 📁 Repository Structure

```
poyalo/
├── api/                     # Vercel Serverless Edge Functions
│   └── generate-plan.ts     # Secure Gemini AI proxy with verified landmark grounding
├── docs/                    # Architecture & Design documentation
│   ├── ARCHITECTURE.md      # Deep architectural patterns and invariants
│   └── DESIGN_SYSTEM.md     # Neo-brutalist tokens, typography, and comic specs
├── public/                  # Public assets, PWA icons, cover banner, Service Worker
│   ├── cover.png            # 1280x640 official cover banner
│   ├── favicon.svg          # Vector favicon
│   ├── manifest.json        # PWA Web App Manifest
│   └── sw.js                # Offline caching service worker
├── src/
│   ├── components/
│   │   ├── comic/           # Comic-Book Story Box & panel renderers
│   │   ├── common/          # ApiKeyModal, AirplaneEasterEgg, InstallModal
│   │   ├── game/            # VGWorldGame (Three.js), GameHUD, VirtualJoystick
│   │   ├── layout/          # Header, BottomDock navigation
│   │   ├── myth/            # MythPointerView, SuggestMythModal
│   │   ├── pass/            # BoardingPass Studio & immigration stamp
│   │   ├── passport/        # 180-Day Passport Expiry Widget
│   │   ├── planner/         # ItineraryPlanner, StopCard, EntryCheckView
│   │   └── visa/            # VisaCompatibilityMatcher, VisaStressScoreQuiz
│   ├── data/                # Offline city databases, landmarks, myths, rules
│   ├── engines/             # Deterministic reality check & rule engines
│   ├── services/            # AI services & local synthesis engines
│   ├── types/               # TypeScript interfaces & types
│   ├── App.tsx              # Root app router & state coordinator
│   └── main.tsx             # React DOM entry point
├── AGENTS.md                # AI coding assistant invariants & rules
├── package.json             # Scripts & dependencies
└── README.md                # This flagship documentation
```

---

## 🔒 Privacy & Security Invariants

1. **Zero Passport Number Storage:** POYALO never prompts for, transmits, or stores sensitive identification numbers (passport numbers, national IDs). Only nationality and expiry dates are evaluated.
2. **API Key Isolation:** Server keys are strictly confined to serverless runtime functions. Client builds are verified to contain zero secrets.
3. **100% Offline Resilience:** The app remains completely operational on airplanes or remote travels using offline Service Worker caching, client-side rule validation, and Web Audio synthesizers.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<br />

<div align="center">
  <sub>Built with ❤️ for curious travelers worldwide. <strong>POYALO (പോയാലോ?)</strong></sub>
</div>
