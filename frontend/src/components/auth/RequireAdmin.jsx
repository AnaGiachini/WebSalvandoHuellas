import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function RequireAdmin({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null; // o un spinner si lo prefieres

  if (!user || user?.rol !== "admin") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
