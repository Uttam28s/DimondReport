const express = require("express");
const router = express.Router();
const controller = require("../Controllers");

router.get("/salary/get", controller.salary.getSalary);
router.post("/salary/upad", controller.salary.upad);
router.get("/settings/addworker", controller.settings.addWorker);
router.get("/settings/addprice", controller.settings.updatePrice);
router.post("/report/add", controller.report.addReport);
router.get("/report/get", controller.report.getReport);


module.exports = router;