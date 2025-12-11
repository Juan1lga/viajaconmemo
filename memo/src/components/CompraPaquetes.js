import React, { useState, useEffect, useMemo } from 'react';
import { getPackages } from '../utils/api';
import './Cards.css';
import PackageCard from './PackageCard';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');
    const fetchPackages = async () => {
      try {
        const { data } = await getPackages();
        if (!isMounted) return;
        setPackages(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!isMounted) return;
        setError(err?.response?.data?.msg || err?.message || 'No se pudieron cargar los paquetes.');
        setPackages([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchPackages();
    return () => { isMounted = false; };
  }, []);

  const normalize = (s) => (s || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const filteredPackages = useMemo(() => {
    const f = normalize(activeFilter);
    if (f === 'todos') {
      return packages;
    }
    return packages.filter(pkg => normalize(pkg.category) === f);
  }, [activeFilter, packages]);

  return (
    <div className='cards'>
      <div className='packages-header'>
        <h1 style={{ color: '#000' }}>Paquetes Exclusivos</h1>
        <p style={{ color: '#000' }}>Experiencias cuidadosamente diseñadas para crear recuerdos inolvidables</p>
      </div>
      {loading && <div className='status info'>Cargando paquetes...</div>}
      {error && <div className='status error'>{error}</div>}
      <div className='filter-buttons'>
        <button onClick={() => setActiveFilter('Todos')} className={activeFilter === 'Todos' ? 'active' : ''}>Todos</button>
        <button onClick={() => setActiveFilter('Populares')} className={activeFilter === 'Populares' ? 'active' : ''}>Populares</button>
        <button onClick={() => setActiveFilter('Lujo')} className={activeFilter === 'Lujo' ? 'active' : ''}>Lujo</button>
        <button onClick={() => setActiveFilter('Económicos')} className={activeFilter === 'Económicos' ? 'active' : ''}>Económicos</button>
      </div>
      {!loading && !error && filteredPackages.length === 0 && (
        <div className='status info'>No hay paquetes para esta categoría.</div>
      )}
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