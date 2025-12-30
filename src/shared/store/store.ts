import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { IUser } from "../../auth/interface/auth.interface";

export interface StoreState {
  token: string | null;
  user: IUser | null;
  isAuthenticated: boolean;

  setToken: (token: string | null) => void;
  setUser: (user: IUser | null) => void;
  login: (token: string, user: IUser) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        token: null,
        user: null,
        isAuthenticated: false,

        setToken: (token: string | null) => {
          set({ token, isAuthenticated: !!token });
        },

        setUser: (user: IUser | null) => {
          set({ user });
        },

        login: (token: string, user: IUser) => {
          set({
            token,
            user,
            isAuthenticated: true,
          });
        },

        logout: () => {
          set({
            token: null,
            user: null,
            isAuthenticated: false,
          });
        },

        checkAuth: () => {
          const state = get();

          // First gate: rely on the app's authenticated flag
          if (!state.isAuthenticated) {
            return false;
          }

          // If we have a token, attempt to validate JWT expiration.
          if (state.token) {
            const parts = state.token.split(".");
            const looksLikeJwt = parts.length === 3;

            if (looksLikeJwt) {
              try {
                const payloadJson = atob(parts[1]);
                const payload = JSON.parse(payloadJson);
                const isExpired =
                  payload.exp && payload.exp * 1000 < Date.now();

                if (isExpired) {
                  get().logout();
                  return false;
                }

                return true;
              } catch (error) {
                // If parsing fails, treat as opaque token and accept.
                return true;
              }
            }

            // Non-JWT token present: accept
            return true;
          }

          // No token present: accept if marked authenticated (e.g., cookie-based session)
          return true;
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          token: state.token,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
