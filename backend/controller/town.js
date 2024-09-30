const Town = require("../model/town");

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
  const { id } = req.params; // Extracting town id
  try {
    // Your logic to find and delete the town by id
    await TownModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Town deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting town" });
  }
};

 
module.exports = {
  town,
  townid,
  addTown,
  deleteTown
};
