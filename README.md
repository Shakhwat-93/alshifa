# 🌿 শিফা কেয়ার (Shifa Care) — Premium D2C Landing Page

An ultra-modern, high-converting direct-response e-commerce landing page for **Shifa Pain Care Oil (শিফা পেইন কেয়ার অয়েল)**, built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS v4**.

Designed and engineered to agency-tier standards: mobile-first conversion architecture, authentic Bangladeshi typography (Noto Sans Bengali), fluid responsive scaling from 320px to 4K ultra-wide displays, and zero-compromise Lighthouse performance.

---

## 🚀 Live Demo & Deployment

This project is fully configured and ready for **1-click deployment on [Vercel](https://vercel.com)**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shakhwat-93/alshifa)

---

## ⚡ Tech Stack & Features

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org) with Turbopack
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **Typography:** Google Fonts `Noto Sans Bengali` (natural Bengali glyphs) + `Plus Jakarta Sans` (currency/numerals)
- **Icons:** [Lucide React](https://lucide.dev)
- **Animations:** CSS 3D transforms, fluid pulse CTAs, and [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Responsive System:** Fluid layout system supporting mobile (320px–430px), tablet (768px–912px), desktop (1024px–1920px), and ultra-wide/4K (2560px–3840px)
- **Conversion Flow:**
  - Emergency Top Bar with click-to-call hotline
  - Sticky header with quick-order action
  - Limited stock urgency indicator with dynamic countdown timer
  - 6 real-world pain point agitation cards
  - Scientific root cause & comparison analysis
  - 6 core physical benefits & clinical advantages
  - 27 herbal ingredients showcase with 14 active extracts
  - 5 target audience personas
  - 3-step easy usage guide
  - Lab test certification showcase
  - Verified customer reviews with real avatars
  - Interactive FAQ accordion
  - 3-tier package selector radio cards (1 Bottle / 2 Bottles Combo / 3 Bottles Family Pack)
  - Cash on Delivery (COD) checkout form with live total calculation
  - Order success modal with celebratory confetti & direct WhatsApp link
  - Mobile bottom sticky action bar

---

## 🛠️ Local Development

### 1. Clone the repository:
```bash
git clone https://github.com/Shakhwat-93/alshifa.git
cd alshifa
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Run development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production:
```bash
npm run build
npm run start
```

---

## 📦 Project Structure

```
├── public/
│   ├── images/                # High-resolution product images, badges & avatars
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── globals.css        # Tailwind v4, custom shadows & animations
│   │   ├── layout.tsx         # RootLayout with Noto Sans Bengali & SEO metadata
│   │   └── page.tsx           # Assembled single-page landing application
│   └── components/
│       ├── TopBar.tsx
│       ├── Header.tsx
│       ├── HeroSection.tsx
│       ├── PainPointsSection.tsx
│       ├── RootCauseSection.tsx
│       ├── FeaturesSection.tsx
│       ├── IngredientsSection.tsx
│       ├── TargetAudienceSection.tsx
│       ├── UsageSection.tsx
│       ├── CertificationSection.tsx
│       ├── UrgencySection.tsx
│       ├── ReviewsSection.tsx
│       ├── FAQSection.tsx
│       ├── OrderSection.tsx
│       ├── FloatingStickyBar.tsx
│       ├── WhatsAppWidget.tsx
│       └── Footer.tsx
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📄 License

MIT License. Designed with pride for Shifa Care.
