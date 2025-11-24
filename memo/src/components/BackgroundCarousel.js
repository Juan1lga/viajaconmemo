import React, { useEffect, useState } from "react";
import "./BackgroundCarousel.css";

import { assetsOrigin } from "../utils/api";
const images = [
  `${assetsOrigin}/uploads/1762491063215-downtown-taxco.jpg`,
  `${assetsOrigin}/uploads/1762494155872-755804628-tizimin.jpg`,
  `${assetsOrigin}/uploads/1762488270724-rawImage.jpg`
];

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