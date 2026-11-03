# PORTFOLIO REBUILD PLAN — THIEN.DEV
## Cinematic Scroll-Driven Interactive Portfolio

> **Reference:** [MiladiCode 3D Portfolio Tutorial](https://www.youtube.com/watch?v=tf_yi6DtDOQ)  
> **Current State:** React 18 + TypeScript + Vite + Tailwind + Three.js (functional, build-passing)  
> **Target State:** Premium cinematic portfolio — scroll-controlled animations, portrait hero, fluid transitions

---

## 1. Architecture Overview

### Current Architecture
```
App.tsx (single page, vertical scroll)
├── Navbar
├── HeroSection          ← 2-column layout, Three.js WebGL bg
├── LogoCarousel         ← 2-row infinite marquee
├── BentoGridSection     ← personal info bento cards
├── SkillsSection        ← filter tabs + progress bars
├── ProjectsSection      ← filter tabs + modal
├── ContactSection       ← form with JS validation
└── Footer
```

### Target Architecture
```
App.tsx
├── ScrollController (GSAP ScrollTrigger global setup)
├── Navbar               ← KEEP + enhance with progress bar
├── CinematicHero        ← REPLACE: portrait-driven cinematic entry
│   ├── Portrait (thien-avatar.jpg)
│   ├── HeroThreeBackground (particle WebGL — KEEP)
│   └── ScrollCue
├── AboutSection         ← NEW: scroll-reveal text + subtle parallax
├── LogoCarousel         ← KEEP as-is
├── BentoGridSection     ← KEEP + scroll-reveal entry
├── SkillsSection        ← KEEP + staggered reveal
├── ProjectsSection      ← KEEP + enhance project cards
│   └── ProjectModal     ← KEEP
├── ContactSection       ← KEEP
└── Footer               ← KEEP
```

### What Changes vs What Stays

| Component | Action | Reason |
|---|---|---|
| `HeroSection.tsx` | **REPLACE** | Rebuild as `CinematicHero` with portrait focus |
| `HeroThreeBackground.tsx` | **KEEP** | WebGL particles working well |
| `AvatarBentoCard.tsx` | **KEEP / Integrate** | 3D tilt effect is premium |
| `LogoCarousel.tsx` | **KEEP** | Already polished |
| `BentoGridSection.tsx` | **KEEP + enhance** | Add scroll-reveal animation |
| `SkillsSection.tsx` | **KEEP + enhance** | Add staggered bar animation |
| `ProjectsSection.tsx` | **KEEP + enhance** | Improve card hover states |
| `ProjectModal.tsx` | **KEEP** | Accessible and functional |
| `ContactSection.tsx` | **KEEP** | JS validation complete |
| `Footer.tsx` | **KEEP** | Clean and branded |
| `Navbar.tsx` | **KEEP + enhance** | Add scroll progress indicator |
| `Avatar3DViewer.tsx` | **ARCHIVE** | No .glb file exists |
| `BikeDriveBy.tsx` | **ARCHIVE** | Deprecated, not in use |
| `Hero3DScene.tsx` | **ARCHIVE** | Superseded |

---

## 2. Cinematic Hero Section Design

### Visual Concept
Inspired by MiladiCode: large-format portrait, minimal text overlay, scroll-triggered reveal.

```
┌─────────────────────────────────────────────────────────────┐
│  [THIEN.DEV]                          [nav links] [☀/🌙]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ╔══════════════╗    Nguyễn Văn Thiện                      │
│   ║              ║    AI Engineering Student                │
│   ║  thien-      ║    @ UTH · Ho Chi Minh City             │
│   ║  avatar.jpg  ║                                          │
│   ║  (portrait)  ║    ─────────────────────────            │
│   ║              ║    "Building AI-powered solutions        │
│   ╚══════════════╝     for real-world problems."            │
│                                                             │
│   [WebGL Particle Background — HeroThreeBackground]         │
│                                                             │
│   ↓ scroll to explore                                       │
└─────────────────────────────────────────────────────────────┘
```

### Implementation Plan

**File:** `src/components/ui/HeroSection.tsx` (rewrite in-place, do not rename)

#### Layout
- Full viewport height (`min-h-screen`)
- CSS Grid: two columns on desktop → single column stacked on mobile
- Portrait image on the **left** (or right on mobile: top)
- Text content on the **right** (or below on mobile)

#### Portrait Treatment
- Source: `/images/thien-avatar.jpg` (81 KB, confirmed exists)
- Container: `rounded-2xl overflow-hidden` with a subtle gradient border ring (UTH Blue → Cyan)
- No fake 3D rotation — clean professional framing
- Subtle CSS scale reveal on load (`@keyframes heroReveal`)

#### Text Animation
- Name: slides in from left on load (CSS `@keyframes slideInLeft`)
- Role/subtitle: fades in 200ms after name
- Description: fades in 400ms after name
- CTA buttons: fades in 600ms after name
- All use `prefers-reduced-motion` safe guards

#### Scroll Cue
- Animated chevron-down icon at bottom center
- Fades out when user scrolls past 100px
- Implemented in React with `useEffect` scroll listener

---

## 3. Scroll Controller Design (GSAP ScrollTrigger)

### Setup
GSAP + ScrollTrigger are **already installed** (`gsap@3.12.5`). No new installs needed.

### Global Initialization
Create: `src/hooks/useScrollAnimations.ts`

```typescript
// Pattern to use across all sections
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

### Per-Section Animations

| Section | Animation Type | Trigger |
|---|---|---|
| Hero | CSS keyframes on mount | Page load |
| About/Bento | Fade + translateY(30px → 0) | Enter viewport |
| Skills | Progress bars animate width | Enter viewport |
| Projects | Card stagger (0.1s between) | Enter viewport |
| Contact | Form slides in | Enter viewport |

### ScrollTrigger Pattern (for each section)
```typescript
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' }
      }
    );
  });
  return () => ctx.revert(); // cleanup
}, []);
```

---

## 4. Image Sequence Animation

### Status: MISSING ASSETS
Image sequence frames (30–90 PNG files for scroll-driven playback) **do not exist** in the project.

### Option A — Provide Frames (Recommended for cinematic effect)
- User exports 30–60 WEBP frames from a video or 3D render
- Stored in `public/sequence/frame-001.webp` … `frame-060.webp`
- Canvas API plays frames as scroll position advances

### Option B — No-frames Fallback (Can implement now)
- CSS parallax scroll effect on the portrait image
- GSAP `scrub` for subtle scale + translate as user scrolls
- No external assets needed
- Less cinematic but fully implementable today

**Recommendation:** Implement Option B immediately. The user can provide frames later for Option A upgrade.

### Option B Implementation
```typescript
// In HeroSection.tsx
ScrollTrigger.create({
  trigger: heroRef.current,
  start: 'top top',
  end: 'bottom top',
  scrub: true,
  onUpdate: (self) => {
    gsap.set(portraitRef.current, {
      scale: 1 + self.progress * 0.05,
      y: self.progress * -30,
    });
  }
});
```

---

## 5. Section Transition System

### Approach: Scroll-reveal (not page-level transitions)
Since this is a single SPA (no React Router), transitions are per-section scroll reveals.

### Stagger Pattern for Cards/Items
```typescript
gsap.fromTo('.project-card',
  { opacity: 0, y: 50, scale: 0.95 },
  {
    opacity: 1, y: 0, scale: 1,
    stagger: 0.1, duration: 0.6, ease: 'back.out(1.2)',
    scrollTrigger: { trigger: '.projects-grid', start: 'top 75%' }
  }
);
```

### Navbar Progress Bar
- A `<div>` fixed at top, width = `scrollY / (documentHeight - windowHeight) * 100%`
- Color: linear-gradient from UTH Blue `#005BAA` to Cyan `#00F2FE`
- Smooth transition with `transition: width 0.1s linear`

---

## 6. Multi-Page vs Scroll-Section Decision

**Current:** Single-page scroll (all sections in `App.tsx`)

**Recommendation:** **Stay with single-page scroll.**

Reasons:
- React Router would require refactoring `App.tsx`, `Navbar.tsx`, `usePortfolioStore.ts`
- The reference video also uses scroll sections, not separate pages
- Hash-based navigation (`#about`, `#skills`) already works with current `Navbar.tsx`
- Portfolio rubric requirements are met by sections, not pages

If multi-page becomes a requirement later:
- Add `react-router-dom` (not yet installed)
- Create `pages/` directory
- Refactor `App.tsx` to use `<Routes>`

---

## 7. Responsive Layout Strategy

### Breakpoints (Tailwind defaults, already configured)
| Breakpoint | Width | Layout |
|---|---|---|
| `base` (mobile) | < 640px | Single column, stacked |
| `sm` | ≥ 640px | Single column (wider) |
| `md` | ≥ 768px | Two columns |
| `lg` | ≥ 1024px | Two columns (wider) |
| `xl` | ≥ 1280px | Two columns, max 1280px container |

### Critical Mobile Fixes
- Hero: portrait on top, text below (flex-col on mobile)
- BentoGrid: full-width cards on mobile (grid-cols-1)
- Navbar: hamburger menu already implemented
- ProjectsSection: single column on mobile

---

## 8. Design System (Already Implemented)

```
Background:     #0B0C10  (near-black)
Surface:        #111318  (card bg)
Border:         rgba(255,255,255,0.08)
Primary:        #005BAA  (UTH Blue)
Accent Cyan:    #00F2FE
Accent Purple:  #8B5CF6
Text Primary:   #F1F5F9
Text Secondary: #94A3B8
Font UI:        Inter (Google Fonts)
Font Code:      JetBrains Mono (Google Fonts)
```

---

## 9. Accessibility Requirements (Already Partially Met)

- [x] `role="dialog"` + `aria-modal` on ProjectModal
- [x] Escape key closes modal
- [x] `prefers-reduced-motion` in Three.js background
- [x] `focus-visible` outlines in `index.css`
- [ ] Skip-to-content link (add to `index.html`)
- [ ] `aria-live` region for form feedback
- [ ] All images need `alt` text audit

---

## 10. Performance Targets

| Metric | Target | Current Strategy |
|---|---|---|
| LCP | < 2.5s | Portrait image preloaded |
| CLS | < 0.1 | Fixed-height hero container |
| FID/INP | < 200ms | Passive scroll listeners |
| Bundle size | < 500 KB gz | Three.js tree-shaking via imports |
| WebGL | Graceful fallback | WebGL detection in HeroThreeBackground |
