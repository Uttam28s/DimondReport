let Settings = require("../Models/Settings");
const Report = require("../Models/Report");
const moment = require("moment");
const Salary = require("../Models/Salary");

const addReport = async (req, res) => {
    let body = req.body;
    console.log("🚀 ~ file: Report.js ~ line 8 ~ addReport ~ body", body);

    const priceDetails = await Settings.findOne();
    const processPrice = priceDetails.priceDetails[body.process];
    let dailyworksalary =
        body.jada * processPrice.jadaPrice +
        body.patla * processPrice.patlaPrice +
        body.extrajada * processPrice.extrajadaPrice;
    let dailyReport = await new Report({
        workerid: body.workerid,
        process: body.process,
        date: new Date(body.date * 1000),
        jada: body.jada,
        patla: body.patla,
        extraJada: body.extrajada,
        total: body.jada + body.patla + body.extrajada,
        dailywork: dailyworksalary,
        price: processPrice,
    });
    dailyReport.save();
    manageSalary(dailyReport);
    res.json({ data: "added" });
};

const addBulkReport = async (req, res) => {
    let body = req.body;
    let bulkArray = body.bulk;
    const priceDetails = await Settings.findOne();
    const processPrice = priceDetails.priceDetails[body.process];
    try {
        for (let i = 0; i < i; i++) {
            await addEntryInReport(body, processPrice);
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
                total: savedData.dailywork,upad:0
            });
        } else {
            if (momentDate.year() > workersalary[0].year) {
                workersalary = [
                    {
                        month: momentDate.month(),
                        year: momentDate.year(),
                        total: savedData.dailywork,
                        upad:0
                    },
                ];
            } else {
                let index = workersalary.findIndex(
                    (d) => d.month == momentDate.month()
                );
                if (index < 0) {
                    workersalary.push({
                        month: momentDate.month(),
                        year: momentDate.year(),
                        total: savedData.dailywork,
                        upad:0
                    });
                } else {
                    workersalary[index] = {
                        month: momentDate.month(),
                        year: momentDate.year(),
                        total: workersalary[index].total + savedData.dailywork,
                        upad:workersalary[index].upad
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


const getReport = async(req,res) =>{
const body = req.body;
let start = new Date(body.to * 1000);
let end = new Date(body.from * 1000);
console.log("🚀 ~ file: Report.js ~ line 135 ~ getReport ~ end", start, end);

let report = await Report.find({
    date: {
        $gte: start,
        $lt: end,
    },
});
console.log("🚀 ~ file: Report.js ~ line 143 ~ getReport ~ report", report)


res.json()
}

module.exports = {
    addReport,
    addBulkReport,
    getReport
};
