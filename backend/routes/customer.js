const Router = require('express');
const {customer,allCustomer,customerId,addCustomers,UpdateCustomer,monthalyReport,deleteCustomer,totalCustomer} = require('../controller/Customer');


 const customerRoutes = Router()
 customerRoutes.get("/customers", customer)
 customerRoutes.get("/allCustomers", allCustomer)
 customerRoutes.get("/customer/:Id", customerId)
 customerRoutes.post("/customers", addCustomers)
 customerRoutes.delete("/customer/:customerId", deleteCustomer);
 customerRoutes.put('/customers/:customerId',UpdateCustomer )
 customerRoutes.get('/:townId/:customerId/:month',monthalyReport )
 customerRoutes.get('/total',totalCustomer )


module.exports = {
    customerRoutes
};