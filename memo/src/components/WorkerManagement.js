import React, { useState, useEffect } from 'react';
import { assetsOrigin } from "../utils/api"
import api from '../utils/api';
import './AdminDashboard.css';

const WorkerManagement = ({ token }) => {
  const [workers, setWorkers] = useState([]);
  const [editingWorker, setEditingWorker] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    photoFile: null,
  });

  useEffect(() => {
    fetchWorkers();
  }, [token]);

  const buildPhotoSrc = (photo) => {
    if (!photo) return 'https://via.placeholder.com/80x80?text=Avatar';
    return photo.startsWith('/uploads/') ? `${assetsOrigin}${photo}` : photo;
  };

  const fetchWorkers = async () => {
    try {
      const res = await api.get('/workers');
      setWorkers(res.data);
    } catch (err) {
      console.error('Error al obtener trabajadores:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photoFile: e.target.files[0] || null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('role', formData.role);
      if (formData.photoFile) {
        fd.append('image', formData.photoFile);
      }


      if (editingWorker) {
        await api.put(`/workers/${editingWorker._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/workers', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setFormData({ name: '', role: '', photoFile: null });
      setEditingWorker(null);
      fetchWorkers();
    } catch (err) {
      console.error('Error al guardar el trabajador:', err);
      alert(err.response?.data?.msg || 'Error al guardar el trabajador');
    }
  };

  const handleEdit = (worker) => {
    setEditingWorker(worker);
    setFormData({ name: worker.name, role: worker.role, photoFile: null });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/workers/${id}`);
      fetchWorkers();
    } catch (err) {
      console.error('Error al eliminar el trabajador:', err);
      alert(err.response?.data?.msg || 'Error al eliminar el trabajador');
    }
  };

  return (
    <div className='admin-dashboard'>
      <h3>Gestionar Trabajadores</h3>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='name'
          placeholder='Nombre del Trabajador'
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type='text'
          name='role'
          placeholder='Rol del Trabajador'
          value={formData.role}
          onChange={handleChange}
          required
        />
        <input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
        />
        <button type='submit'>{editingWorker ? 'Actualizar Trabajador' : 'Añadir Trabajador'}</button>
        {editingWorker && <button type='button' onClick={() => setEditingWorker(null)}>Cancelar Edición</button>}
      </form>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Foto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <tr key={worker._id}>
              <td>{worker.name}</td>
              <td>{worker.role}</td>
              <td><img src={buildPhotoSrc(worker.photo)} alt={worker.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }} /></td>
              <td>
                <button onClick={() => handleEdit(worker)}>Editar</button>
                <button onClick={() => handleDelete(worker._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkerManagement;