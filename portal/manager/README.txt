SUPER ADMIN DASHBOARD
=====================

Quick start
-----------
Just open index.html in a browser (or serve the folder with any static server).
It runs in MOCK mode out of the box using your sample data — login with:
    superadmin@platform.com   (any password)

Connecting your backend
-----------------------
1. Open js/config.js and set:
       API_BASE_URL: "https://your-backend.com/api"
2. Expected REST routes (edit `endpoints` in js/api.js if yours differ):
       GET/POST       /vendors
       GET/PUT/DELETE /vendors/:id
       GET/POST       /products
       GET/PUT/DELETE /products/:id
       GET            /transactions
       GET/DELETE     /transactions/:id
3. Auth: the frontend sends  `Authorization: Bearer <token>`  from localStorage.
   Implement the login() stub in js/app.js to POST to your auth endpoint
   and store the returned JWT under CONFIG.TOKEN_KEY.

Features
--------
- Dashboard: vendor/product/transaction counts + revenue from successful txs
- Vendors: search, filter by status, add/edit/delete, detail view with socials
- Products: gallery detail, add/edit/delete, linked to vendor
- Transactions: status filter, volume stats, detail view, delete
- Fully responsive (mobile bottom nav), dark theme, toasts & modals

File map
--------
index.html        shell
css/style.css     theme + components
js/config.js      ← your API URL lives here
js/api.js         fetch wrapper + mock data fallback
js/app.js         views, routing, auth
