import React from 'react';
import HeroBanner from './HeroBanner';

import './Home.css';
import Logo from './Logo';
import AboutMemo from './AboutMemo';

import ServicesGrid from './ServicesGrid';
import homeContent from '../content/home.json';
import company from '../content/company.json';
import { openWhatsApp } from '../utils/whatsapp';
import { AlbumsPreview } from './AlbumsFeature';
import CompanyPage from './CompanyPage';
import Team from './Team';


import CompanyStats from './CompanyStats';
import Testimonials from './Testimonials';

const Home = ({ user }) => {
  const number = company.phone || "";
  const handleContact = () => openWhatsApp(number, "Hola, me gustaría cotizar mi viaje.");
  return (
    <div className="home">
      <div className="logo-right"><Logo size="lg" showText={true} /></div>
      <HeroBanner />
      <div className="container">

        {/* Servicios con tarjetas */}
        <section className="section-pad">
          <h2 className="section-title">Nuestros servicios</h2>
          <p className="section-subtitle">Todo lo que necesitas para planear y disfrutar tu viaje, en un solo lugar.</p>
          <ServicesGrid />
        </section>


        {/* CTA principal */}
        <div className="cta-block" style={{textAlign:'center',padding:'1.5rem 1rem'}}>
          <h2 className="cta-title">{homeContent.cta?.title}</h2>
          <p className="text-outline" style={{color:'#fff'}}>{homeContent.cta?.text}</p>
          <button className="whatsapp-btn" onClick={handleContact}>
            {homeContent.cta?.button || 'Contactar'}
          </button>
        </div>

        {/* Galería y empresa */}
        <section id="gallery" className="section-pad">
          <AlbumsPreview />
        </section>
        <section className="section-pad">
          <CompanyPage embedded />
        </section>

        {/* Estadísticas de la empresa */}
        <section className="section-pad">
          <h2 className="section-title">Confianza y resultados</h2>
          <p className="section-subtitle">Nos respaldan nuestras cifras y la satisfacción de nuestros clientes.</p>
          <CompanyStats stats={company.stats || {}} />
        </section>

        {/* Sobre nosotros */}
        <section className="section-pad">
          <AboutMemo />
        </section>

        {/* Testimonios */}
        <section className="section-pad">
          <h2 className="section-title">Testimonios</h2>
          <p className="section-subtitle">Opiniones reales de clientes satisfechos que viajaron con nosotros.</p>
          <Testimonials />
        </section>

        {/* Equipo */}
        <section className="section-pad">
          <Team />
        </section>

      </div>
    </div>
  );
};

export default Home;