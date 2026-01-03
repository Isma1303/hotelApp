import { config } from "../shared/config.ts";
import type { AxiosInstance, AxiosRequestHeaders } from "axios";
import axios from "axios";
import { toast } from "react-toastify";
import { useStore } from "./store/store";

export class parentService<T, TNew = Partial<T>, TUpdate = Partial<T>> {
  protected http: AxiosInstance;
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.http = axios.create({
      baseURL: `${config.enviroment.API_URL}/${endpoint}`,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.http.interceptors.request.use((request) => {
      const token = useStore.getState().token;
      if (token) {
        const headers = request.headers as AxiosRequestHeaders | undefined;
        request.headers = {
          ...(headers ?? {}),
          Authorization: `Bearer ${token}`,
        } as AxiosRequestHeaders;
      }
      return request;
    });

    this.http.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;
        const message =
          error?.response?.data?.message?.toString().toLowerCase() || "";

        const requiresRedirect = status === 401 && message.includes("token");

        if (requiresRedirect) {
          useStore.getState().logout();
          if (typeof window !== "undefined") {
            window.location.replace("/login");
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async getAll(): Promise<T[]> {
    try {
      const response = await this.http.get<T[]>("");
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al obtener los datos";
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
      });
      throw error;
    }
  }

  async getById(id: number): Promise<T> {
    try {
      const response = await this.http.get<T>(`/${id}`);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        `Error al obtener el registro con ID: ${id}`;
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
      });
      throw error;
    }
  }

  async create(data: TNew): Promise<T> {
    try {
      const response = await this.http.post<T>("", data);
      toast.success("Registro creado exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al crear el registro";
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
      });
      throw error;
    }
  }

  async update(id: string, data: TUpdate): Promise<T> {
    try {
      const response = await this.http.put<T>(`/${id}`, data);
      toast.success("Registro actualizado exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al actualizar el registro";
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.http.delete<void>(`/${id}`);
      toast.success("Registro eliminado exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al eliminar el registro";
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
      });
      throw error;
    }
  }
}
