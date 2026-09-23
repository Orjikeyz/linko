/* ============================================================
   API CONFIG — point this at your backend when it's ready.
   While API_BASE_URL is null, the dashboard runs on embedded
   mock data (your sample collections) so you can develop the UI.
   Set it to e.g. "https://api.yourdomain.com" to go live.
   ============================================================ */
const CONFIG = {
  API_BASE_URL: null,          // e.g. "https://api.yourdomain.com/api"
  TOKEN_KEY: "sa_token",       // localStorage key for the admin JWT
  ADMIN_EMAIL: "superadmin@platform.com", // demo login (any password works in mock mode)
};
