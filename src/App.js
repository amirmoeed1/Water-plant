import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import TownCustomerManagement from './components/town&coustomer';
import Delivery from './components/deliverypage';
import Payment from './components/payment';
import Report from './components/monthlyreport';
import Dashboard from './components/dashboard';
// import Logout from './components/logout';
import TownCustomersList from './components/customerdata';
// import Deliverypage from './components/deliverypage';
 
 
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/logout" element={<Logout />} /> */}
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
