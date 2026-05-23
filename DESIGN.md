---
name: Aura of Aradhna
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c4c7c7'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c8c6c5'
  primary: '#c8c6c5'
  on-primary: '#313030'
  primary-container: '#1a1a1a'
  on-primary-container: '#848282'
  inverse-primary: '#5f5e5e'
  secondary: '#ffffff'
  on-secondary: '#343200'
  secondary-container: '#efe800'
  on-secondary-container: '#6a6700'
  tertiary: '#95d3ba'
  on-tertiary: '#003829'
  tertiary-container: '#001f15'
  on-tertiary-container: '#518e78'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#efe800'
  secondary-fixed-dim: '#d2cc00'
  on-secondary-fixed: '#1e1d00'
  on-secondary-fixed-variant: '#4b4900'
  tertiary-fixed: '#b0f0d6'
  tertiary-fixed-dim: '#95d3ba'
  on-tertiary-fixed: '#002117'
  on-tertiary-fixed-variant: '#0b513d'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '300'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.15em
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style
The design system for this premium jewelry brand centers on "Modern Luxury"—a fusion of timeless opulence and contemporary minimalism. The brand personality is prestigious, heritage-driven, yet forward-thinking, targeting high-net-worth individuals seeking investment-grade craftsmanship.

The visual style employs **Minimalism with Opulent Accents**. It leverages heavy whitespace to allow high-resolution product photography to breathe, creating a digital "gallery" experience. The emotional response should be one of exclusivity, trust, and calm sophistication. Design elements utilize thin strokes, vibrant high-contrast accents, and a dark, moody palette to guide the user’s eye toward the intricate details of the jewelry.

## Colors
The palette is rooted in a deep, matte **Obsidian Black** (#1A1A1A) to provide a high-contrast stage for precious metals and gemstones. 

- **Electric Citrine (#F7F011)**: A bold, modern update to traditional gold. Used exclusively for primary call-to-actions, active states, and brand-critical highlights to inject a contemporary edge into the luxury aesthetic.
- **Deep Emerald (#064E3B)**: Applied sparingly for secondary elements, trust indicators, or "limited edition" tags to evoke a sense of heritage and value.
- **Ivory (#F9F9F9)**: The primary text color, ensuring maximum legibility against the dark background without the harshness of pure white.
- **Gold-tinted Grey (#A39E93)**: Used for secondary descriptions and metadata to maintain a soft, tonal hierarchy.

## Typography
The typography system relies on a high-contrast serif for narrative and branding, paired with a structured geometric sans-serif for utility.

- **Headlines**: Use **Playfair Display**. It provides the necessary "editorial" feel. Display sizes should utilize tighter letter-spacing to feel more cohesive.
- **Body & UI**: Use **Montserrat**. Its geometric nature feels modern and clean. Use the "Light" (300) weight for large descriptive text to enhance the minimalist aesthetic.
- **Captions/Labels**: Always use uppercase with increased letter-spacing for a premium, architectural feel.

## Layout & Spacing
The layout follows a **Fixed Grid** model on desktop to ensure product imagery is framed perfectly within the center of the viewport. 

- **Desktop**: A 12-column grid with generous 80px side margins to isolate the content as a "jewel box."
- **Section Gaps**: Use significant vertical spacing (120px+) between major sections to emphasize the premium nature of the brand; avoid cluttering the interface.
- **Product Alignment**: Use asymmetrical layouts for editorial sections, while maintaining a strict, clean grid for product listings.

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Subtle Outlines** rather than heavy shadows.

- **Surfaces**: Primary surfaces are Matte Black. Secondary surfaces (cards, modals) use a slightly lighter grey (#242424) with a 1px border in #F7F011 at 15% opacity.
- **Overlays**: Use a 40% blur backdrop for sticky headers and modals to create a sense of glass-like transparency without breaking the dark theme.
- **Interactive Depth**: On hover, elements should not rise (shadow), but rather "glow" slightly with a soft Electric Citrine outer stroke or a subtle increase in image scale.

## Shapes
This design system utilizes **Sharp (0px)** corners for all structural elements including buttons, cards, and input fields. Sharp edges evoke a sense of precision, architectural rigor, and high-end luxury, mimicking the facets of a cut diamond. Circles are permitted only for icon containers or small status indicators to provide a visual break.

## Components

### Live Rate Ticker
A slim, secondary header positioned at the very top. Use Deep Emerald background with Ivory text. It should feature a slow-scroll animation for gold and silver rates, using the `label-caps` typography.

### Product Cards
Cards should be borderless by default. The image should occupy 80% of the card area with a subtle zoom-on-hover effect. Product titles in `headline-sm` and prices in `body-lg`.

### Primary CTA (Electric Citrine Button)
Sharp corners, no border. Background: #F7F011. Text: #1A1A1A. Hover state: Slight desaturation or a thin 1px Electric Citrine border expansion.

### Luxe Contact Form
Use "Ghost" input fields—only a bottom border (1px Ivory). Labels should be floating or positioned above in `label-caps`. Focus state changes the bottom border to Electric Citrine.

### WhatsApp Integration
A floating action button (FAB) in the bottom right. Instead of a standard green icon, use a minimalist Electric Citrine icon within a black circular frame to maintain brand consistency.

### Sticky Header
A semi-transparent Matte Black header. It contains the brand mark (centered), navigation links (left), and Inquiry/Account links (right).