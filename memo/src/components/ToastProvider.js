import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const ToastContext = createContext({ showSuccess: () => {}, showError: () => {} });
export const useToast = () => useContext(ToastContext);

const genId = () => Math.random().toString(36).slice(2);
const isTimeoutLike = (msg) => {
  try {
    if (typeof msg === "string") return /timeout|ECONNABORTED/i.test(msg);
    if (msg && typeof msg === "object") {
      const code = msg.code || "";
      const status = msg.response?.status;
      const message = String(msg.message || "");
      return code === "ECONNABORTED" || /timeout/i.test(message) || status === 408 || status === 504;
    }
    return false;
  } catch (_) {
    return false;
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const pushToast = React.useCallback((type, message, options = {}) => {
    const isSilent = options && options.silent;
    if (isSilent || isTimeoutLike(message)) {
      return;
    }
    const safeMsg = typeof message === "string"
      ? message
      : (message?.response?.data?.msg || String(message?.message || "") || "");
    if (!safeMsg || !String(safeMsg).trim()) {
      return;
    }
    const id = genId();
    const ttl = options.ttl ?? 4000; // ms
    const newToast = { id, type, message: safeMsg };
    setToasts((prev) => [newToast, ...prev]);
    const timer = setTimeout(() => removeToast(id), ttl);
    timersRef.current.set(id, timer);
  }, [removeToast]);

  const showSuccess = React.useCallback((message, options) => pushToast("success", message, options), [pushToast]);
  const showError = React.useCallback((message, options) => {
    if (isTimeoutLike(message)) return;
    return pushToast("error", message, options);
  }, [pushToast]);

  const value = useMemo(() => ({ showSuccess, showError }), [showSuccess, showError]);

  // Exponer manejadores globales para uso desde utilidades (axios interceptors)
  useEffect(() => {
    const g = typeof window !== "undefined" ? window : {};
    g.__toast = {
      success: (msg, opts) => showSuccess(msg, opts),
      error: (msg, opts) => showError(msg, opts),
    };
    const timersMap = timersRef.current;
    return () => {
      if (g.__toast) delete g.__toast;
      timersMap.forEach((timer) => clearTimeout(timer));
      timersMap.clear();
    };
  }, [showSuccess, showError]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Contenedor de toasts */}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item toast-${t.type}`} role="status">
            <div className="toast-content">
              <span className="toast-icon" aria-hidden="true">{t.type === "success" ? "✔" : "✖"}</span>
              <span className="toast-message">{t.message}</span>
              <button className="toast-close" aria-label="Cerrar" onClick={() => removeToast(t.id)}>×</button>
            </div>
          </div>
        ))}
      </div>
      {/* Estilos embebidos para no depender de archivos CSS adicionales */}
      <style>{`
        .toast-container{position:fixed;top:16px;right:16px;display:flex;flex-direction:column;gap:10px;z-index:2000}
        .toast-item{min-width:280px;max-width:360px;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.18);color:#fff;overflow:hidden;animation:toastSlideIn .38s ease, toastFadeOut .3s ease 4s forwards}
        .toast-content{display:flex;align-items:center;gap:12px;padding:12px 14px}
        .toast-icon{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.2)}
        .toast-message{flex:1;font-weight:600;letter-spacing:.2px}
        .toast-close{background:transparent;border:none;color:#fff;font-size:18px;line-height:1;cursor:pointer;opacity:.9}
        .toast-close:hover{opacity:1}
        .toast-success{background:linear-gradient(135deg,#1FAA59,#58D68D)}
        .toast-error{background:linear-gradient(135deg,#E74C3C,#FF6B6B)}
        @keyframes toastSlideIn{from{opacity:0;transform:translate3d(24px,-8px,0) scale(.98)}to{opacity:1;transform:translate3d(0,0,0) scale(1)}}
        @keyframes toastFadeOut{to{opacity:0;transform:translate3d(8px,-6px,0) scale(.98)}}
      `}</style>
    </ToastContext.Provider>
  );
};

export default ToastProvider;