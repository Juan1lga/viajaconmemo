import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';


import PhotoManagement from './PhotoManagement';

import './AdminDashboard.css';
import Logo from './Logo';

const AdminDashboard = ({ token, setToken }) => {
  const [packages, setPackages] = useState([]);
  
  

  useEffect(() => {
    const fetchPackages = async () => {
      const res = await api.get('/packages');
      setPackages(res.data);
    };
    fetchPackages();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/packages/${id}`);
      setPackages(packages.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <div className="container my-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-3">
          <Logo size="sm" showText={true} />
          <h2 className="m-0">Panel Admin</h2>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/workers" className="btn btn-outline-primary">Gestionar equipo</Link>
          <Link to="/admin/users" className="btn btn-outline-primary">Nuevos admin</Link>
          <Link to="/" className="btn btn-outline-secondary">Ver Sitio</Link>
          <button className="btn btn-outline-danger" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="fw-bold">Paquetes Activos</div>
              <div className="display-6">{packages.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card h-100 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Gestión de Fotos</h5>
              <span className="text-muted small">Admin</span>
            </div>
            <div className="card-body">
              <PhotoManagement token={token} />
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card h-100 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Paquetes</h5>
              <Link to="/admin/packages/new" className="btn btn-success btn-sm">Nuevo</Link>
            </div>
            <div className="list-group list-group-flush">
              {packages.map((pkg) => (
                <div key={pkg._id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-semibold">{pkg.name}</div>
                      <div className="text-muted small">{pkg.duration || 'Duración no especificada'} • ${pkg.price}</div>
                      <div className="mt-1">
                        {pkg.popular && <span className="badge bg-warning text-dark me-2">Popular</span>}
                        <span className="badge bg-success">Activo</span>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <Link to={`/admin/packages/edit/${pkg._id}`} className="btn btn-outline-primary btn-sm">Editar</Link>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(pkg._id)}>Eliminar</button>
                    </div>
                  </div>
                </div>
              ))}
              {packages.length === 0 && (
                <div className="list-group-item text-muted">No hay paquetes</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;