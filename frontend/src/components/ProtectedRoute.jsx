import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // ❗ user null হলে সব route block হবে
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
