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
  const navigate = useNavigate();

  useEffect(() => {
    fetchTowns();
  }, []);

  const fetchTowns = async () => {
    try {
      const response = await axios.get('http://localhost:5000/towns');
      setTowns(response.data);
    } catch (error) {
      alert('Error fetching towns: ' + error.message);
    }
  };

  const fetchCustomers = async (townId) => {
    try {
      if (!townId) return;
      const response = await axios.get(`http://localhost:5000/customers?townId=${townId}`);
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
      await axios.post('http://localhost:5000/towns', { newtown: newTown });
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
        await axios.put(`http://localhost:5000/customers/${editCustomer._id}`, {
          customer: newCustomer,
          phone: newPhone,
          address: newAddress,
          quantity: newQuantity,
        });
        setEditCustomer(null);
      } else {
        await axios.post('http://localhost:5000/customers', {
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
        await axios.delete(`http://localhost:5000/towns/${townId}`);
        fetchTowns();
      } catch (error) {
        alert('Error deleting town: ' + error.message);
      }
    }
  };

  // const handleEditCustomer = (customer) => {
  //   setNewCustomer(customer.name);
  //   setNewPhone(customer.phone);
  //   setNewAddress(customer.address);
  //   setNewQuantity(customer.quantity);
  //   setEditCustomer(customer);
  // };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`http://localhost:5000/customers/${customerId}`);
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
      }
    }
  };

  const handlePhoneInputChange = (e) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
      setNewPhone(inputValue);
    }
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
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search Town"
              value={townSearch}
              onChange={(e) => setTownSearch(e.target.value)}
              onKeyPress={handleTownSearchKeyPress}
            />
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
            <button className="btn btn-danger" onClick={() => handleDeleteTown(selectedTown)}>Delete Town</button>
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
              placeholder="New Customer"
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
          <button className="btn btn-success" onClick={handleAddCustomer}>
            {editCustomer ? 'Update Customer' : 'Add Customer'}
          </button>
        </div>

        <div className='col-md-6 mb-4'>
          <h4>Select Customer for Delivery</h4>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search Customer"
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              onKeyPress={handleCustomerSearchKeyPress}
            />
            <select className="form-select" onChange={(e) => setSelectedCustomer(e.target.value)} value={selectedCustomer}>
              <option value="">Select a Customer</option>
              {filteredCustomers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCustomer && (
            <>
              <button className="btn btn-danger" onClick={() => handleDeleteCustomer(selectedCustomer)}>Delete Customer</button>
              <button className="btn btn-primary ml-2" onClick={handleNavigateToDelivery}>Go to Delivery</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TownCustomerManagement;
