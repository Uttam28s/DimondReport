let Settings = require("../Models/Settings");
const Report = require("../Models/Report");
const moment = require("moment");
const Salary = require("../Models/Salary");

const addReport = async (req, res) => {
    let body = req.body;
    const priceDetails = await Settings.findOne();
    const processPrice = priceDetails.priceDetails[body.process];
    let dailyworksalary =
        body.jada * processPrice.jadaPrice +
        body.patla * processPrice.patlaPrice +
        body.extraJada * processPrice.extrajadaPrice;
    // let date1 = body.date
    let dailyReport = await new Report({
        workerid: body.workerid,
        process: body.process,
        date: new Date(body.date),
        jada: body.jada,
        patla: body.patla,
        extraJada: body.extraJada,
        total: body.total,
        dailywork: dailyworksalary,
        price: processPrice,
    });
    dailyReport.save();
    manageSalary(dailyReport);
    res.json({ data: "added" });
};

const addBulkReport = async (req, res) => {
    let { process } = req.query;
    let bulkArray = req.body;
    const priceDetails = await Settings.findOne();
    const processPrice = priceDetails.priceDetails[process];
    try {
        for (let i = 0; i < bulkArray.length; i++) 
        {   
            if(bulkArray[i].total != ""){
                await addEntryInReport(bulkArray[i], processPrice);
            }
        }
        res.json({ data: "adeed bulk data" });
    } catch {
        res.json({ error: "error in  bulk data" });
    }
};

const addEntryInReport = async (body, processPrice) => {

    let dailyworksalary =
        body.jada * processPrice.jadaPrice +
        body.patla * processPrice.patlaPrice +
        body.extraJada * processPrice.extrajadaPrice;

    let dailyReport = await new Report({
        workerid: body.workerid,
        process: body.process,
        date: body.date,
        jada: body.jada,
        patla: body.patla,
        extraJada: body.extraJada,
        total: body.total,
        dailywork: dailyworksalary,
    });
    await dailyReport.save();
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
                jama:0
            });
        } else {
            if (momentDate.year() > workersalary.year) {
               let jama = workersalary[workersalary.length - 1].total + 
                        (workersalary[workersalary.length - 1].jama||0) - 
                        workersalary[workersalary.length - 1].upad
                workersalary = [    
                    {
                        month: momentDate.month(),
                        year: momentDate.year(),
                        total: savedData.dailywork,
                        upad: (jama < 0 ) ? - jama : 0,
                        jama: (jama > 0) ? jama : 0 ,
                    },
                ];
            } else {
                let index = workersalary.findIndex(
                    (d) => d.month == momentDate.month()
                );
                if (index < 0) {
                    let jama = 0
                        jama = newSalary.salary[newSalary.salary.length - 1].total + 
                            (newSalary.salary[newSalary.salary.length - 1].jama || 0) - 
                            newSalary.salary[newSalary.salary.length - 1].upad
                    workersalary.push({
                        month: momentDate.month(),
                        year: momentDate.year(),
                        total: savedData.dailywork,
                        upad: (jama < 0 ) ? -jama : 0,
                        jama: (jama > 0) ? jama : 0 ,
                    });
                } else {
                    workersalary[index] = {
                        month: momentDate.month(),
                        year: momentDate.year(),
                        total: workersalary[index].total + savedData.dailywork,
                        upad: workersalary[index].upad,
                        jama:workersalary[index].jama,
                    };
                }
            }
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
                },
            ],
        });
    }
};

const getEmployeeReport = async (req, res) => {
    console.log("🚀 ~ file: Report.js ~ line 148 ~ getEmployeeReport ~ to",req.query)
    let { to } = req.query;
    let { from } = req.query;
    let { emp_id } = req.query;
    if(from != "" && to != ""){
        start = new Date(from);
        end = new Date(to); 
    }

    let report = []
    if(end != ""){
        report = await Report.find({
            date: {
                $gte: start,
                $lt: end,
            },
            workerid : emp_id
        });
    }else{
        report = await Report.find({
            workerid : emp_id
        })
    }
    res.json({ data: report });
}


const getReport = async (req, res) => {
    let { process } = req.query;
    let { to } = req.query;
    let { from } = req.query;
    let start = ""
    let end = ""
    if(from != "" && to != ""){
        start = new Date(from);
        end = new Date(to);
    }

    let report = []
    if(end != ""){
        report = await Report.find({
            date: {
                $gte: start,
                $lt: end,
            },
            process : process
        });
    }else{
        report = await Report.find({
            process : process
        })
    }
    res.json({ data: report });
}

module.exports = {
    addReport,
    addBulkReport,
    getReport,
    getEmployeeReport
};
