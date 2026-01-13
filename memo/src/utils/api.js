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
    const method = (error?.config?.method || 'get').toLowerCase();
    const isNetworkErr = error && (error.code === 'ERR_NETWORK' || status === 0 || status === 502 || status === 503 || status === 504);
    if (status === 401) {
      try { localStorage.removeItem("token"); } catch (_) {}
      if (typeof window !== "undefined") window.location.href = "/admin-login";
      return Promise.reject(error);
    }
    if (isNetworkErr) {
      if (method === 'get') {
        return { data: [], status: 200, headers: {}, config: error.config };
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);


const CACHE_TTL_MS = 3600000;
const readCache = (key) => { try { const raw = localStorage.getItem(key); if (!raw) return null; const obj = JSON.parse(raw); if (!obj || typeof obj !== 'object') return null; return obj; } catch (_) { return null; } };
const writeCache = (key, value) => { try { const payload = { ts: Date.now(), data: value }; localStorage.setItem(key, JSON.stringify(payload)); } catch (_) {} };
const withTs = (p) => { const sep = p.includes('?') ? '&' : '?'; return `${p}${sep}_ts=${Date.now()}`; };
const cachedGet = async (path, options = {}, cacheKey) => {
  const getOpts = { ...options, timeout: Math.min((options && options.timeout) || 5000, 5000) };
  const cachedObj = cacheKey ? readCache(cacheKey) : null;
  const expired = cachedObj ? (Date.now() - (cachedObj.ts || 0) > CACHE_TTL_MS) : false;
  if (cachedObj) {
    // Mostrar datos de caché inmediatamente y revalidar en segundo plano
    api.get(withTs(path), getOpts).then((res) => {
      if (cacheKey) writeCache(cacheKey, res.data);
    }).catch(() => {});
    return { data: cachedObj.data, stale: expired };
  }
  const attempt = async () => {
    const res = await api.get(withTs(path), getOpts);
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
      return { data: [], stale: false };
    }
  }
};
export const getAlbums = (params = {}) => cachedGet(`/albums${toQuery(params)}`, undefined, `cache:albums:${JSON.stringify(params)}`);
export const createAlbum = (payload) => api.post('/albums', payload);
export const updateAlbum = (id, payload) => api.put(`/albums/${id}`, payload);
export const deleteAlbum = (id) => api.delete(`/albums/${id}`);
export const getPendingAlbums = () => api.get(`/albums/pending?_ts=${Date.now()}`);
export const approveAlbum = (id) => api.put(`/albums/${id}/approve`);
const toQuery = (params = {}) => { const entries = Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== ''); if (entries.length === 0) return ''; const usp = new URLSearchParams(); for (const [k, v] of entries) { usp.append(k, v); } return `?${usp.toString()}`; }; export const getPackages = (params = {}) => cachedGet(`/packages${toQuery(params)}`, undefined, `cache:packages:${JSON.stringify(params)}`);
export const getPackagesLive = async (params = {}) => { const qs = toQuery(params); const ts = Date.now(); const sep = qs ? '&' : '?'; return api.get(`/packages${qs}${sep}_ts=${ts}`, { timeout: 7000 }); };
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