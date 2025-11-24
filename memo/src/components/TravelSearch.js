import React from 'react';
import './TravelSearch.css';

const TravelSearch = () => {
  return (
    <div className="travel-search">
      <h2>Busca tu próximo destino</h2>
      <form>
        <input type="text" placeholder="Destino" />
        <input type="date" />
        <input type="date" />
        <input type="number" placeholder="Huéspedes" />
        <button type="submit">Buscar</button>
      </form>
    </div>
  );
};

export default TravelSearch;