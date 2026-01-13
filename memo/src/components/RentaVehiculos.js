import React from "react";
import "./RentaVehiculos.css";
import company from "../content/company.json";
import { openWhatsApp } from "../utils/whatsapp";

const images = [1, 2, 3, 4, 5,6,7,8,9,10,11,12].map((n) => `${process.env.PUBLIC_URL}/carros/${n}.jfif`);

const RentaVehiculos = () => {
  const handleWhatsApp = () => {
    openWhatsApp(company.phone, "Hola, me interesa la renta de vehículos.");
  };

  return (
    <section className="renta-vehiculos theme-renta-vehiculos">
      <div className="rv-container">
        <header className="rv-header">
          <h1 className="rv-title">Renta de vehículos</h1>
          <p className="rv-subtitle">Contamos con renta de varios vehículos, ideal para tu nuevo viaje.</p>
        </header>

        <div className="cars-grid">
          {images.map((src, idx) => (
            <figure className="car-card" key={idx}>
              <img className="car-img" src={src} alt={`Vehículo ${idx + 1}`} loading="lazy" />
            </figure>
          ))}
        </div>

        <div className="rv-cta">
          <p className="rv-cta-text">Si deseas rentar, contáctanos dando clic aquí</p>
          <button className="btn btn-success rv-cta-btn" onClick={handleWhatsApp}>
            Contactar por WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
};

export default RentaVehiculos;