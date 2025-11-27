import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { assetsOrigin } from '../utils/api';
import PhotoUploadForm from "./PhotoUploadForm";
import './PhotoAlbum.css';
import './Gallery.css';

const PhotoAlbum = () => {
  const [photos, setPhotos] = useState([]);
  const [showUpload, setShowUpload] = useState(false);

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
      <h2>Álbum de Fotos</h2>

      <div className="gallery-actions">
        <button className="btn-cta" onClick={() => setShowUpload((v) => !v)}>Sube tu propia foto</button>
      </div>

      {showUpload && (
        <div className="upload-panel">
          <h3 style={{marginTop:0}}>Sube tu propia foto</h3>
          <PhotoUploadForm onClose={() => { setShowUpload(false); fetchPhotos(); }} />
        </div>
      )}

      <div className="photos-container">
        {photos.map(photo => (
          <div key={photo._id} className="photo-card">
            <img src={photo.url || `${assetsOrigin}${photo.imageUrl}`} alt={photo.title} />
            <h3>{photo.title}</h3>
            <p>{photo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoAlbum;