const Router = require('express');
const {login} = require('../controller/user');


 const authRoutes = Router()

authRoutes.post("/", login)


module.exports = {
    authRoutes
};
