const Router = require("express");
const { town ,townid, addTown,deleteTown} = require("../controller/town");

const townRoutes = Router();

townRoutes.get("/towns", town);
townRoutes.get("/towns/:townId", townid);
townRoutes.post("/towns", addTown);
townRoutes.delete("/towns/:id", deleteTown);

module.exports = {
  townRoutes,
};
