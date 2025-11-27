import React from "react";
import "./Footer.css";
import { FaFacebook, FaEnvelope, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER;
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : 'https://wa.me/';
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <h2 className="footer-title">Viaja con Memo</h2>
        <p className="footer-subtitle">Tu aventura comienza aquí</p>
        <div className="footer-social">
          <a href="mailto:viajaconmemoya@gmail.com" aria-label="Email" className="social-link">
            <FaEnvelope size={26} />
          </a>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="social-link">
            <FaWhatsapp size={26} />
          </a>
          <a href="https://www.facebook.com/viajaconmemo.mx" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link">
            <FaFacebook size={26} />
          </a>
        </div>
        <p className="footer-copy">© 2025 Viaja con Memo. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;