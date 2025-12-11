import axios from "axios";
const baseURL = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";
export const assetsOrigin = process.env.REACT_APP_ASSETS_ORIGIN || baseURL.replace(/\/api$/, "");
const api = axios.create({ baseURL, timeout: 30000 });

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
    const isNetworkErr = error && error.code === 'ERR_NETWORK';
    const msg = error?.response?.data?.msg || (isNetworkErr ? 'No se pudo conectar con el servidor. Verifica tu conexión y que la API esté activa.' : error.message) || 'Error inesperado';
    try {
      if (!isNetworkErr && typeof window !== "undefined" && window.__toast && typeof window.__toast.error === "function") {
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


const CACHE_TTL_MS = 3600000;
const readCache = (key) => { try { const raw = localStorage.getItem(key); if (!raw) return null; const obj = JSON.parse(raw); if (!obj || typeof obj !== 'object') return null; return obj; } catch (_) { return null; } };
const writeCache = (key, value) => { try { const payload = { ts: Date.now(), data: value }; localStorage.setItem(key, JSON.stringify(payload)); } catch (_) {} };
const cachedGet = async (path, options = {}, cacheKey) => {
  const getOpts = { ...options, timeout: Math.min((options && options.timeout) || 5000, 5000) };
  const cachedObj = cacheKey ? readCache(cacheKey) : null;
  const expired = cachedObj ? (Date.now() - (cachedObj.ts || 0) > CACHE_TTL_MS) : false;
  if (cachedObj) {
    // Mostrar datos de caché inmediatamente y revalidar en segundo plano
    api.get(path, getOpts).then((res) => {
      if (cacheKey) writeCache(cacheKey, res.data);
    }).catch(() => {});
    return { data: cachedObj.data, stale: expired };
  }
  const attempt = async () => {
    const res = await api.get(path, getOpts);
    if (cacheKey) writeCache(cacheKey, res.data);
    return res;
  };
  try {
    return await attempt();
  } catch (err) {
    // Reintento rápido con backoff corto
    await new Promise((r) => setTimeout(r, 1200));
    try {
      return await attempt();
    } catch (err2) {
      return Promise.reject(err2);
    }
  }
};
export const getAlbums = () => cachedGet('/albums', undefined, 'cache:albums');
export const createAlbum = (payload) => api.post('/albums', payload);
export const updateAlbum = (id, payload) => api.put(`/albums/${id}`, payload);
export const deleteAlbum = (id) => api.delete(`/albums/${id}`);
export const getPackages = () => cachedGet('/packages', undefined, 'cache:packages');
export const getAlbumPhotos = (id, params = {}) => api.get(`/albums/${id}/photos`, { params });
export const uploadPhoto = (formData) => api.post('/photos/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const createAlbumWithCover = async (name, file) => {
  try {
    const fd = new FormData();
    fd.append('name', name);
    if (file) fd.append('cover', file);
    const { data } = await api.post('/albums', fd);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateAlbumWithCover = async (id, name, file) => {
  try {
    const fd = new FormData();
    if (name !== undefined) fd.append('name', name);
    if (file) fd.append('cover', file);
    const { data } = await api.put(`/albums/${id}`, fd);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export default api;