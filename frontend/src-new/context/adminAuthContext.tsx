import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { restoreAdminSession } from "@/features/admin/auth/auth.api";
import { setAdminAccessToken } from "@/api-setup/adminClient";
import type { Admin } from "@/features/admin/auth/auth.type";

interface AdminAuthContextValue {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAdmin: (admin: Admin | null) => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const response = await restoreAdminSession();
        setAdminAccessToken(response.data.accessToken);
        setAdmin({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        });
      } catch {
        setAdminAccessToken(null);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    restore();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, isAuthenticated: !!admin, isLoading, setAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuthContext = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuthContext must be used within AdminAuthProvider");
  }
  return context;
};