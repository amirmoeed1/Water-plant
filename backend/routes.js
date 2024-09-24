


const express = require('express');
const app = express.Router();
const Town = require('./model/town');
const Customer = require('./model/coustomer');
const Bottle = require('./model/bottles');
// const Bottlemonthly = require('./model/bottlemonthly');
const Payment = require('./model/payments');
// const town = require('./model/town');
// const Login = require('./model/payment');



// // Get all towns
// app.get('/towns', async (req, res) => {
//   try {
//     const towns = await Town.find();
//     res.json(towns);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// // Add a new town
// app.post('/towns', async (req, res) => {
//   const town = new Town({
//     name: req.body.town,
//   });

//   try {
//     const newTown = await town.save();
//     res.status(201).json(newTown);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Get all customers for a specific town
app.get('/customers', async (req, res) => {
  const townId = req.query.townId;
  try {
    const customers = await Customer.find({ town: townId });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get all customers  
app.get('/allCustomers', async (req, res) => {
  try {
    // Fetch all customers without filtering by townId
    const customers = await Customer.find(); // This will return all customers
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// // Add a new customer
// app.post('/customers', async (req, res) => {
//   const customer = new Customer({
//     name: req.body.customer,
//     town: req.body.town,
//   });

//   try {
//     const newCustomer = await customer.save();
//     res.status(201).json(newCustomer);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Add a bottle to a customer
// app.post('/bottles', async (req, res) => {
//   const bottle = new Bottle({
//     type: req.body.type,
//     qty: req.body.qty,
//     pricePerBottle: req.body.pricePerBottle,
//     customerId: req.body.customerId,
//   });

//   try {
//     const newBottle = await bottle.save();
//     res.status(201).json(newBottle);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
// Login route
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Check if the user exists
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).json({ success: false, message: 'Invalid username or password' });
//     }

//     // Compare the entered password with the hashed password in the database
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: 'Invalid username or password' });
//     }

//     // Create a token that expires in 1 week
//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1w' });

//     // Return the token
//     res.json({ success: true, token });
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });
const users = [
    { username: 'admin', password: '12345' } // Example user
  ];
  
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
  

// Get all towns
app.get('/towns', async (req, res) => {
  try {
    const towns = await Town.find();
    res.json(towns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// get town by id
app.get('/towns/:townId', async (req, res) => {
  try {
    const townId = req.params.townId;
    const town = await Town.findById(townId);
    
    if (!town) {
      return res.status(404).json({ message: 'Town not found' });
    }
    
    res.json(town);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Add a new town
// app.post('/towns', async (req, res) => {
//   const town = new Town({ name: req.body.town });
//   console.log(req.body.town);
  

//   try {
//     const newTown = await town.save();
//     res.status(201).json(newTown);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
// app.post('/towns', async (req, res) => {
//   console.log('Request body:', req.body); // Log the entire request body

//   // Check if req.body.town is defined and not empty
//   if (!req.body.town) {
//     return res.status(400).json({ message: 'Town name is required' });
//   }

//   const town = new Town({ town: req.body.town });

//   try {
//     const newTown = await town.save();
//     res.status(201).json(newTown);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
// Add a new town
app.post('/towns', async (req, res) => {
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
});




// Update an existing town
// app.put('/town/:id', async (req, res) => {
//   try {
//     const { town } = req.body;
//     const updatedTown = await Town.findByIdAndUpdate(req.params.id, { name: town }, { new: true });
//     if (!updatedTown) return res.status(404).json({ message: 'Town not found' });
//     res.json(updatedTown);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating town', error });
//   }
// });

// Delete a town
app.delete('/towns/:id', async (req, res) => {
  try {
    const deletedTown = await Town.findByIdAndDelete(req.params.id);
    if (!deletedTown) return res.status(404).json({ message: 'Town not found' });
    res.json({ message: 'Town deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting town', error });
  }
});


// Get customers by town
// salman
app.get('/customers', async (req, res) => {
  try {
    const { town } = req.query;
    if (!town) {
      return res.status(400).json({ message: 'Town ID is required' });
    }
    const customers = await Customer.find({ town });
    if (customers.length === 0) {
      return res.status(404).json({ message: 'No customers found for this town' });
    }
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Customer by ID
app.get('/customer/:Id', async (req, res) => {
  const { Id } = req.params; // Access route parameter
  console.log("id ....", Id);
  try {
    const customer = await Customer.findById(Id);
    console.log("customer res", customer);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// salman
// Add a new customer

// POST route to add a new customer
app.post('/customers', async (req, res) => {
  const { customer, town, phone, address,quantity } = req.body;

  // Ensure required fields are present
  if (!customer || !town || !phone || !address || !quantity) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create a new customer
    const newCustomer = new Customer({
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
});
// Fetch Customer by ID
// app.get('/customers/:Id', async (req, res) => {
//   try {
//     console.log("coustomer id ", req.params.Id)
//     const customer = await Customer.findById(req.params.Id);
//     if (!customer) {
//       return res.status(404).json({ message: 'Customer not found' });
//     }
//     res.json(customer);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching customer: ' + error.message });
//   }
// });

// Fetch Customer by ID
// app.get('/customers/:Id', async (req, res) => {
//   try {
//     const { Id } = req.params;
    
//     // Validate if the Id is a valid MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(Id)) {
//       return res.status(400).json({ message: 'Invalid Customer ID' });
//     }
    
//     console.log("Customer ID: ", Id);
    
//     // Find the customer using findOne (optionally log the database query)
//     const customer = await Customer.findOne({ _id: Id });
    
//     if (!customer) {
//       return res.status(404).json({ message: 'Customer not found' });
//     }
    
//     res.json(customer);
//   } catch (error) {
//     console.error("Error fetching customer: ", error.message);
//     res.status(500).json({ message: 'Error fetching customer: ' + error.message });
//   }
// });

// // Update Customer by ID
app.put('/customers/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params; // Get customer ID from URL parameters
    const updates = req.body; // Get updates from request body
    const customer = await Customer.findByIdAndUpdate(customerId, updates, { new: true });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Error updating customer: ' + error.message });
  }
});

app.get('/customers', async (req, res) => {
  const { Id } = req.query; // Access query parameter
  // console.log("id ....", Id);
  try {
    const customer = await Customer.findById(Id);
    console.log("customer res", customer);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Delete Customer by ID
app.delete('/customers/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params; // Get customer ID from URL parameters
    const customer = await Customer.findByIdAndDelete(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting customer: ' + error.message });
  }
});

// Add a new bottle entry
// app.post('/bottles', async (req, res) => {
//   const { type, qty, pricePerBottle, customerId } = req.body;

//   const bottle = new Bottle({
//     type,
//     qty,
//     pricePerBottle,
//     customerId,
//     totalPrice: qty * pricePerBottle, // Calculate total price
//     createdAt: new Date() // Store the current date
//   });

//   try {
//     const newBottle = await bottle.save();
//     res.status(201).json(newBottle);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Get all bottle entries
// app.get('/bottles', async (req, res) => {
//   try {
//     const bottles = await Bottle.find().populate('customerId', 'name');
//     res.json(bottles);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// Add bottle
// app.post('/bottles', async (req, res) => {
//   try {
//     const { type, qty, pricePerBottle } = req.body;
//     const totalPrice = qty * pricePerBottle;
    
//     const bottle = new Bottle({
//       type,
//       qty,
//       pricePerBottle,
//       totalPrice,
//     });

//     await bottle.save();
//     res.status(201).json({ success: true });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });
// Add a new bottle entry
// salman
app.post('/bottles', async (req, res) => {
  const { type, qty, pricePerBottle, customerId , totalAmount } = req.body;

  const bottle = new Bottle({
    type,
    qty,
    pricePerBottle,
    customerId,
    totalAmount: qty * pricePerBottle, // Calculate total price
    date: new Date() // Store the current date
  });
  console.log(bottle.customerId);
  

  try {
    const newBottle = await bottle.save();
    res.status(201).json(newBottle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// salman

// Get All Bootles 
app.get('/bottles', async (req, res) => {
  try {
    const bootles = await Bottle.find();
    res.json(bootles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Route to get bottles by customer ID
app.get('/bottles/:id', async (req, res) => {
  try {
    const customerId = req.params.id; // Access the customer ID from route parameters
    console.log("Bottle customer ID:", customerId);

    // Find bottles by customerId and populate customer details
    const bottles = await Bottle.find({ customerId }).populate('customerId', 'name');

    if (!bottles || bottles.length === 0) {
      return res.status(404).json({ message: 'No bottles found for this customer' });
    }

    res.json(bottles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Delete a bottle entry
app.delete('/bottles/:id', async (req, res) => {
  try {
    await Bottle.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Bottle entry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a bottle entry
app.put('/bottles/:id', async (req, res) => {
  const { type, qty, pricePerBottle } = req.body;
  const totalAmount = qty * pricePerBottle; // Calculate total amount

  try {
    const updatedBottle = await Bottle.findByIdAndUpdate(req.params.id, {
      type,
      qty,
      pricePerBottle,
      totalAmount,
      date: new Date() // Update the date to current date
    }, { new: true });

    res.json(updatedBottle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get bills (for employer)
app.get('/bills', async (req, res) => {
  try {
    const bills = await Bottle.find().sort({ date: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



// Get daily data (admin view)
app.get('/daily-data', async (req, res) => {
  try {
    const dailyData = await Bottle.aggregate([
      {
        $group: {
          _id: { type: '$type', date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } },
          totalQty: { $sum: '$qty' },
          totalSales: { $sum: '$totalPrice' }
        }
      },
      {
        $project: {
          type: '$_id.type',
          date: '$_id.date',
          totalQty: 1,
          totalSales: 1,
          _id: 0
        }
      },
      { $sort: { date: -1 } }
    ]);

    res.json(dailyData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// Update town by ID
// app.put('/towns/:id', async (req, res) => {
//   const { id } = req.params;
//   const { town } = req.body;

//   try {
//     // Find town by ID and update it
//     const updatedTown = await Town.findByIdAndUpdate(
//       id,
//       { town }, // Update the town field
//       { new: true, runValidators: true } // Return the updated document
//     );

//     if (!updatedTown) {
//       return res.status(404).json({ message: 'Town not found' });
//     }

//     res.json(updatedTown);
//   } catch (error) {
//     console.error('Error updating town:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Delete town and associated customers
app.delete('/towns/:id', async (req, res) => {
  try {
    const townId = req.params.id;

    // Find and delete the town
    const deletedTown = await Town.findByIdAndDelete(townId);

    if (!deletedTown) {
      return res.status(404).send('Town not found');
    }

    // Delete associated customers
    await Customer.deleteMany({ town: townId });

    res.status(200).send('Town and associated customers deleted successfully');
  } catch (error) {
    console.error('Error deleting town:', error);
    res.status(500).send('Server error');
  }
});

 // Get monthly report for a specific town and customer
app.get('/:townId/:customerId/:month', async (req, res) => {
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
});



// Get total amounts and remaining balances for all towns
app.get('/total', async (req, res) => {
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
});

// Create a new payment
app.post('/payment', async (req, res) => {
  const { customerId, totalAmount, receivedAmount,town, date } = req.body;
 
  try {
    // Check if the customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
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
      res.status(200).json(updatedPayment);
    } else {
      // If no payment entry exists, create a new one
      const newPayment = new Payment({
        customerId,
        town: town, 
        receivedAmount: receivedAmount,
        totalAmount: totalAmount,
        remainingBalance: totalAmount - receivedAmount, // Calculate the remaining balance
        date
      });

      const savedPayment = await newPayment.save();
      res.status(201).json(savedPayment);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Get all payments
app.get('/payment', async (req, res) => {
  try {
    // Fetch all payments and populate 'customerId' and 'town'
    const payments = await Payment.find()
      .populate('customerId')  // Populates customer details
      .populate('town');       // Populates town details
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payments by customer ID
app.get('/paymentcustomer/:customerId', async (req, res) => {
  try {
    const payments = await Payment.find({ customerId: req.params.customerId }).populate('customerId');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payments by date range
app.get('/paymentdate', async (req, res) => {
  const { startDate, endDate } = req.query;
  
  try {
    const payments = await Payment.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('customerId');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a payment
app.put('/payment/:id', async (req, res) => {
  const { receivedAmount } = req.body; // Make sure this matches your frontend key

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      { receivedAmount }, // Use the correct field name
      { new: true }
    );
    
    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(updatedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a payment
app.delete('/payment/:id', async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;