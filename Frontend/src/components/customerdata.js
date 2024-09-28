import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import 'bootstrap/dist/css/bootstrap.min.css';

const TownCustomerForm = () => {
  const [towns, setTowns] = useState([]); // State to store towns
  const [selectedTown, setSelectedTown] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch towns when the component loads
  useEffect(() => {
    const fetchTowns = async () => {
      try {
        const response = await axios.get('https://water-plant-backend.onrender.com');
        console.log('Fetched towns:', response.data); // Debugging line
        setTowns(response.data); // Assuming the response is an array of towns
      } catch (error) {
        console.error('Error fetching towns:', error);
      }
    };
    fetchTowns(); // Fetch towns on component mount
  }, []); // Empty dependency array means it runs once on mount

  // Handle town selection and fetch customers for that town
  const handleTownChange = async (e) => {
    const townId = e.target.value;
    setSelectedTown(townId);
    setSelectedCustomer(null); // Reset customer when town changes

    try {
      const response = await axios.get(`https://water-plant-backend.onrender.com`);
      console.log('Fetched customers:', response.data); // Debugging line
      setCustomers(response.data); // Assuming the response is an array of customers
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  // Handle customer selection
  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    const customer = customers.find((cust) => cust._id === customerId);
    setSelectedCustomer(customer || null);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Select Town and Customer</h2>
      
      {/* Town Selection */}
      <div className="mb-3">
        <label htmlFor="townSelect" className="form-label">Select Town</label>
        <select className="form-select" onChange={handleTownChange} value={selectedTown}>
            <option value="">Select a Town</option>
            {towns.map((town) => (
              <option key={town._id} value={town._id}>
                {town?.town}
              </option>
            ))}
          </select>
      </div>

      {/* Customer Selection */}
      <div className="mb-3">
        <label htmlFor="customerSelect" className="form-label">Select Customer</label>
        <select
          id="customerSelect"
          className="form-select"
          value={selectedCustomer ? selectedCustomer._id : ''}
          onChange={handleCustomerChange}
          disabled={!selectedTown}
        >
          <option value="">-- Select Customer --</option>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <option key={customer._id} value={customer._id}>{customer.name}</option>
            ))
          ) : (
            <option value="" disabled>No Customers Available</option>
          )}
        </select>
      </div>

      {/* Display Customer Details */}
      {selectedCustomer && (
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">Customer Details</h5>
            <p><strong>Name:</strong> {selectedCustomer.name}</p>
            <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
            <p><strong>Address:</strong> {selectedCustomer.address}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TownCustomerForm;
