import React from 'react';
import './CompanyInfo.css';
import company from '../content/company.json';

const CompanyInfo = () => {
  return (
    <div className="company-info">
      <h2>Nuestra Empresa</h2>
      <p><strong>Nombre:</strong> VIAJA CON MEMO</p>
      <p><strong>Misión:</strong> Ofrecer experiencias de viaje inolvidables, seguras y personalizadas.</p>
      <p><strong>Visión:</strong> Ser la agencia de viajes líder en la región, reconocida por nuestra calidad y servicio al cliente.</p>
      <p><strong>Dirección:</strong> {company.address}</p>
      <p><strong>Teléfono:</strong> {company.phone}</p>
      <p><strong>Email:</strong> {company.email}</p>
    </div>
  );
};

export default CompanyInfo;