import React, { useState, useMemo } from 'react';
import { useAutoRefreshPackages } from '../hooks/useAutoRefresh';
import './Cards.css';
import PackageCard from './PackageCard';


const Packages = () => {

  



  const [activeFilter, setActiveFilter] = useState('');
  const [month, setMonth] = useState('');
  const { data: packages, loading, error, refetchNow } = useAutoRefreshPackages(month ? { month } : {}, 2000);

  // auto-refresh handled by useAutoRefreshPackages hook

  const normalize = (s) => (s || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const filteredPackages = useMemo(() => {
    const f = normalize(activeFilter);
    if (!f) {
      return packages;
    }
    return packages.filter(pkg => normalize(pkg.category) === f);
  }, [activeFilter, packages]);

  const handleSearch = async () => {
    refetchNow();
  };

  return (
    <div className='cards'>
      <div className='packages-header'>
        <h1 style={{ color: '#000' }}>Paquetes Exclusivos</h1>
        <p style={{ color: '#000' }}>Experiencias cuidadosamente diseñadas para crear recuerdos inolvidables</p>
      </div>
      {error && <div className='status error'>{error}</div>}
      <div className='search-bar d-flex gap-2 align-items-center mb-3'>
        <input type='month' className='form-control' value={month} onChange={(e) => setMonth(e.target.value)} />
        <button onClick={handleSearch} className='btn btn-primary'>Buscar</button>
        {month && <button onClick={() => { setMonth(''); handleSearch(); }} className='btn btn-secondary'>Limpiar</button>}
      </div>
      <div className='filter-buttons'>
        <button onClick={() => setActiveFilter('Hoteles en la Riviera Maya')} className={activeFilter === 'Hoteles en la Riviera Maya' ? 'active' : ''}>Hoteles en la Riviera Maya</button>
        <button onClick={() => setActiveFilter('Nuestros paquetes nacionales')} className={activeFilter === 'Nuestros paquetes nacionales' ? 'active' : ''}>Nuestros paquetes nacionales</button>
        <button onClick={() => setActiveFilter('Nuestros pasadías')} className={activeFilter === 'Nuestros pasadías' ? 'active' : ''}>Nuestros pasadías</button>
        <button onClick={() => setActiveFilter('Nuestros paquetes internacionales')} className={activeFilter === 'Nuestros paquetes internacionales' ? 'active' : ''}>Nuestros paquetes internacionales</button>
        <button onClick={() => setActiveFilter('Nuestros viajes a Europa')} className={activeFilter === 'Nuestros viajes a Europa' ? 'active' : ''}>Nuestros viajes a Europa</button>

      </div>
      {!loading && !error && filteredPackages.length === 0 && (
        <div className='status info'>No hay paquetes en la categoría "{activeFilter || 'seleccionada'}".</div>
      )}
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items packages-grid'>
            {filteredPackages.map(pkg => (
              <li className='cards__item' key={pkg._id}>
                <PackageCard pkg={pkg} plain showIncludes />
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};

export default Packages;