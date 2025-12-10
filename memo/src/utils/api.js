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
export const getAlbums = () => api.get('/albums');
export const createAlbum = (payload) => api.post('/albums', payload);
export const updateAlbum = (id, payload) => api.put(`/albums/${id}`, payload);
export const deleteAlbum = (id) => api.delete(`/albums/${id}`);
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