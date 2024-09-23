import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // Check if the user is authenticated on component load
  useEffect(() => {
    const token = localStorage.getItem('tokenExpiry');
    if (!token) {
      // Redirect to login if token doesn't exist
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('tokenExpiry');
    // Optionally clear other data such as user details
    // localStorage.removeItem('userDetails');
    // Redirect to the login page
    navigate('/');
  };

  return (
    <div>
      {/* Navbar with Logout Button */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="container">
    <h3 className="text-primary fw-bold">Welcome to: Ijaz Ahmad Water-Plant</h3>
    <div className="ms-auto mt-md-5"> {/* Center and add margin-top on medium screens */}
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </div>
  </div>
</nav>

      <div className="container mt-5">
        <h2 className="mb-4">Dashboard</h2>
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">New Customer & Town Add</h5>
                <Link to="/towns-customers" className="btn btn-primary">Go to Towns & Customers</Link>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Payment</h5>
                <Link to="/payment" className="btn btn-primary">Check Customer Payment</Link>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Monthly Report</h5>
                <Link to="/report" className="btn btn-primary">Go to Monthly Report</Link>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Customer Information</h5>
                <Link to="/customerdata" className="btn btn-primary">Check Customer Detail</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
