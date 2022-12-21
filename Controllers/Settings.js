const Settings = require("../Models/Settings");
const Salary = require("../Models/Salary");

const getWorkerList = async (req, res) => {
  const { adminId } = req.query
  let isAdmin = false
  if(adminId === "639c4be0dd41dfe8ad122b5d"){
      isAdmin = true
  }
  let SettingsObj = {}
  let worker = []
  if(isAdmin){
    SettingsObj = await Settings.find();
    SettingsObj.map((ele)=> {
      ele.worker.map((i) => {
        worker.push(i)
      })
    })
  }else{
    SettingsObj = await Settings.findOne({ adminId : adminId });
    worker = SettingsObj?.worker 
  }
    res.json({ data: worker || [] });
}

const getWorkerListBulk = async (req, res) => {
  let { process, adminId } = req.query;
  let SettingsObj = await Settings.findOne({ adminId : adminId });

  let worker = SettingsObj.worker;
  let data = []
  let workerList = []
  worker.map((ele) => {
    if (ele.process) {
      if (ele.process == process) {
        workerList.push(ele)
      }
    }
  })
  workerList.map((ele, index) => {
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
    data.push(b)

  })
  res.json({ data: data });
}

const addWorker = async (req, res) => {
  let { name, process, adminId} = req.query;
  try {
    let SettingsObj = await Settings.findOne({ adminId : adminId});
    let worker = SettingsObj.worker || [];
    let checkName = worker.findIndex((d) => d.name == name);
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
      let indexOfAddedUser = updated.worker.findIndex((d) => d.name == name);
      let id = updated.worker[indexOfAddedUser]._id;
      let salary = new Salary({
        workerid: id,
        adminId : adminId,
        salary: []
      })
      await salary.save()
      res.status(200).json({ message: "Worker Added Successfully" });
    }
  } catch {
    res.status(200).json({ message: "Error" });

   }
};

const getPriceList = async (req, res) => {
  let { value, adminId } = req.query
  let SettingsObj = await Settings.findOne({adminId:adminId});
  let pricelist = SettingsObj?.priceDetails[value];
  res.json({ pricelist: pricelist });

}

const updatePrice = async (req, res) => {
  let { process, subcategory, price,adminId } = req.query;
  try {
    let SettingsObj = await Settings.findOne({adminId});
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
