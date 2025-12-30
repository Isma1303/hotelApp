import { useState } from "react";
import { AuthService } from "../auth.service";

export const useLoginForm = () => {
  const authService = new AuthService();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      await authService.login(email, password);
      return true;
    } catch (err: any) {
      console.error("Error en login:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleSubmit };
};
