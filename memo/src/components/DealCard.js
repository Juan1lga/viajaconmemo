import React from "react";
import { Link } from "react-router-dom";
import { assetsOrigin } from "../utils/api";
import { formatMoney } from "../utils/formatMoney";
import { formatDateRange } from "../utils/formatDateRange";

const buildImageSrc = (image) => {
  if (!image) return `${process.env.PUBLIC_URL}/memo-logo.jfif?v=2`;
  return image.startsWith("/uploads/") ? `${assetsOrigin}${image}` : image;
};

const DealCard = ({ pkg }) => {
  if (!pkg) return null;
  const rawImage = pkg.mainPhotoUrl || pkg.image;
  const imgSrc = buildImageSrc(rawImage);
  const cur = pkg.currency === "MXN" ? "MXN" : "USD";
  const priceGeneral = formatMoney(pkg.price, cur);
  const priceDouble = formatMoney(pkg.priceDouble, cur);
  const priceChild = formatMoney(pkg.priceChild, cur);
  const priceAdult = formatMoney(pkg.priceAdult, cur);
  const range = formatDateRange(pkg.startDate, pkg.endDate, { style: "short" });

  return (
    <article className="deal-card">
      <div className="deal-image">
        <img src={imgSrc} alt={pkg.name} />
      </div>
      <div className="deal-info">
        <h3 className="deal-title">{pkg.name}</h3>
        {range ? (
          <div className="deal-duration">{range}</div>
        ) : (
          pkg.duration ? <div className="deal-duration">{pkg.duration}</div> : null
        )}
        <p className="deal-city">{pkg.description}</p>
        <div className="deal-price">
          <div className="price-row"><span>Base doble</span><span>{priceDouble}</span></div>
          <div className="price-row"><span>General</span><span>{priceGeneral}</span></div>
          <div className="price-row"><span>Niños</span><span>{priceChild}</span></div>
          <div className="price-row"><span>Adultos</span><span>{priceAdult}</span></div>
        </div>
        <div className="deal-actions">
          <Link to={`/packages/${pkg._id}`} className="btn btn-primary">Ver ofertas</Link>
        </div>
      </div>
    </article>
  );
};

export default DealCard;