const mongoose = require('mongoose');

const BottleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  pricePerBottle: {
    type: Number,
    required: true,
  },
  // salman
  totalAmount: { 
    type: Number,  // Automatically calculated based on qty and pricePerBottle
  },
  // salman
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the current date and time
  },
  entryCount: {
    type: Number,
    default: 1, // Default to 1 entry
  }
});

// Calculate the totalPrice before saving
BottleSchema.pre('save', function (next) {
  this.totalPrice = this.qty * this.pricePerBottle;
  next();
});

module.exports = mongoose.model('Bottle', BottleSchema);
