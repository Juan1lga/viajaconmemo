import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { assetsOrigin } from '../utils/api';
import { useParams } from 'react-router-dom';
import { openWhatsApp, sanitizeNumber } from "../utils/whatsapp";
import './PackageDetails.css';
import { formatMoney } from "../utils/formatMoney";
import { formatDateRange } from "../utils/formatDateRange";
import ImagePreview from "./ImagePreview";

const PackageDetails = () => {
  const { id } = useParams();
  const [pkg, setPackage] = useState(null);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");

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
  const isPositive = (v) => v !== undefined && v !== null && v !== "" && !isNaN(Number(v)) && Number(v) > 0;
  const dblLabel = (typeof pkg?.priceDoubleLabel === 'string' && pkg.priceDoubleLabel.trim()) ? pkg.priceDoubleLabel.trim() : 'Base doble';
  const prices = [
    isPositive(pkg.priceDouble) && { key: 'double', label: dblLabel, amount: formatMoney(pkg.priceDouble, cur) },
    isPositive(pkg.price) && { key: 'general', label: 'General', amount: formatMoney(pkg.price, cur) },
    isPositive(pkg.priceChild) && { key: 'child', label: 'Ni\u00f1os', amount: formatMoney(pkg.priceChild, cur) },
    isPositive(pkg.priceAdult) && { key: 'adult', label: 'Adultos', amount: formatMoney(pkg.priceAdult, cur) },
  ].filter(Boolean);
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
          <img src={imageUrl} alt={pkg.name} className="package-image" onClick={() => { setPreviewSrc(imageUrl); setPreviewOpen(true); }} />
        </div>
        <div className="package-info-section">
          <h1 className="package-title">{pkg.name}</h1>
          
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

          {prices.length > 0 && (
            <div className="package-price-section">
              {prices.map(p => (
                <div key={p.key} className="price-row"><span>{p.label}</span><span>{p.amount}</span></div>
              ))}
            </div>
          )}

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
      {isPreviewOpen && <ImagePreview src={previewSrc} alt={pkg.name} onClose={() => setPreviewOpen(false)} />}
    </div>
  );
};

export default PackageDetails;