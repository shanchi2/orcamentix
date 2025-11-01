import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";
import { ToastProvider } from "./utils/Toasts";

function ThemeBoot() {
  useEffect(() => {
    let stored = null;
    try { stored = localStorage.getItem("orcx.theme"); } catch {}
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const prefersDark = mql.matches;
    const userChose = stored === "dark" || stored === "light";
    const wantDark = userChose ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", wantDark);
    const onChange = (e) => { if (!userChose) document.documentElement.classList.toggle("dark", e.matches); };
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);
  return null;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeBoot />
    <ToastProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToastProvider>
  </StrictMode>
);
