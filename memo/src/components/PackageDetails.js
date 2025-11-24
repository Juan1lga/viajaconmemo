import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { assetsOrigin } from '../utils/api';
import { useParams } from 'react-router-dom';
import { openWhatsApp, sanitizeNumber } from "../utils/whatsapp";
import './PackageDetails.css';

const PackageDetails = () => {
  const { id } = useParams();
  const [pkg, setPackage] = useState(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const { data } = await api.get(`/packages/${id}`);
        setPackage(data);
      } catch (error) {
        console.error("Error fetching package:", error);
      }
    };
    fetchPackage();
  }, [id]);

  if (!pkg) return <div className="loading">Cargando...</div>;

  const imageUrl = pkg.image && pkg.image.startsWith('/uploads/') ? `${assetsOrigin}${pkg.image}` : (pkg.image || 'https://via.placeholder.com/800x600');

  const handleWhatsApp = () => {
    const num = process.env.REACT_APP_WHATSAPP_NUMBER;
    const clean = sanitizeNumber(num);
    if (!clean) {
      alert("No hay número de WhatsApp configurado. Añade REACT_APP_WHATSAPP_NUMBER en el .env del front.");
      return;
    }
    const msg = `Hola, quiero cotizar el paquete "${pkg.name}".`;
    openWhatsApp(clean, msg);
  };

  return (
    <div className="package-details-container">
      <div className="package-details-card">
        <div className="package-image-section">
          <img src={imageUrl} alt={pkg.name} className="package-image" />
        </div>
        <div className="package-info-section">
          <h1 className="package-title">{pkg.name}</h1>
          <p className="package-description">{pkg.description}</p>
          
          <div className="package-meta">
            <div className="meta-item">
              <span className="meta-title">Duración</span>
              <span className="meta-content">{pkg.days} Días / {pkg.nights} Noches</span>
            </div>
          </div>

          {pkg.includes && pkg.includes.length > 0 && (
            <div className="package-includes">
              <h3 className="includes-title">Incluye</h3>
              <ul className="includes-list">
                {pkg.includes.map((item, index) => (
                  <li key={index} className="include-item">{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="package-price-section">
            <span className="price-from">Desde</span>
            <span className="package-price">${pkg.price}</span>
            <span className="price-currency">USD</span>
          </div>

          <button className="whatsapp-button" onClick={handleWhatsApp}>
            Cotiza ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;