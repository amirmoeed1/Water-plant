
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const Login = require('./api/login.js');
const {authRoutes} = require('./routes/userRoutes.js')
const {customerRoutes} = require('./routes/customer.js')
const {townRoutes} = require('./routes/town.js')
const {bottlesRoutes} = require('./routes/bottles.js')
const {paymetRoutes} = require('./routes/payment.js')
const connectToDatabase = require('./db.js');
require('./db')
// Middleware
app.use(cors());
app.use(bodyParser.json());
connectToDatabase();
// Start server
const port = 5000;

app.use("/", authRoutes)
app.use("/", customerRoutes)
app.use("/", townRoutes)
app.use("/", bottlesRoutes)
app.use("/", paymetRoutes)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
