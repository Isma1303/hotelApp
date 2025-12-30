// Configuración de variables de entorno para Vite
// Las variables deben tener el prefijo VITE_ para ser accesibles en el cliente

export const config = {
  enviroment: {
    API_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
  },
};
