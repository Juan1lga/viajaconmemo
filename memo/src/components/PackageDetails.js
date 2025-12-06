import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { assetsOrigin } from '../utils/api';
import { useParams } from 'react-router-dom';
import { openWhatsApp, sanitizeNumber } from "../utils/whatsapp";
import './PackageDetails.css';
import { formatMoney } from "../utils/formatMoney";
import { formatDateRange } from "../utils/formatDateRange";

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

  const rawImage = pkg.mainPhotoUrl || pkg.image;
  const imageUrl = rawImage && rawImage.startsWith('/uploads/') ? `${assetsOrigin}${rawImage}` : (rawImage || `${process.env.PUBLIC_URL}/memo-logo.jfif?v=2`);
  const cur = pkg.currency === 'MXN' ? 'MXN' : 'USD';
  const priceGeneral = formatMoney(pkg.price, cur);
  const priceDouble = formatMoney(pkg.priceDouble, cur);
  const priceChild = formatMoney(pkg.priceChild, cur);
  const priceAdult = formatMoney(pkg.priceAdult, cur);
  const range = formatDateRange(pkg.startDate, pkg.endDate, { style: 'short' });

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
          {pkg.description && <p className="package-description">{pkg.description}</p>}
           
          <div className="package-meta">
            <div className="meta-item">
              <span className="meta-title">Duración</span>
              {range ? (
                <span className="meta-content">{range}</span>
              ) : (
                <span className="meta-content">{pkg.duration || 'Consultar'}</span>
              )}
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
            <div className="price-row"><span>Base doble</span><span>{priceDouble}</span></div>
            <div className="price-row"><span>General</span><span>{priceGeneral}</span></div>
            <div className="price-row"><span>Niños</span><span>{priceChild}</span></div>
            <div className="price-row"><span>Adultos</span><span>{priceAdult}</span></div>
          </div>

          {(pkg.itinerary || pkg.description) && (
            <div className="package-itinerary">
              <h3 className="includes-title">Itinerario</h3>
              <p className="itinerary-text">{pkg.itinerary || pkg.description}</p>
            </div>
          )}

          <button className="whatsapp-button" onClick={handleWhatsApp}>
            Cotiza ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;