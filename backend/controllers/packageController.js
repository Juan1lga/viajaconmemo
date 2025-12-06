const Package = require('../models/Package');
const mongoose = require('mongoose');

const path = require('path');
const fs = require('fs').promises;
const { configured, uploadBuffer, deleteByUrl, isCloudinaryUrl } = require('../utils/cloudinary');


// Obtener todos los paquetes

exports.getPackages = async (req, res) => {
  try {
    const filter = {};
    const { category, popular } = req.query || {};
    if (typeof category === 'string' && category.trim()) {
      const cat = category.trim();
      const normalized = (cat === 'Popular') ? 'Populares' : cat;
      const allowed = ['Populares','Lujo','Económicos','Ofertas de fin de semana'];
      if (allowed.includes(normalized)) filter.category = normalized;
    }
    if (popular === 'true') filter.popular = true;
    if (popular === 'false') filter.popular = false;

    const packages = await Package.find(filter).lean();
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
    const { name, description, price, currency, priceDouble, priceDoubleLabel, priceChild, priceAdult, duration, startDate, endDate, category, includes, itinerary, isPopular, popular, image, mainPhotoUrl } = req.body;

    if (!name) {
      return res.status(400).json({ msg: 'El nombre es requerido' });
    }

    const providedPrices = [price, priceDouble, priceChild].filter(v => v !== undefined && v !== null && v !== '');
    if (providedPrices.length === 0) {
      return res.status(400).json({ msg: 'Al menos un precio (general, base doble o niños) es requerido' });
    }

    const numericPrice = (price !== undefined && price !== null && price !== '') ? Number(price) : undefined;
    if (numericPrice !== undefined && Number.isNaN(numericPrice)) {
      return res.status(400).json({ msg: 'El precio debe ser un número' });
    }
    const numericDouble = (priceDouble !== undefined && priceDouble !== null && priceDouble !== '') ? Number(priceDouble) : undefined;
    if (numericDouble !== undefined && Number.isNaN(numericDouble)) {
      return res.status(400).json({ msg: 'El precio base doble debe ser un número' });
    }
    const numericChild = (priceChild !== undefined && priceChild !== null && priceChild !== '') ? Number(priceChild) : undefined;
    if (numericChild !== undefined && Number.isNaN(numericChild)) {
      return res.status(400).json({ msg: 'El precio para niños debe ser un número' });
    }
    const numericAdult = (priceAdult !== undefined && priceAdult !== null && priceAdult !== '') ? Number(priceAdult) : undefined;
    if (numericAdult !== undefined && Number.isNaN(numericAdult)) {
      return res.status(400).json({ msg: 'El precio para adultos debe ser un número' });
    }

    const parseDate = (val) => {
      if (!val) return undefined;
      try {
        const d = new Date(val);
        return Number.isNaN(d.getTime()) ? undefined : d;
      } catch {
        return undefined;
      }
    };
    const start = parseDate(startDate);
    const end = parseDate(endDate);

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
      if (!configured) { return res.status(503).json({ error: 'cloudinary_not_configured', message: 'Cloudinary no está disponible para subir imágenes' }); }
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

    const currencyNormalized = (typeof currency === 'string' && (currency.trim().toUpperCase() === 'MXN' || currency.trim().toUpperCase() === 'USD')) ? currency.trim().toUpperCase() : 'USD';

    const newPkg = new Package({
      name,
      description: description || '',
      price: numericPrice !== undefined ? numericPrice : undefined,
      currency: currencyNormalized,
      priceDouble: numericDouble !== undefined ? numericDouble : undefined,
      priceDoubleLabel: (typeof priceDoubleLabel === 'string' && priceDoubleLabel.trim()) ? priceDoubleLabel.trim() : 'Base doble',
      priceChild: numericChild !== undefined ? numericChild : undefined,
      priceAdult: numericAdult !== undefined ? numericAdult : undefined,
      duration: duration || '',
      startDate: start,
      endDate: end,
      category: (category && ['Populares','Lujo','Económicos','Ofertas de fin de semana'].includes(category)) ? category : 'Populares',
      itinerary: itinerary || '',
      includes: includesArray,
      popular: popularFlag,
      image: imageUrl,
      mainPhotoUrl: imageUrl
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
  const { name, description, price, currency, priceDouble, priceDoubleLabel, priceChild, priceAdult, duration, startDate, endDate, category, includes, itinerary, isPopular, popular, image, mainPhotoUrl } = req.body;

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
  if (category !== undefined) {
    let cat = category;
    if (cat === 'Popular') cat = 'Populares';
    packageFields.category = ['Populares','Lujo','Económicos','Ofertas de fin de semana'].includes(cat) ? cat : 'Populares';
  }

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

  const parseDate = (val) => {
    if (!val) return undefined;
    try {
      const d = new Date(val);
      return Number.isNaN(d.getTime()) ? undefined : d;
    } catch {
      return undefined;
    }
  };

  if (isPopular !== undefined) {
    packageFields.popular = toBoolean(isPopular);
  } else if (popular !== undefined) {
    packageFields.popular = toBoolean(popular);
  }

  if (currency !== undefined) {
    const c = typeof currency === 'string' ? currency.trim().toUpperCase() : currency;
    packageFields.currency = (c === 'MXN' || c === 'USD') ? c : 'USD';
  }

  if (priceDouble !== undefined && priceDouble !== null && priceDouble !== '') {
    const n = Number(priceDouble);
    if (Number.isNaN(n)) {
      return res.status(400).json({ msg: 'El precio base doble debe ser un número' });
    }
    packageFields.priceDouble = n;
  }

  if (priceChild !== undefined && priceChild !== null && priceChild !== '') {
    const n = Number(priceChild);
    if (Number.isNaN(n)) {
      return res.status(400).json({ msg: 'El precio para niños debe ser un número' });
    }
    packageFields.priceChild = n;
  }

  if (priceAdult !== undefined && priceAdult !== null && priceAdult !== '') {
    const n = Number(priceAdult);
    if (Number.isNaN(n)) {
      return res.status(400).json({ msg: 'El precio para adultos debe ser un número' });
    }
    packageFields.priceAdult = n;
  }

  if (priceDoubleLabel !== undefined) {
    if (typeof priceDoubleLabel === 'string') {
      const lbl = priceDoubleLabel.trim();
      packageFields.priceDoubleLabel = lbl || 'Base doble';
    }
  }

  if (itinerary !== undefined) packageFields.itinerary = itinerary;

  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (start !== undefined) packageFields.startDate = start;
  if (end !== undefined) packageFields.endDate = end;

  // La imagen se manejará más adelante (posible subida a Blob en producción)
  if (!req.file && typeof image === 'string' && image.trim()) {
    const img = image.trim();
    packageFields.image = img;
    packageFields.mainPhotoUrl = img;
  }
  if (!req.file && typeof mainPhotoUrl === 'string' && mainPhotoUrl.trim()) {
    packageFields.mainPhotoUrl = mainPhotoUrl.trim();
  }

  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de paquete inválido' });
    }

    let pkg = await Package.findById(id);
    if (!pkg) return res.status(404).json({ msg: 'Paquete no encontrado' });

    if (req.file && req.file.buffer) {
      if (!configured) { return res.status(503).json({ error: 'cloudinary_not_configured', message: 'Cloudinary no está disponible para subir imágenes' }); }
      const result = await uploadBuffer(req.file.buffer, 'packages');
      packageFields.image = result.secure_url;
      packageFields.mainPhotoUrl = result.secure_url;
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
      if (!configured) { return res.status(503).json({ error: 'cloudinary_not_configured', message: 'Cloudinary no está disponible para eliminar imágenes' }); }
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