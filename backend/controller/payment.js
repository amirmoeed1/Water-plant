const Payment = require("../model/payments");
const  Customer  = require("../model/coustomer");
// Add Payment

const addPayment = async (req, res) => {
  const { customerId, totalAmount, receivedAmount, town, date } = req.body;

  try {
    console.log("customer id ", customerId)
    // Check if the customer exists
    const customer = await Customer.findById(customerId); // Ensure 'Customer' model is imported correctly
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Check if a payment entry already exists for this customer
    let payment = await Payment.findOne({ customerId });

    if (payment) {
      // If payment exists, update the existing record
      payment.receivedAmount += receivedAmount; // Add the new received amount to the existing one
      // payment.remainingBalance = payment.totalAmount - payment.receivedAmount; // Update the remaining balance
      payment.totalAmount = totalAmount; // Optionally update totalAmount if needed

      // Save the updated payment entry
      const updatedPayment = await payment.save();
      return res.status(200).json(updatedPayment);
    } else {
      // If no payment entry exists, create a new one
      const newPayment = new Payment({
        customerId,
        town: town,
        receivedAmount: receivedAmount,
        totalAmount: totalAmount,
        remainingBalance: totalAmount - receivedAmount, // Calculate the remaining balance
        date,
      });

      const savedPayment = await newPayment.save();
      return res.status(201).json(savedPayment);
    }
  } catch (error) {
    console.error('Error in addPayment:', error); // Log the error for debugging
    res.status(400).json({ message: error.message });
  }
};

// Get all payments
const getAllPayments = async (req, res) => {
  try {
    // Fetch all payments and populate 'customerId' and 'town'
    const payments = await Payment.find()
      .populate("customerId") // Populates customer details
      .populate("town"); // Populates town details

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payments by customer ID
const getPaymetByCustomerID = async (req, res) => {
  try {
    const payments = await Payment.find({
      customerId: req.params.customerId,
    }).populate("customerId");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payments by date range
const paymetnDate = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const payments = await Payment.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).populate("customerId");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a payment
const UpdatePaymet = async (req, res) => {
  const { receivedAmount } = req.body; // Make sure this matches your frontend key

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      { receivedAmount }, // Use the correct field name
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(updatedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Delete a payment
const DeletePayment = async (req, res) => {

  console.log("hello");
  
  try {
    await Payment.findByIdAndDelete(req.params.id);


    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addPayment,
  getAllPayments,
  getPaymetByCustomerID,
  paymetnDate,
  UpdatePaymet,
  DeletePayment
};
