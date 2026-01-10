import React, { useState, useEffect } from 'react';
import './Cards.css';
import PackageCard from './PackageCard';
import api from '../utils/api';

function Cards() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await api.get('/packages');
        setPackages(data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className='cards'>
      <h1>¡Echa un vistazo a estos destinos ÉPICOS!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            {packages.slice(0, 2).map((pkg) => (
              <li className='cards__item' key={pkg._id}>
                <PackageCard pkg={pkg} variant="booking small" />
              </li>
            ))}
          </ul>
          <ul className='cards__items'>
            {packages.slice(2, 5).map((pkg) => (
              <li className='cards__item' key={pkg._id}>
                <PackageCard pkg={pkg} variant="booking small" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;