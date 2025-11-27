const Package = require('../models/Package');
const mongoose = require('mongoose');

const path = require('path');
const fs = require('fs').promises;
const { uploadBuffer, deleteByUrl, isCloudinaryUrl } = require('../utils/cloudinary');


// Obtener todos los paquetes

exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.find().lean();
    res.json(packages);
  } catch (err) {
    console.error('getPackages failed:', err);
    res.status(500).json({ error: 'getPackages failed', detail: err.message });
  }
};

exports.getPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de paquete inválido' });
    }
    const pkg = await Package.findById(id);
    if (!pkg) return res.status(404).json({ msg: 'Paquete no encontrado' });
    res.json(pkg);
  } catch (err) {
    console.error('Error al obtener paquete:', err.message);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Crear un paquete
exports.createPackage = async (req, res) => {
  try {
    const { name, description, price, duration, category, includes, isPopular, popular, image } = req.body;

    if (!name || !description) {
      return res.status(400).json({ msg: 'Nombre y descripción son requeridos' });
    }

    if (price === undefined || price === null || price === '') {
      return res.status(400).json({ msg: 'El precio es requerido' });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) {
      return res.status(400).json({ msg: 'El precio debe ser un número' });
    }

    let includesArray = [];
    if (Array.isArray(includes)) {
      includesArray = includes
        .filter((i) => typeof i === 'string')
        .map((i) => i.trim())
        .filter(Boolean);
    } else if (typeof includes === 'string') {
      includesArray = includes.split(',').map((i) => i.trim()).filter(Boolean);
    }

    let imageUrl;
    if (req.file && req.file.buffer) {
      const result = await uploadBuffer(req.file.buffer, 'packages');
      imageUrl = result.secure_url;
    } else if (typeof image === 'string' && image.trim()) {
      imageUrl = image.trim();
    } else {
      return res.status(400).json({ msg: 'La imagen es requerida' });
    }

    const toBoolean = (val) => {
      if (typeof val === 'boolean') return val;
      if (typeof val === 'string') {
        const v = val.trim().toLowerCase();
        if (v === 'true' || v === '1') return true;
        if (v === 'false' || v === '0') return false;
      }
      return Boolean(val);
    };

    const popularFlag = isPopular !== undefined ? toBoolean(isPopular) : (popular !== undefined ? toBoolean(popular) : false);

    const newPkg = new Package({
      name,
      description,
      price: numericPrice,
      duration: duration || '',
      category: (category && ['Populares','Lujo','Económicos'].includes(category)) ? category : 'Populares',
      includes: includesArray,
      popular: popularFlag,
      image: imageUrl
    });

    const saved = await newPkg.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error al crear paquete:', err.message);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Actualizar un paquete
exports.updatePackage = async (req, res) => {
  const { name, description, price, duration, category, includes, isPopular, popular, image } = req.body;

  // Construir objeto de paquete
  const packageFields = {};
  if (name) packageFields.name = name;
  if (description) packageFields.description = description;

  if (price !== undefined && price !== null && price !== '') {
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) {
      return res.status(400).json({ msg: 'El precio debe ser un número' });
    }
    packageFields.price = numericPrice;
  }

  if (duration !== undefined) packageFields.duration = duration;
  if (category !== undefined) packageFields.category = category;

  if (includes !== undefined) {
    let includesArray = [];
    if (Array.isArray(includes)) {
      includesArray = includes
        .filter((i) => typeof i === 'string')
        .map((i) => i.trim())
        .filter(Boolean);
    } else if (typeof includes === 'string') {
      includesArray = includes.split(',').map((i) => i.trim()).filter(Boolean);
    }
    packageFields.includes = includesArray;
  }

  const toBoolean = (val) => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') {
      const v = val.trim().toLowerCase();
      if (v === 'true' || v === '1') return true;
      if (v === 'false' || v === '0') return false;
    }
    return Boolean(val);
  };

  if (isPopular !== undefined) {
    packageFields.popular = toBoolean(isPopular);
  } else if (popular !== undefined) {
    packageFields.popular = toBoolean(popular);
  }

  // La imagen se manejará más adelante (posible subida a Blob en producción)
  if (!req.file && typeof image === 'string' && image.trim()) {
    packageFields.image = image.trim();
  }

  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de paquete inválido' });
    }

    let pkg = await Package.findById(id);
    if (!pkg) return res.status(404).json({ msg: 'Paquete no encontrado' });

    if (req.file && req.file.buffer) {
      const result = await uploadBuffer(req.file.buffer, 'packages');
      packageFields.image = result.secure_url;
      if (pkg.image && isCloudinaryUrl(pkg.image)) {
        try { await deleteByUrl(pkg.image); } catch (e) { console.error('No se pudo borrar imagen anterior de Cloudinary:', e.message); }
      } else if (pkg.image && pkg.image.includes('/uploads/')) {
        try {
          const idx = pkg.image.indexOf('/uploads/');
          const rel = idx !== -1 ? pkg.image.slice(idx) : '';
          const localPath = path.join(__dirname, '..', rel.replace(/^\/+/, ''));
          await fs.unlink(localPath);
        } catch (e) {
          console.error('No se pudo borrar archivo local anterior:', e.message);
        }
      }
    }

    pkg = await Package.findByIdAndUpdate(
      id,
      { $set: packageFields },
      { new: true }
    );

    res.json(pkg);
  } catch (err) {
    console.error('Error al actualizar paquete:', err.message);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Eliminar un paquete
exports.deletePackage = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de paquete inválido' });
    }
    const packageDoc = await Package.findById(id);
    if (!packageDoc) return res.status(404).json({ msg: 'Paquete no encontrado' });
    if (packageDoc.image && isCloudinaryUrl(packageDoc.image)) {
      try { await deleteByUrl(packageDoc.image); } catch (e) { console.error('Error al eliminar imagen de Cloudinary:', e.message); }
    } else if (packageDoc.image && packageDoc.image.includes('/uploads/')) {
      try {
        const idx = packageDoc.image.indexOf('/uploads/');
        const rel = idx !== -1 ? packageDoc.image.slice(idx) : '';
        const localPath = path.join(__dirname, '..', rel.replace(/^\/+/, ''));
        await fs.unlink(localPath);
      } catch (e) {
        console.error('Error al eliminar imagen asociada:', e.message);
      }
    }
    await Package.findByIdAndDelete(id);
    res.json({ msg: 'Paquete eliminado' });
  } catch (err) {
    console.error('Error al eliminar paquete:', err.message);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};