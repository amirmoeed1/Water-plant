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
      const response = await axios.get('https://water-plant-backend.onrender.com/towns');
      setTowns(response.data);
    } catch (error) {
      alert('Error fetching towns: ' + error.message);
    }
  };

  const fetchCustomers = async (townId) => {
    try {
      if (!townId) return;
      const response = await axios.get(`https://water-plant-backend.onrender.com/customers?townId=${townId}`);
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
      await axios.post('https://water-plant-backend.onrender.com/towns', { newtown: newTown });
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
        await axios.put(`https://water-plant-backend.onrender.com/customers/${editCustomer._id}`, {
          customer: newCustomer,
          phone: newPhone,
          address: newAddress,
          quantity: newQuantity,
        });
        setEditCustomer(null);
      } else {
        await axios.post('https://water-plant-backend.onrender.com/customers', {
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
      alert('Error adding/updating customer: ' + error.message);
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
        await axios.delete(`https://water-plant-backend.onrender.com/towns/${townId}`);
        fetchTowns();
      } catch (error) {
        alert('Error deleting town: ' + error.message);
      }
    }
  };

  const handleDeleteCustomer = async () => {
    if (selectedCustomer && window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`https://water-plant-backend.onrender.com/customers/${selectedCustomer}`);
        fetchCustomers(selectedTown);
        setSelectedCustomer(''); // Reset the selected customer
      } catch (error) {
        alert('Error deleting customer: ' + error.message);
      }
    } else {
      alert('Please select a customer to delete');
    }
  };

  const handleEditCustomer = () => {
    const customerToEdit = customers.find(customer => customer._id === selectedCustomer);
    if (customerToEdit) {
      setNewCustomer(customerToEdit.name);
      setNewPhone(customerToEdit.phone);
      setNewAddress(customerToEdit.address);
      setNewQuantity(customerToEdit.quantity);
      setEditCustomer(customerToEdit);
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

  const handleTownInputChange = (e) => {
    setTownSearch(e.target.value);
    setShowTownSuggestions(true);
  };

  const handleCustomerInputChange = (e) => {
    setCustomerSearch(e.target.value);
    setShowCustomerSuggestions(true);
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
    <div className="container mt-3">
      <h2 className="text-center mb-3">Town & Customer Management</h2>

      {/* Town Management Section */}
      <div className="row mb-3">
        <div className="col-md-6">
          <h3 className="mb-3">Add Town</h3>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={newTown}
              onChange={(e) => setNewTown(e.target.value)}
              placeholder="Enter town name"
            />
            <button className="btn btn-primary" onClick={handleAddTown}>
              Add Town
            </button>
          </div>
        </div>

        <div className="col-md-6">
          <h3 className="mb-3">Delete Town</h3>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={townSearch}
              onChange={handleTownInputChange}
              placeholder="Search towns"
              onKeyPress={handleTownSearchKeyPress}
            />
            <div className="suggestion-dropdown">
              {showTownSuggestions && filteredTowns.map((town) => (
                <div key={town._id} className="dropdown-item" onClick={() => handleTownSuggestionClick(town)}>
                  {town.town}
                </div>
              ))}
            </div>
            <button className="btn btn-danger" onClick={() => handleDeleteTown(selectedTown)}>
              Delete Town
            </button>
          </div>
        </div>
      </div>

      {/* Customer Management Section */}
      <div className="row">
        <div className="col-md-6">
          <h3 className="mb-3">Add/Edit Customer</h3>
          <div className="input-group">
            <select
              className="form-select"
              value={selectedTown}
              onChange={handleTownChange}
            >
              <option value="">Select town</option>
              {towns.map((town) => (
                <option key={town._id} value={town._id}>
                  {town.town}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={newCustomer}
              onChange={(e) => setNewCustomer(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={newPhone}
              onChange={handlePhoneInputChange}
              placeholder="Enter customer phone number"
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter customer address"
            />
          </div>
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              placeholder="Enter number of cans"
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddCustomer}>
            {editCustomer ? 'Update Customer' : 'Add Customer'}
          </button>
        </div>

        <div className="col-md-6">
          <h3 className="mb-3">Delete/Update Customer</h3>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={customerSearch}
              onChange={handleCustomerInputChange}
              placeholder="Search customers"
              onKeyPress={handleCustomerSearchKeyPress}
            />
            <div className="suggestion-dropdown">
              {showCustomerSuggestions && filteredCustomers.map((customer) => (
                <div key={customer._id} className="dropdown-item" onClick={() => handleCustomerSuggestionClick(customer)}>
                  {customer.name}
                </div>
              ))}
            </div>
            <button className="btn btn-warning" onClick={handleEditCustomer}>
              Edit Customer
            </button>
            <button className="btn btn-danger" onClick={handleDeleteCustomer}>
              Delete Customer
            </button>
          </div>

          <button className="btn btn-primary mt-3" onClick={handleNavigateToDelivery}>
            Navigate to Delivery
          </button>
        </div>
      </div>
    </div>
  );
};

export default TownCustomerManagement;
