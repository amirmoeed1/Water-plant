const Router = require("express");
const { addBottles,GetBottles,getBottleByCustomerId,DeleteBottle,updateBottle,GetDailyData } = require("../api/bottles");

const bottlesRoutes = Router();

bottlesRoutes.post("/bottles", addBottles);
bottlesRoutes.get("/bottles", GetBottles);
bottlesRoutes.get("/bottles/:id", getBottleByCustomerId);
bottlesRoutes.delete("/bottles/:id", DeleteBottle);
bottlesRoutes.put("/bottles/:id", updateBottle);
bottlesRoutes.get("/daily-data", GetDailyData);

module.exports = {
  bottlesRoutes,
};
