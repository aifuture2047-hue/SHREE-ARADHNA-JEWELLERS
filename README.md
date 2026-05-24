# 💎 New Gayatri Jewellers

A premium luxury jewellery storefront built with **React + TypeScript + Vite**.

Live gold & silver rates • Product catalog with admin CRUD • WhatsApp inquiries • Fully responsive

---

## ✨ Features

| Feature | Description |
|---|---|
| **Live Market Rates** | Real-time 22KT, 18KT gold and 24KT silver prices via API |
| **Product Catalog** | Browse jewellery with weight, making charges, and full price breakdown (incl. 3% GST) |
| **Admin Panel** | Password-protected panel to manage products, banners, collection images, and popup ads |
| **Dynamic Banners** | Upload and control hero banners and collection highlight images from admin settings |
| **Announcement Popups** | Configurable promotional popups with session-based dismiss |
| **WhatsApp Integration** | One-click WhatsApp inquiry with pre-filled product details |
| **Mobile Responsive** | Fully responsive luxury UI optimized for all screen sizes |
| **Price Breakdown** | Transparent invoice-style pricing: Base Metal + Making + GST |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Deploy to Vercel

This project is **Vercel-ready** out of the box.

### Option 1: Import from GitHub (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the GitHub repository: `aifuture2047-hue/SHREE-ARADHNA-JEWELLERS`
3. Vercel will auto-detect the Vite framework
4. Click **Deploy** — that's it!

### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel
```

The included `vercel.json` handles SPA routing automatically.

---

## 🔐 Admin Access

Access the admin panel via the **"Admin Portal"** link in the footer.

- **Passcode:** Set during first login
- **Capabilities:** Manage products, update live rates, upload banners, configure popup ads

---

## 🛠 Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Vanilla CSS with custom properties
- **Storage:** localStorage (client-side persistence)
- **API:** Gold/Silver rate APIs for live pricing

---

## 📁 Project Structure

```
├── public/            # Static assets (images, favicon, icons)
├── src/
│   ├── components/    # React components
│   │   ├── AdminPanel.tsx
│   │   ├── AnnouncementPopup.tsx
│   │   ├── ContactForm.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── LiveMarketDashboard.tsx
│   │   ├── LocationGallery.tsx
│   │   ├── ProductCatalog.tsx
│   │   ├── RateTicker.tsx
│   │   └── WhatsAppFAB.tsx
│   ├── App.tsx        # Main application with routing & state
│   ├── index.css      # Global styles & design system
│   └── main.tsx       # Entry point
├── vercel.json        # Vercel deployment config
├── vite.config.ts     # Vite configuration
└── package.json
```

---

## 📝 Credits

**Made by Unnat Jain**

---

*© 2025 New Gayatri Jewellers. All rights reserved.*
