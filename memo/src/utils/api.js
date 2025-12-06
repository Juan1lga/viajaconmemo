import axios from "axios";
const baseURL = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";
export const assetsOrigin = process.env.REACT_APP_ASSETS_ORIGIN || baseURL.replace(/\/api$/, "");
const api = axios.create({ baseURL, timeout: 10000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const msg = error?.response?.data?.msg || (error.code === 'ERR_NETWORK' ? 'No se pudo conectar con el servidor. Verifica tu conexión y que la API esté activa.' : error.message) || 'Error inesperado';
    try {
      if (typeof window !== "undefined" && window.__toast && typeof window.__toast.error === "function") {
        window.__toast.error(msg);
      }
    } catch (_) {}
    if (status === 401) {
      try { localStorage.removeItem("token"); } catch (_) {}
      window.location.href = "/admin-login";
    }
    return Promise.reject(error);
  }
);

export default api;