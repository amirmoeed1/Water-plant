import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';  // Import a date picker library like react-datepicker
import 'react-datepicker/dist/react-datepicker.css';  // Make sure to import the CSS for the date picker

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
  
  const [startDate, setStartDate] = useState(new Date());  // Default to current date
  const [endDate, setEndDate] = useState(new Date());  // Default to current date

  const bottleTypes = [
    '1 Can',
    '2 Dispenser Can',
  ];

  useEffect(() => {
    fetchCustomer();
    fetchBottles();
    fetchPayments();
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      if (!customerId) throw new Error('Customer ID is missing');
      const response = await axios.get(`https://water-plant-backend.onrender.com/customer/${customerId}`);
      setCustomer(response.data);
      const quantity = response.data.quantity || 0;
      setEmptyBottles(quantity);
    } catch (error) {
      console.error('Error fetching customer:', error.response ? error.response.data : error.message);
    }
  };

  const fetchBottles = async () => {
    try {
      const response = await axios.get(`https://water-plant-backend.onrender.com/bottles/${customerId}`);
      setBottles(response.data);
    } catch (error) {
      console.error('Error fetching bottles:', error.response || error.message);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`https://water-plant-backend.onrender.com/paymentcustomer/${customerId}`);
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
        await axios.put(`https://water-plant-backend.onrender.com/bottles/${editBottle._id}`, {
          type: bottleType,
          qty: parseInt(bottleQty),
          pricePerBottle: parseFloat(pricePerBottle),
          totalAmount,
          customerId,
          date: new Date().toISOString(),
        });
        setEditBottle(null);
      } else {
        await axios.post('https://water-plant-backend.onrender.com/bottles', {
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
      await axios.delete(`https://water-plant-backend.onrender.com/bottles/${id}`);
      fetchBottles();
    } catch (error) {
      console.error('Error deleting bottle:', error.response || error.message);
    }
  };

  const calculateTotalAmount = () => {
    // Calculate total based on filtered bottles (within the selected date range)
    return filterBottles().reduce((total, bottle) => total + (bottle.totalAmount || 0), 0);
  };

  // Filter bottles for current month or selected date range
  const filterBottles = () => {
    const start = new Date(startDate.setHours(0, 0, 0, 0));  // Set time to start of day
    const end = new Date(endDate.setHours(23, 59, 59, 999)); // Set time to end of day

    return bottles.filter((bottle) => {
      const bottleDate = new Date(bottle.createdAt);
      return bottleDate >= start && bottleDate <= end;
    });
  };

  // Update the filtered bottles whenever startDate or endDate changes
  useEffect(() => {
    fetchBottles();  // Re-fetch bottles if necessary, or update the state based on date
  }, [startDate, endDate]);  // Add dependencies to trigger when date changes

  return (
    <div>
      <div className="row">
        <h2 className="col-md-5">Delivery Page for Customer {customer?.name}</h2>
        <h2 className="col-md-6">{customer?.name} Takes {emptyBottles} Empty Bottles</h2>

        <div>
          <h3>{editBottle ? 'Edit Bottle' : 'Add Bottle'}</h3>
          
          <select
            value={bottleType}
            onChange={(e) => setBottleType(e.target.value)}
          >
            <option value="">Select Bottle Type</option>
            {bottleTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={bottleQty}
            onChange={(e) => setBottleQty(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price Per Bottle"
            value={pricePerBottle}
            onChange={(e) => setPricePerBottle(e.target.value)}
          />
          <button onClick={handleAddBottle}>
            {editBottle ? 'Update Bottle' : 'Add Bottle'}
          </button>
        </div>

        <div>
          <h3>Select Date Range</h3>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="MMMM d, yyyy"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            dateFormat="MMMM d, yyyy"
          />
        </div>

        <div>
          <h3>Bottles for Customer</h3>
          <ul>
            {filterBottles()?.map((bottle) => (
              <li key={bottle._id}>
                {bottle.type}: {bottle.qty} bottles at Rs{bottle.pricePerBottle} each 
                (Total: Rs{bottle.totalAmount}) - {bottle.createdAt ? new Date(bottle.createdAt).toLocaleDateString() : 'No date available'}
                <button onClick={() => { 
                  setEditBottle(bottle); 
                  setBottleType(bottle.type); 
                  setBottleQty(bottle.qty); 
                  setPricePerBottle(bottle.pricePerBottle); 
                }}>
                  Edit
                </button>
                <button onClick={() => handleDeleteBottle(bottle._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <h3>Grand Total: Rs {calculateTotalAmount()}</h3> {/* Updated grand total */}
        </div>
      </div>
    </div>
  );
};

export default Delivery;
