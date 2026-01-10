import React from "react";
import "./ServicesGrid.css";
import homeContent from "../content/home.json";
import { useState } from 'react';
import Lightbox from './Lightbox';

const imageMap = {
  "avion": "boletos-avion.jfif",
  "hotel": "hospedaje.jfif",
  "traslados": "traslados.jfif",
  "tours": "tours.jfif",
  "paquetes": "paquetes.jfif",
  "asistencia": "asistencia.jfif"
};

const getImageSrc = (name) => {
  const fileName = imageMap[name];
  if (fileName) {
    return `${process.env.PUBLIC_URL}/servicios-jpg/${fileName}`;
  }
  return `${process.env.PUBLIC_URL}/servicios-jpg/${name}.jfif`;
};



const ServicesGrid = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleImageClick = (imgSrc, altText) => {
    setSelectedImage({ src: imgSrc, title: altText });
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };
  const services = homeContent.services || [];
  return (
    <section className="services-grid">
      <h2>Servicios</h2>
      <div className="grid">
        {services.map((srv, idx) => (
          <div className="card" key={idx}>
            {srv.image && (
              <img
                className="service-image clickable"
                loading="lazy"
                src={getImageSrc(srv.image)}
                alt={srv.title}
                onClick={() => handleImageClick(getImageSrc(srv.image), srv.title)}
              />
            )}
            <h3>{srv.title}</h3>
            <p>{srv.desc}</p>
          </div>
        ))}
      </div>
      {isOpen && (
        <Lightbox
          images={[selectedImage]}
          currentIndex={0}
          onClose={closeLightbox}
        />
      )}
    </section>
  );
};

export default ServicesGrid;