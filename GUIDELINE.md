Here is a complete, structured guideline you can copy-paste directly to your coding agent (or use yourself step-by-step). The focus is on building a **mobile-first responsive web app** — optimized primarily for phones (since that's your target audience), with excellent performance, touch-friendly interactions, and no native app development. We aim to create something significantly better than askmyval.com: more romantic fonts, smoother & more loving animations/effects, subtle 3D elements, and deeply emotional/touching content flow.

### Project Overview & Goals
- **Concept**: A single-page (or light multi-section) interactive "Love Journey" website for your valentine. It tells your story through milestones, photos, messages, and playful/touching interactions.
- **Core Improvements over askmyval.com**:
  - Much prettier, more emotional UI with handwritten/romantic fonts.
  - Gentle, loving animations (pulsing hearts, floating particles, confetti reveals, smooth fades).
  - Subtle 3D heart element (rotatable or floating) for wow factor.
  - Fully mobile-optimized: fast load, large touch targets, vertical scrolling, no horizontal issues.
- **Tech Stack** (keep it simple & performant for mobile):
  - HTML5 + CSS3 (modern features: flexbox, grid, container queries if needed).
  - Vanilla JavaScript (no heavy frameworks unless you want React/Next.js later).
  - Libraries via CDN (minimal bundle size):
    - Three.js (~for 3D heart)
    - tsParticles or particles.js (~for heart-shaped floating particles)
    - canvas-confetti (~for love bursts)
  - Google Fonts (free & fast).
  - Host: Vercel, Netlify, or GitHub Pages (free, automatic HTTPS, fast CDN).
- **Non-goals**: No backend (use URL params or localStorage for personalization if needed). No heavy video/audio auto-play (bad for mobile data/battery). Keep total load < 2-3 MB.

### 1. Mobile-First Responsive Design Rules (Highest Priority)
Follow 2025–2026 best practices:
- **Mobile-first CSS**: Write base styles for small screens (≤480px), then use media queries to enhance for larger screens.
  ```css
  /* Base: mobile */
  body { font-size: 1.1rem; line-height: 1.6; }
  @media (min-width: 768px) { /* tablet+ */ ... }
  ```
- Use fluid layouts: %, vw/vh, clamp(), min()/max(), flexbox + grid.
- Breakpoints: Minimal — focus on 3 key ones if needed:
  - Base: 0–480px (phones)
  - 481–768px (larger phones/tablets)
  - 769px+ (desktops, minor tweaks only)
- Touch-friendly:
  - Buttons ≥ 48×48px, ≥8px padding.
  - Large tap targets, no tiny links.
  - Hover effects optional (use :active for mobile).
- Performance:
  - Lazy-load images: `<img loading="lazy">`
  - Optimize images: Use WebP, max 800px wide, compress to <100KB each.
  - Defer non-critical JS: `<script defer src="...">`
  - Avoid layout shifts (set width/height attributes on images).
  - Test Core Web Vitals (LCP < 2.5s, CLS < 0.1, FID/INP low).
- Viewport & meta:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  ```

### 2. Color Palette & Aesthetic
- Primary: Soft blush pink (#FFC0CB to #FF69B4 gradient), pastel red, lavender accents.
- Background: Light gradient or subtle bokeh/hearts pattern (low opacity).
- Text: Dark gray/charcoal for readability on mobile.
- Accents: Gold/white for highlights.

### 3. Fonts (More Romantic & Pretty)
Use Google Fonts – load only 2–3 weights:
- Headings: 'Love Light' or 'Great Vibes' (cursive with heart vibes).
- Subheadings/quotes: 'Pangolin' or 'Sacramento'.
- Body: 'Open Sans' or 'Poppins' (clean, readable on small screens).
Example import:
```html
<link href="https://fonts.googleapis.com/css2?family=Love+Light&family=Open+Sans:wght@400;600&family=Pangolin&display=swap" rel="stylesheet">
```

### 4. Structure & Content Flow (Single-Page Scroll)
Sections in vertical order (easy mobile scroll):
1. Hero/Intro: Animated 3D heart + "To: [Her Name]" + floating hearts.
2. Our Story Timeline: Cards or steps that fade in on scroll (use IntersectionObserver).
3. Photo Gallery: 3–6 photos in grid (2-column on mobile), lightbox on tap.
4. Love Messages/Letters: Reveal-on-click with confetti + beating heart.
5. Interactive Fun: Quiz ("How well do you know me?") or playful "Yes/No" (No button dodges).
6. Future Dreams: Sweet forward-looking text.
7. End: "Forever yours" + music toggle + share button.

### 5. Animations & Love Effects
- **Floating hearts/particles**: Use tsParticles with heart shape (config example: shape.type = "heart", move.direction = "top", speed low).
- **Pulsing/beating elements**: CSS `@keyframes pulse { 0%,100% {transform: scale(1);} 50% {transform: scale(1.08);}}`
- **Confetti on reveal/click**: canvas-confetti with heart shapes/colors.
- **Scroll reveals**: Elements fade/slide up with AOS.js or simple IntersectionObserver.
- **Hover/tap effects**: Scale up gently, color shift (use :active on mobile).

### 6. 3D Element (Subtle & Performant)
- Use Three.js → central floating/rotating heart (low-poly for mobile performance).
- From tutorial examples: Parametric heart shape (search "three.js heart parametric").
- Controls: Auto-rotate + orbit on drag/touch.
- Fallback: If device is low-end, show 2D CSS heart.
- Place in hero or background (low opacity, no blocking content).
- Keep canvas size small or use requestAnimationFrame throttling.

### 7. Implementation Steps for Your Coding Agent
1. Create project folder → index.html, style.css, script.js.
2. Set up basic HTML structure + meta tags + fonts.
3. Style mobile-first base CSS (body, sections, typography).
4. Build hero section with placeholder 3D canvas or particles div.
5. Add timeline/gallery with responsive grid/flex.
6. Implement JS:
   - Init particles/confetti.
   - Three.js scene (if using 3D).
   - Scroll observers for animations.
   - Touch events for interactions.
7. Optimize: Compress assets, test Lighthouse score >90 on mobile.
8. Deploy & test on real phones (Chrome DevTools device mode + actual devices).

### Final Tips
- Test early & often on iPhone/Android (different screen ratios).
- Add a loading screen or preloader if assets are heavy.
- Personalize: Hardcode her name/photos or use URL params (?name=HerName&photo=...) for shareable links.
- Time estimate: 1–3 days for basic version, +1–2 days for polish/3D.