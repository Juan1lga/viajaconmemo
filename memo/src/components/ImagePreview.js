import React, { useEffect } from "react";
import "./ImagePreview.css";

const ImagePreview = ({ src, alt, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose && onClose();
    };
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!src) return null;

  return (
    <div className="imgprev-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="imgprev-content" onClick={(e) => e.stopPropagation()}>
        <img className="imgprev-image" src={src} alt={alt || "Imagen"} />
        <button className="imgprev-close" aria-label="Cerrar" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default ImagePreview;