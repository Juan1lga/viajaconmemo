const Photo = require('../models/Photo');
const mongoose = require('mongoose');

const path = require('path');
const fs = require('fs').promises;
const { configured, uploadBuffer, deleteByUrl, isCloudinaryUrl } = require('../utils/cloudinary');


exports.getPhotos = async (req, res) => {
  try {
    const filter = {};
    if (req.query.approved === 'true') filter.approved = true;
    if (req.query.approved === 'false') filter.approved = false;
    const photos = await Photo.find(filter);
    res.json(photos);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ "error": "upload_failed", "detail": err.message });
  }
};

// Subir una foto
exports.uploadPhoto = async (req, res) => {
  try {
    const { title, description, image } = req.body;
    let url = null;
    let public_id = null;

    if (req.file && req.file.buffer) {
      if (!configured) { return res.status(503).json({ error: 'cloudinary_not_configured', message: 'Cloudinary no está disponible para subir imágenes' }); }
      const result = await uploadBuffer(req.file.buffer, 'photos');
      url = result.secure_url;
      public_id = result.public_id || null;
    } else if (typeof image === 'string' && image.trim()) {
      url = image.trim();
    } else {
      return res.status(400).json({ ok: false, "error": "file_required", "message": "Adjunta una imagen en el campo \"image\" o envía una URL válida en body.image" });
    }

    const photo = new Photo({ title, description, url });
    await photo.save();
    res.status(201).json({ ok: true, url, public_id });
  } catch (err) {
    console.error('Error al subir foto:', err.message);
    res.status(500).json({ "error": "upload_failed", "detail": err.message });
  }
};

// Aprobar una foto
exports.approvePhoto = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de foto inválido' });
    }
    const photo = await Photo.findById(id);
    if (!photo) return res.status(404).json({ msg: 'Foto no encontrada' });
    photo.approved = true;
    await photo.save();
    res.status(201).json({ ok: true, message: "Foto subida exitosamente", photo });
  } catch (err) {
    console.error('Error al aprobar foto:', err.message);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Obtener fotos pendientes (solo admin)
exports.getPendingPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ approved: false });
    res.json(photos);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ "error": "upload_failed", "detail": err.message });
  }
};

// Actualizar una foto
exports.updatePhoto = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de foto inválido' });
    }
    const photo = await Photo.findById(id);
    if (!photo) return res.status(404).json({ msg: 'Foto no encontrada' });

    const toBoolean = (val) => {
      if (typeof val === 'boolean') return val;
      if (typeof val === 'string') {
        const v = val.trim().toLowerCase();
        if (v === 'true' || v === '1') return true;
        if (v === 'false' || v === '0') return false;
      }
      return Boolean(val);
    };

    const updateFields = {};
    if (req.body.title !== undefined) updateFields.title = req.body.title;
    if (req.body.description !== undefined) updateFields.description = req.body.description;
    if (req.body.approved !== undefined) updateFields.approved = toBoolean(req.body.approved);

    if (req.file && req.file.buffer) {
      if (!configured) { return res.status(503).json({ error: 'cloudinary_not_configured', message: 'Cloudinary no está disponible para subir imágenes' }); }
      // Subir nueva imagen a Cloudinary
      const result = await uploadBuffer(req.file.buffer, 'photos');
      updateFields.url = result.secure_url;
      // Borrar imagen anterior si existía
      if (photo && isCloudinaryUrl(photo.url)) {
        try { await deleteByUrl(photo.url); } catch (e) { console.error('No se pudo borrar imagen anterior de Cloudinary:', e.message); }
      } else if (photo && photo.imageUrl) {
        try {
          const localPath = path.join(__dirname, '..', photo.imageUrl.replace(/^\/+/, ''));
          await fs.unlink(localPath);
        } catch (e) {
          console.error('No se pudo borrar archivo local anterior:', e.message);
        }
      }
    }

    const updated = await Photo.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
    return res.json(updated);
  } catch (err) {
    console.error('Error al actualizar foto:', err.message);
    return res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Eliminar una foto
exports.deletePhoto = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de foto inválido' });
    }
    const photo = await Photo.findById(id);
    if (!photo) return res.status(404).json({ msg: 'Foto no encontrada' });

    if (photo.url && isCloudinaryUrl(photo.url)) {
      if (!configured) { return res.status(503).json({ error: 'cloudinary_not_configured', message: 'Cloudinary no está disponible para eliminar imágenes' }); }
      try { await deleteByUrl(photo.url); } catch (e) { console.error('No se pudo borrar imagen de Cloudinary:', e.message); }
    } else if (photo.imageUrl) {
      try {
        const localPath = path.join(__dirname, '..', photo.imageUrl.replace(/^\/+/, ''));
        await fs.unlink(localPath);
      } catch (e) {
        console.error('No se pudo borrar archivo local:', e.message);
      }
    }

    await Photo.findByIdAndDelete(id);
    res.json({ msg: 'Foto eliminada' });
  } catch (err) {
    console.error('Error al eliminar foto:', err.message);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};