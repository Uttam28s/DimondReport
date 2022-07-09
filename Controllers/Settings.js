const Settings = require("../Models/Settings");
const Salary = require("../Models/Salary");
const addWorker = async (req, res) => {
  let { name } = req.query;
  try {
    let SettingsObj = await Settings.findOne();

    let worker = SettingsObj.worker;

    //check worker name

    let checkName = worker.findIndex((d) => d.name == name);

    if (checkName >= 0) {
      res.json({ error: "name already in use " });
    } else {
      worker.push({ name: name });
      let updated = await Settings.findOneAndUpdate(
        { _id: SettingsObj._id },
        {
          $set: {
            priceDetails: SettingsObj.priceDetails,
            worker: worker,
          },
        },
        { new: true }
      );
      console.log("🚀 ~ file: Settings.js ~ line 27 ~ addWorker ~ updated", updated)
      let indexOfAddedUser = updated.worker.findIndex((d) => d.name == name);
      let id = updated.worker[indexOfAddedUser]._id;

      let salary = new Salary({
        workerid: id,
        salary: []
      })

      await salary.save()
      res.json({ data: "added" });
    }
  } catch { }
};

const updatePrice = async (req, res) => {
  let { process, subcategory, price } = req.query;
  try {
    let SettingsObj = await Settings.findOne();
    if (process && subcategory && price) {
      let priceDetailsObj = {
        ...SettingsObj.priceDetails,
      };
      if (priceDetailsObj[process] == undefined) {
        priceDetailsObj[process] = { ...priceDetailsObj[process] };
      }
      priceDetailsObj[process][subcategory] = price;
      await Settings.updateOne(
        { _id: SettingsObj._id },
        {
          $set: {
            priceDetails: priceDetailsObj,
            worker: SettingsObj.worker,
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
};
