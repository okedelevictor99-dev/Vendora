
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import "@/index.css"
import App from "@/app/App";

import { queryClient } from "@/app/queryClent.ts";
import { AuthProvider } from "@/context/authContext.tsx";
import { AdminAuthProvider } from "@/context/adminAuthContext";
import { ToastProvider } from "@/context/toastContext.tsx";
import ScrollToTop from "@/components/ui/scrollToTop";

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <ScrollToTop/>
        <AuthProvider>
          <AdminAuthProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
);