const Router = require('express');
const {login} = require('../Controller/user');


 const authRoutes = Router()

authRoutes.post("/login", login)


module.exports = {
    authRoutes
};