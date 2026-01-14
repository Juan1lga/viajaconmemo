import './App.css';
import ToastProvider from './components/ToastProvider';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import CompraPaquetes from './components/CompraPaquetes';
import PackageDetails from './components/PackageDetails';
import ServiceDetail from './components/ServiceDetail';
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
import AdminAlbums from './components/AdminAlbums';
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import BackgroundCarousel from './components/BackgroundCarousel';
import BackButton from './components/BackButton';
import { AlbumsPage, AlbumDetailPage } from './components/AlbumsFeature';
import api from './utils/api';
import LoadingSplash from './components/LoadingSplash';
import PageTransitionOverlay from './components/PageTransitionOverlay';

const RouteTransition = ({ disabled }) => {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); }
    if (disabled) {
      document.body.classList.remove('app-transitioning');
      setShow(false);
      return () => {};
    }
    document.body.classList.add('app-transitioning');
    setShow(true);
    timerRef.current = setTimeout(() => {
      document.body.classList.remove('app-transitioning');
      setShow(false);
    }, 2000);
    return () => { if (timerRef.current) { clearTimeout(timerRef.current); } };
  }, [location.pathname, disabled]);
  return show ? <PageTransitionOverlay /> : null;
};


// Componente principal de la aplicación
function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isBooting, setIsBooting] = useState(true);
  const skipSplash = process.env.REACT_APP_SKIP_SPLASH === '1';
  const aliveRef = useRef(true);


  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Esperar a que el backend confirme salud y conexión a la base de datos antes de ocultar el splash
  useEffect(() => {
    if (skipSplash) { setIsBooting(false); return; }
    aliveRef.current = true;
    const minSplashMs = 900;
    const startedAt = Date.now();
    const maxHideTimer = setTimeout(() => { if (aliveRef.current) setIsBooting(false); }, 4000);
    let intervalId = null;
    let hideTimerId = null;
    const attempt = async () => {
      try {
        const { data } = await api.get('/health', { timeout: 4000 });
        const ok = data && data.status === 'ok';
        if (ok) {
          clearTimeout(maxHideTimer);
          if (intervalId) { clearInterval(intervalId); }
          const elapsed = Date.now() - startedAt;
          const wait = Math.max(0, minSplashMs - elapsed);
          hideTimerId = setTimeout(() => { if (aliveRef.current) setIsBooting(false); }, wait);
        }
      } catch (_) {}
    };
    intervalId = setInterval(() => { if (aliveRef.current) attempt(); }, 1500);
    attempt();
    return () => { aliveRef.current = false; clearTimeout(maxHideTimer); if (intervalId) clearInterval(intervalId); if (hideTimerId) clearTimeout(hideTimerId); };
  }, [skipSplash]);

  return (
    <ToastProvider>
      <Router>
        <div className="App">
{isBooting && !skipSplash && <LoadingSplash />}
        <RouteTransition disabled={isBooting && !skipSplash} />
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
            <Route path="/servicios/:slug" element={<ServiceDetail />} />

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
            <Route
              path="/admin/albums"
              element={
                <AdminRoute>
                  <AdminAlbums token={token} />
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
