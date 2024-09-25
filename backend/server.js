
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
// const Login = require('./api/login.js');

const {authRoutes} = require('./routes/userRoutes.js')
const {customerRoutes} = require('./routes/customer.js')
const {townRoutes} = require('./routes/town.js')
const {bottlesRoutes} = require('./routes/bottles.js')
const {paymetRoutes} = require('./routes/payment.js')
const connectToDatabase = require('./db.js');
require('./db')
const path = require('path');
// Middleware
app.use(cors());
app.use(bodyParser.json());
connectToDatabase();
// Start server
const port = 5000;
// app.get("/",(req, res)=>{
//   res.json({masseg: "Hello world for backend"})
// });''


// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle API routes here
app.get('/', (req, res) => {
  // Your API logic here
  res.json({ message: "This is an API endpoint" });
});

// Anything that doesn't match the API routes above, send back the React app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'server.js'));
});

app.use("/", authRoutes)
app.use("/", customerRoutes)
app.use("/", townRoutes)
app.use("/", bottlesRoutes)
app.use("/", paymetRoutes)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
