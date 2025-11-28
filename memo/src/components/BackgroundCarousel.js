import React, { useEffect, useState } from "react";
import "./BackgroundCarousel.css";

const imageFiles = ["R (2).jfif", "Tours.jfif", "acapulco-baie.jfif", "europa.jfif", "europa2.jfif", "la-habana-2.jfif"];
const images = imageFiles.map(file => `${process.env.PUBLIC_URL}/imagenes-fondo/${file}`);

const BackgroundCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-carousel" aria-hidden="true">
      {images.map((src, i) => (
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