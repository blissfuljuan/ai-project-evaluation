import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { loading, user } = useUser();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  return children;
}
