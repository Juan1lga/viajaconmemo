import React, { useEffect, useState } from "react";
import "./BackgroundCarousel.css";

const imageFiles = ["R (2).jfif", "Tours.jfif", "acapulco-baie.jfif", "europa.jfif", "europa2.jfif", "la-habana-2.jfif"];
const images = imageFiles.map(file => `/imagenes-fondo/${file}`);
const fallback = "/memo-logo.jfif";

const BackgroundCarousel = () => {
  const [slides, setSlides] = useState([fallback]);
  const [index, setIndex] = useState(0);

  // Pre-carga de imágenes con reemplazo en caso de error
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      images.map(src => new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => resolve(fallback);
        img.src = src;
      }))
    ).then(result => { if (!cancelled) { setSlides(result); setIndex(0); } });
    return () => { cancelled = true; };
  }, []);

  // Avance cíclico seguro usando la longitud real de slides
  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setIndex(i => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <div className="bg-carousel" aria-hidden="true">
      {slides.map((src, i) => (
        <div
          key={i}
          className={`bg-slide ${i === index ? "active" : ""}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className="bg-overlay" />
    </div>
  );
};

export default BackgroundCarousel;