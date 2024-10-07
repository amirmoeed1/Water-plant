const Town = require("../model/town");
const mongoose = require('mongoose');


const town = async (req, res) => {
  try {
    const towns = await Town.find();
    res.json(towns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const townid = async (req, res) => {
  try {
    const townId = req.params.townId;
    const town = await Town.findById(townId);
    if (!town) {
      return res.status(404).json({ message: "Town not found" });
    }
    res.json(town);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addTown = async (req, res) => {
  try {
    const { newtown } = req.body; // Extract the town from the request body

    // Check if the town already exists
    const existingTown = await Town.findOne({ town: newtown });
    if (existingTown) {
      return res.status(400).json({ message: "Town already exists" });
    }

    // If the town does not exist, create a new one
    const newTown = new Town({ town: newtown });
    console.log("New town ", newTown);

    const AddTown = await newTown.save();
    console.log("AddTown ", AddTown);

    res.status(201).json(AddTown);
  } catch (error) {
    res.status(400).json(error);
  }
};


const deleteTown = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid town ID" });
  }

  try {
    const deletedTown = await Town.findByIdAndDelete(id);

    if (!deletedTown) {
      return res.status(404).json({ message: "Town not found" });
    }

    res.status(200).json({ message: "Town deleted successfully" });
  } catch (error) {
    console.error("Error deleting town:", error);
    res.status(500).json({ message: "Error deleting town", error: error.message });
  }
};

 
module.exports = {
  town,
  townid,
  addTown,
  deleteTown
};
