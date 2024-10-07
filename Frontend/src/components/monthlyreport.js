import React, { useState, useEffect } from "react";
import axios from "axios";
import "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./monthlyreport.css"; // Import custom CSS for additional styling
import { Link } from "react-router-dom";
import { BASE_API_URL } from "../Api.Config";
import DatePicker from "react-datepicker";

const Report = () => {
  // Initial States
  const [towns, setTowns] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedTown, setSelectedTown] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [allBottles, setAllBottles] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  console.log("allPayments...", allPayments);

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

  const options = { month: "long" }; // Use 'long' for full month name
  const month = startDate.toLocaleString("default", options);
  function getMonthName(dateString) {
    const date = new Date(dateString);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[date.getMonth()];
  }

  // Function to get month and year from date
  function getMonthYear(dateString) {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString("default", { month: "long" }),
      year: date.getFullYear(),
    };
  }

  // Extract target month and year from startDate
  const { month: targetMonth, year: targetYear } = getMonthYear(startDate);

  // Filter bottles by the target month and year
  const filteredBottles = allBottles.filter((bottle) => {
    const { month, year } = getMonthYear(bottle.createdAt);
    return month === targetMonth && year === targetYear;
  });

  // Calculate total amount, received amount, and remaining balance
  const totals = filteredBottles.reduce(
    (accumulator, currentItem) => {
      accumulator.totalAmount += currentItem.totalAmount || 0;
      accumulator.receivedAmount +=
        currentItem.pricePerBottle * currentItem.qty || 0; // Assuming received amount can be calculated
      accumulator.remainingBalance +=
        currentItem.totalAmount -
          currentItem.pricePerBottle * currentItem.qty || 0; // Example calculation
      return accumulator;
    },
    {
      totalAmount: 0,
      receivedAmount: 0,
      remainingBalance: 0,
    }
  );

  console.log("allPayments", allPayments);
  // const targetMonth = 9; // For October (0-based index)
  // const targetYear = 2024; // For the year 2024

  const filterPayments = allPayments.filter((payment) => {
    const paymentDate = new Date(payment?.paymentDate);
    const startMonth = startDate.getMonth() + 1; // getMonth() returns 0-indexed month, so add 1
    const startYear = startDate.getFullYear();
    console.log("paymentDate", paymentDate);
    const itemMonth = paymentDate.getUTCMonth() + 1; // Add 1 to make it 1-indexed
    const itemYear = paymentDate.getUTCFullYear();
    return itemMonth === startMonth && itemYear === startYear;
   
  });

  console.log("filterPayments", filterPayments);

  // Calculate total received amount for the filtered payments
  const totalReceivedAmount = filterPayments.reduce(
    (sum, paymentItem) => sum + paymentItem.receivedAmount,
    0
  );

  console.log("totalReceivedAmount", totalReceivedAmount);

  const totalRemainingAmount = totals.totalAmount - totalReceivedAmount;

  // Town Calculation
  // Total  Town Data TotalAmount, TotalReciving , TotalRemaining
  const filteredPayments = allPayments?.filter((payment) => {
    return payment.town?._id === selectedTown;
  });
  // Filter payments by the target month/year and selected town

  // const startDate = new Date("Sat Nov 01 2024 18:38:09 GMT+0500 (Pakistan Standard Time)");

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
      <div className="text-center mt-5 mb-4">
        <Link to="/dashboard" className="btn btn-secondary">
          DashBoard Page
        </Link>
      </div>
      <div className="mb-3">
        <label htmlFor="paymentStartDate" className="form-label">
          Payment Start Date
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="form-control"
        />
      </div>

      <h2 className="mb-4 text-center">Monthly Report</h2>

      <div className="row mb-4 text-center">
        <div className="col-md-3">
          <h5>
            Total Amount :{" "}
            <span className="badge bg-primary">{totals?.totalAmount}</span>
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
                <span className="badge bg-success">{totalReceivedAmount}</span>
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
      </div>
    </div>
  );
};

export default Report;
