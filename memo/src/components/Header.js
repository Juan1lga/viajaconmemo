import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Viaja con Memo
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/paquetes" className="nav-links">
              Paquetes
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;