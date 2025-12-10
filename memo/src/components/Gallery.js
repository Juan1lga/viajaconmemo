import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { assetsOrigin } from "../utils/api";
import Lightbox from "./Lightbox";
import "./Gallery.css";
import AboutMemo from "./AboutMemo";
import { useNavigate } from "react-router-dom";

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovedPhotos = async () => {
      try {
        const { data } = await api.get("/photos?approved=true");
        setPhotos(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("No se pudieron cargar las fotos");
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedPhotos();
  }, []);

  const items = (photos && photos.length
    ? photos.map((p) => ({ src: p.url || `${assetsOrigin}${p.imageUrl}`, title: p.title, description: p.description }))
    : [
        { src: "/logo512.png?v=2", title: "Ejemplo 1", description: "Imagen de ejemplo" },
        { src: "/logo192.png?v=2", title: "Ejemplo 2", description: "Imagen de ejemplo" }
      ]);

  if (loading) return <div className="loading">Cargando galería...</div>;
  if (error && !items.length) return <div className="error-message">{error}</div>;

  const openAt = (idx) => { setSelectedIndex(idx); setIsOpen(true); };
  const closeLb = () => setIsOpen(false);

  return (
    <>
    <section className="gallery-section" id="gallery">
      <h2 className="gallery-title section-title--white">Galeria de Aventuras</h2>

      <div className="gallery-actions">
        <button className="btn-cta" onClick={() => navigate('/albums')}>Crear tu álbum</button>
      </div>

      {items.length === 0 ? (
        <p style={{ textAlign: "center" }}>Aún no hay fotos aprobadas.</p>
      ) : (
        <div className="gallery-grid">
          {items.map((photo, idx) => (
            <div key={idx} className="gallery-item" onClick={() => openAt(idx)}>
              <img src={photo.src} alt={photo.title || `Foto ${idx+1}`} />
              <div className="meta">
                {photo.title && <h4 className="text-outline">{photo.title}</h4>}
                {photo.description && <p>{photo.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && <Lightbox images={items} startIndex={selectedIndex} onClose={closeLb} />}

    </section>
    <AboutMemo />
    </>
  );
};

export default Gallery;