import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../shared/store/store";

/**
 * Hook para proteger rutas y verificar autenticación
 * @param redirectTo - Ruta a la que redirigir si no está autenticado
 * @returns isAuthenticated, user, token, logout
 */
export const useAuth = (redirectTo: string = "/login") => {
  const navigate = useNavigate();
  const { isAuthenticated, user, token, logout, checkAuth } = useStore();

  useEffect(() => {
    const isValid = checkAuth();
    
    if (!isAuthenticated || !isValid) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo, checkAuth]);

  return {
    isAuthenticated,
    user,
    token,
    logout,
    checkAuth,
  };
};
