import React, { useState, useEffect } from 'react';
import { getAlbums, createAlbumWithCover, deleteAlbum, updateAlbumWithCover } from '../utils/api';

const AlbumManagement = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCoverFile, setEditCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const { data } = await getAlbums();
      setAlbums(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('No se pudieron cargar los álbumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createAlbumWithCover(name, coverFile);
      setName('');
      setCoverFile(null);
      document.getElementById('cover-file-input').value = null;
      await loadAlbums();
    } catch (err) {
      const msg = err?.response?.data?.msg || 'Error al crear el álbum';
      setError(msg);
    }
  };

  const handleDelete = async (albumId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este álbum?')) {
      try {
        await deleteAlbum(albumId);
        await loadAlbums();
      } catch (err) {
        const msg = err?.response?.data?.msg || 'Error al eliminar el álbum';
        setError(msg);
      }
    }
  };

  const handleEditClick = (album) => {
    setEditId(album._id);
    setEditName(album.name || '');
    setEditCoverFile(null);
    setError('');
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditName('');
    setEditCoverFile(null);
    setSaving(false);
    try { document.getElementById('edit-cover-file-input').value = null; } catch (_) {}
  };

  const handleEditSave = async (albumId) => {
    if (!editName.trim()) {
      setError('El nombre del álbum no puede estar vacío');
      return;
    }
    try {
      setSaving(true);
      await updateAlbumWithCover(albumId, editName, editCoverFile || undefined);
      setSaving(false);
      setEditId(null);
      setEditName('');
      setEditCoverFile(null);
      try { document.getElementById('edit-cover-file-input').value = null; } catch (_) {}
      await loadAlbums();
    } catch (err) {
      setSaving(false);
      const msg = err?.response?.data?.msg || 'Error al actualizar el álbum';
      setError(msg);
    }
  };

  if (loading) return <p>Cargando álbumes...</p>;

  return (
    <div>
      <h5>Gestión de Álbumes</h5>
      <form onSubmit={handleCreate} className="mb-4 p-3 border rounded">
        <div className="mb-2">
          <label className="form-label">Nombre del álbum</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Verano 2024"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Foto de portada (opcional)</label>
          <input
            type="file"
            id="cover-file-input"
            className="form-control"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">Crear Álbum</button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="list-group">
        {albums.map((album) => (
          <div key={album._id} className="list-group-item d-flex justify-content-between align-items-center">
            {editId === album._id ? (
              <div className="w-100">
                <div className="mb-2">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Portada (opcional)</label>
                  <input
                    type="file"
                    id="edit-cover-file-input"
                    className="form-control form-control-sm"
                    accept="image/*"
                    onChange={(e) => setEditCoverFile(e.target.files[0])}
                  />
                  {album.coverUrl ? <div className="form-text">Actual: {album.coverUrl}</div> : null}
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-success btn-sm" disabled={saving} onClick={() => handleEditSave(album._id)}>{saving ? 'Guardando...' : 'Guardar'}</button>
                  <button className="btn btn-secondary btn-sm" onClick={handleEditCancel}>Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                {album.name}
                <div>
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEditClick(album)}>Editar</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(album._id)}>Eliminar</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {albums.length === 0 && !loading && <p>No hay álbumes creados.</p>}
    </div>
  );
};

export default AlbumManagement;