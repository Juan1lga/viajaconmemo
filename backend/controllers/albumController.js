const Album = require('../models/Album');
const Photo = require('../models/Photo');
const mongoose = require('mongoose');
const { configured, uploadBuffer, deleteByUrl, isCloudinaryUrl } = require('../utils/cloudinary');
console.log('Cloudinary configured status in albumController:', configured);

const slugify = (name) => {
  return String(name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

exports.createAlbum = async (req, res) => {
  try {
    const { name, coverUrl } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ msg: 'El nombre del álbum es requerido' });
    }
    let slug = slugify(name);
    if (!slug) {
      return res.status(400).json({ msg: 'No se pudo generar el slug del álbum' });
    }
    // asegurar unicidad del slug
    let baseSlug = slug;
    let n = 1;
    while (await Album.findOne({ slug })) {
      slug = `${baseSlug}-${n++}`;
    }

    let finalCoverUrl = '';
    if (req.file && req.file.buffer) {
      if (!configured) {
        return res.status(400).json({ msg: 'Cloudinary no configurado', error: 'cloudinary_not_configured' });
      }
      try {
        const folderName = `albums/${slug}`;
        const result = await uploadBuffer(req.file.buffer, folderName);
        finalCoverUrl = result.secure_url;
      } catch (e) {
        console.error('Error al subir portada de álbum:', e.message || e);
        return res.status(500).json({ msg: 'No se pudo subir la portada del álbum', error: 'cover_upload_failed', detail: e.message || String(e) });
      }
    } else if (coverUrl !== undefined) {
      finalCoverUrl = String(coverUrl || '');
    }

    const album = new Album({ name: String(name).trim(), slug, coverUrl: finalCoverUrl });
    await album.save();
    res.status(201).json({ ok: true, album });
  } catch (err) {
    console.error('Error al crear álbum:', err.message || err);
    res.status(500).json({ error: 'server_error', detail: err.message || String(err) });
  }
};

exports.getAlbums = async (req, res) => {
  try {
    const albums = await Album.find({}).sort({ createdAt: -1 });
    res.json(albums);
  } catch (err) {
    console.error('Error al listar álbumes:', err.message || err);
    res.status(500).json({ error: 'server_error', detail: err.message || String(err) });
  }
};

exports.getAlbumPhotos = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de álbum inválido' });
    }
    const filter = { album: id };
    if (req.query.approved === 'true') filter.approved = true;
    if (req.query.approved === 'false') filter.approved = false;
    const photos = await Photo.find(filter).sort({ _id: -1 });
    res.json(photos);
  } catch (err) {
    console.error('Error al obtener fotos del álbum:', err.message || err);
    res.status(500).json({ error: 'server_error', detail: err.message || String(err) });
  }
};

exports.updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de álbum inválido' });
    }
    const album = await Album.findById(id);
    if (!album) return res.status(404).json({ msg: 'Álbum no encontrado' });

    const { name, coverUrl } = req.body;
    const updateFields = {};

    let newSlugCandidate = null;
    if (name !== undefined) {
      const newName = String(name || '').trim();
      if (!newName) {
        return res.status(400).json({ msg: 'El nombre del álbum no puede estar vacío' });
      }
      let newSlug = slugify(newName);
      if (!newSlug) {
        return res.status(400).json({ msg: 'No se pudo generar el slug del álbum' });
      }
      const baseSlug = newSlug;
      let n = 1;
      while (await Album.findOne({ slug: newSlug, _id: { $ne: id } })) {
        newSlug = `${baseSlug}-${n++}`;
      }
      updateFields.name = newName;
      updateFields.slug = newSlug;
      newSlugCandidate = newSlug;
    }

    // Manejo de portada (archivo o URL)
    if (req.file && req.file.buffer) {
      if (!configured) {
        return res.status(400).json({ msg: 'Cloudinary no configurado', error: 'cloudinary_not_configured' });
      }
      try {
        const folderName = `albums/${newSlugCandidate || album.slug}`;
        const result = await uploadBuffer(req.file.buffer, folderName);
        updateFields.coverUrl = result.secure_url;
        if (album.coverUrl && isCloudinaryUrl(album.coverUrl)) {
          try { await deleteByUrl(album.coverUrl); } catch (e) { console.error('No se pudo borrar portada anterior de Cloudinary:', e.message || e); }
        }
      } catch (e) {
        console.error('Error al actualizar portada del álbum:', e.message || e);
        return res.status(500).json({ msg: 'No se pudo actualizar la portada del álbum', error: 'cover_upload_failed', detail: e.message || String(e) });
      }
    } else if (coverUrl !== undefined) {
      updateFields.coverUrl = String(coverUrl || '');
    }

    const updated = await Album.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
    return res.json({ ok: true, album: updated });
  } catch (err) {
    console.error('Error al actualizar álbum:', err.message || err);
    res.status(500).json({ error: 'server_error', detail: err.message || String(err) });
  }
};

exports.deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de álbum inválido' });
    }
    const album = await Album.findById(id);
    if (!album) return res.status(404).json({ msg: 'Álbum no encontrado' });

    // Desvincular fotos del álbum eliminado
    await Photo.updateMany({ album: id }, { $set: { album: null } });
    await Album.findByIdAndDelete(id);

    res.json({ ok: true, msg: 'Álbum eliminado' });
  } catch (err) {
    console.error('Error al eliminar álbum:', err.message || err);
    res.status(500).json({ error: 'server_error', detail: err.message || String(err) });
  }
};