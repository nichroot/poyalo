# DESIGN_SYSTEM.md — POYALO Visual Design System & UI Specifications

> **Aesthetic Identity:** Retro Neo-Brutalist Boarding Pass, Comic-Book Graphic Novel Lore & 3D Mobile HUD  
> **Inspiration Grounding:** The Visa Guy x Layover x TinkerHub Hackathon Visual Identity & Classic Comic Art  
> **Primary Rule:** High contrast, chunky outlines, flat hard shadows, comic speech bubbles, and strict smartphone-first ergonomics.  

---

## 1. Design Principles & Aesthetic Overview

1. **Neo-Brutalism with Tactile Joy:** Everything feels like a physical travel token: boarding passes, luggage tags, passport stamps, and comic panels.
2. **Hard Offsets over Soft Gradients:** Elevation is expressed strictly via solid, crisp drop shadows (`box-shadow: 4px 4px 0px #111827`).
3. **Comic-Book Graphic Novel Lore:** Historical storytelling abandons walls of text and is rendered in dynamic comic book strips with speech bubbles, narrative boxes, sound effect decals, and halftone dot patterns.
4. **Lightweight 3D Game HUD:** Minimalist, high-contrast overlay controls for the "Little UAE" 3D exploration world with an ergonomic virtual joystick and proximity emote pills.
5. **Mobile Ergonomics First:** When horizontal desktop layouts fail on smartphones, they seamlessly morph into vertical boarding passes, single-column comic readers, and one-thumb touch game HUDs.

---

## 2. Color Palette & Semantic Tokens

### 2.1 Core Palette

| Token Name | Hex Code | Tailwind Equivalent | Role & Context |
| :--- | :--- | :--- | :--- |
| **Layover Blue** | `#1B3FFF` | `bg-[#1B3FFF]` / `text-[#1B3FFF]` | Primary brand color, logo headers, track 09 solid fill, active links, primary CTA |
| **Jet Orange** | `#FF5722` | `bg-[#FF5722]` / `text-[#FF5722]` | Ticket borders, time/date pills, warning alerts, secondary accents, highlight cards |
| **Comic Gold** | `#FBBF24` | `bg-[#FBBF24]` / `text-[#FBBF24]` | Narrative caption boxes (`"MEANWHILE..."`), coin collectibles, golden-hour badge |
| **Coral Salmon** | `#FFA07A` | `bg-[#FFA07A]` / `border-[#FFA07A]` | Secondary status badges (e.g., "Application closed", soft pill fills) |
| **Deep Ink Black**| `#111827` | `border-[#111827]` / `text-[#111827]`| Heavy borders, typography, drop shadow color, comic ink lines |
| **Canvas Cream** | `#FDFBF7` | `bg-[#FDFBF7]` | Warm paper background; authentic comic newsprint warmth |
| **Pure White** | `#FFFFFF` | `bg-white` | Speech bubble fills, card backgrounds, contrast containers |
| **Emerald Check**| `#10B981` | `bg-emerald-500` | Reality Check "All Clear" status, valid passport indicators |
| **Crimson Error** | `#EF4444` | `bg-red-500` | Murphy Mode chaos button, closed venue violation, passport expired alert |

---

## 3. Comic-Book Graphic Novel Design Specifications

### 3.1 The Multi-Panel Comic Strip
- **Panel Containers:**
  - Border: `2.5px solid #111827` (Deep Ink Black).
  - Background: `#FFFFFF` or pale era tint.
  - Drop Shadow: `4px 4px 0px #111827`.
  - Corner Radius: `16px` (`rounded-2xl`).
- **Halftone Dot Texture (Ben-Day Dots):**
  - Subtle radial gradient background pattern representing classic comic printing:
    ```css
    background-image: radial-gradient(#111827 1px, transparent 1px);
    background-size: 8px 8px;
    opacity: 0.06;
    ```

### 3.2 Comic Speech & Thought Bubbles
- **Speech Bubble Container:**
  - Fill: Pure white (`#FFFFFF`).
  - Border: `2px solid #111827`.
  - Drop Shadow: `3px 3px 0px #111827`.
  - Border Radius: `16px` (`rounded-2xl`).
  - Pointer Tail: CSS pseudo-element or SVG triangle pointing to speaker character avatar.
- **Narrative Caption Boxes (The "Meanwhile..." Box):**
  - Fill: Comic Gold (`#FBBF24`) or Jet Orange (`#FF5722`).
  - Border: `2px solid #111827`.
  - Font: Monospace Bold Uppercase (`font-mono font-black text-xs uppercase tracking-wider`).

### 3.3 Dynamic Comic Sound Decals (Stickers)
- Skewed, high-energy text decals with heavy black outline and offset shadow:
  - `"SWOOSH!"`, `"CLINK!"`, `"BOOM!"`, `"YALLA!"`, `"MARHABA!"`
  - Transform: `rotate(-6deg) scale(1.05)`.
  - Text Fill: White or Yellow with `-webkit-text-stroke: 1.5px #111827`.

---

## 4. "Little UAE" 3D Game HUD Specifications

### 4.1 Mobile Virtual Touch Joystick
- **Base Ring:**
  - Diameter: `96px`.
  - Border: `2.5px solid #111827`.
  - Background: `rgba(255, 255, 255, 0.4)` (Frosted glass neo-brutalist).
  - Shadow: `3px 3px 0px #111827`.
- **Thumb Knob:**
  - Diameter: `44px`.
  - Border: `2px solid #111827`.
  - Background: Jet Orange (`#FF5722`) with white arrow glyphs.

### 4.2 Collectible Counter & Score Pill (Top HUD)
```html
<div class="fixed top-4 left-4 z-40 flex items-center space-x-2">
  <!-- Score Badge -->
  <div class="px-3.5 py-1.5 bg-white border-2 border-[#111827] rounded-full shadow-[3px_3px_0px_#111827] flex items-center space-x-1.5">
    <span class="text-sm">🪙</span>
    <span class="font-mono font-bold text-xs text-[#111827]">350 PTS</span>
  </div>
  <!-- Pearl Counter -->
  <div class="px-3 py-1.5 bg-[#EBF2FF] border-2 border-[#111827] rounded-full shadow-[3px_3px_0px_#111827] flex items-center space-x-1">
    <span class="text-sm">🦪</span>
    <span class="font-mono font-bold text-xs text-[#1B3FFF]">4/10</span>
  </div>
</div>
```

### 4.3 Live Multiplayer Proximity Emote Pill
- Appears when within 3m of another real player avatar:
```html
<button class="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 bg-[#FF5722] text-white border-2 border-[#111827] rounded-full shadow-[4px_4px_0px_#111827] font-display font-extrabold text-xs uppercase tracking-wider flex items-center space-x-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none animate-bounce">
  <span>👋</span>
  <span>Say Marhaba!</span>
</button>
```

---

## 5. SMARTPHONE-FIRST REDESIGN SPECIFICATION

### 5.1 Redesign Matrix: Desktop vs. Smartphone

```
DESKTOP VIEWPORT                         SMARTPHONE VIEWPORT (<430px)
+------------------------------------+   +---------------------------+
| Horizontal Landscape Boarding Pass |   | Vertical Boarding Pass    |
+------------------------------------+   | Top: Flight CCJ -> DXB    |
                                         | - - - - Perforation - - - |
+----+ +----+ +----+ +----+ +----+       | Bottom: QR & Score Stub   |
| 01 | | 02 | | 03 | | 04 | | 05 |       +---------------------------+
5-Column Stats Row                       +-------------+-------------+
                                         |     01      |     02      |
                                         +-------------+-------------+
                                         |     03      |     04      |
                                         +-------------+-------------+
                                         |       05 (Full Width)     |
                                         +---------------------------+
                                         2x2 Responsive Stats Grid

+------------------------------------+   +---------------------------+
| 3-Panel Horizontal Comic Strip     |   | Vertical Comic Reader     |
| [Panel 1] [Panel 2] [Panel 3]      |   | [ Panel 1: The Port ]     |
| Side-by-side                       |   | [ Panel 2: The Souk ]     |
+------------------------------------+   | [ Panel 3: The Punchline] |
                                         | Stacks vertically / swipe |
                                         +---------------------------+
```

### 5.2 Smartphone-Specific Adaptations
1. **Vertical Comic Reader:** On smartphones, multi-panel comic strips stack into a comfortable vertical reading stream (or a horizontal swipeable snap gallery `snap-x snap-mandatory`), preserving high-contrast text and speech bubbles without micro-text squinting.
2. **Vertical Mobile Boarding Pass:** Perforated divider switches from vertical to horizontal with half-circle tear notches on left and right borders.
3. **Persistent Bottom Dock:** 5-tab neo-brutalist navigation bar (`Explore`, `Reality Check`, `Comic Lore`, `3D UAE`, `Services`) with `pb-safe` for mobile gesture bar clearance.
4. **Touch Target Sizing:** Minimum `48px x 48px` on all buttons, joystick bounds, and tab icons.
