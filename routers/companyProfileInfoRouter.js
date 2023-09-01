const express = require("express");
const router = express.Router();

class CompanyProfileInfoRouter {
  constructor(controller, jwtCheck) {
    this.controller = controller;
    this.jwtCheck = jwtCheck;
  }
  routes() {
    router.get("/", this.controller.getAll.bind(this.controller));
    router.get(
      "/company/:companyId",
      this.controller.getOneCompany.bind(this.controller)
    );
    router.get("/location", this.controller.getLocation.bind(this.controller));
    return router;
  }
}
module.exports = CompanyProfileInfoRouter;
