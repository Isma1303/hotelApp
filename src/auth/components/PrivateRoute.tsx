import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../../shared/store/store";

interface PrivateRouteProps {
  children?: React.ReactNode;
  redirectTo?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  redirectTo = "/login" 
}) => {
  const { isAuthenticated, checkAuth } = useStore();
  const isValidAuth = checkAuth();

  if (!isAuthenticated || !isValidAuth) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
