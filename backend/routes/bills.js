const Router = require("express");
const { getBills } = require("../Controller/bills");

const billsRouts = Router();

authRoutes.get("/bills", getBills);

module.exports = {
  getBills,
};
