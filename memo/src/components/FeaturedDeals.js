import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { assetsOrigin } from '../utils/api';
import CardItem from './CardItem';
import './Cards.css';
import './FeaturedDeals.css';

const FeaturedDeals = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const { data } = await api.get('/packages');
        // Filter for featured packages and limit to 3
        const featuredDeals = data.filter(p => p.featured).slice(0, 3);
        setDeals(featuredDeals);
      } catch (error) {
        console.error('Error fetching featured deals:', error);
      }
    };

    fetchDeals();
  }, []);

  return (
    <div className='cards featured-deals'>
      <h2 className='featured-deals-title' style={{ color: '#000' }}>Paquetes Exclusivos</h2>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            {deals.map(deal => (
              <CardItem
                key={deal._id}
                itemClass='travel-card package-card'
                src={(deal.image && deal.image.startsWith('/uploads/')) ? `${assetsOrigin}${deal.image}` : (deal.image || `${process.env.PUBLIC_URL}/memo-logo.jfif?v=2`)}
                text={deal.description}
                label={deal.name}
                path={`/packages/${deal._id}`}
                price={deal.price}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeaturedDeals;