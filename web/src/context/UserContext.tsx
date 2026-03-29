import { authApi } from "@/api/auth.api";
import { userApi } from "@/api/user.api";
import { tokenStore } from "@/auth/token";
import type { LoginRequest } from "@/types/auth";
import type { UserResponse } from "@/types/user";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type UsertContextValue = {
  user: UserResponse | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
};

const UserContext = createContext<UsertContextValue | undefined>(undefined);

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!tokenStore.get() && !!user;

  const clearError = () => setError(null);

  const refreshUser = async () => {
    setError(null);

    const token = tokenStore.get();
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const me = await userApi.me();
      setUser(me);
    } catch (err: any) {
      tokenStore.clear();
      setUser(null);
      const msg =
        err?.response?.data?.message || "Session expired. Please login again.";
      setError(msg);
    }
  };

  const login = async (payload: LoginRequest) => {
    setError(null);
    try {
      const res = await authApi.login(payload);
      tokenStore.set(res.accessToken);
      await refreshUser();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Invalid email or password.";
      setError(msg);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);

    try {
      await authApi.logout();
    } catch {
      // ignore errors on logout
    } finally {
      tokenStore.clear();
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshUser();
      setLoading(false);
    })();
  }, []);

  const value = useMemo<UsertContextValue>(
    () => ({
      user,
      isAuthenticated,
      loading,
      error,
      login,
      logout,
      refreshUser,
      clearError,
    }),
    [user, isAuthenticated, loading, error]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserContextProvider");
  return ctx;
}
