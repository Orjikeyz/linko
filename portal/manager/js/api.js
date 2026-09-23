/* ============================================================
   API LAYER
   - If CONFIG.API_BASE_URL is set, every call hits your backend
     with the stored JWT in the Authorization header.
   - Otherwise calls resolve against MOCK_DATA (your sample
     collections) so the UI is fully testable today.
   Expected backend routes (adjust in `endpoints` if yours differ):
     GET/POST          /vendors
     GET/PUT/DELETE    /vendors/:id
     GET/POST          /products
     GET/PUT/DELETE    /products/:id
     GET               /transactions
     GET               /transactions/:id
   ============================================================ */
const endpoints = {
  vendors: () => `${CONFIG.API_BASE_URL}/vendors`,
  vendor: (id) => `${CONFIG.API_BASE_URL}/vendors/${id}`,
  products: () => `${CONFIG.API_BASE_URL}/products`,
  product: (id) => `${CONFIG.API_BASE_URL}/products/${id}`,
  transactions: () => `${CONFIG.API_BASE_URL}/transactions`,
  tx: (id) => `${CONFIG.API_BASE_URL}/transactions/${id}`,
};

async function apiFetch(path, { method = "GET", body } = {}) {
  if (!CONFIG.API_BASE_URL) throw new Error("API_BASE_URL not configured");
  const token = localStorage.getItem(CONFIG.TOKEN_KEY);
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) { logout(); throw new Error("Session expired — please sign in again."); }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed (${res.status})`);
  }
  return res.json();
}

/* ---------------- MOCK DATA (your sample collections) ---------------- */
const MOCK_DATA = {
  vendors: [
    {
      _id: "692ec5f3d7afbc0220a28824",
      brand_name: "Empire Clothinghub",
      brand_image: "https://cloudstorage.codeph.ng/linkostorage/uploads/images/ea44521b3e0fd3df4618b4d439e42846.jpg",
      brand_description: "sell - buy - delivery",
      instagram: "https://instagram.com/empireclothing",
      facebook: "https://facebook.com/empireclothing",
      x: "https://x.com/empireclothing",
      phone_number: "+1234567890",
      plan: "basic", status: "active",
      username: "empireclothing_4821",
      brand_email: "admin@gmail.com",
      twofactorToken: "on",
      updatedAt: "2026-04-23T17:29:07.819Z",
    },
    {
      _id: "692ec5f3d7afbc0220a28825",
      brand_name: "Urban Threads",
      brand_image: "https://example.com/images/urbanthreads_logo.jpg",
      brand_cover_image: "https://example.com/images/urbanthreads_cover.jpg",
      brand_description: "Street style with a modern twist.",
      instagram: "https://instagram.com/urbanthreads",
      facebook: "https://facebook.com/urbanthreads",
      x: "https://x.com/urbanthreads",
      phone_number: "+0987654321",
      plan: "basic", status: "active",
      username: "urbanthreads_7392",
    },
  ],
  products: [
    {
      _id: "6a393c4eedee2ed38a4c3a85",
      name: "Classic Black Wrist Watch",
      description: "Elegant minimalist black wrist watch suitable for all occasions.",
      price: 12000,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        "https://images.unsplash.com/photo-1518544887870-8d34c0c5f0b7",
        "https://images.unsplash.com/photo-1508057198894-247b23fe5ade",
      ],
      vendor_id: "empireclothing_4821",
    },
  ],
  transactions: [
    {
      _id: "697a813d723daacadb176a3a",
      vendor_id: "123",
      reference_id: "tx863heog3",
      amount: 3000,
      status: "success",
      description: "Subscription Plan",
      createdAt: "2026-01-28T21:35:57.233Z",
    },
  ],
};

/* In-memory mock store so create/update/delete work offline */
const mockStore = {
  vendors: structuredClone(MOCK_DATA.vendors),
  products: structuredClone(MOCK_DATA.products),
  transactions: structuredClone(MOCK_DATA.transactions),
};
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const mockOk = async (payload, ms = 220) => { await delay(ms); return structuredClone(payload); };

const mockApi = {
  async list(coll) { return mockOk(mockStore[coll]); },
  async get(coll, id) {
    const row = mockStore[coll].find((r) => r._id === id);
    if (!row) throw new Error("Record not found");
    return mockOk(row);
  },
  async create(coll, data) {
    const row = { _id: crypto.randomUUID(), ...data };
    mockStore[coll].unshift(row);
    return mockOk(row);
  },
  async update(coll, id, data) {
    const i = mockStore[coll].findIndex((r) => r._id === id);
    if (i === -1) throw new Error("Record not found");
    mockStore[coll][i] = { ...mockStore[coll][i], ...data };
    return mockOk(mockStore[coll][i]);
  },
  async remove(coll, id) {
    const i = mockStore[coll].findIndex((r) => r._id === id);
    if (i === -1) throw new Error("Record not found");
    mockStore[coll].splice(i, 1);
    return mockOk({ ok: true });
  },
};

/* ---------------- UNIFIED DATA ACCESS ---------------- */
const useLiveApi = () => !!CONFIG.API_BASE_URL;

const Data = {
  async list(coll) { return useLiveApi() ? apiFetch(endpoints[coll]()) : mockApi.list(coll); },
  async get(coll, id) { return useLiveApi() ? apiFetch(endpoints[coll === "transactions" ? "tx" : coll.slice(0, -1)](id)) : mockApi.get(coll, id); },
  async create(coll, data) {
    const path = coll === "vendors" ? endpoints.vendors() : endpoints.products();
    return useLiveApi() ? apiFetch(path, { method: "POST", body: data }) : mockApi.create(coll, data);
  },
  async update(coll, id, data) {
    const path = coll === "vendors" ? endpoints.vendor(id) : coll === "products" ? endpoints.product(id) : endpoints.tx(id);
    return useLiveApi() ? apiFetch(path, { method: "PUT", body: data }) : mockApi.update(coll, id, data);
  },
  async remove(coll, id) {
    const path = coll === "vendors" ? endpoints.vendor(id) : coll === "products" ? endpoints.product(id) : endpoints.tx(id);
    return useLiveApi() ? apiFetch(path, { method: "DELETE" }) : mockApi.remove(coll, id);
  },
};
