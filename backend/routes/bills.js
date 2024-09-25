const Router = require("express");
const { getBills } = require("../api/bills");

const billsRouts = Router();

authRoutes.get("/bills", getBills);

module.exports = {
  getBills,
};
