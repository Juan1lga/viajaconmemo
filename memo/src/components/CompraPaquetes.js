import React, { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import './Cards.css';
import PackageCard from './PackageCard';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Todos');

  useEffect(() => {
    const fetchPackages = async () => {
      const res = await api.get('/packages');
      setPackages(res.data);
    };
    fetchPackages();
  }, []);

  const filteredPackages = useMemo(() => {
    if (activeFilter === 'Todos') {
      return packages;
    }
    return packages.filter(pkg => pkg.category === activeFilter);
  }, [activeFilter, packages]);

  return (
    <div className='cards'>
      <div className="packages-header">
        <h1 style={{ color: '#000' }}>Paquetes Exclusivos</h1>
        <p style={{ color: '#000' }}>Experiencias cuidadosamente diseñadas para crear recuerdos inolvidables</p>
      </div>
      <div className="filter-buttons">
        <button onClick={() => setActiveFilter('Todos')} className={activeFilter === 'Todos' ? 'active' : ''}>Todos</button>
        <button onClick={() => setActiveFilter('Populares')} className={activeFilter === 'Populares' ? 'active' : ''}>Populares</button>
        <button onClick={() => setActiveFilter('Lujo')} className={activeFilter === 'Lujo' ? 'active' : ''}>Lujo</button>
        <button onClick={() => setActiveFilter('Económicos')} className={activeFilter === 'Económicos' ? 'active' : ''}>Económicos</button>
      </div>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items packages-grid'>
            {filteredPackages.map(pkg => (
              <li className='cards__item' key={pkg._id}>
                <PackageCard pkg={pkg} className='compact' />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Packages;