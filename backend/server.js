require("dotenv").config();
const express = require('express');
// const mongoose = require('mongoose');
// const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();


// const Login = require('./api/login.js');

const {authRoutes} = require('./routes/userRoutes.js')
const {customerRoutes} = require('./routes/customer.js')
const {townRoutes} = require('./routes/town.js')
const {bottlesRoutes} = require('./routes/bottles.js')
const {paymetRoutes} = require('./routes/payment.js')
const connectDB = require('./db.js');
require('./db')
// const path = require('path');
// const path = require('path');
// Middleware
app.use(cors({
  origin: '*', // Replace '*' with a specific origin or array of allowed origins if needed
  methods: ["POST", "GET", "DELETE", "PUT"],
  credentials: true // Fixed typo here
}));
app.use(bodyParser.json());
connectDB();


// Start server
const PORT = process.env.PORT || 8081;
app.use("/", authRoutes)
app.use("/", customerRoutes)
app.use("/", townRoutes)
app.use("/", bottlesRoutes)
app.use("/", paymetRoutes)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.bold.rainbow);
});
