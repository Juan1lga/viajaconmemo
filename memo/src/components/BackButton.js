import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './BackButton.css';

const BackButton = ({ hideOnPaths = ['/'] }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const shouldHide = hideOnPaths.includes(location.pathname);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (shouldHide) return null;

  return (
    <button className="back-button" onClick={handleBack} aria-label="Volver atrás">
      <FaArrowLeft className="back-button__icon" />
      <span className="back-button__text">Atrás</span>
    </button>
  );
};

export default BackButton;