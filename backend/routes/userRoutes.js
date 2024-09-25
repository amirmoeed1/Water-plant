const Router = require('express');
const {login} = require('../api/user');


 const authRoutes = Router()

authRoutes.post("/login", login)


module.exports = {
    authRoutes
};