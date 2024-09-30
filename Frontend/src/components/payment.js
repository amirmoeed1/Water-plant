import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'bootstrap/dist/css/bootstrap.min.css';
import './payment.css';

const Payment = () => {
  const [towns, setTowns] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedTown, setSelectedTown] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [customerDetails, setCustomerDetails] = useState(null);
  const [allPayments, setAllPayments] = useState([]);
  const [allBottles, setAllBottles] = useState([]);
  // console.log("allBottles", allBottles)
  const [editPaymentId, setEditPaymentId] = useState(null); // ID of the payment to be edited

  // const [cansCount, setCansCount] = useState(0);
  // const [dispensersCount, setDispensersCount] = useState(0);
  // const [localcan, setlocalcan] = useState(0);

  const foundCustomer = allPayments && allPayments.find(item => item.customerId?._id === customerDetails?._id);
  // Total  Town Data TotalAmount, TotalReciving , TotalRemaining

  // console.log("selectedCustomer", selectedCustomer)
  const filteredData = allBottles?.filter(item => item.customerId._id === selectedCustomer);

  // Step 2: Use the reduce method to calculate the total sum of totalAmount
  const totalCustomerAmount = filteredData.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.totalAmount;
  }, 0); // Initial value of the accumulator is 0
  
  console.log("totalCustomerAmount", totalCustomerAmount)



  

    const [quantities, setQuantities] = useState({
      '1 Can': 0,
      '2 Dispenser Can': 0,
      '3 Local Can': 0
    });
  
    
  
  

  const fetchTowns = async () => {
    try {
      const response = await axios.get(
        'https://water-plant-backend.onrender.com/towns'
      );
      setTowns(response.data);
    } catch (error) {
      console.error('Error fetching towns:', error);
    }
  };

  const AllPayments = async () => {
    try {
      const response = await axios.get(
        'https://water-plant-backend.onrender.com/payment'
      );
      setAllPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const AllBottles = async (id) => {
    try {
      const response = await axios.get(
        `https://water-plant-backend.onrender.com/bottles/${id}`
      );
      setAllBottles(response.data);
    } catch (error) {
      console.error('Error fetching bottles:', error);
    }
  };

  const fetchCustomers = async (townId) => {
    try {
      const response = await axios.get(
        `https://water-plant-backend.onrender.com/customers?townId=${townId}`
      );
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleTownChange = (event) => {
    const selectedTownId = event.target.value;
    setSelectedTown(selectedTownId);
    if (selectedTownId) {
      fetchCustomers(selectedTownId);
    }
  };

  const handleCustomerChange = async (e) => {
    const customerId = e.target.value;
    setSelectedCustomer(customerId);
    if (customerId) {
      AllBottles(customerId);
      try {
        const response = await axios.get(
          `https://water-plant-backend.onrender.com/customer/${customerId}`
        );
        setCustomerDetails(response.data);
        setQuantities({
          '1 Can': 0,
          '2 Dispenser Can': 0,
        });
      } catch (error) {
        console.error('Error fetching customer details:', error);
        setCustomerDetails(null);
      }
    } else {
      setCustomerDetails(null);
    }
  };

  const calculateQuantities = (data, customerId) => {
    const quantities = {
      '1 Can': 0,
      '2 Dispenser Can': 0,
    };

    data.forEach((item) => {
      if (item.customerId._id === customerId) {
        quantities[item.type] += item.qty;
      }
    });
    return quantities;
  };

  const handlePayment = async () => {
    const amount = parseFloat(paymentAmount);

    if (isNaN(amount) || amount <= 0 || !selectedCustomer) {
      alert('Please enter a valid payment amount and select a customer');
      return;
    }

    try {
      if (editPaymentId) {
        await axios.put(
          `https://water-plant-backend.onrender.com/payment/${editPaymentId}`,
          {
            receivedAmount: amount,
          }
        );
        setEditPaymentId(null);
      } else {
        await axios.post('https://water-plant-backend.onrender.com/payment', {
          town: selectedTown,
          customerId: selectedCustomer,
          receivedAmount: amount,
          totalAmount: totalCustomerAmount,
        });
      }
      setPaymentAmount('');
      handleCustomerChange({ target: { value: selectedCustomer } });
      AllPayments();
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  };

  const handleEditPayment = (payment) => {
    setPaymentAmount(payment.receivedAmount);
    setEditPaymentId(payment._id);
  };

  const handleDeletePayment = async (paymentId) => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this payment?'
    );

    if (isConfirmed) {
      try {
        await axios.delete(
          `https://water-plant-backend.onrender.com/payment/${paymentId}`
        );
        handleCustomerChange({ target: { value: selectedCustomer } });
        AllPayments();
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  const generatePDF = async () => {
    // PDF generation code here
    // ...
  };

  useEffect(() => {
    fetchTowns();
    AllPayments();
  }, []);

  useEffect(() => {
    if (selectedCustomer && allBottles.length > 0) {
      const newQuantities = calculateQuantities(allBottles, selectedCustomer);
      setQuantities(newQuantities);
    }
  }, [allBottles, selectedCustomer]);

  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-secondary mb-4">
        Back to Dashboard
      </Link>
      <h2 className="mb-4">Town and Customer Payment</h2>
      <div className="row">
        <div className="col-md-6 mb-3">
          <select
            className="form-select"
            onChange={handleTownChange}
            value={selectedTown}
          >
            <option value="">Select a Town</option>
            {towns.map((town) => (
              <option key={town._id} value={town._id}>
                {town?.town}
              </option>
            ))}
          </select>
        </div>

        {selectedTown && (
          <div className="col-md-6 mb-3">
            <select
              className="form-select"
              onChange={handleCustomerChange}
              value={selectedCustomer}
            >
              <option value="">Select a Customer</option>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))
              ) : (
                <option value="">No customers available</option>
              )}
            </select>
          </div>
        )}
      </div>

      {customerDetails ? (
        <div className="card p-4 mb-4 shadow-sm" id="payment-report">
          <h3>Customer Details</h3>
          <p>
            <strong>Total Amount:</strong> RS {totalCustomerAmount || 0}
          </p>
          <p>
            <strong>Received Amount:</strong> RS{' '}
            {foundCustomer?.receivedAmount || 0}
          </p>
          <p>
            <strong>Remaining Balance:</strong> RS{' '}
            {totalCustomerAmount - foundCustomer?.receivedAmount || 0}
          </p>

          <p>
            <strong>Number of Cans:</strong> {quantities['1 Can']}
          </p>
          <p>
            <strong>Number of Dispensers Cans:</strong>{' '}
            {quantities['2 Dispenser Can']}
          </p>

          <div className="mb-3">
            <label htmlFor="paymentAmount" className="form-label">
              Enter Payment Amount
            </label>
            <input
              type="number"
              className="form-control"
              id="paymentAmount"
              placeholder="Enter payment amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handlePayment}>
            {editPaymentId ? 'Update Payment' : 'Record Payment'}
          </button>

          <div className="mt-4">
            <h4>Payment History</h4>
            <ul className="list-group">
              {allPayments
                .filter((payment) => payment.customerId?._id === customerDetails?._id)
                .map((payment) => (
                  <li key={payment._id} className="list-group-item">
                    Amount Received: {payment.receivedAmount}
                    <button
                      className="btn btn-sm btn-secondary mx-2"
                      onClick={() => handleEditPayment(payment)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeletePayment(payment._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
            </ul>
          </div>
          <button className="btn btn-success mt-4" onClick={generatePDF}>
            Download PDF
          </button>
        </div>
      ) : (
        <p>No customer details available</p>
      )}
    </div>
  );
};

export default Payment;
