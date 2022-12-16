const express = require("express");
const router = express.Router();
const controller = require("../Controllers");

router.put("/salary/paidStatus", controller.salary.changeStatus)
router.get("/salary/get", controller.salary.getSalary);
router.post("/salary/upad", controller.salary.upad);
router.get("/salary/monthwise", controller.salary.getMonthWise)

router.get("/settings/addworker", controller.settings.addWorker);

router.get("/settings/getworker", controller.settings.getWorkerList);
router.get("/settings/getworkerbulk", controller.settings.getWorkerListBulk);

router.get("/settings/addprice", controller.settings.updatePrice);
router.get("/settings/getprice", controller.settings.getPriceList);
router.post("/report/add", controller.report.addReport);

router.post("/report/addbulkreport", controller.report.addBulkReport);

router.get("/report/get", controller.report.getReport);

router.get("/employee/report", controller.report.getEmployeeReport);


router.post("/user/add",controller.user.addUser);
router.get("/user/getusers",controller.user.getUsers);
router.delete("/user/deleteuser",controller.user.deleteUser);

router.post("/user/checkLogin",controller.user.checkLogin);
router.put("/user/updateFlag",controller.user.updateUserStatus);


module.exports = router;