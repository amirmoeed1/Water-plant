
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('./db')
// const loginRoute = require('./login'); // Import login route

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// app.use('/login', loginRoute);
// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/deliverySystem', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// Routes
const routes = require('./routes');
app.use('/', routes);

// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
