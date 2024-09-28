const coustomer = require("../model/coustomer");

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
// payment customer
const customer = async (req, res) => {
  const townId = req.query.townId;
  try {
    const customer = await coustomer.find({ town: townId });
    res.json(customer);
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
  const { customer, town, phone, address, quantity } = req.body;
  // Ensure required fields are present
  if (!customer || !town || !phone || !address || !quantity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create a new customer
    const newCustomer = new coustomer({
      name: customer,
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
  try {
    const { customerId } = req.params; // Get customer ID from URL parameters
    const updates = req.body; // Get updates from request body
    const customer = await coustomer.findByIdAndUpdate(customerId, updates, {
      new: true,
    });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating customer: " + error.message });
  }
};

// Delete Customer
const deleteCustomer = async (req, res) => {
  try {
    const { customerId } = req.params; // Get customer ID from URL parameters
    const customer = await Customer.findByIdAndDelete(customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting customer: " + error.message });
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
