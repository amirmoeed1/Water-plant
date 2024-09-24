const Bottle = require("../model/bottles");

const getBills = async (req, res) => {
  try {
    const bills = await Bottle.find().sort({ date: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBills,
};
