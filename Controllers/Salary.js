const Salary = require("../Models/Salary");
const Settings = require("../Models/Settings");
const Report = require("../Models/Report");
const moment = require("moment");
const User = require("../Models/User");

const getMonthWise = async (req, res) => {
  const { month, year, adminId } = req.query;
  const salary = await Salary.find({ adminId: adminId });
  const workerDetails = await Settings.find({ adminId: adminId });
  const workers = workerDetails[0]?.worker;
  const report = await Report.find({ adminId: adminId });
  const user = await User.findOne({ _id: adminId });
  data = [];
  salary.map((ele, index) => {
    let data1 = ele.salary.findIndex((ele) => {
      return ele.month === Number(month) && ele.year === year;
    });
    if (data1 !== -1) {
      let workerName = workers.filter((ele1) => {
        return String(ele1._id) === String(ele.workerid);
      });
      const reportData = report.filter((eleReport) => {
        return (
          eleReport.date.getMonth() === moment().month() &&
          String(eleReport.workerid) === String(ele?.workerid)
        );
      });
      let obj = {};
      user.diamondType.map((ele) => {
        return (obj[`${ele}pcs`] = 0);
      });
      user.diamondType.map((type) => {
        reportData.map((ele) => {
          obj[`${type}pcs`] = obj[`${type}pcs`] + Number(ele?.pcs[type] || 0);
        });
    });
      let pcsObj = {};
      user.diamondType.map((ele) => {
        pcsObj[`${ele}pcs`] = obj[`${ele}pcs`];
      });
      // ele.salary[data1]?.total -ele.salary[data1]?.upad +ele.salary[data1]?.jama,
      data[index] = {
        _id: index,
        workerid: ele?.workerid,
        workerName: workerName[0]?.name,
        process: workerName[0]?.process,
        total: ele.salary[data1]?.total,
        uppad: ele.salary[data1]?.upad,
        jama: ele.salary[data1]?.jama,
        status: ele.salary[data1]?.status,
        ...obj,
        salary:
          ele.salary[data1]?.total -
          ele.salary[data1]?.upad +
          ele.salary[data1]?.jama,
      };
    }
  });
  let MathalaData = [];
  let TaliyaData = [];
  let PelData = [];
  let TableData = [];
  let RussianData = [];

  let totalObj = {};
  user.diamondType.map((ele) => {
    return (totalObj[`total${ele}pcs`] = 0);
  });

  let totaltotal = 0;
  let totaluppad = 0;
  let totaljama = 0;
  let totalsalary = 0;

  user?.diamondType?.map((type) => {
    data.map((ele) => {
      totalObj[`total${type}pcs`] = ele[`${type}pcs`] + totalObj[`total${type}pcs`];
    });
  });
  // console.log("🚀 ~ file: Salary.js:105 ~ data.map ~ data", data)

  data.map((ele) => {
    totaltotal = ele.total + totaltotal;
    totaluppad = ele.uppad + totaluppad;
    totaljama = ele.jama + totaljama;
    totalsalary = ele.salary + totalsalary;
    // console.log("🚀 ~ file: Salary.js:87 ~ data.map ~ ele.salary + totalsalary", ele.salary , totalsalary)

    if (ele.process === "mathala") {
      MathalaData.push(ele);
    }
    if (ele.process === "taliya") {
      TaliyaData.push(ele);
    }
    if (ele.process === "pel") {
      PelData.push(ele);
    }
    if (ele.process === "table") {
      TableData.push(ele);
    }
    if (ele.process === "russian") {
      RussianData.push(ele);
    }
  });
  finalData = {
    MathalaData: MathalaData,
    TaliyaData: TaliyaData,
    PelData: PelData,
    TableData: TableData,
    RussianData: RussianData,
    Total: {
      ...totalObj,
      totaltotal: totaltotal,
      totaluppad: totaluppad,
      totaljama: totaljama,
      totalsalary: totalsalary,
    },
  };
  res.json({
    data: finalData,
    message: "Data fetched successfully Successfully ",
  });
};

const changeStatus = async (req, res) => {
  try {
    const { workerid, month } = req.query;
    const salary = await Salary.findOne({ workerid: workerid });
    let SalaryArray = [...salary.salary];
    let index = SalaryArray.findIndex((d) => {
      return d.month === Number(month);
    });
    SalaryArray[index].status = "paid";

    await Salary.updateOne(
      { workerid: workerid },
      {
        $set: {
          salary: SalaryArray,
        },
      }
    );
    res.json({
      message: "Updated Successfully ",
    });
  } catch (e) {
    res.status(400).json({ message: e });
  }
};

const getSalary = async (req, res) => {
  const { workerid, month, year } = req.query;
  const salary = await Salary.findOne({ workerid: workerid });
  console.log("🚀 ~ file: Salary.js:153 ~ getSalary ~ salary", salary)
  let resData = salary;
  if (month == 0 || (month && salary)) {
    console.log("🚀 ~ file: Salary.js:156 ~ getSalary ~ month == 0 || (month && salary", month == 0 )
    resData.salary = salary?.salary.filter((d) => {
      console.log("🚀 ~ file: Salary.js:159 ~ resData.salary=salary?.salary.filter ~ d.month == month && d.year == year", d.month , month , d.year ,year)
      if (d.month == month && d.year == year) {
        return d;
      }
    });
  }
  console.log("🚀 ~ file: Salary.js:161 ~ resData.salary=salary?.salary.filter ~ resData", resData)

  if (salary && salary?.salary?.length !== 0) {
    res
      .status(200)
      .json({ data: resData, message: "Get Month Report SuccessFully" });
  } else {
    res
      .status(400)
      .json({ message: "No Data Found for this Month and Employee" });
  }
};

const upad = async (req, res) => {
  const { workerid, upad, month } = req.query;
  const salary = await Salary.findOne({ workerid: workerid });
  let SalaryArray = [...salary.salary];
  let index = SalaryArray.findIndex((d) => {
    return d.month === month - 1;
  });
  if (index == -1) {
    return res.json({
      error: "You Can not Add Uppad for Upcoming Month",
    });
  }
  if (SalaryArray.length !== 0) {
    SalaryArray[SalaryArray.length - 1].upad =
      Number(SalaryArray[index]?.upad || 0) + Number(upad);
  }
  if (salary) {
    await Salary.updateOne(
      {
        workerid: workerid,
      },
      {
        $set: {
          salary: SalaryArray,
        },
      }
    );

    res.json({
      data: "sucess",
    });
  } else {
    res.json({
      error: "somthing wrong",
    });
  }
};

module.exports = {
  getSalary,
  upad,
  changeStatus,
  getMonthWise,
};
