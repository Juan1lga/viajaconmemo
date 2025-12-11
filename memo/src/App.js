import './App.css';
import ToastProvider from './components/ToastProvider';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import CompraPaquetes from './components/CompraPaquetes';
import PackageDetails from './components/PackageDetails';
import Navbar from './components/Navbar';
import PhotoAlbum from './components/PhotoAlbum';
import CompanyInfo from './components/CompanyInfo';
import Team from './components/Team';
import Home from './components/Home';
import PackageForm from './components/PackageForm';
import UserManagement from './components/UserManagement';
import WorkerManagement from './components/WorkerManagement';
import AdminRoute from './components/AdminRoute';
import Checkout from './components/Checkout';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/Footer';
import BackgroundCarousel from './components/BackgroundCarousel';
import BackButton from './components/BackButton';
import { AlbumsPage, AlbumDetailPage } from './components/AlbumsFeature';
import api from './utils/api';


// Componente principal de la aplicación
function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Ping de salud para despertar el backend y evitar esperas largas en la primera carga
  useEffect(() => { api.get('/health', { timeout: 4000 }).catch(() => {}); }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <ToastProvider>
      <Router>
        <div className="App">
        <Navbar />
        <BackButton />
        <BackgroundCarousel />
        
        <main className="main-content">
          <Routes>
            {/* Ruta pública para la página de inicio */}
                        <Route path="/" element={<Home />} />

            {/* Nuevas rutas publicas */}
            <Route path="/album" element={<PhotoAlbum />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/albums/:id" element={<AlbumDetailPage />} />
            <Route path="/company" element={<CompanyInfo />} />
            <Route path="/team" element={<Team />} />

            {/* Ruta pública para la compra de paquetes */}
            <Route path="/paquetes" element={<CompraPaquetes />} />

            {/* Ruta pública para los detalles de paquetes */}
            <Route path="/packages/:id" element={<PackageDetails />} />
            {/* Nueva ruta de checkout */}
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/packages/:id/checkout" element={<Checkout />} />

            {/* Ruta para el login de administradores */}
            <Route 
              path="/admin-login" 
              element={<AdminLogin setToken={setToken} />} 
            />
            
            {/* Ruta protegida para el panel de administración */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard token={token} setToken={setToken} />
                </AdminRoute>
              } 
            />

            {/* Rutas para crear y editar paquetes */}
            <Route 
              path="/admin/packages/new" 
              element={
                <AdminRoute>
                  <PackageForm token={token} />
                </AdminRoute>
              } 
            />
            {/* Ruta para la gestión de usuarios */}
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <UserManagement token={token} />
                </AdminRoute>
              }
            />
            {/* Ruta para la gestión de equipo */}
            <Route
              path="/admin/workers"
              element={
                <AdminRoute>
                  <WorkerManagement token={token} />
                </AdminRoute>
              }
            />
            <Route 
              path="/admin/packages/edit/:id" 
              element={
                <AdminRoute>
                  <PackageForm token={token} />
                </AdminRoute>
              } 
            />
            
            {/* Redirección para rutas no encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />

        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
