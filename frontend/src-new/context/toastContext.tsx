import { createContext, useContext, useState, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

interface Toast {
  id: string;
  message: string;
  linkText?: string;
  linkTo?: string;
}

interface ToastContextValue {
  showToast: (message: string, linkText?: string, linkTo?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, linkText?: string, linkTo?: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const id = crypto.randomUUID();
    setToast({ id, message, linkText, linkTo });

    timeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-6 left-1/2 z-[100] w-full max-w-sm -translate-x-1/2 px-4">
        <AnimatePresence mode="wait">
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="rounded-lg bg-[#14151A] px-4 py-3 text-sm text-white shadow-lg"
            >
              {toast.message}{" "}
              {toast.linkText && toast.linkTo && (
                <Link to={toast.linkTo} className="font-medium text-[#E8682F] hover:underline">
                  {toast.linkText}
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};