import React, { useState } from "react";
import "./ServicesGrid.css";
import homeContent from "../content/home.json";
import { useNavigate } from 'react-router-dom';

const imageMap = {
  "hoteles": "hotelesriviera.jfif",
  "hoteles-nacionales": "hotelnacional.jfif",
  "paquetes-nacionales": "paquetes.jfif",
  "pasadias": "tours.jfif",
  "paquetes-internacionales": "umbrellainternacionales.jfif",
  "viajes-europa": "boletos-avion.jfif",
  "renta-vehiculos": "traslados.jfif"
};

const getImageSrc = (name) => {
  const fileName = imageMap[name];
  if (fileName) {
    return `${process.env.PUBLIC_URL}/servicios-jpg/${fileName}`;
  }
  return `${process.env.PUBLIC_URL}/servicios-jpg/${name}.jfif`;
};

const slugToThemeClass = (slug) => {
  const map = {
    "hoteles": "theme-hoteles",
    "hoteles-nacionales": "theme-nacionales",
    "paquetes-nacionales": "theme-nacionales",
    "pasadias": "theme-pasadias",
    "paquetes-internacionales": "theme-internacionales",
    "viajes-europa": "theme-europa",
    "renta-vehiculos": "theme-renta-vehiculos"
  };
  return map[slug] || "";
};



const ServicesGrid = () => {
  const navigate = useNavigate();
  const services = homeContent.services || [];
  const [selectedService, setSelectedService] = useState("");
  const handleNavigate = (slug) => { if (slug) navigate(`/servicios/${slug}`); };
  const handleCardClick = (slug) => { if (!slug) return; setSelectedService(slug); handleNavigate(slug); };
  return (
    <section className={`services-grid home-services ${selectedService ? slugToThemeClass(selectedService) : ""}`}>
      <h2>Servicios</h2>
      <div className="grid">
        {services.map((srv, idx) => (
          <div className={`card service-card ${slugToThemeClass(srv.slug)} ${selectedService === srv.slug ? "active" : ""}`} key={idx}>
            {srv.image && (
              <img
                className="service-image clickable"
                loading="lazy"
                src={getImageSrc(srv.image)}
                alt={srv.title}
                onClick={() => handleCardClick(srv.slug)}
              />
            )}
            <h3>{srv.title}</h3>
            <p>{srv.desc}</p>
            <div className="card-actions">
              {srv.slug && <button className="btn btn-primary" onClick={() => handleCardClick(srv.slug)}>Ver paquetes</button>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesGrid;