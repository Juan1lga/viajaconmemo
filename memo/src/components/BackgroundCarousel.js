import React, { useEffect, useState } from "react";import { useLocation } from "react-router-dom";import "./BackgroundCarousel.css";

const fallback = "/memo-logo.jfif?v=3";

// Mapeo de imagen por ruta (usando archivos disponibles actualmente)
const routeBackgrounds = {
  "/": "/imagenes-fondo/acapulco-baie.jfif?v=3",
  "/paquetes": "/imagenes-fondo/Tours.jfif?v=3",
  "/albums": "/imagenes-fondo/europa.jfif?v=3",
  "/album": "/imagenes-fondo/europa2.jfif?v=3",
  "/company": "/imagenes-fondo/la-habana-2.jfif?v=3",
  "/team": "/imagenes-fondo/la-habana-2.jfif?v=3"
};

function pickSrc(pathname) {
  if (pathname.startsWith("/packages/")) return routeBackgrounds["/paquetes"] || routeBackgrounds["/"];
  if (pathname.startsWith("/albums/")) return routeBackgrounds["/albums"] || routeBackgrounds["/"];
  return routeBackgrounds[pathname] || routeBackgrounds["/"];
}

const BackgroundCarousel = () => {
  const location = useLocation();
  const [slides, setSlides] = useState([fallback]);
  const [index, setIndex] = useState(0);

  // Fondo estático: precarga según la ruta actual con fallback
  useEffect(() => {
    let cancelled = false;
    const src = pickSrc(location.pathname);
    const img = new Image();
    img.onload = () => { if (!cancelled) { setSlides([src]); setIndex(0); } };
    img.onerror = () => { if (!cancelled) { setSlides([fallback]); setIndex(0); } };
    img.src = src;
    return () => { cancelled = true; };
  }, [location.pathname]);

  return (
    <div className="bg-carousel" aria-hidden="true">
      {slides.map((src, i) => (
        <div key={i} className={`bg-slide ${i === index ? "active" : ""}`} style={{ backgroundImage: `url(${src})` }} />
      ))}
      <div className="bg-overlay" />
    </div>
  );
};

export default BackgroundCarousel;