// models/Bottle.js
const mongoose = require('mongoose');

const bottleSchema = new mongoose.Schema({
  type: String,
  qty: Number,
  pricePerBottle: Number,
  totalPrice: Number,
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bottl', bottleSchema);
