import React from "react";
import { Link } from "react-router-dom";
import { assetsOrigin } from "../utils/api";

const buildImageSrc = (image) => {
  if (!image) return "https://via.placeholder.com/600x400?text=Oferta";
  return image.startsWith("/uploads/") ? `${assetsOrigin}${image}` : image;
};

const DealCard = ({ pkg }) => {
  const imgSrc = buildImageSrc(pkg.image);
  return (
    <article className="deal-card">
      <div className="deal-image">
        <img src={imgSrc} alt={pkg.name} />
        <div className="deal-rating">9.0</div>
      </div>
      <div className="deal-info">
        <h3 className="deal-title">{pkg.name}</h3>
        <p className="deal-city">{pkg.description}</p>
        <div className="deal-price">
          <span className="per-night">Precio</span>
          <span className="total">${pkg.price}</span>
        </div>
        <div className="deal-actions">
          <Link to={`/packages/${pkg._id}`} className="btn btn-primary">Ver ofertas</Link>
        </div>
      </div>
    </article>
  );
};

export default DealCard;