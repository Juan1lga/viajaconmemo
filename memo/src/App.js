import './App.css';
import ToastProvider from './components/ToastProvider';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import CompraPaquetes from './components/CompraPaquetes';
import PackageDetails from './components/PackageDetails';
import Navbar from './components/Navbar';
import PhotoAlbum from './components/PhotoAlbum';
import CompanyPage from './components/CompanyPage';
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
import api, { getPackages, getAlbums } from './utils/api';
import LoadingSplash from './components/LoadingSplash';


// Componente principal de la aplicación
function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isBooting, setIsBooting] = useState(true);


  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Esperar a que el backend confirme salud y conexión a la base de datos antes de ocultar el splash
  useEffect(() => {
    let alive = true;
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    const probe = async () => {
      while (alive) {
        try {
          const { data } = await api.get('/health', { timeout: 4000 });
          const ok = data && data.status === 'ok';
          const connected = !!(data && data.db && data.db.connected === true);
          if (ok && connected) {
            setIsBooting(false);
            try { getPackages(); getAlbums(); } catch (_) {}
            return;
          }
        } catch (_) {}
        await delay(1500);
      }
    };
    probe();
    return () => { alive = false; };
  }, []);

  return (
    <ToastProvider>
      <Router>
        <div className="App">
{isBooting && <LoadingSplash />}
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
            <Route path="/company" element={<CompanyPage />} />
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
