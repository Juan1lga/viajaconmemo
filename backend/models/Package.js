const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, default: '' },
  category: { type: String, enum: ['Populares','Lujo','Económicos'], default: 'Populares' },
  includes: { type: [String], default: [] },
  popular: { type: Boolean, default: false },
  image: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Package', PackageSchema);