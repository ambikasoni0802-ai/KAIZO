# KAIZO — Wear the Change

A Nike-style e-commerce front end for the KAIZO clothing brand. Pure HTML/CSS/JS — no build step, no framework, deploys straight to GitHub Pages, Netlify, or Vercel.

## Structure

```
kaizo-site/
├── index.html          Main page (all sections + modals live here)
├── manifest.json        PWA manifest (installable on mobile)
├── README.md
├── .gitignore
├── /css
│   └── styles.css       All styling, design tokens, responsive rules
├── /js
│   └── app.js            Product data, cart, filters, modals, theme toggle
└── /assets
    └── favicon.svg       Site icon (K mark)
```

## Features

- Product grid with category filters (Hoodies, Tees, Joggers, Jackets, Shorts, Caps)
- Quick View modal — pick colour + size, add to bag
- Cart drawer — quantity control, remove, live subtotal
- Demo checkout flow (see note below)
- Site-wide search
- Light/dark theme toggle
- Fully responsive, keyboard accessible, respects reduced-motion

## Important notes before going live

- **Checkout is a demo.** It collects details and shows a confirmation, but does not charge anyone. Wire it up to a real payment gateway (Razorpay, Stripe, etc.) before accepting real orders.
- **Product images are CSS-drawn placeholders**, not photos, so there are no broken links or copyright issues out of the box. Swap them for real product photography inside `garmentEl()` in `js/app.js` whenever you're ready.
- **Cart and theme choice reset on page reload** by design (no `localStorage` is used). If you want them to persist across visits, add `localStorage` calls where noted in the comments in `js/app.js`.

## Deploying with GitHub Pages

1. Push this folder's contents to a new repository.
2. Go to **Settings → Pages** in the repo.
3. Set the source branch to `main` (root).
4. Your site goes live at `https://<your-username>.github.io/<repo-name>/`.
