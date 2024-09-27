import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import TownCustomerManagement from './components/town&coustomer';
import Delivery from './components/deliverypage';
import Payment from './components/payment';
import Report from './components/monthlyreport';
import Dashboard from './components/dashboard';
 
import TownCustomersList from './components/customerdata';
// import Deliverypage from './components/deliverypage';
 
 
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import '../styles/globals.css'; // Your custom styles, if any
function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/dilivery" element={<Delivery />} />
        <Route path="/customerdata" element={<TownCustomersList />} />
      
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/towns-customers" element={<TownCustomerManagement />} />
        <Route path="/customers/:customerId" element={<Delivery />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
