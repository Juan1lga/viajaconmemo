import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import DealCard from "./DealCard";
import "./Deals.css";

const DealsGrid = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await api.get("/packages");
        setPackages(data || []);
      } catch (e) {
        setError("No se pudieron cargar las ofertas.");
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <section className="deals-grid">
      <div className="deals-header">
        <h2>Ofertas de última hora para el fin de semana</h2>
        <Link to="/paquetes" className="btn-cta">Ver todas las ofertas</Link>
      </div>
      {loading && <div className="loader">Cargando ofertas...</div>}
      {!loading && error && <div className="error">{error}</div>}
      {!loading && !error && (
        <div className="deals-list">
          {packages.map((pkg) => (
            <DealCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      )}
    </section>
  );
};

export default DealsGrid;