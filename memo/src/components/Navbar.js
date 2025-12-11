import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Logo from './Logo';
import company from '../content/company.json';

const Navbar = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navRef = useRef(null);
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const closeNav = () => setIsNavCollapsed(true);
  const location = useLocation();
  useEffect(() => { setIsNavCollapsed(true); }, [location.pathname]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  let isAdmin = false;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = (decoded?.user?.isAdmin === true) || (decoded?.isAdmin === true);
    } catch (e) {
      isAdmin = false;
    }
  }

  const whatsappNumber = company.phone || '';
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : 'https://wa.me/';
  const facebookHref = "https://www.facebook.com/viajaconmemo.mx";

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <Logo size="sm" showText={false} imgClass="navbar-logo-img" />
        </Link>
        <button className="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded={!isNavCollapsed} aria-label="Toggle navigation" onClick={handleNavCollapse}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`navbar-collapse collapse ${isNavCollapsed ? '' : 'show'}`} id="navbarSupportedContent" ref={navRef}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={closeNav}>Inicio</Link>
            </li>
            <li className="nav-item">
              <Link to="/albums" className="nav-link" onClick={closeNav}>Álbumes</Link>
            </li>
            <li className="nav-item">
              <Link to="/company" className="nav-link" onClick={closeNav}>Nuestra Empresa</Link>
            </li>
            <li className="nav-item">
              <Link to="/team" className="nav-link" onClick={closeNav}>Equipo</Link>
            </li>
            <li className="nav-item">
              <Link to={isAdmin ? "/admin" : "/admin-login"} className="nav-link" onClick={closeNav}>Admin</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            <a href={facebookHref} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon" onClick={closeNav}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.19 8.44 9.98v-7.06H8.08v-2.92h2.36V9.41c0-2.33 1.39-3.62 3.51-3.62 1.02 0 2.08.18 2.08.18v2.29h-1.17c-1.15 0-1.51.72-1.51 1.46v1.75h2.57l-.41 2.92h-2.16v7.06C18.34 21.25 22 17.08 22 12.06z"/></svg>
            </a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" onClick={closeNav}>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;