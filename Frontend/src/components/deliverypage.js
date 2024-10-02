import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker'; // Date picker
import 'react-datepicker/dist/react-datepicker.css'; // Date picker styles
import { BASE_API_URL } from '../Api.Config';

const Delivery = () => {
  const { customerId } = useParams();

  const [customer, setCustomer] = useState(null);
  const [bottles, setBottles] = useState([]);
  const [bottleType, setBottleType] = useState('');
  const [bottleQty, setBottleQty] = useState('');
  const [pricePerBottle, setPricePerBottle] = useState('');
  const [editBottle, setEditBottle] = useState(null);
  const [emptyBottles, setEmptyBottles] = useState(0);
  const [Payments, setPayments] = useState(0);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const bottleTypes = ['1 Bottle', '2 Dispenser Bottle'];

  useEffect(() => {
    fetchCustomer();
    fetchBottles();
    fetchPayments();
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/customer/${customerId}`);
      setCustomer(response.data);
      const quantity = response.data.quantity || 0;
      setEmptyBottles(quantity);
    } catch (error) {
      console.error('Error fetching customer:', error.response ? error.response.data : error.message);
    }
  };

  const fetchBottles = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/bottles/${customerId}`);
      setBottles(response.data);
    } catch (error) {
      console.error('Error fetching bottles:', error.response || error.message);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/paymentcustomer/${customerId}`);
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error.response || error.message);
    }
  };

  const handleAddBottle = async () => {
    if (bottleType.trim() === '' || isNaN(bottleQty) || isNaN(pricePerBottle)) {
      alert('Please enter valid details');
      return;
    }

    try {
      const totalAmount = parseInt(bottleQty) * parseFloat(pricePerBottle);

      if (editBottle) {
        await axios.put(`${BASE_API_URL}/bottles/${editBottle._id}`, {
          type: bottleType,
          qty: parseInt(bottleQty),
          pricePerBottle: parseFloat(pricePerBottle),
          totalAmount,
          customerId,
          date: new Date().toISOString(),
        });
        setEditBottle(null);
      } else {
        await axios.post(`${BASE_API_URL}/bottles`, {
          type: bottleType,
          qty: parseInt(bottleQty),
          pricePerBottle: parseFloat(pricePerBottle),
          totalAmount,
          customerId,
          date: new Date().toISOString(),
        });
      }
      setBottleType('');
      setBottleQty('');
      setPricePerBottle('');
      fetchBottles();
      fetchCustomer();
    } catch (error) {
      console.error('Error adding or updating bottle:', error.response || error.message);
    }
  };

  const handleDeleteBottle = async (id) => {
    try {
      await axios.delete(`${BASE_API_URL}/bottles/${id}`);
      fetchBottles();
    } catch (error) {
      console.error('Error deleting bottle:', error.response || error.message);
    }
  };

  const calculateTotalAmount = () => {
    return filterBottles().reduce((total, bottle) => total + (bottle.totalAmount || 0), 0);
  };

  const filterBottles = () => {
    const start = new Date(startDate.setHours(0, 0, 0, 0));
    const end = new Date(endDate.setHours(23, 59, 59, 999));
    return bottles.filter((bottle) => {
      const bottleDate = new Date(bottle.createdAt);
      return bottleDate >= start && bottleDate <= end;
    });
  };

  useEffect(() => {
    fetchBottles();
  }, [startDate, endDate]);

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>

      <div className="row mb-5">
        <div className="col-md-6">
          <h2>Customer Name: {customer?.name}</h2>
          <h3>Empty Bottles: {emptyBottles}</h3>
        </div>
      </div>

      <div className="card mb-5">
        <div className="card-header">
          <h3>{editBottle ? 'Edit Bottle' : 'Add Bottle'}</h3>
        </div>
        <div className="card-body">
          <form className="form-inline">
            <div className="form-group mb-3">
              <select className="form-control" value={bottleType} onChange={(e) => setBottleType(e.target.value)}>
                <option value="">Select Bottle Type</option>
                {bottleTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group mb-3 mx-sm-3">
              <input
                type="number"
                className="form-control"
                placeholder="Quantity"
                value={bottleQty}
                onChange={(e) => setBottleQty(e.target.value)}
              />
            </div>
            <div className="form-group mb-3 mx-sm-3">
              <input
                type="number"
                className="form-control"
                placeholder="Price Per Bottle"
                value={pricePerBottle}
                onChange={(e) => setPricePerBottle(e.target.value)}
              />
            </div>
            <button type="button" className="btn btn-success" onClick={handleAddBottle}>
              {editBottle ? 'Update Bottle' : 'Add Bottle'}
            </button>
          </form>
        </div>
      </div>

      <div className="card mb-5">
        <div className="card-header">
          <h3>Select Date Range</h3>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label>Start Date</label>
            <DatePicker
              className="form-control"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="MMMM d, yyyy"
            />
              <label>End Date</label>
            <DatePicker
              className="form-control"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              dateFormat="MMMM d, yyyy"
            />
          </div>
           
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Bottles Summary</h3>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {filterBottles().map((bottle) => (
              <li key={bottle._id} className="list-group-item d-flex justify-content-between align-items-center">
                {bottle.type}: {bottle.qty} bottles at Rs{bottle.pricePerBottle} each
                (Total: Rs{bottle.totalAmount}) - {bottle.createdAt ? new Date(bottle.createdAt).toLocaleDateString() : 'No date available'}
                <div>
                  <button className="btn btn-warning btn-sm mx-2" onClick={() => {
                    setEditBottle(bottle);
                    setBottleType(bottle.type);
                    setBottleQty(bottle.qty);
                    setPricePerBottle(bottle.pricePerBottle);
                  }}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBottle(bottle._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
          <h3 className="mt-4">Grand Total: Rs {calculateTotalAmount()}</h3>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
