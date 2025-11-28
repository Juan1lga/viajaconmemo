import React from "react";
import "./ServicesGrid.css";
import homeContent from "../content/home.json";

const imageMap = {
  "avion": "boletos-avion.jpg",
  "hotel": "hospedaje.png",
  "traslados": "traslados.jfif",
  "tours": "Tours.jpg",
  "paquetes": "paquetes.jfif",
  "asistencia": "asistencia.jfif"
};

const getImageSrc = (name) => {
  const fileName = imageMap[name];
  if (fileName) {
    return `/servicios-jpg/${fileName}`;
  }
  return `/assets/services/${name}.jpg`;
};



const ServicesGrid = () => {
  const services = homeContent.services || [];
  return (
    <section className="services-grid">
      <h2>Servicios</h2>
      <div className="grid">
        {services.map((srv, idx) => (
          <div className="card" key={idx}>
            {srv.image && (
              <img
                className="service-image"
                loading="lazy"
                src={getImageSrc(srv.image)}
                alt={srv.title}
              />
            )}
            <h3>{srv.title}</h3>
            <p>{srv.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesGrid;