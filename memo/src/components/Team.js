import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { assetsOrigin } from '../utils/api';
import './Team.css';

const Team = () => {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await api.get('/workers');
        setWorkers(res.data);
      } catch (err) {
        console.error('Error al obtener trabajadores:', err);
      }
    };
    fetchWorkers();
  }, []);

  const buildPhotoSrc = (photo) => {
    if (!photo) return 'https://via.placeholder.com/150?text=Avatar';
    return photo.startsWith('/uploads/') ? `${assetsOrigin}${photo}` : photo;
  };

  return (
    <div className="team">
      <h2>Nuestro Equipo</h2>
      <div className="team-members-container">
        {workers.map((member) => (
          <div key={member._id} className="team-member-card">
            <div className="card-media"><img src={buildPhotoSrc(member.photo)} alt={member.name} /></div>
            <h3>{member.name}</h3>
            <h4>{member.role}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;