const coustomer = require("../model/coustomer");
const mongoose = require("mongoose");


// Find customer by TownId


const customer = async (req, res) => {
  const townId = req.query.townId;
  try {
    const customers = await coustomer.find({ town: townId });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// Get all Customers
const allCustomer = async (req, res) => {
  try {
    const customers = await coustomer.find(); // This will return all customers
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Find Customer By Id
const customerId = async (req, res) => {
  const { Id } = req.params; // Access route parameter
  console.log("id ....", Id);
  try {
    const customer = await coustomer.findById(Id);
    console.log("customer res", customer);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Customer
const addCustomers = async (req, res) => {
  const { name, town, phone, address, quantity } = req.body;
  // Ensure required fields are present
  if (!name || !town || !phone || !address || !quantity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create a new customer
    const newCustomer = new coustomer({
      name,
      town,
      phone,
      address,
      quantity,
    });

    // Save the customer to the database
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Customer

const UpdateCustomer = async (req, res) => {
  console.log("Request Body:", req.body); // Log the request body to debug

  try {
    const { customerId } = req.params; // Get customer ID from URL parameters

    // Validate if the customerId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: "Invalid customer ID format" });
    }

    const updates = req.body; // Get updates from request body

    // Update customer in the database
    const customer = await coustomer.findByIdAndUpdate(customerId, updates, { new: true });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    console.log("Updated Customer:", customer); // Log updated customer to verify
    res.json(customer);
    
  } catch (error) {
    console.error("Error updating customer:", error); // Log the full error message for debugging
    res.status(500).json({ error: "Error updating customer: " + error.message });
  }
};

// Delete Customer
const deleteCustomer = async (req, res) => {
  const { customerId } = req.params;

  console.log(req.params, "params")

  // Validate customerId format
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return res.status(400).json({ message: "Invalid customer ID format" });
  }

  try {
    const deletedCustomer = await coustomer.findByIdAndDelete(customerId);
    console.log(deletedCustomer, "delwted");
    

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error); 
    res.status(500).json({ message: "Error deleting customer", error });
  }
};



 

// Monthaly Report 

const monthalyReport = async(req,res)=>{
    try {
        const { townId, customerId, month } = req.params;
        
        // Parse month to start and end dates
        const startDate = new Date(month);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // Last day of the month
    
        const query = {
          date: { $gte: startDate, $lte: endDate },
        };
    
        if (townId !== 'all') {
          query['town'] = townId;
        }
        if (customerId !== 'all') {
          query['customerId'] = customerId;
        }
    
        const bottles = await Bottle.find(query).populate('customerId', 'name');
        const totalBottles = bottles.reduce((sum, bottle) => sum + bottle.qty, 0);
        const totalAmount = bottles.reduce((sum, bottle) => sum + bottle.totalPrice, 0);
    
        // Fetch customer details
        let customer = {};
        if (customerId !== 'all') {
          customer = await Customer.findById(customerId);
        }
        
        // Calculate total bill, total paid, and remaining balance
        const totalBill = customer.totalBill || 0;
        const totalPaid = customer.totalPaid || 0;
        const balance = totalBill - totalPaid;
    
        res.json({
          deliveries: bottles.map(bottle => ({
            date: bottle.date.toISOString().split('T')[0],
            amount: bottle.totalPrice,
            bottles: bottle.qty
          })),
          totalBottles,
          totalAmount,
          totalBill,
          totalPaid,
          balance
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}




// Get total amounts and remaining balances for all towns
const totalCustomer = async (req, res) => {
    try {
      const towns = await Town.find();
      const townReports = await Promise.all(towns.map(async (town) => {
        const customers = await Customer.find({ town: town._id });
        const totalBill = customers.reduce((sum, customer) => sum + customer.totalBill, 0);
        const totalPaid = customers.reduce((sum, customer) => sum + customer.totalPaid, 0);
        const balance = totalBill - totalPaid;
        return { town: town.name, totalBill, totalPaid, balance };
      }));
  
      res.json(townReports);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}
  

module.exports = {
  customer,
  allCustomer,
  customerId,
  addCustomers,
  UpdateCustomer,
  deleteCustomer,
  monthalyReport,
  totalCustomer
};
