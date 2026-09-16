import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { restoreSession } from "@/features/client/auth/auth.api";

import {
  setAccessToken,
  setRefreshToken,
} from "@/api-setup/client";

import type { User } from "@/features/client/auth/auth.type";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const attemptRestore = async () => {
      try {
        const response = await restoreSession();

        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);

        setUser({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          isEmailVerified: true,
        });
      } catch {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    attemptRestore();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
};