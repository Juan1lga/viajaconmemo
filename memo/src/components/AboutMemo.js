import React from "react";
import "./AboutMemo.css";

const AboutMemo = () => {
  const imageSrc = `${process.env.PUBLIC_URL}/memo.jpeg`;
  const fallbackSrc = process.env.REACT_APP_LOGO_URL || `${process.env.PUBLIC_URL}/memo-logo.jpg`;
  return (
    <section className="about-memo" id="about-memo">
      <div className="about-memo__container">
        <div className="about-memo__text">
          <h2 className="about-memo__title">¿Quién es Memo?</h2>
          <p className="about-memo__lead">Memo es un apasionado viajero que ha recorrido más de 50 países en los últimos 15 años. Su misión es compartir la belleza del mundo y hacer que cada viaje sea una experiencia transformadora.</p>
          <p className="about-memo__lead">Con un equipo de expertos en turismo y fotografía, creamos paquetes únicos que combinan aventura, cultura y descanso, siempre con el toque personal que nos caracteriza.</p>
          <div className="about-memo__stats">
            <div className="stat">
              <div className="stat__value">50+</div>
              <div className="stat__label">Países Visitados</div>
            </div>
            <div className="stat">
              <div className="stat__value">1000+</div>
              <div className="stat__label">Clientes Felices</div>
            </div>
            <div className="stat">
              <div className="stat__value">15</div>
              <div className="stat__label">Años de Experiencia</div>
            </div>
            <div className="stat">
              <div className="stat__value">24/7</div>
              <div className="stat__label">Soporte</div>
            </div>
          </div>
        </div>
        <div className="about-memo__media">
          <div className="media-card">
            <img src={imageSrc} alt="Memo" onError={(e) => { e.currentTarget.src = fallbackSrc; }} />
            <div className="media-quote">
              <span className="quote-text">"Cada viaje es una historia que contar"</span>
              <span className="quote-author">- Memo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMemo;