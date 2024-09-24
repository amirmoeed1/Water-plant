const Bottle = require("../model/bottles");

// addBottles
const addBottles = async (req, res) => {
  const { type, qty, pricePerBottle, customerId, totalAmount } = req.body;

  const bottle = new Bottle({
    type,
    qty,
    pricePerBottle,
    customerId,
    totalAmount: qty * pricePerBottle, // Calculate total price
    date: new Date(), // Store the current date
  });
  console.log(bottle.customerId);

  try {
    const newBottle = await bottle.save();
    res.status(201).json(newBottle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Bottles
const GetBottles = async (req, res) => {
  try {
    const bootles = await Bottle.find();
    res.json(bootles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Bottles by Customer id
const getBottleByCustomerId = async (req, res) => {
  try {
    const customerId = req.params.id; // Access the customer ID from route parameters
    console.log("Bottle customer ID:", customerId);

    // Find bottles by customerId and populate customer details
    const bottles = await Bottle.find({ customerId }).populate(
      "customerId",
      "name"
    );

    if (!bottles || bottles.length === 0) {
      return res
        .status(404)
        .json({ message: "No bottles found for this customer" });
    }

    res.json(bottles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Bottle
const DeleteBottle = async (req, res) => {
  try {
    await Bottle.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Bottle entry deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update bottle
const updateBottle = async (req, res) => {
  const { type, qty, pricePerBottle } = req.body;
  const totalAmount = qty * pricePerBottle; // Calculate total amount

  try {
    const updatedBottle = await Bottle.findByIdAndUpdate(
      req.params.id,
      {
        type,
        qty,
        pricePerBottle,
        totalAmount,
        date: new Date(), // Update the date to current date
      },
      { new: true }
    );

    res.json(updatedBottle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Daily Data admin
const GetDailyData = async (req, res) => {
  try {
    const dailyData = await Bottle.aggregate([
      {
        $group: {
          _id: {
            type: "$type",
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          },
          totalQty: { $sum: "$qty" },
          totalSales: { $sum: "$totalPrice" },
        },
      },
      {
        $project: {
          type: "$_id.type",
          date: "$_id.date",
          totalQty: 1,
          totalSales: 1,
          _id: 0,
        },
      },
      { $sort: { date: -1 } },
    ]);

    res.json(dailyData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addBottles,
  GetBottles,
  getBottleByCustomerId,
  DeleteBottle,
  updateBottle,
  GetDailyData
};
