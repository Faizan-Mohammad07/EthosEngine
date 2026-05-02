# UI Design Guidelines: EthosEngine

## 1. Visual Identity & Vision
The **EthosEngine** is an enterprise-grade "Regulatory-as-a-Service" platform. The UI must convey **trust, authority, and clarity**. It should feel like a high-end financial or security dashboard—serious, objective, and extremely easy to navigate for both technical auditors and C-suite executives.

The design is heavily inspired by the **IBM Carbon Design System**, emphasizing modularity, accessibility, and a "data-first" approach.

---

## 2. Design Philosophy
- **Professionalism:** Clean lines, minimal decorative elements, and a structured layout.
- **Transparency:** Data should be presented clearly without ambiguity. Use of white space to reduce cognitive load.
- **Consistency:** Every component (buttons, inputs, cards) must follow strict spacing and styling rules to build user familiarity.
- **Immediacy:** Critical information (Trust Scores) must be visible at a glance.

---

## 3. Typography
We use **IBM Plex Sans** as our primary typeface to ensure readability and a modern, neutral feel.

| Element | Font Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **H1** | 32px | Semi-Bold (600) | 40px | Main Page Titles |
| **H2** | 24px | Regular (400) | 32px | Section Headers |
| **H3** | 20px | Semi-Bold (600) | 28px | Widget/Card Titles |
| **Body** | 14px | Regular (400) | 20px | General Content |
| **Label** | 12px | Medium (500) | 16px | Metadata, Tags, Labels |
| **Code** | 14px | Regular (400) | 20px | JSON/Technical Logs (IBM Plex Mono) |

---

## 4. Color Palette
The color system is derived from IBM Carbon, focusing on a neutral base with semantic highlights for risk levels.

### Base Colors
- **Primary Blue:** `#0f62fe` (Actionable elements, Links)
- **Background (Light):** `#ffffff` (Page Content) / `#f4f4f4` (UI Background)
- **Background (Dark):** `#161616` (Sidebar/Header)
- **Border/Divider:** `#e0e0e0` (Light Mode) / `#393939` (Dark Mode)

### Semantic Status (The "Trust Score" System)
- **Green (Safe):** `#24a148` — High Trust / No issues found.
- **Yellow (Caution):** `#f1c21b` — Potential Bias / Minor drift detected.
- **Red (Critical):** `#da1e28` — Policy Breach / High Bias / Unsafe.

---

## 5. Spacing & Layout
A strict **8px base grid** ensures vertical and horizontal rhythm.

- **Page Padding:** 24px or 32px depending on screen size.
- **Card Padding:** 16px (Compact) or 24px (Comfortable).
- **Component Gap:** 8px (Small items), 16px (Between widgets), 32px (Between sections).
- **Border Radius:** `0px` (Strict professional look) or `2px` (Subtle modern touch). Avoid large rounded corners.

---

## 6. Key UI Components

### A. The AI Nutrition Label
A specialized card component that breaks down model attributes:
- **Visual:** Table-like structure with clear borders.
- **Styling:** Light gray background (`#f4f4f4`) with high-contrast text.
- **Icons:** Simple monochromatic icons for data types (e.g., "Gender", "Race", "Safety").

### B. Trust Score Indicators
- **Shape:** Large circular gauges or solid pill-shaped badges.
- **Animation:** Subtle "fill" animation when the dashboard loads to indicate real-time auditing.

### C. Dashboard Widgets
- **Border:** 1px solid `#e0e0e0`.
- **Shadows:** None or very subtle (e.g., `0 2px 4px rgba(0,0,0,0.05)`). We prefer "flat" design for professional clarity.

---

## 7. Imagery & Iconography
- **Icons:** Use **IBM Carbon Icons**. They are thin-line, geometric, and functional.
- **Illustrations:** Avoid generic 3D characters. Use abstract data visualizations or geometric patterns if needed.
- **Images:** High-quality, monochromatic or blue-tinted professional office/tech environments (only if necessary for landing pages).

---

## 8. Accessibility (A11y)
- **Contrast:** Ensure all text passes WCAG AA standards.
- **Focus States:** High-visibility blue outlines for keyboard navigation.
- **Alt Text:** Every data visualization must have an accessible text alternative.
