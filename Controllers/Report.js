let Settings = require('../Models/Settings');
const Report = require('../Models/Report')
const moment = require('moment')
const addReport = async (req, res) => {
  let body = req.body
  const priceDetails = await Settings.findOne()
  const processPrice = priceDetails.priceDetails[body.process]
  let dailyworksalary = (body.jada * processPrice.jadaPrice) + (body.patla * processPrice.patlaPrice) + (body.extrajada * processPrice.extrajadaPrice)
  let dailyReport = await new Report({
    workerid: body.workerid,
    process: body.process,
    date: body.date,
    jada: body.jada,
    patla: body.patla,
    extraJada: body.extrajada,
    total: body.jada + body.patla + body.extrajada,
    dailywork: dailyworksalary
  })
  dailyReport.save();
  manageSalary(body)
  res.json({ data: 'added' })
}



const addBulkReport = async (req, res) => {
  let body = req.body;
  let bulkArray = body.bulk;
  const priceDetails = await Settings.findOne();
  const processPrice = priceDetails.priceDetails[body.process];
  try{
  for (let i = 0; i < i; i++) {
    await addEntryInReport(body, processPrice);
  }
  res.json({data:'adeed bulk data'})
}catch{
  res.json({ error: "error in  bulk data" });

  }
}



const addEntryInReport = async (body, processPrice) => {
  let dailyworksalary =
    body.jada * processPrice.jadaPrice +
    body.patla * processPrice.patlaPrice +
    body.extrajada * processPrice.extrajadaPrice;

  let dailyReport = await new Report({
    workerid: body.workerid,
    process: body.process,
    date: body.date,
    jada: body.jada,
    patla: body.patla,
    extraJada: body.extrajada,
    total: body.jada + body.patla + body.extrajada,
    dailywork: dailyworksalary,
  });

  await dailyReport.save()
};


const manageSalary = async(data)=>{
  let momentDate = moment(new Date(data.date));
  console.log(
      "🚀 ~ file: Report.js ~ line 69 ~ manageSalary ~ momentDate",
      // momentDate.getMonth()
  );
  
 
}

module.exports = {
    addReport,
    addBulkReport,
};