const express = require("express");
const router = express.Router();
const controller = require("../Controllers");

router.get("/salary/get", controller.salary.getSalary);

 router.get("/settings/addworker", controller.settings.addWorker);
router.get("/settings/addprice", controller.settings.updatePrice);
router.post("/report/add", controller.report.addReport);
module.exports = router;