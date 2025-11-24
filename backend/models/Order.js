const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', default: null },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'MXN' },
  status: { type: String, default: 'in_progress' },
  transactionId: { type: String, default: null },
  customerEmail: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);