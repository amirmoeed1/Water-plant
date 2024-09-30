const Router = require("express");
const { addPayment,getAllPayments,getPaymetByCustomerID,paymetnDate,UpdatePaymet,DeletePayment } = require("../controller/payment");

const paymetRoutes = Router();

paymetRoutes.post("/payment", addPayment);
paymetRoutes.get("/payment", getAllPayments);
paymetRoutes.get("/paymentcustomer/:customerId", getPaymetByCustomerID);
paymetRoutes.get("/paymentdate",paymetnDate );
paymetRoutes.put("/payment/:id",UpdatePaymet );
paymetRoutes.delete("/payment/:id",DeletePayment );

module.exports = {
  paymetRoutes,
};
