const Settings = require("../Models/Settings");
const Salary = require("../Models/Salary");

const getWorkerList = async (req, res) => {
  let SettingsObj = await Settings.findOne({adminId : req.query.adminId });
  console.log("🚀 ~ file: Settings.js:6 ~ getWorkerList ~ SettingsObj", SettingsObj.worker)
  let worker = SettingsObj.worker;
  res.json({ data: worker });
}

const getWorkerListBulk = async (req, res) => {
  let { process } = req.query;
  // console.log("----------------------statrt",process)
  let SettingsObj = await Settings.findOne();
  let worker = SettingsObj.worker;
  let a = []
  let ne = []
  worker.map((ele) => {
    if (ele.process) {
      // console.log("--20---",ele.process)
      if (ele.process == process) {
        ne.push(ele)
      }
    }
  })
  // console.log("==========27",ne)
  ne.map((ele, index) => {
    let b = {
      'index': index,
      'name': ele.name,
      '_id': ele._id,
      'jada': "",
      'patla': "",
      'extraJada': "",
      'total': "",
      'dailywork': "",
      'price': ""
    }
    a.push(b)

  })
  res.json({ data: a });
}

const addWorker = async (req, res) => {
  let { name, process, adminId} = req.query;
  try {
    let SettingsObj = await Settings.findOne({ adminId : adminId});
    let worker = SettingsObj.worker;
    let checkName = worker.findIndex((d) => d.name == name);
    console.log("check name is ", checkName)
    if (checkName >= 0) {
      res.status(400).json({ message: "Name Already In Use" });
    } else {
      worker.push({ name: name, process: process });
      let updated = await Settings.findOneAndUpdate(
        { adminId: SettingsObj.adminId },
        {
          $set: {
            priceDetails: SettingsObj.priceDetails,
            worker: worker,
          },
        },
        { new: true }
      );
      // console.log("🚀 ~ file: Settings.js ~ line 27 ~ addWorker ~ updated", updated)
      let indexOfAddedUser = updated.worker.findIndex((d) => d.name == name);
      let id = updated.worker[indexOfAddedUser]._id;
      let salary = new Salary({
        workerid: id,
        salary: []
      })
      await salary.save()
      res.status(200).json({ message: "Worker Added Successfully" });
    }
  } catch { }
};

const getPriceList = async (req, res) => {
  let SettingsObj = await Settings.findOne();
  let pricelist = SettingsObj.priceDetails[req.query.value];
  res.json({ pricelist: pricelist });

}

const updatePrice = async (req, res) => {
  let { process, subcategory, price } = req.query;
  try {
    let SettingsObj = await Settings.findOne();
    if (process && subcategory && price) {
      let priceDetailsObj = {
        ...SettingsObj?.priceDetails,
      };
      if (priceDetailsObj[process] == undefined) {
        priceDetailsObj[process] = { ...priceDetailsObj[process] };
      }
      priceDetailsObj[process][subcategory] = price;
      await Settings.updateOne(
        { _id: SettingsObj?._id },
        {
          $set: {
            priceDetails: priceDetailsObj,
          },
        }
      );
      res.json({ error: "Saved" });
    } else {
      res.json({ error: "please provide name and value" });
    }
  } catch { }
};

module.exports = {
  addWorker,
  updatePrice,
  getWorkerList,
  getWorkerListBulk,
  getPriceList
};
