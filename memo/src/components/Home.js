import React from 'react';
import HeroBanner from './HeroBanner';
import DealsGrid from './DealsGrid';
import Gallery from './Gallery';
import './Home.css';
import Logo from './Logo';

import ServicesGrid from './ServicesGrid';
import homeContent from '../content/home.json';
import company from '../content/company.json';
import { openWhatsApp } from '../utils/whatsapp';

const Home = ({ user }) => {
  const number = company.phone || "";
  const handleContact = () => openWhatsApp(number, "Hola, me gustaría cotizar mi viaje.");
  return (
    <div className="home">
      <div className="logo-right"><Logo size="lg" showText={true} /></div>
      <HeroBanner />
      <div className="container">

        <ServicesGrid />
        <div className="cta-block" style={{textAlign:'center',padding:'1.5rem 1rem'}}>
          <h2 className="cta-title">{homeContent.cta?.title}</h2>
          <p className="text-outline" style={{color:'#fff'}}>{homeContent.cta?.text}</p>
          <button className="whatsapp-btn" onClick={handleContact}>
            {homeContent.cta?.button || 'Contactar'}
          </button>
        </div>
        <section id="packages">
          <DealsGrid />
        </section>
        <section id="gallery">
          <Gallery />
        </section>
      </div>
    </div>
  );
};

export default Home;