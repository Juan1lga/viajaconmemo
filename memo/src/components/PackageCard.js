import React, { useState } from "react";
import { Link } from "react-router-dom";
import { assetsOrigin } from "../utils/api";
import "./PackageCard.css";
import "./PackageCard.plain.css";
import { formatMoney } from "../utils/formatMoney";
import { formatDateRange } from "../utils/formatDateRange";
import Lightbox from "./Lightbox";


const buildImageSrc = (image) => {
  if (!image) return "https://via.placeholder.com/600x400?text=Paquete";
  return image.startsWith("/uploads/") ? `${assetsOrigin}${image}` : image;
};

// Devuelve la URL original de Cloudinary sin transformaciones para ver la imagen completa
const stripCloudinaryTransforms = (url) => {
  if (typeof url !== "string") return url;
  try {
    return url.replace(/(\/image\/upload\/)(?!v\d+\/)([^/]+\/)/, "$1");
  } catch (e) {
    return url;
  }
};

const getDurationText = (pkg) => {
  const range = formatDateRange(pkg?.startDate || pkg?.fechaInicio, pkg?.endDate || pkg?.fechaFin, { style: "short" });
  if (range) return range;
  const d = pkg?.duration || pkg?.duracion || pkg?.dateRange;
  if (!d) return "Fechas a consultar";
  if (typeof d === "string") return d;
  if (typeof d === "object" && d.days != null && d.nights != null) return `${d.days} días ${d.nights} noches`;
  return "";
};

const PackageCard = ({ pkg, className, hideItinerary, showIncludes, variant, enablePreview = false, plain = false }) => {
  const [showLb, setShowLb] = useState(false);
  const title = pkg?.name || pkg?.title || "Paquete";
  const rawImage = pkg?.mainPhotoUrl || pkg?.image || pkg?.coverImage || (Array.isArray(pkg?.photos) ? pkg.photos[0]?.url : undefined);
  const imgSrc = buildImageSrc(rawImage || `${process.env.PUBLIC_URL}/memo-logo.jfif?v=2`);
  const includes = Array.isArray(pkg?.includes) ? pkg.includes : (typeof pkg?.includes === "string" ? pkg.includes.split(",").map(i => i.trim()).filter(Boolean) : []);
  
  const images = (
  Array.isArray(pkg?.photos) && pkg.photos.length
    ? pkg.photos.map(p => {
        const srcRaw = buildImageSrc(p?.url || p?.src || p);
        const src = stripCloudinaryTransforms(srcRaw);
        return { src, title };
      })
    : [{ src: stripCloudinaryTransforms(imgSrc), title }]
);
  const variantStr = typeof variant === "string" ? variant : (typeof className === "string" ? className : "");
  const variantList = variantStr.split(/\s+/).filter(Boolean);
  const hasVar = (v) => variantList.includes(v);
  const isCompact = hasVar("compact");
  const isVertical = hasVar("vertical");
  const isSmall = hasVar("small");
  const isBooking = hasVar("booking");
  const cur = (typeof pkg?.currency === "string" && pkg.currency.trim().toUpperCase() === "MXN") ? "MXN" : "USD";
  const generalRaw = pkg?.price ?? pkg?.generalPrice;
  const doubleRaw = pkg?.priceDouble ?? pkg?.doublePrice;
  const childRaw = pkg?.priceChild ?? pkg?.childPrice;
  const adultRaw = pkg?.priceAdult ?? pkg?.adultPrice;
  const isPositive = (v) => v !== undefined && v !== null && v !== "" && !isNaN(Number(v)) && Number(v) > 0;
  const dblLabel = (typeof pkg?.priceDoubleLabel === "string" && pkg.priceDoubleLabel.trim()) ? pkg.priceDoubleLabel.trim() : "Base doble";
  const customPrice = (typeof pkg?.priceCustom === "string" && pkg.priceCustom.trim()) ? pkg.priceCustom.trim() : null;
  const customPrice2 = (typeof pkg?.priceCustom2 === "string" && pkg.priceCustom2.trim()) ? pkg.priceCustom2.trim() : null;
  const customPrice3 = (typeof pkg?.priceCustom3 === "string" && pkg.priceCustom3.trim()) ? pkg.priceCustom3.trim() : null;
  const customPrice4 = (typeof pkg?.priceCustom4 === "string" && pkg.priceCustom4.trim()) ? pkg.priceCustom4.trim() : null;
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


  

  if (plain) {
    const dt = getDurationText(pkg);
    return (
      <article className="package-card-plain">
        <div className="pkg-image-plain" onClick={() => { setShowLb(true); }}>
          <img src={imgSrc} alt={title} />
        </div>
        <div className="pkg-info-plain">
          {pkg?.category && <div className="pkg-category-plain">{pkg.category}</div>}
          <h3 className="pkg-title-plain">{title}</h3>
          {dt && <div className="pkg-duration-plain">{dt}</div>}
          {(showIncludes) && includes.length > 0 && (
            <div className="pkg-includes-plain">
              <span className="label-plain">Incluye:</span>
              <div className="pkg-chips-plain">
                {includes.slice(0, 2).map((item, idx) => (
                  <span key={idx} className="pkg-chip-plain">{item}</span>
                ))}
              </div>
            </div>
          )}
          <div className="pkg-footer-plain">
            {(customPrice || customPrice2 || customPrice3 || customPrice4 || badges.length > 0) && (
              <div className="pkg-prices-plain">
                {customPrice && (<div className="price-row-plain">{customPrice}</div>)}
                {customPrice2 && (<div className="price-row-plain">{customPrice2}</div>)}
                {customPrice3 && (<div className="price-row-plain">{customPrice3}</div>)}
                {customPrice4 && (<div className="price-row-plain">{customPrice4}</div>)}
                {badges.map((b) => (
                  <div key={b.key} className="price-row-plain">
                    <span>{b.label}</span>
                    <span>{b.amount}</span>
                  </div>
                ))}
              </div>
            )}
            <Link to={pkg?._id ? `/packages/${pkg._id}` : "/"} className="btn-cta-plain">Ver oferta</Link>
          </div>
        </div>
        {showLb && <Lightbox images={images} startIndex={0} onClose={() => setShowLb(false)} showControls={false} />}
      </article>
    );
  }

  return (
    <article className={`package-card ${isCompact ? "compact" : ""} ${isVertical ? "vertical" : ""} ${isSmall ? "small" : ""} ${isBooking ? "booking" : ""} ${className || ""}`}>
        <div className="cards__item__pic-wrap pkg-image" onClick={() => { setShowLb(true); }}>
          <img className='cards__item__img' src={imgSrc} alt={title} />
        </div>
        <div className="cards__item__info pkg-info">
          {pkg?.category && <div className="pkg-category">{pkg.category}</div>}
          <h3 className="cards__item__text pkg-title">{title}</h3>
        {renderDuration()}
        {(showIncludes || isCompact) && includes.length > 0 && (
          <div className="pkg-includes">
            <span className="label">Incluye:</span>
            <div className="pkg-chips">
              {includes.slice(0, 2).map((item, idx) => (
                <span key={idx} className="pkg-chip">{item}</span>
              ))}
            </div>
          </div>
        )}
        <div className="pkg-footer">
          {(customPrice || customPrice2 || customPrice3 || customPrice4 || badges.length > 0) && (
            <div className="pkg-prices">
              {customPrice && (
                <div className="price-row price-badge custom">{customPrice}</div>
              )}
              {customPrice2 && (
                <div className="price-row price-badge custom">{customPrice2}</div>
              )}
              {customPrice3 && (
                <div className="price-row price-badge custom">{customPrice3}</div>
              )}
              {customPrice4 && (
                <div className="price-row price-badge custom">{customPrice4}</div>
              )}
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
      {showLb && <Lightbox images={images} startIndex={0} onClose={() => setShowLb(false)} showControls={false} />}
      
    </article>
  );
};

export default PackageCard;