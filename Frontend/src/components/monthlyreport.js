import React, { useState, useEffect } from "react";
import axios from "axios";
import "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./monthlyreport.css"; // Import custom CSS for additional styling
import { BASE_API_URL } from "../Api.Config";

const Report = () => {
  // Initial States
  const [towns, setTowns] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedTown, setSelectedTown] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [allBottles, setAllBottles] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [totalEmptyBottles, setTotalEmptyBottles] = useState(0);


  // calculating for Sumer Customer , bottles, payments
  const totalEmptybotle = allCustomers?.reduce((total, customer) => {
    return total + (customer.quantity || 0); // Add the quantity of each customer
  }, 0);

  // Single customer total empty bottles
  const totalQuantityForCustomer = allCustomers
    .filter((customer) => customer._id === selectedCustomer) // Filter by customer ID
    .reduce((total, customer) => total + (customer.quantity || 0), 0); // Sum the quantities

  // Calculate total amount, received amount, and remaining balance
  const totalSum = allBottles?.reduce((accumulator, currentItem) => {
    return accumulator + (currentItem.totalAmount || 0);
  }, 0);

  const totalReceivedAmount = allPayments.reduce(
    (sum, paymentItem) => sum + paymentItem.receivedAmount,
    0
  );
  const totalRemainingAmount = totalSum - totalReceivedAmount;

  // Town Calculation
  // Total  Town Data TotalAmount, TotalReciving , TotalRemaining
  const filteredPayments = allPayments?.filter((payment) => {
    return payment.town?._id === selectedTown;
  });
  // Step 2: Calculate the total sum  of totalAmount and receivedAmount
  const townSums = filteredPayments.reduce(
    (totals, payment) => {
      return {
        totalAmountSum: totals.totalAmountSum + payment.totalAmount,
        receivedAmountSum: totals.receivedAmountSum + payment.receivedAmount,
        remainingBalance: totals.remainingBalance + payment.remainingBalance,
      };
    },
    { totalAmountSum: 0, receivedAmountSum: 0, remainingBalance: 0 }
  );

  // customer Calulation
  const filteredCustomerPayments = allPayments?.filter(
    (payment) => payment.customerId?._id === selectedCustomer
  );

  // Step 2: Calculate the total sum of totalAmount, receivedAmount, and remainingBalance
  const customerSum = filteredCustomerPayments?.reduce(
    (totals, payment) => {
      return {
        totalAmountSum: totals.totalAmountSum + payment.totalAmount,
        receivedAmountSum: totals.receivedAmountSum + payment.receivedAmount,
        remainingBalanceSum:
          totals.remainingBalanceSum + payment.remainingBalance,
      };
    },
    { totalAmountSum: 0, receivedAmountSum: 0, remainingBalanceSum: 0 }
  );

  // Fetch all towns
  const fetchTowns = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/towns`);
      setTowns(response.data);
    } catch (error) {
      console.error("Error fetching towns:", error);
    }
  };
  // Fetch all customer
  const fetchAllCustomer = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/allCustomers`);
      setAllCustomers(response.data);
    } catch (error) {
      console.error("Error fetching towns:", error);
    }
  };

  // Fetch data for a single town
  const fetchSingleTownData = async (townId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/towns/${townId}`); // API endpoint to get a single town's data
      // setTownData(response.data); // Save the town data
      console.log("res....", response);
    } catch (error) {
      console.error("Error fetching single town data:", error);
    }
  };

  // Fetch all bottles
  const fetchAllBottles = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/bottles`);
      setAllBottles(response.data);
    } catch (error) {
      console.error("Error fetching bottles:", error);
    }
  };

  // Fetch all payments
  const fetchAllPayments = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/payment`);
      setAllPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  // Fetch customers by townId
  const fetchCustomers = async (townId) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/customers?townId=${townId}`
      );
      setCustomers(response.data);
      calculateTotalEmptyBottles(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  // Calculate total empty bottles from customers
  const calculateTotalEmptyBottles = (customers) => {
    const total = customers.reduce(
      (acc, customer) => acc + customer.quantity,
      0
    );
    setTotalEmptyBottles(total);
  };



  // Fetch towns, bottles, and payments on component load
  useEffect(() => {
    fetchTowns();
    fetchAllBottles();
    fetchAllPayments();
    fetchAllCustomer();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Monthly Report</h2>

      <div className="row mb-4 text-center">
        <div className="col-md-3">
          <h5>
            Total Amount: <span className="badge bg-primary">{totalSum}</span>
          </h5>
        </div>
        <div className="col-md-3">
          <h5>
            Total Received:{" "}
            <span className="badge bg-success">{totalReceivedAmount}</span>
          </h5>
        </div>
        <div className="col-md-3">
          <h5>
            Total Remaining:{" "}
            <span className="badge bg-danger">{totalRemainingAmount}</span>
          </h5>
        </div>
        <div className="col-md-3">
          <h5>
            Total Empty Bottles:{" "}
            <span className="badge bg-danger">
              {totalEmptybotle > 0 ? totalEmptybotle : 0}
            </span>
          </h5>
        </div>
      </div>

      {/* Town and customer selection */}
      <div className="row mb-4">
        <div className="col-md-9 mb-5">
          <select
            className="form-select"
            onChange={(e) => {
              const townId = e.target.value;
              setSelectedTown(townId);
              fetchCustomers(townId);
              fetchSingleTownData(townId); // Fetch the single town data on selection
            }}
          >
            <option value="">Select a Town</option>
            {towns.map((town) => (
              <option key={town._id} value={town._id}>
                {town?.town}
              </option>
            ))}
          </select>
        </div>
        {towns && (
          <div className="row mb-4 mb-5 mt-5 text-center">
            <div className="col-md-3">
              <h5>
                Total Amount:{" "}
                <span className="badge bg-primary">
                  {townSums?.totalAmountSum}
                </span>
              </h5>
            </div>
            <div className="col-md-3">
              <h5>
                Total Received:{" "}
                <span className="badge bg-success">
                  {townSums?.receivedAmountSum}
                </span>
              </h5>
            </div>
            <div className="col-md-3">
              <h5>
                Total Remaining:{" "}
                <span className="badge bg-danger">
                  {townSums?.remainingBalance}
                </span>
              </h5>
            </div>
            <div className="col-md-3">
              <h5>
                Empty Bottle{" "}
                <span className="badge bg-danger">{totalEmptyBottles}</span>
              </h5>
            </div>
          </div>
        )}
        {selectedTown && (
          <div className="col-md-12">
            <select
              className="form-select"
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <option value="">Select a Customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </select>
            {selectedCustomer && (
              <div className="row mb-5 mb-5 mt-5 text-center">
                <div className="col-md-3">
                  <h5>
                    Total Amount:{" "}
                    <span className="badge bg-primary">
                      {customerSum?.totalAmountSum}
                    </span>
                  </h5>
                </div>
                <div className="col-md-3">
                  <h5>
                    Total Received:{" "}
                    <span className="badge bg-success">
                      {customerSum?.receivedAmountSum}
                    </span>
                  </h5>
                </div>
                <div className="col-md-3">
                  <h5>
                    Total Remaining:{" "}
                    <span className="badge bg-danger">
                      {customerSum?.remainingBalanceSum}
                    </span>
                  </h5>
                </div>
                <div className="col-md-3">
                  <h5>
                    Empty Bottles{" "}
                    <span className="badge bg-danger">
                      {totalQuantityForCustomer}
                    </span>
                  </h5>
                </div>
              </div>
            )}
          </div>
        )}

        {/* <div className="col-md-7">
          <input
            type="month"
            className="form-control"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div> */}
      </div>

      {/* Single Town Data Display */}

      {/* <div className="text-center">
        <button className="btn btn-primary" onClick={handleGenerateReport}>Generate Report</button>
      </div>
      {report && (
        <div className="card mt-4 p-3 shadow-sm">
          <h3 className="card-title">Report for {selectedCustomer} in {month}</h3>
          <p><strong>Total Bottles:</strong> {report.totalBottles}</p>
          <p><strong>Total Amount:</strong> {report.totalAmount}</p>
          <p><strong>Total Bill:</strong> {report.totalBill}</p>
          <p><strong>Total Paid:</strong> {report.totalPaid}</p>
          <p><strong>Remaining Balance:</strong> {report.balance}</p>
        </div>
      )} */}
    </div>
  );
};

export default Report;