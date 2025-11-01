import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastCtx = createContext(null);

// Hook seguro: se o Provider faltar, não quebra a app; apenas vira no-op.
export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) {
    const noop = () => {};
    if (import.meta.env.DEV) {
      console.warn(
        "[toasts] useToast() usado fora de <ToastProvider>. " +
        "Os toasts serão ignorados até você envolver a árvore com o provider."
      );
    }
    return { success: noop, error: noop, warn: noop, info: noop };
  }
  return ctx;
}

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const push = useCallback((type, payload) => {
    const id = crypto.randomUUID?.() || String(Math.random());
    const ttl = payload.ttl ?? 5500;
    setItems((prev) => [...prev, { id, type, ...payload }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, ttl);
  }, []);

  const api = useMemo(
    () => ({
      success: (p) => push("success", p),
      error:   (p) => push("error", p),
      warn:    (p) => push("warn", p),
      info:    (p) => push("info", p),
    }),
    [push]
  );

  return (
    <ToastCtx.Provider value={api}>
      {children}

      {/* Stack (canto inferior direito) */}
      <div className="toasts-stack">
        {items.map((t) => (
          <div key={t.id} className={`toast-card toast-${t.type}`}>
            {t.title && <div className="toast-title">{t.title}</div>}
            {t.message && <div className="toast-msg">{t.message}</div>}
          </div>
        ))}
      </div>

      <style>{`
        .toasts-stack{
          position: fixed;
          right: 16px;
          bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 9999;
          pointer-events: none;
        }
        .toast-card{
          min-width: 260px;
          max-width: 360px;
          padding: 12px 14px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,.18);
          border: 1px solid rgba(0,0,0,.06);
          backdrop-filter: blur(6px);
          pointer-events: auto;
          animation: toast-in .18s ease-out;
        }
        .toast-title{ font-weight: 600; margin-bottom: 2px; }
        .toast-msg{ font-size: .9rem; opacity:.95; }

        /* Temas */
        .toast-success{ background: #ecfdf5; color:#065f46; border-color:#10b98133; }
        .toast-error{   background: #fef2f2; color:#7f1d1d; border-color:#ef444433; }
        .toast-warn{    background: #fff7ed; color:#7c2d12; border-color:#f59e0b33; }
        .toast-info{    background: #eff6ff; color:#1e3a8a; border-color:#3b82f633; }

        /* Dark */
        .dark .toast-success{ background:#052e2d; color:#a7f3d0; border-color:#10b98133; }
        .dark .toast-error{   background:#2f0b0b; color:#fecaca; border-color:#ef444433; }
        .dark .toast-warn{    background:#3a1e06; color:#fed7aa; border-color:#f59e0b33; }
        .dark .toast-info{    background:#0a1b3c; color:#bfdbfe; border-color:#3b82f633; }

        @keyframes toast-in {
          from{ transform: translateY(8px); opacity:0 }
          to{ transform: translateY(0); opacity:1 }
        }
      `}</style>
    </ToastCtx.Provider>
  );
}
