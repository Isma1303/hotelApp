import { toast } from "react-toastify";
import { parentService } from "../shared/parent.service";
import type { IUser, IUserNew, IUserUpdate } from "./interface/auth.interface";
import { useStore } from "../shared/store/store";

interface LoginResponse {
  token: string;
  user: IUser;
}

export class AuthService extends parentService<IUser, IUserNew, IUserUpdate> {
  constructor() {
    super("users");
  }

  public async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.http.post<LoginResponse>("/login", {
        email,
        password,
      });

      const { token, user } = response.data;
      // Normalize token: strip 'Bearer ' prefix if present so JWT parsing works
      const normalizedToken = token?.startsWith("Bearer ")
        ? token.slice(7)
        : token;
      useStore.getState().login(normalizedToken, user);

      toast.success("Sesión iniciada exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al iniciar sesión";
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
      });
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      await this.http.post("/logout");

      useStore.getState().logout();

      toast.success("Sesión cerrada exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error: any) {
      useStore.getState().logout();

      const message = error.response?.data?.message || "Error al cerrar sesión";
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
      });
      throw error;
    }
  }

  public verifyToken(): boolean {
    return useStore.getState().checkAuth();
  }
}
