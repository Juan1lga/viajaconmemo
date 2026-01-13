import { useEffect, useRef, useState } from "react";
import { getPackagesLive } from "../utils/api";

const useAutoRefreshPackages = (params = {}, intervalMs = 2000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const mountedRef = useRef(true);
  const timerRef = useRef(null);
  const firstLoadRef = useRef(true);

  const doFetch = async () => {
    try {
      if (!mountedRef.current) return;
      if (firstLoadRef.current) setLoading(true);
      setError("");
      const { data: res } = await getPackagesLive(params);
      if (!mountedRef.current) return;
      setData(Array.isArray(res) ? res : []);
      setError("");
    } catch (e) {
      if (!mountedRef.current) return;
      setError(e?.response?.data?.msg || e?.message || "No se pudieron cargar los paquetes.");
      // Mantener los datos previos para evitar saltos en la UI
    } finally {
      if (mountedRef.current && firstLoadRef.current) {
        setLoading(false);
        firstLoadRef.current = false;
      }
    }
  };

  const refetchNow = () => {
    doFetch();
  };

  useEffect(() => {
    mountedRef.current = true;

    const handleFocus = () => {
      if (mountedRef.current) doFetch();
    };
    const handleVisibility = () => {
      if (mountedRef.current && typeof document !== "undefined" && document.visibilityState === "visible") {
        doFetch();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("focus", handleFocus);
    }
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibility);
    }

    doFetch();
    if (intervalMs && intervalMs > 0) {
      timerRef.current = setInterval(doFetch, intervalMs);
    }
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", handleFocus);
      }
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibility);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params), intervalMs]);

  return { data, loading, error, refetchNow };
};

export default useAutoRefreshPackages;
export { useAutoRefreshPackages };