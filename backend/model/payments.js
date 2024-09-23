const { default: mongoose } = require("mongoose");

const paymentSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: false
  },
  town: {  // Renamed from 'name' to 'town' for clarity
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Town',
    required: false
  },
  totalAmount: {
    type: Number,  // Total amount that the customer owes
    required: false,
    default: 0
  },
  receivedAmount: {
    type: Number,  // Amount received from the customer
    required: false,
    default: 0
  },
  remainingBalance: {
    type: Number,  // Remaining balance to be paid (calculated field)
    default: 0,
    required: false
  },
  paymentDate: {
    type: Date,  // Date when the payment was received
    default: Date.now
  },
  receivedDate: {
    type: Date,  // Date when the full amount was received (optional if partial payments)
  }
});

// Middleware to automatically calculate the remaining balance before saving the payment
paymentSchema.pre('save', function (next) {
  this.remainingBalance = this.totalAmount - this.receivedAmount;
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
