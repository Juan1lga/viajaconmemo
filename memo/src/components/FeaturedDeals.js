import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './Cards.css';
import './FeaturedDeals.css';
import PackageCard from './PackageCard';



const FeaturedDeals = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const { data } = await api.get('/packages');
        const popularDeals = (data || []).filter(p => p.popular === true || p.category === 'Populares').slice(0, 6);
        setDeals(popularDeals);
      } catch (error) {
        console.error('Error al cargar paquetes populares:', error?.message || error);
      }
    };

    fetchDeals();
  }, []);

  return (
    <div className='cards featured-deals'>
      <h2 className='featured-deals-title' style={{ color: '#000' }}>Explora nuestros paquetes</h2>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            {deals.map(deal => (
              <li className='cards__item package-wide' key={deal._id}>
                <PackageCard pkg={deal} className='travel-card package-card-horizontal' hideItinerary />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeaturedDeals;