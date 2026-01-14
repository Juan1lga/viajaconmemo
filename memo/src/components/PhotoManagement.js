import React, { useState, useEffect } from 'react';
import api, { assetsOrigin, isTimeoutLike } from '../utils/api';
import './AdminDashboard.css'; // Reutilizando algunos estilos de AdminDashboard

const PhotoManagement = ({ token }) => {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPhotos();
  }, [token]);

  const fetchPhotos = async () => {
    try {
      const res = await api.get('/photos');
      setPhotos(res.data);
    } catch (err) {
      console.error('Error fetching photos:', err?.response?.data?.msg || err.message);
      setError('Error al obtener fotos: ' + (err?.response?.data?.msg || err.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('image', file);

    try {
      await api.post('/photos', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData({ title: '', description: '' });
      setFile(null);
      setMessage('Foto añadida exitosamente. Pendiente de aprobación.');
      setError('');
      fetchPhotos();
    } catch (err) {
      console.error('Error al guardar la foto:', err?.response?.data?.msg || err.message);
      if (isTimeoutLike(err)) {
        return;
      }
      setError('Error al guardar la foto: ' + (err?.response?.data?.msg || err.message));
      setMessage('');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/photos/${id}/approve`, {});
      setMessage('Foto aprobada correctamente.');
      setError('');
      fetchPhotos(); // Refresh photos to show updated status
    } catch (err) {
      console.error('Error al aprobar la foto:', err?.response?.data?.msg || err.message);
      if (isTimeoutLike(err)) {
        return;
      }
      setError('Error al aprobar la foto: ' + (err?.response?.data?.msg || err.message));
      setMessage('');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/photos/${id}`);
      setMessage('Foto eliminada correctamente.');
      setError('');
      fetchPhotos();
    } catch (err) {
      console.error('Error al eliminar la foto:', err?.response?.data?.msg || err.message);
      if (isTimeoutLike(err)) {
        return;
      }
      setError('Error al eliminar la foto: ' + (err?.response?.data?.msg || err.message));
      setMessage('');
    }
  };

  return (
    <div className='admin-dashboard'>
      <h3>Gestionar Fotos</h3>
      {message && <div style={{color: 'green', marginBottom: '10px'}}>{message}</div>}
      {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='title'
          placeholder='Título de la foto'
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type='file'
          name='image'
          onChange={handleFileChange}
          required
        />
        <textarea
          name='description'
          placeholder='Descripción de la foto'
          value={formData.description}
          onChange={handleChange}
        ></textarea>
        <button type='submit'>Añadir Foto</button>
      </form>

      <div className='photo-grid'>
        {photos.map((photo) => (
          <div key={photo._id} className='photo-card'>
            <img src={photo.url || `${assetsOrigin}${photo.imageUrl}`} alt={photo.title} />
            <div className='photo-card-body'>
              <h4>{photo.title}</h4>
              <p>{photo.description}</p>
              <p>Estado: {photo.approved ? 'Aprobada' : 'Pendiente'}</p>
            </div>
            <div className='photo-card-actions'>
              {!photo.approved && (
                <button onClick={() => handleApprove(photo._id)}>Aprobar</button>
              )}
              <button onClick={() => handleDelete(photo._id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoManagement;