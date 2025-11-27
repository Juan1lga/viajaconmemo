import React from "react";
import { assetsOrigin } from "../utils/api";
import "./ServicesGrid.css";
import homeContent from "../content/home.json";
const imageMap = {
  avion: `${assetsOrigin}/uploads/voletos%20de%20avion.jpeg`,
  hotel: `${assetsOrigin}/uploads/hospedaje.png`,
  traslados: `${assetsOrigin}/uploads/traslados.png`,
  tours: `${assetsOrigin}/uploads/Tours.jpg`,
  paquetes: `${assetsOrigin}/uploads/1762484909822-Flyer%20Turismo%20Cancun%20Playa%20Simple%20Azul%20y%20Naranja.jpg`,
  asistencia: `${assetsOrigin}/uploads/1762488330414-495417440-89.jpg`,
};

const getImageSrc = (name) => imageMap[name] || `/assets/services/${name}.jpg`;



const ServicesGrid = () => {
  const services = homeContent.services || [];
  return (
    <section className="services-grid">
      <h2>Servicios</h2>
      <div className="grid">
        {services.map((srv, idx) => (
          <div className="card" key={idx}>
            {srv.image && imageMap[srv.image] && (
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