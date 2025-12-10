const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  // URL absoluta del blob (producción)
  url: {
    type: String,
    required: function() { return !this.imageUrl; }
  },
  // Ruta relativa local (desarrollo)
  imageUrl: {
    type: String,
    required: function() { return !this.url; }
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: false
  },
  approved: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Photo', PhotoSchema);