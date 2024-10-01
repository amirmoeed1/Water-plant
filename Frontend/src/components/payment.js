import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'bootstrap/dist/css/bootstrap.min.css';
import './payment.css';
import { BASE_API_URL } from '../Api.Config';

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
  // const BalanceCustomer = allPayments && allPayments.find(item => item.customerId?._id === customerDetails?._id);
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
          `${BASE_API_URL}/payment/${paymentId}`
        );
        handleCustomerChange({ target: { value: selectedCustomer } });
        AllPayments();
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Set custom colors
    const headerColor = '#4CAF50'; // Green color for the header
    const textColor = '#000000'; // Black color for text
    const footerColor = '#D32F2F'; // Red color for the footer
    const amountColor = '#1976D2'; // Blue color for amounts
    const cansColor = '#FFA000'; // Amber color for cans
  
    // Load the logo image (if it's a URL, convert to base64 or download first)
    const logoUrl = 'logoplant.jpg'; // Path to your image file
  
    // Add the logo at the top center of the PDF
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 50;
    const logoHeight = 50;
    const logoX = (pageWidth - logoWidth) / 2; // Center the logo
    doc.addImage(logoUrl, 'PNG', logoX, 1, logoWidth, logoHeight); // (image, format, x, y, width, height)
  
    // Title below the logo
    doc.setFontSize(22);
    doc.setTextColor(headerColor);
    doc.text('Customer Payment Report', pageWidth / 2, 60, { align: 'center' });
  
    // Draw a colored line below the title
    doc.setDrawColor(headerColor);
    doc.setLineWidth(1);
    doc.line(20, 65, pageWidth - 20, 65);
  
    // Customer Details Section
    if (customerDetails) {
      doc.setFontSize(14);
      doc.setTextColor(textColor);
      doc.text(`Customer Name: ${customerDetails?.name || ''}`, 20, 75);
  
      // Prepare data for the table
      const tableData = [
        { label: 'Total Amount', value: `RS ${totalCustomerAmount || 0}` },
        { label: 'Received Amount', value: `RS ${foundCustomer?.receivedAmount || 0}` },
        { label: 'Remaining Balance', value: `RS ${totalCustomerAmount - (foundCustomer?.receivedAmount || 0)}` },
        { label: 'Number of Cans', value: quantities['1 Can'] },
        { label: 'Number of Dispenser Cans', value: quantities['2 Dispenser Can'] },
      ];
  
      // Define the columns for the table
      const columns = [
        { header: 'Description', dataKey: 'label' },
        { header: 'Amount', dataKey: 'value' },
      ];
  
      // Add table to the PDF
      doc.autoTable({
        head: [columns.map(col => col.header)], // Set table header
        body: tableData.map(item => [item.label, item.value]), // Set table body
        startY: 80, // Start Y position below the customer name
        theme: 'grid', // You can change the theme to 'striped', 'plain', etc.
        styles: {
          cellPadding: 3,
          fontSize: 10,
        },
      });
    }
  
    // Footer Section
    const footerY = doc.internal.pageSize.getHeight() - 140; // Position the footer at the bottom with space for details
    doc.setDrawColor(footerColor);
    doc.setLineWidth(0.5);
    doc.line(20, footerY - 10, pageWidth - 20, footerY - 10); // Line above footer
  
    doc.setFontSize(12);
    doc.setTextColor(footerColor);
    doc.text('Contact Number: 0333-6566564', 20, footerY);
    doc.text('JazzCash Number: 0333-6566564 (Account Name: IJAZ Ahmad)', 20, footerY + 10);
  
    // Save the PDF with customer name
    const customerName = customerDetails?.name || 'unknown_customer'; // Fallback in case name is not available
    const fileName = `customer_payment_report_${customerName}.pdf`.replace(/[^a-zA-Z0-9]/g, '_'); // Replace special characters with underscores
    doc.save(fileName);
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
          {/* <p>
            <strong>Priviouse Balance:</strong> RS{' '}
            {totalCustomerAmount - BalanceCustomer?.receivedAmount || 0}
          </p> */}

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
