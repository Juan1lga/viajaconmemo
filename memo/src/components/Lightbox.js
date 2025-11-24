import React, { useEffect, useState } from "react";
import "./Lightbox.css";

const Lightbox = ({ images = [], startIndex = 0, onClose }) => {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose && onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [index]);

  const handlePrev = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  if (!images.length) return null;
  const current = images[index] || {};

  return (
    <div className="lightbox-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lb-btn lb-prev" aria-label="Atrás" onClick={handlePrev}>‹</button>
        <img className="lightbox-image" src={current.src} alt={current.title || "Imagen"} />
        <button className="lb-btn lb-next" aria-label="Siguiente" onClick={handleNext}>›</button>
        <button className="lb-close" aria-label="Cerrar" onClick={onClose}>✕</button>
        {(current.title || current.description) && (
          <div className="lightbox-caption">
            {current.title && <h3 className="heading-backdrop text-outline">{current.title}</h3>}
            {current.description && <p className="text-outline">{current.description}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lightbox;