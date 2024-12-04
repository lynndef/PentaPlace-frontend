import { useNavigate, useParams } from "react-router-dom";
import { useEffect, ReactNode } from "react";
import { useAuth } from "./useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps): ReactNode {
  const { isAuthenticated, userData, loading } = useAuth();
  const { username } = useParams<string>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) { 
      if (!isAuthenticated || userData?.username !== username) {
        navigate("/login", { replace: true });
      }
    }
  }, [isAuthenticated, navigate, userData, username, loading]);

  if (loading) {
    return null;
  }

  if (!isAuthenticated || userData?.username !== username) {
    return null;
  }

  return children;
}
