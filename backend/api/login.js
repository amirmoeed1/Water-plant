// const express = require('express');
// const app = express.Router();
// // const Town = require('./model/town');
// // const Customer = require('./model/coustomer');
// // const Bottle = require('./model/bottles');
// // const Bottlemonthly = require('./model/bottlemonthly');
// // const Payment = require('./model/payments');
// // const Login = require('./model/login.js');
// // const cors = require('cors');
// // app.use(cors());
// const users = [
//     { username: 'admin', password: '12345' } // Example user
//   ];
// app.post('/login', (req, res) => {
//         // console.log('Login attempt:', req.body); // Log the login attempt
//         const { username, password } = req.body;
    
//         const user = users.find(u => u.username === username && u.password === password);
//         if (user) {
//             res.json({ success: true, message: 'Login successful' });
//         } else {
//             res.json({ success: false, message: 'Invalid credentials' });
//         }
//     });