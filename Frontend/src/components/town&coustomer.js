import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TownCustomerManagement.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const TownCustomerManagement = () => {
  const [towns, setTowns] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [newTown, setNewTown] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [editCustomer, setEditCustomer] = useState(null);
  const [townSearch, setTownSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [showTownSuggestions, setShowTownSuggestions] = useState(false);
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTowns();
  }, []);

  const fetchTowns = async () => {
    try {
      const response = await axios.get("https://water-plant-backend.onrender.com/towns");
      setTowns(response.data);
    } catch (error) {
      alert('Error fetching towns: ' + error.message);
    }
  };

  const fetchCustomers = async (townId) => {
    try {
      if (!townId) return;
      const response = await axios.get("https://water-plant-backend.onrender.com/customers?townId=${townId}");
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error.message);
    }
  };

  const handleAddTown = async () => {
    if (newTown.trim() === '') {
      alert('Town name cannot be empty');
      return;
    }

    try {
      await axios.post('https://water-plant-backend.onrender.com', { newtown: newTown });
      setNewTown('');
      fetchTowns();
    } catch (error) {
      alert('Error adding town: ' + error?.response?.data?.message);
    }
  };

  const handleAddCustomer = async () => {
    if (
      newCustomer.trim() === '' ||
      !selectedTown ||
      newPhone.trim() === '' ||
      newAddress.trim() === '' ||
      newQuantity.trim() === ''
    ) {
      alert('Please fill in all customer details');
      return;
    }

    try {
      if (editCustomer) {
        await axios.put("https://water-plant-backend.onrender.com/customers/${editCustomer._id}", {
          customer: newCustomer,
          phone: newPhone,
          address: newAddress,
          quantity: newQuantity,
        });
        setEditCustomer(null);
      } else {
        await axios.post("https://water-plant-backend.onrender.com/customers", {
          customer: newCustomer,
          town: selectedTown,
          phone: newPhone,
          address: newAddress,
          quantity: Number(newQuantity),
        });
      }

      setNewCustomer('');
      setNewPhone('');
      setNewAddress('');
      setNewQuantity('');
      fetchCustomers(selectedTown);
    } catch (error) {
      console.error('Error adding/updating customer:', error.message);
    }
  };

  const handleTownChange = (e) => {
    const townId = e.target.value;
    setSelectedTown(townId);
    fetchCustomers(townId);
  };

  const handleNavigateToDelivery = () => {
    if (!selectedCustomer) {
      alert('Please select a customer');
      return;
    }
    navigate(`/customers/${selectedCustomer}`);
  };

  const handleDeleteTown = async (townId) => {
    if (window.confirm('Are you sure you want to delete this town?')) {
      try {
        await axios.delete("https://water-plant-backend.onrender.com/towns/${townId}");
        fetchTowns();
      } catch (error) {
        alert('Error deleting town: ' + error.message);
      }
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete("https://water-plant-backend.onrender.com/customers/${customerId}");
        fetchCustomers(selectedTown);
      } catch (error) {
        alert('Error deleting customer: ' + error.message);
      }
    }
  };

  const filteredTowns = towns.filter(town =>
    town?.town.toLowerCase().includes(townSearch.toLowerCase())
  );

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const handleTownSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      const foundTown = filteredTowns[0];
      if (foundTown) {
        setSelectedTown(foundTown._id);
        setTownSearch('');
        setShowTownSuggestions(false);
        fetchCustomers(foundTown._id);
      }
    }
  };

  const handleCustomerSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      const foundCustomer = filteredCustomers[0];
      if (foundCustomer) {
        setSelectedCustomer(foundCustomer._id);
        setCustomerSearch('');
        setShowCustomerSuggestions(false);
      }
    }
  };

  const handlePhoneInputChange = (e) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
      setNewPhone(inputValue);
    }
  };

  // Show town suggestions when typing
  const handleTownInputChange = (e) => {
    setTownSearch(e.target.value);
    setShowTownSuggestions(true); // Show the suggestions dropdown
  };

  // Show customer suggestions when typing
  const handleCustomerInputChange = (e) => {
    setCustomerSearch(e.target.value);
    setShowCustomerSuggestions(true); // Show the suggestions dropdown
  };

  const handleTownSuggestionClick = (town) => {
    setSelectedTown(town._id);
    setTownSearch('');
    setShowTownSuggestions(false);
    fetchCustomers(town._id);
  };

  const handleCustomerSuggestionClick = (customer) => {
    setSelectedCustomer(customer._id);
    setCustomerSearch('');
    setShowCustomerSuggestions(false);
  };

  return (
    <div className='container'>
      <div className='text-center mt-5 mb-4'>
        <Link to="/dashboard" className="btn btn-secondary">Home</Link>
      </div>

      <h2 className='text-center mb-5'>Manage Towns and Customers</h2>

      <div className='row'>
        <div className='col-md-6 mb-4'>
          <h4>Add Town</h4>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="New Town"
              value={newTown}
              onChange={(e) => setNewTown(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleAddTown}>Add Town</button>
          </div>
        </div>

        <div className='col-md-6 mb-4'>
          <h4>Select a Town</h4>
          <div className="input-group mb-3 ">
            <input
              type="text"
              className="form-control"
              placeholder="Search Town"
              value={townSearch}
              onChange={handleTownInputChange}
              onKeyPress={handleTownSearchKeyPress}
            />
            {showTownSuggestions && (
              <ul className="list-group position-absolute mt-5 suggestion-dropdown">
                {filteredTowns.map((town) => (
                  <li
                    key={town._id}
                    className="list-group-item"
                    onClick={() => handleTownSuggestionClick(town)}
                  >
                    {town?.town}
                  </li>
                ))}
              </ul>
            )}
            <select className="form-select" onChange={handleTownChange} value={selectedTown}>
              <option value="">Select a Town</option>
              {filteredTowns.map((town) => (
                <option key={town._id} value={town._id}>
                  {town?.town}
                </option>
              ))}
            </select>
          </div>

          {selectedTown && (
            <button className="btn btn-danger mst-1 " onClick={() => handleDeleteTown(selectedTown)}>Delete Town</button>
          )}
        </div>
      </div>

      <div className='row'>
        <div className='col-md-6 mb-4'>
          <h4>Add/Edit Customer</h4>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Customer Name"
              value={newCustomer}
              onChange={(e) => setNewCustomer(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Phone Number"
              value={newPhone}
              onChange={handlePhoneInputChange}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Quantity of Cans"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddCustomer}>
            {editCustomer ? 'Update Customer' : 'Add Customer'}
          </button>
        </div>

        <div className='col-md-6 mb-4'>
          <h4>Select a Customer</h4>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search Customer"
              value={customerSearch}
              onChange={handleCustomerInputChange}
              onKeyPress={handleCustomerSearchKeyPress}
            />
            {showCustomerSuggestions && (
              <ul className="list-group position-absolute suggestion-dropdown">
                {filteredCustomers.map((customer) => (
                  <li
                    key={customer._id}
                    className="list-group-item"
                    onClick={() => handleCustomerSuggestionClick(customer)}
                  >
                    {customer.name}
                  </li>
                ))}
              </ul>
            )}
            <select className="form-select" value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
              <option value="">Select a Customer</option>
              {filteredCustomers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCustomer && (
            <button className="btn btn-danger" onClick={() => handleDeleteCustomer(selectedCustomer)}>Delete Customer</button>
          )}
        </div>
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={handleNavigateToDelivery}>Go to Delivery Page</button>
      </div>
    </div>
  );
};

export default TownCustomerManagement;
