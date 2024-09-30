import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; // For capturing HTML to generate PDF
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
  console.log("allBottles", allBottles)
  const [editPaymentId, setEditPaymentId] = useState(null); // ID of the payment to be edited

  const [cansCount, setCansCount] = useState(0);
  const [dispensersCount, setDispensersCount] = useState(0);
  const [localcan, setlocalcan] = useState(0);

  const foundCustomer = allPayments && allPayments.find(item => item.customerId?._id === customerDetails?._id);
  const ToalAmountCustomer = allBottles && allBottles.find(item => item.customerId?._id === customerDetails?._id);


  

    const [quantities, setQuantities] = useState({
      '1 Can': 0,
      '2 Dispenser Can': 0,
      '3 Local Can': 0
    });
  
    
  
  

    const fetchTowns = async () => {
      try {
        const response = await axios.get('http://localhost:5000/towns');
        // const response = await axios.get('api/townrates/towns?type=get-towns');
        setTowns(response.data);
      } catch (error) {
        console.error('Error fetching towns:', error);
      }
    };
  const AllPayments = async () => {
    try {
      const response = await axios.get("https://water-plant-backend.onrender.com/payment");
      setAllPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const AllBottles = async (id) => {
    try {
      const response = await axios.get("https://water-plant-backend.onrender.com/bottles/${id}");
      setAllBottles(response.data);
    } catch (error) {
      console.error('Error fetching bottles:', error);
    }
  };

  const fetchCustomers = async (townId) => {
    try {
      const response = await axios.get("https://water-plant-backend.onrender.com/customers?townId=${townId}");
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
        const response = await axios.get("https://water-plant-backend.onrender.com/customer/${customerId}");
        setCustomerDetails(response.data);
        // Reset quantities
        setQuantities({
          '1 Can': 0,
          '2 Dispenser Can': 0,
          '3 Local Can': 0
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
      '3 Local Can': 0
    };

    data.forEach(item => {
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
        // Update existing payment
        await axios.put("https://water-plant-backend.onrender.com/payment/${editPaymentId}", {
          receivedAmount: amount
        });
        setEditPaymentId(null);
      } else {
        // Add new payment
        await axios.post("https://water-plant-backend.onrender.com/payment", {
          town:selectedTown,
          customerId: selectedCustomer,
          receivedAmount: amount,
          totalAmount: ToalAmountCustomer?.totalAmount
        });
      }
      setPaymentAmount('');
      handleCustomerChange({ target: { value: selectedCustomer } }); // Refresh customer details
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
    try {
      await axios.delete("https://water-plant-backend.onrender.com/payment/${paymentId}");
      handleCustomerChange({ target: { value: selectedCustomer } }); // Refresh customer details
      AllPayments();
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  const generatePDF = async () => {
    const input = document.getElementById('payment-report');
    const logoUrl = 'logoplant.jpg'; // Path to your logo
  
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
  
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 10; // Left and right margin
  
    // Add background color
    pdf.setFillColor(245, 245, 245); // Light grey background
    pdf.rect(0, 0, pageWidth, pageHeight, 'F'); // Fill entire page
  
    // Add company logo
    const logoWidth = 40; // Adjust logo width
    const logoHeight = (logoWidth * 2) / 3; // Maintain aspect ratio
    pdf.addImage(logoUrl, 'PNG', margin, 10, logoWidth, logoHeight);
  
    // Header for company name
    pdf.setFontSize(30);
    pdf.setTextColor(50, 50, 50);
    pdf.text('Masafi Drinking Water', pageWidth / 2, 30, null, null, 'center');
  
    // Customer and payment details
    pdf.setFontSize(16);
    pdf.setTextColor(0, 102, 204);
    pdf.text(`Customer Name: ${customerDetails?.name}`, margin, 60);
  
    pdf.setFontSize(14);
    pdf.setTextColor(0, 153, 0);
    pdf.text(`Total Amount: RS ${ToalAmountCustomer?.totalAmount || 0}`, margin, 75);
  
    pdf.setTextColor(255, 165, 0);
    pdf.text(`Received Amount: RS ${foundCustomer?.receivedAmount || 0}`, margin, 90);
  
    pdf.setTextColor(255, 0, 0);
    pdf.text(`Remaining Balance: RS ${ToalAmountCustomer?.totalAmount - foundCustomer?.receivedAmount || 0}`, margin, 105);
  
    // Emergency and payment info
    pdf.setTextColor(0, 0, 0); // Black for normal text
    pdf.text('Contact Number: 03336566564', margin, 125);
    pdf.text('JazzCash Number: 03336566564  Account Name: IJAZ Ahmad', margin, 140);
    pdf.text('Bank Account: 123456789', margin, 155);
  
    // Separator line
    pdf.setLineWidth(0.5);
    pdf.line(margin, 165, pageWidth - margin, 165); // Horizontal line
  
    // Table structure for quantities and prices
    pdf.setFontSize(14);
    pdf.setTextColor(0, 102, 204);
    pdf.text('Item', margin, 180);
    pdf.text('Quantity', 100, 180); // Second column
    pdf.text('Price', 160, 180); // Third column
  
    // Example prices
    const prices = {
      '1 Can': 50,
      '2 Dispenser Can': 100,
      '3 Local Can': 30
    };
  
    // Table rows for quantities and prices
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    
    pdf.text('Number of Cans:', margin, 195);
    pdf.text(`${quantities['1 Can']}`, 100, 195);
    pdf.text(`RS ${prices['1 Can'] * quantities['1 Can']}`, 160, 195);
  
    pdf.text('Number of Dispensers:', margin, 210);
    pdf.text(`${quantities['2 Dispenser Can']}`, 100, 210);
    pdf.text(`RS ${prices['2 Dispenser Can'] * quantities['2 Dispenser Can']}`, 160, 210);
  
    pdf.text('Number of Local Cans:', margin, 225);
    pdf.text(`${quantities['3 Local Can']}`, 100, 225);
    pdf.text(`RS ${prices['3 Local Can'] * quantities['3 Local Can']}`, 160, 225);
  
    // Footer with company info
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Thank you for choosing Masafi Drinking Water', pageWidth / 2, pageHeight - 30, null, null, 'center');
  
    // Save the PDF with a dynamic name
    pdf.save(`payment_report_${customerDetails?.name}.pdf`);
  };
  
  
  

  useEffect(() => {
    fetchTowns();
    AllPayments();
  
  }, []);
  useEffect(() => {
    if (selectedCustomer) {
      const newQuantities = calculateQuantities(allBottles, selectedCustomer);
      setQuantities(newQuantities);
    }
  }, [allBottles, selectedCustomer]);
  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-secondary mb-4">Back to Dashboard</Link>
      <h2 className="mb-4">Town and Customer Payment</h2>
      <div className="row">
        <div className="col-md-6 mb-3">
          <select className="form-select" onChange={handleTownChange} value={selectedTown}>
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
            <select className="form-select" onChange={handleCustomerChange} value={selectedCustomer}>
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
    <p><strong>Total Amount:</strong> RS {ToalAmountCustomer?.totalAmount || 0}</p>
    <p><strong>Received Amount:</strong> RS {foundCustomer?.receivedAmount || 0}</p>
    <p><strong>Remaining Balance:</strong> RS {(ToalAmountCustomer?.totalAmount - foundCustomer?.receivedAmount) || 0}</p>
    
    {/* New fields for displaying cans, dispensers, and local cans */}
    <p><strong>Number of Cans:</strong> {quantities['1 Can']}</p>
          <p><strong>Number of Dispensers:</strong> {quantities['2 Dispenser Can']}</p>
          <p><strong>Number of Local Cans:</strong> {quantities['3 Local Can']}</p>
    <div className="mb-3">
      <label htmlFor="paymentAmount" className="form-label">Enter Payment Amount</label>
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
          .filter(payment => payment.customerId?._id === selectedCustomer)
          .map(payment => (
            <li key={payment._id} className="list-group-item d-flex justify-content-between align-items-center">
              Amount: RS {payment.receivedAmount}
              <div>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditPayment(payment)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeletePayment(payment._id)}>Delete</button>
              </div>
            </li>
          ))}
      </ul>
    </div>

    <button className="btn btn-info mt-3" onClick={generatePDF}>Generate PDF</button>
  </div>
) : (
  <p>Please select a customer to view details.</p>
)}

    </div>
  );
};

export default Payment;
