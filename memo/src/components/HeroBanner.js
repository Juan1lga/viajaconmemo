import React from "react";
import "./HeroBanner.css";
import { openWhatsApp } from "../utils/whatsapp";
import homeContent from "../content/home.json";
import company from "../content/company.json";
import TypewriterTitle from "./TypewriterTitle";


const HeroBanner = () => {
  const number = company.phone || "";
  const handleClick = () => openWhatsApp(number, "Hola, me gustar\u00eda cotizar mi viaje.");
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <section className="hero-banner hero-overlay">
      <div className="hero-inner">

        <h1 className="hero-title text-outline">
          <TypewriterTitle text={homeContent.hero.title} speed={140} />
        </h1>
        <p className="subtitle text-outline">{homeContent.hero.subtitle}</p>
        <div className="hero-actions">
          <button className="btn-cta" onClick={() => scrollTo("gallery")}>Ver Galería</button>
                    <button className="btn-cta secondary" onClick={() => scrollTo("packages")}>Explorar Paquetes</button>

        </div>
        <button className="whatsapp-btn" onClick={handleClick}>{homeContent.hero.ctaText}</button>
      </div>
    </section>
  );
};

export default HeroBanner;