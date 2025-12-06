import React, { useState } from "react";
import { Link } from "react-router-dom";
import { assetsOrigin } from "../utils/api";
import "./PackageCard.css";
import { formatMoney } from "../utils/formatMoney";
import { formatDateRange } from "../utils/formatDateRange";
import Lightbox from "./Lightbox";

const buildImageSrc = (image) => {
  if (!image) return "https://via.placeholder.com/600x400?text=Paquete";
  return image.startsWith("/uploads/") ? `${assetsOrigin}${image}` : image;
};

const PackageCard = ({ pkg, className, hideItinerary }) => {
  const [showLb, setShowLb] = useState(false);
  const title = pkg?.name || pkg?.title || "Paquete";
  const rawImage = pkg?.mainPhotoUrl || pkg?.image || pkg?.coverImage || (Array.isArray(pkg?.photos) ? pkg.photos[0]?.url : undefined);
  const imgSrc = buildImageSrc(rawImage || `${process.env.PUBLIC_URL}/memo-logo.jfif?v=2`);
  const includes = Array.isArray(pkg?.includes) ? pkg.includes : (typeof pkg?.includes === "string" ? pkg.includes.split(",").map(i => i.trim()).filter(Boolean) : []);
  
  const images = (Array.isArray(pkg?.photos) && pkg.photos.length ? pkg.photos.map(p => ({ src: buildImageSrc(p?.url || p?.src || p), title })) : [{ src: imgSrc, title }]);
  const shouldHide = Boolean(hideItinerary) || (typeof className === "string" && className.includes("compact"));
  const cur = (typeof pkg?.currency === "string" && pkg.currency.trim().toUpperCase() === "MXN") ? "MXN" : "USD";
  const generalRaw = pkg?.price ?? pkg?.generalPrice;
  const doubleRaw = pkg?.priceDouble ?? pkg?.doublePrice;
  const childRaw = pkg?.priceChild ?? pkg?.childPrice;
  const adultRaw = pkg?.priceAdult ?? pkg?.adultPrice;
  const isPositive = (v) => v !== undefined && v !== null && v !== "" && !isNaN(Number(v)) && Number(v) > 0;
  const dblLabel = (typeof pkg?.priceDoubleLabel === "string" && pkg.priceDoubleLabel.trim()) ? pkg.priceDoubleLabel.trim() : "Base doble";
  const badges = [
    isPositive(doubleRaw) && { key: "double", label: dblLabel, amount: formatMoney(Number(doubleRaw), cur) },
    isPositive(generalRaw) && { key: "general", label: "General", amount: formatMoney(Number(generalRaw), cur) },
    isPositive(childRaw) && { key: "child", label: "Ni\u00f1os", amount: formatMoney(Number(childRaw), cur) },
    isPositive(adultRaw) && { key: "adult", label: "Adultos", amount: formatMoney(Number(adultRaw), cur) },
  ].filter(Boolean);
  const renderDuration = () => {
    const range = formatDateRange(pkg?.startDate || pkg?.fechaInicio, pkg?.endDate || pkg?.fechaFin, { style: "short" });
    if (range) return <div className="pkg-duration">{range}</div>;
    const d = pkg?.duration || pkg?.duracion || pkg?.dateRange;
    if (!d) return <div className="pkg-duration">Fechas a consultar</div>;
    if (typeof d === "string") return <div className="pkg-duration">{d}</div>;
    if (typeof d === "object" && d.days != null && d.nights != null) return <div className="pkg-duration">{`${d.days} días ${d.nights} noches`}</div>;
    return null;
  };


  return (
    <article className={`package-card travel-card ${className || ""}`}>
      <div className="pkg-image" onClick={() => setShowLb(s => !s)}>
        <img src={imgSrc} alt={title} />
      </div>
      <div className="pkg-info">
        {pkg?.category && <div className="pkg-category">{pkg.category}</div>}
        <h3 className="pkg-title">{title}</h3>
        {renderDuration()}
        {!shouldHide && pkg?.description && <p className="pkg-desc">{pkg.description}</p>}
        {!shouldHide && includes.length > 0 && (
          <div className="pkg-includes">
            <span className="label">Incluye:</span>
            <div className="pkg-chips">
              {includes.map((item, idx) => (
                <span key={idx} className="pkg-chip">{item}</span>
              ))}
            </div>
          </div>
        )}
        <div className="pkg-footer">
          {badges.length > 0 && (
            <div className="pkg-prices">
              {badges.map((b) => (
                <div key={b.key} className={`price-row ${b.key}`}>
                  <span>{b.label}</span>
                  <span>{b.amount}</span>
                </div>
              ))}
            </div>
          )}
          <Link to={pkg?._id ? `/packages/${pkg._id}` : "/"} className="btn-cta cta-small">Ver oferta</Link>
        </div>
      </div>
      {showLb && <Lightbox images={images} startIndex={0} onClose={() => setShowLb(false)} />}
    </article>
  );
};

export default PackageCard;