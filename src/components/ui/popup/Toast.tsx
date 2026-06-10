"use client";

// Tambahkan ikon Trash dari @phosphor-icons/react
import {
  CheckCircle,
  Info,
  WarningCircle,
  Trash,
  X,
} from "@phosphor-icons/react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// 1. Tambahkan "delete" ke dalam tipe ToastVariant
type ToastVariant = "success" | "error" | "info" | "delete";

interface ToastMessage {
  id: string;
  title: string;
  description: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  addToast: (toast: Omit<ToastMessage, "id">) => void;
}

const ToastContext = createContext<ToastContextValue>({
  addToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timeouts = useRef<Record<string, number>>({});

  useEffect(() => {
    return () => {
      Object.values(timeouts.current).forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      timeouts.current = {};
    };
  }, []);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const message: ToastMessage = { id, ...toast };
    setToasts((previous) => [message, ...previous]);

    const timeoutId = window.setTimeout(() => {
      setToasts((previous) => previous.filter((item) => item.id !== id));
      delete timeouts.current[id];
    }, 2000);

    timeouts.current[id] = timeoutId;
  };

  const contextValue = useMemo(() => ({ addToast }), []);

  // 2. Tambahkan style warna Tailwind untuk varian "delete"
  const getVariantStyles = (variant: ToastVariant) => {
    switch (variant) {
      case "success":
        return "border-green-700 bg-green-500 text-white";
      case "error":
        return "border-red-700 bg-red-500 text-white";
      case "delete":
        return "border-red-700 bg-red-500 text-white";
      default:
        return "border-sky-200 bg-sky-50 text-sky-900";
    }
  };

  // 3. Tambahkan kondisi icon Trash untuk varian "delete"
  const getVariantIcon = (variant: ToastVariant) => {
    if (variant === "success") return <CheckCircle weight="fill" size={18} />;
    if (variant === "error") return <WarningCircle weight="fill" size={18} />;
    if (variant === "delete") return <Trash weight="fill" size={18} />; // Ikon tempat sampah
    return <Info weight="fill" size={18} />;
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`w-full max-w-sm rounded-md border px-4 py-3 shadow-2xl shadow-black/5 backdrop-blur-sm ${getVariantStyles(
              toast.variant,
            )}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-current">
                {getVariantIcon(toast.variant)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug">
                  {toast.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-current/80 font-medium">
                  {toast.description}
                </p>
              </div>
              <button
                type="button"
                className="text-current/70 hover:text-current"
                onClick={() =>
                  setToasts((prev) =>
                    prev.filter((item) => item.id !== toast.id),
                  )
                }
                aria-label="Close notification"
              >
                <X size={16} weight="bold" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
