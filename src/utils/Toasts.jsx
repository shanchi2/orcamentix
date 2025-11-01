import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

/* =========================
   Context + Provider
   ========================= */
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Remove automaticamente após 5 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

/* =========================
   Hook customizado
   ========================= */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  }
  return context;
}

/* =========================
   Container dos Toasts
   ========================= */
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

/* =========================
   Toast Individual
   ========================= */
function Toast({ id, message, type, onClose }) {
  const config = {
    success: {
      icon: CheckCircle2,
      bgLight: "bg-emerald-50",
      bgDark: "dark:bg-emerald-950/30",
      borderLight: "border-emerald-200",
      borderDark: "dark:border-emerald-800",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      textColor: "text-emerald-900 dark:text-emerald-100",
      progressBg: "bg-emerald-500",
    },
    error: {
      icon: XCircle,
      bgLight: "bg-red-50",
      bgDark: "dark:bg-red-950/30",
      borderLight: "border-red-200",
      borderDark: "dark:border-red-800",
      iconColor: "text-red-600 dark:text-red-400",
      textColor: "text-red-900 dark:text-red-100",
      progressBg: "bg-red-500",
    },
    warning: {
      icon: AlertCircle,
      bgLight: "bg-amber-50",
      bgDark: "dark:bg-amber-950/30",
      borderLight: "border-amber-200",
      borderDark: "dark:border-amber-800",
      iconColor: "text-amber-600 dark:text-amber-400",
      textColor: "text-amber-900 dark:text-amber-100",
      progressBg: "bg-amber-500",
    },
    info: {
      icon: Info,
      bgLight: "bg-blue-50",
      bgDark: "dark:bg-blue-950/30",
      borderLight: "border-blue-200",
      borderDark: "dark:border-blue-800",
      iconColor: "text-blue-600 dark:text-blue-400",
      textColor: "text-blue-900 dark:text-blue-100",
      progressBg: "bg-blue-500",
    },
  };

  const style = config[type] || config.success;
  const Icon = style.icon;

  return (
    <div
      className={`
        pointer-events-auto
        min-w-[320px] max-w-md
        rounded-lg border shadow-lg
        overflow-hidden
        animate-slide-in
        ${style.bgLight} ${style.bgDark}
        ${style.borderLight} ${style.borderDark}
      `}
    >
      {/* Conteúdo do Toast */}
      <div className="flex items-start gap-3 p-4">
        <Icon className={`flex-shrink-0 ${style.iconColor}`} size={20} />
        <p className={`flex-1 text-sm font-medium ${style.textColor}`}>{message}</p>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${style.iconColor} hover:opacity-70 transition-opacity`}
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Barra de Progresso */}
      <div className="h-1 bg-black/5 dark:bg-white/5">
        <div
          className={`h-full ${style.progressBg} animate-progress`}
          style={{ animationDuration: "5s" }}
        />
      </div>
    </div>
  );
}

/* =========================
   Animações (adicionar no index.css ou styles.css)
   ========================= */
/*
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

.animate-progress {
  animation: progress linear;
  width: 100%;
}
*/
