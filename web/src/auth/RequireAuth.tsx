import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { tokenStore } from "@/auth/token";
import { useUser } from "@/context/UserContext";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { loading, user } = useUser();
  const hasToken = !!tokenStore.get();

  if (loading) return null;
  if (!user && hasToken) return null;
  if (!user) return <Navigate to="/" replace />;

  return children;
}
