const Worker = require('../models/Worker');
const mongoose = require('mongoose');

const path = require('path');
const fs = require('fs').promises;


// Obtener todos los trabajadores
exports.getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find();
    res.json(workers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// Crear un trabajador
exports.createWorker = async (req, res) => {
  const { name, role } = req.body;

  try {
    if (!name || !role) {
      return res.status(400).json({ msg: 'Faltan campos requeridos: name y role' });
    }

    let photoUrl = '';
    if (req.file && req.file.filename) {
      photoUrl = `/uploads/${req.file.filename}`;
    } else if (typeof req.body.photo === 'string' && req.body.photo.trim()) {
      photoUrl = req.body.photo.trim();
    }

    const newWorker = new Worker({
      name,
      role,
      photo: photoUrl
    });

    const worker = await newWorker.save();
    res.json(worker);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// Actualizar un trabajador
exports.updateWorker = async (req, res) => {
  const { name, role } = req.body;
  const { id } = req.params;

  const workerFields = {};
  if (name) workerFields.name = name;
  if (role) workerFields.role = role;
  if (!req.file && typeof req.body.photo === 'string' && req.body.photo.trim()) {
    workerFields.photo = req.body.photo.trim();
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de trabajador inválido' });
    }

    let worker = await Worker.findById(id);
    if (!worker) return res.status(404).json({ msg: 'Trabajador no encontrado' });

    if (req.file && req.file.filename) {
      const newLocal = `/uploads/${req.file.filename}`;
      if (worker.photo && worker.photo.includes('/uploads/')) {
        try {
          const idx = worker.photo.indexOf('/uploads/');
          const rel = idx !== -1 ? worker.photo.slice(idx) : '';
          const localPath = path.join(__dirname, '..', rel.replace(/^\/+/, ''));
          await fs.unlink(localPath);
        } catch (e) {
          console.error('No se pudo borrar archivo local anterior:', e.message);
        }
      }
      workerFields.photo = newLocal;
    }

    worker = await Worker.findByIdAndUpdate(
      id,
      { $set: workerFields },
      { new: true }
    );

    res.json(worker);
  } catch (err) {
    console.error('Error al actualizar trabajador:', err.message);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Eliminar un trabajador
exports.deleteWorker = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'ID de trabajador inválido' });
    }

    const worker = await Worker.findById(id);
    if (!worker) return res.status(404).json({ msg: 'Trabajador no encontrado' });

    if (worker.photo && worker.photo.includes('/uploads/')) {
      try {
        const idx = worker.photo.indexOf('/uploads/');
        const rel = idx !== -1 ? worker.photo.slice(idx) : '';
        const localPath = path.join(__dirname, '..', rel.replace(/^\/+/, ''));
        await fs.unlink(localPath);
      } catch (e) {
        console.error('No se pudo eliminar foto del trabajador:', e.message);
      }
    }

    await Worker.findByIdAndDelete(id);

    res.json({ msg: 'Trabajador eliminado' });
  } catch (err) {
    console.error('Error al eliminar trabajador:', err.message);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};