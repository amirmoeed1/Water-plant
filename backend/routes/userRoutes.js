const Router = require('express');
const {login} = require('../controller/user');


 const authRoutes = Router()

authRoutes.post("/login", login)


module.exports = {
    authRoutes
};