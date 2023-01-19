let Settings = require("../Models/Settings");
const Report = require("../Models/Report");
const moment = require("moment");
const Salary = require("../Models/Salary");
const User = require("../Models/User");

const addReport = async (req, res) => {
  let { params, data } = req.body;
  const priceDetails = await Settings.findOne({ adminId: params?.adminId });
  const processPrice = priceDetails?.priceDetails[params?.process];

  let obj = processPrice.reduce(function (result, item) {
    let key = Object.keys(item)[0];
    result[key] = item[key];
    return result;
  }, {});
  let dailyworksalary = 0;
  let pcsObj = {};
  let priceObj = {};
  Object.keys(obj).map((ele, index) => {
    priceObj[ele] = obj[ele];
    Object.keys(data).map((i, j) => {
      if (index === 0) {
        pcsObj[i] = data[i];
      }
      if (ele.slice(0, -5) === i) {
        dailyworksalary = dailyworksalary + data[i] * obj[ele];
      }
    });
  });
  let dailyReport = await new Report({
    workerid: params?.workerid,
    adminId: params?.adminId,
    process: params?.process,
    date: new Date(params?.date),
    total: params?.total,
    dailywork: dailyworksalary,
    price: priceObj,
    pcs: pcsObj,
  });
  dailyReport.save();
  manageSalary(dailyReport);
  res.json({ data: "added" });
};

const addBulkReport = async (req, res) => {
  let { process, adminId } = req.query;
  let bulkArray = req.body;
  const priceDetails = await Settings.findOne({ adminId: adminId });
  const processPrice = priceDetails?.priceDetails[process];
  try {
    for (let i = 0; i < bulkArray.length; i++) {
      if (bulkArray[i].total != "") {
        await addEntryInReport(bulkArray[i], processPrice, adminId);
      }
    }
    res.json({ message: "Bulk Data Added" });
  } catch {
    res.json({ error: "error in  bulk data" });
  }
};

const addEntryInReport = async (body, processPrice, adminId) => {
  let obj = processPrice.reduce(function (result, item) {
    let key = Object.keys(item)[0];
    result[key] = item[key];
    return result;
  }, {});
  let dailyworksalary = 0;
  let pcsObj = {};
  let priceObj = {};
  Object.keys(obj).map((ele, index) => {
    priceObj[ele] = obj[ele];
    Object.keys(body).map((i, j) => {
      pcsObj[ele.slice(0, -5)] = body[ele.slice(0, -5)];
      if (ele.slice(0, -5) === i) {
        dailyworksalary = dailyworksalary + body[i] * obj[ele];
      }
    });
  });

  let dailyReport = await new Report({
    workerid: body?.workerid,
    adminId: adminId,
    process: body?.process,
    date: body?.date,
    total: body?.total,
    pcs: pcsObj,
    price: priceObj,
    dailywork: dailyworksalary,
  });
  await dailyReport.save();
  manageSalary(dailyReport)
};

const manageSalary = async (savedData) => {
  let momentDate = moment(savedData.date);
  let newSalary = await Salary.findOne({ workerid: savedData.workerid });
  if (newSalary) {
    let workersalary = newSalary.salary || [];
    if (!newSalary.salary.length) {
      workersalary.push({
        month: momentDate.month(),
        year: momentDate.year(),
        total: savedData.dailywork,
        upad: 0,
        jama: 0,
        status: "pending",
      });
    } else {
      // if (momentDate.year() > workersalary[0].year) {
      //   let jama =
      //     workersalary[workersalary.length - 1].total +
      //     (workersalary[workersalary.length - 1].jama || 0) -
      //     workersalary[workersalary.length - 1].upad;
      //   workersalary = [
      //     {
      //       month: momentDate.month(),
      //       year: momentDate.year(),
      //       total: savedData.dailywork,
      //       upad: jama < 0 ? -jama : 0,
      //       jama: jama > 0 ? jama : 0,
      //       status: "pending",
      //     },
      //   ];
      // } else {
        let index = workersalary.findIndex(
          (d) => d.month == momentDate.month()
        );
        let jama = 0;
        if (index < 0) {
          if (
            workersalary[workersalary.length - 1]?.status !== "paid" ||
            workersalary[workersalary.length - 1]?.total <
              workersalary[workersalary.length - 1]?.upad
          ) {
            jama =
              newSalary?.salary[newSalary?.salary.length - 1].total +
              (newSalary?.salary[newSalary?.salary.length - 1].jama || 0) -
              newSalary?.salary[newSalary?.salary.length - 1].upad;
          }
          workersalary.push({
            month: momentDate.month(),
            year: momentDate.year(),
            total: savedData?.dailywork,
            upad: jama < 0 ? -jama : 0,
            jama: jama > 0 ? jama : 0,
            status: "pending",
          });
        } else {
          workersalary[index] = {
            month: momentDate.month(),
            year: momentDate.year(),
            total: workersalary[index]?.total + savedData?.dailywork,
            upad: workersalary[index]?.upad,
            jama: workersalary[index]?.jama,
            status: "pending",
          };
        }
      // }
    }
    await Salary.updateOne(
      { workerid: savedData.workerid },
      {
        $set: {
          salary: workersalary,
        },
      }
    );
  } else {
    await Salary.create({
      workerid: savedData.workerid,
      salary: [
        {
          month: momentDate.month(),
          year: momentDate.year(),
          total: savedData.dailywork,
          upad: 0,
          jama: 0,
          status: "pending",
        },
      ],
    });
  }
};

const getEmployeeReport = async (req, res) => {
  let { to } = req.query;
  let { from } = req.query;
  let { emp_id } = req.query;
  var tomorrow = new Date(to);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (from != "" && to != "") {
    start = new Date(from);
    end = new Date(tomorrow);
  }

  let report = [];
  if (end != "") {
    report = await Report.find({
      date: {
        $gte: start,
        $lt: end,
      },
      workerid: emp_id,
    });
  } else {
    report = await Report.find({
      workerid: emp_id,
    });
  }
  res.json({ data: report });
};

const getReport = async (req, res) => {
  try {
    let { process, to, from, adminId } = req.query;
    let isAdmin = false;
    if (adminId === "639c4be0dd41dfe8ad122b5d") {
      isAdmin = true;
    }
    let start = "";
    let end = "";
    if (from !== "" && to !== "") {
      start = new Date(from);
      end = new Date(to);
    }

    let report = [];
    if (!isAdmin) {
      if (end != "") {
        report = await Report.find({
          date: {
            $gte: start,
            $lt: end,
          },
          process: process,
          adminId: adminId,
        });
      } else {
        report = await Report.find({
          process: process,
          adminId: adminId
        });
      }
    } else {
      if (end != "") {
        report = await Report.find({
          date: {
            $gte: start,
            $lt: end,
          },
          process: process,
        });
      } else {
        report = await Report.find({
          process: process,
        });
      }
    }

    let pcs = {};
    let price = {};
    let data = [];

    report.map((ele) => {
      if(ele?.pcs){
        Object.keys(ele?.pcs).map((i) => {
          pcs[i] = ele?.pcs[i];
          ele[i] = ele?.pcs[i];
        });
      }
      if(ele?.price){
        Object.keys(ele?.price).map((i) => {
          price[i] = ele?.price[i];
        });
      }
      ele = {
        ...ele,
        ...pcs,
        ...price,
      };
    });

    res.json({ data: report });
  } catch (e) {
    console.log("🚀 ~ file: Report.js:284 ~ getReport ~ e", e);
  }
};

const ReportforSuperAdmin = async (req, res) => {
  const salary = await Salary.find();
  const user = await User.find();
  let data = [];
  user.map((ele, index) => {
    if (!(index === 0)) {
      data.push({
        id: index,
        Name: ele.name,
        AdminId: ele._id,
      });
    }
  });

  res.json({ data: data });
};

const DeleteReport = async (req, res) => {
  const { id } = req.query;
  console.log("🚀 ~ file: Report.js:301 ~ DeleteReport ~ id", id);
  try {
    const report = await Report.findOne({ _id: id });

    let month = report?.date?.getMonth(report.date);
    let year = report?.date?.getFullYear(report.date);
    const salary = await Salary.findOne({ workerid: report.workerid });
    if (report && salary) {
      let workerSalary = salary?.salary || [];
      let salaryAvailable = workerSalary?.findIndex((ele) => {
        return ele.month === month && Number(ele.year) === year;
      });

      workerSalary[salaryAvailable] = {
        month: workerSalary[salaryAvailable].month,
        year: workerSalary[salaryAvailable].year,
        total: workerSalary[salaryAvailable]?.total - report.dailywork,
        upad: workerSalary[salaryAvailable]?.upad,
        jama: workerSalary[salaryAvailable]?.jama,
        status: "pending",
      };

      await Salary.updateOne(
        { workerid: report.workerid },
        {
          $set: {
            salary: workerSalary,
          },
        }
      );
      await Report.deleteOne({ _id: id });
    } else {
      res.status(400).json({ message: "Report Not Found" });
    }
    res.json({ message: "Deleted SuccessFully" });
  } catch (e) {
    console.log("🚀 ~ file: Report.js:309 ~ DeleteReport ~ e", e);
    res.json({ message: "Deleted UnsuccessFully" });
  }
};

const getSingleReport = async (req, res) => {
  try {
    const { id } = req.query;
    let data = await Report.findOne({ _id: id });
    res.json({ data, message: "Fetched Successfully" });
  } catch (e) {
    console.log("🚀 ~ file: Report.js:309 ~ DeleteReport ~ e", e);
    res.json({ message: "Deleted UnsuccessFully" });
  }
};

const editReport = async (req, res) => {
  try {
    const { data, params } = req.body;
    let report = await Report.findOne({ _id: params["id"] });
    let dailyworksalary = 0;
    let priceObj = report?.price;
    let pcsObj = data;
    let olddailySalary = report?.dailywork

    Object.keys(pcsObj).map((ele, index) => {
      dailyworksalary = dailyworksalary + pcsObj[ele] * priceObj[`${ele}Price`];
    });

    await Report.updateOne(
      { _id: params["id"] },
      {
        workerid: params?.workerid,
        adminId: params?.adminId,
        process: params?.process,
        date: new Date(params?.date),
        total: params?.total,
        dailywork: dailyworksalary,
        price: priceObj,
        pcs: pcsObj,
      }
    );
    let month = new Date(params?.date).getMonth();
    let year = new Date(params?.date).getFullYear();
    const salary = await Salary.findOne({ workerid: params?.workerid });
    let workerSalary = salary?.salary || [];
    let salaryAvailable = workerSalary?.findIndex((ele) => {
      return ele?.month === month && Number(ele?.year) === year;
    });
    
    let obj  = {
      month: workerSalary[salaryAvailable]?.month,
      year: workerSalary[salaryAvailable]?.year,
      total: Number(workerSalary[salaryAvailable]?.total) - Number(olddailySalary) + Number(dailyworksalary),
      upad: workerSalary[salaryAvailable]?.upad,
      jama: workerSalary[salaryAvailable]?.jama,
      status: "pending",
    };

    workerSalary[salaryAvailable]  = obj
    console.log("Point 2")

    await Salary.updateOne(
      { workerid: report.workerid },
      {
        $set: {
          salary: workerSalary,
        },
      }
    );
    console.log("Point 3")

    res.json({ message: "Updated SuccessFully" });
  } catch(e) {
    console.log("🚀 ~ file: Report.js:417 ~ editReport ~ e", e)
    res.json({ message: "Updated UnsuccessFully" });
  }
};
module.exports = {
  addReport,
  addBulkReport,
  getReport,
  getEmployeeReport,
  ReportforSuperAdmin,
  DeleteReport,
  getSingleReport,

  editReport,
};
