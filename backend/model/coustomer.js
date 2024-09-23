const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  town: { type: mongoose.Schema.Types.ObjectId, ref: 'Town', required: true },
  phone: { type: String, required: true }, // New phone field
  address: { type: String, required: true }, // New address field

  quantity: { type: Number, required: true, default: 0 }, // Quantity of cans field

  totalBill: { type: Number, default: 0 },
  totalPaid: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  canCount: { type: Number, default: 0 },
  dispenserCount: { type: Number, default: 0 },
  localCanCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Customer', customerSchema);
