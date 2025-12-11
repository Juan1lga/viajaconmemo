import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPackages, assetsOrigin } from "../utils/api";
import PackageCard from "./PackageCard";
import "./Deals.css";

const DealsGrid = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await getPackages();
        setPackages(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("No se pudieron cargar las ofertas.");
      } finally {
        setLoading(false);
      }
    };
    try {
      fetch(`${assetsOrigin}/health`, { cache: "no-store" }).catch(() => {});
    } catch (_) {}
    fetchPackages();
  }, []);

  return (
    <section className="deals-grid">
      <div className="deals-header">
        <h2>Explora nuestros paquetes</h2>
        <Link to="/paquetes" className="btn-cta">Ver todos los paquetes</Link>
      </div>
      {loading && <div className="loader">Cargando ofertas...</div>}
      {!loading && error && <div className="error">{error}</div>}
      {!loading && !error && (
        <div className="deals-list">
          {packages
            .filter(p => p.popular === true || p.category === 'Populares')
            .slice(0, 8)
            .map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} className="package-card" hideItinerary showIncludes />
            ))}
        </div>
      )}
    </section>
  );
};

export default DealsGrid;