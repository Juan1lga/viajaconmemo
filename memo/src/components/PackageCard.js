import React from "react";
import { Link } from "react-router-dom";
import { assetsOrigin } from "../utils/api";
import "./PackageCard.css";

const buildImageSrc = (image) => {
  if (!image) return "https://via.placeholder.com/600x400?text=Paquete";
  return image.startsWith("/uploads/") ? `${assetsOrigin}${image}` : image;
};

const PackageCard = ({ pkg, className }) => {
  if (!pkg) return null;
  const imgSrc = buildImageSrc(pkg.image);
  const includes = Array.isArray(pkg.includes) ? pkg.includes : [];
  const renderDuration = () => {
    const d = pkg.duration;
    if (!d) return null;
    if (typeof d === "string") return <div className="pkg-duration">{d}</div>;
    if (typeof d === "object" && d.days != null && d.nights != null) return <div className="pkg-duration">{`${d.days} días ${d.nights} noches`}</div>;
    return null;
  };
  const amount = pkg.price != null && pkg.price !== "" ? pkg.price : "Consultar";

  return (
    <article className={`package-card package-card-horizontal travel-card ${className || ""}`}>
      <div className="pkg-image">
        <img src={imgSrc} alt={pkg.name} />
      </div>
      <div className="pkg-info">
        {pkg.category && <div className="pkg-category">{pkg.category}</div>}
        <h3 className="pkg-title">{pkg.name}</h3>
        {renderDuration()}
        {pkg.description && <p className="pkg-desc">{pkg.description}</p>}
        {includes.length > 0 && (
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
          <div className="pkg-price">
            <span className="from">Desde</span>
            <span className="amount">${amount}</span>
          </div>
          <Link to={`/packages/${pkg._id}`} className="btn-cta">Ver ofertas</Link>
        </div>
      </div>
    </article>
  );
};

export default PackageCard;