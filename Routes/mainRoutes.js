const express = require("express");
const router = express.Router();
const controller = require("../Controllers");


router.get("/salary/get", controller.salary.getSalary);
router.post("/salary/upad", controller.salary.upad);
router.get("/settings/addworker", controller.settings.addWorker);

router.get("/settings/getworker",controller.settings.getWorkerList);
router.get("/settings/getworkerbulk",controller.settings.getWorkerListBulk);

router.get("/settings/addprice", controller.settings.updatePrice);
router.get("/settings/getprice",controller.settings.getPriceList);
router.post("/report/add", controller.report.addReport);

router.post("/report/addbulkreport", controller.report.addBulkReport);

router.get("/report/get", controller.report.getReport);

router.get("/employee/report", controller.report.getEmployeeReport);

module.exports = router;