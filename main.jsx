import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA: register the service worker so the app keeps working offline after
// it has been opened once. Production-only — registering it during
// `npm run dev` would cache dev-server responses and cause stale-reload
// confusion while developing. Guarded with try/catch + feature-detection
// since this must never block the app from loading if unsupported
// (e.g. inside the Claude.ai artifact sandbox, which has no /sw.js to serve).
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Offline support degrades gracefully — the app still works online.
    });
  });
}
