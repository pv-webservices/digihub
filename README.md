# Digihub eBook storefront

The storefront runs on Node.js 22.13 or newer. Install dependencies with `npm ci`. Run `npm run build` followed by `npm start` and open http://127.0.0.1:4173. Run `npm run dev` to build and serve the development edition, including labelled sample testimonials. Rebuild after source edits.

## Catalog and publishing

Edit `src/catalog.mjs` to replace the six sample listings. Product cards, search, detail pages and the cart use this catalog. The build writes the production pages to `dist/`. Only the artwork in `assets/` is copied to the published storefront. The supplied reference and original brand assets remain in `public/`.

## Forms and storage

The Node server handles `POST /api/contact` and `POST /api/newsletter`. It saves enquiries in the `enquiries` table and deduplicates newsletter addresses in `subscriptions`. Contact retries reuse the submission ID. Both tables are in `.data/digihub.sqlite` by default. The forms confirm a submission only after a successful database write. No email sender or mailing campaign service is configured.

Set `DIGIHUB_DATA_DIR` to a private, persistent directory for hosting and backups. Use `HOST` and `PORT` to configure the HTTP listener behind an HTTPS reverse proxy. Static-only hosting can serve the generated pages but needs a separate backend for these form endpoints.

## Commerce

The cart stores a single copy of each selected title on the current device. The checkout shows a summary and a closed payment state. The order-status route grants no access. Opening sales requires final book files and metadata, approved policies, a business payment account and a server-side order, payment verification and authorized delivery integration. No payment credentials or book files belong in the public output.

