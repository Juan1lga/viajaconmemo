import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { assetsOrigin } from '../utils/api';
import { useNavigate } from "react-router-dom";
import './PhotoAlbum.css';
import './Gallery.css';
import Lightbox from './Lightbox';

const PhotoAlbum = () => {
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const items = (photos && photos.length ? photos.map((p) => ({ src: p.url || `${assetsOrigin}${p.imageUrl}`, title: p.title, description: p.description })) : []);
  const openAt = (idx) => { setSelectedIndex(idx); setIsOpen(true); };
  const closeLb = () => setIsOpen(false);

  const fetchPhotos = async () => {
    try {
      const { data } = await api.get('/photos?approved=true');
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);



  return (
    <div className="photo-album">
      <h2>Álbunes</h2>

      <div className="gallery-actions">
        <button className="btn-cta" onClick={() => navigate('/albums')}>Crea tu álbum</button>
      </div>


      <div className="gallery-grid">
        {photos.map((photo, idx) => (
          <div key={photo._id} className="gallery-item" onClick={() => openAt(idx)}>
            <img src={photo.url || `${assetsOrigin}${photo.imageUrl}`} alt={photo.title || `Foto ${idx+1}`} />
            <div className="meta">
              {photo.title && <h4 className="text-outline">{photo.title}</h4>}
              {photo.description && <p>{photo.description}</p>}
            </div>
          </div>
        ))}
      </div>

      {isOpen && <Lightbox images={items} startIndex={selectedIndex} onClose={closeLb} />}
    </div>
  );
};

export default PhotoAlbum;