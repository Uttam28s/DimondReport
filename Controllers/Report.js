let Settings = require("../Models/Settings");
const Report = require("../Models/Report");
const moment = require("moment");
const Salary = require("../Models/Salary");
const User = require("../Models/User");

const addReport = async (req, res) => {
    let body = req.body;
    const priceDetails = await Settings.findOne({ adminId : body?.adminId});
    const processPrice = priceDetails?.priceDetails[body.process];
    let dailyworksalary =
    body.jada * processPrice?.jadaPrice +
    body.patla * processPrice?.patlaPrice +
    body.extraJada * processPrice?.extrajadaPrice + 
    body.extraPatla * processPrice?.extraPatlaPrice;
    let dailyReport = await new Report({
        workerid: body.workerid,
        adminId : body.adminId,
        process: body.process,
        date: new Date(body.date),
        jada: body?.jada || 0,
        patla: body?.patla || 0,
        extraPatla: body?.extraPatla || 0,
        extraJada: body?.extraJada || 0,
        total: body.total,
        jadaPrice : processPrice?.jadaPrice,
        patlaPrice : processPrice?.patlaPrice,
        extraPatlaPrice : processPrice?.extraPatlaPrice,    
        extraJadaPrice : processPrice?.extrajadaPrice,
        dailywork: dailyworksalary,
        price: processPrice,
    });
    dailyReport.save();
    manageSalary(dailyReport);
    res.json({ data: "added" });
};

const addBulkReport = async (req, res) => {
    let { process,adminId } = req.query;
    let bulkArray = req.body;
    const priceDetails = await Settings.findOne({adminId : adminId});
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

    let dailyworksalary =
        body.jada * processPrice?.jadaPrice +
        body.patla * processPrice?.patlaPrice +
        body.extraJada * processPrice?.extrajadaPrice + 
        body.extraPatla * processPrice?.extraPatlaPrice;

    let dailyReport = await new Report({
        workerid: body?.workerid,
        adminId: adminId,
        process: body?.process,
        date: body?.date,
        jada: body?.jada,
        patla: body?.patla,
        extraPatla : body?.extraPatla,
        extraJada: body?.extraJada,
        total: body?.total,
        jadaPrice : processPrice?.jadaPrice,
        patlaPrice : processPrice?.patlaPrice,
        extraPatlaPrice : processPrice?.extraPatlaPrice,
        extraJadaPrice : processPrice?.extrajadaPrice,
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
                jama: 0,
                status : 'pending'
            });
        } else {
            if (momentDate.year() > workersalary[0].year) {
                let jama = workersalary[workersalary.length - 1].total +
                    (workersalary[workersalary.length - 1].jama || 0) -
                    workersalary[workersalary.length - 1].upad
                workersalary = [
                    {
                        month: momentDate.month(),
                        year: momentDate.year(),
                        total: savedData.dailywork,
                        upad: (jama < 0) ? - jama : 0,
                        jama: (jama > 0) ? jama : 0,
                        status : 'pending'
                    },
                ];
            } else {
                let index = workersalary.findIndex(
                    (d) => d.month == momentDate.month()
                );
                let jama = 0
                if (index < 0) {
                    if (workersalary[workersalary.length - 1]?.status !== 'paid' || workersalary[workersalary.length - 1]?.total < workersalary[workersalary.length - 1]?.upad) {
                        jama = newSalary?.salary[newSalary?.salary.length - 1].total +
                            (newSalary?.salary[newSalary?.salary.length - 1].jama || 0) -
                            newSalary?.salary[newSalary?.salary.length - 1].upad
                    }
                    workersalary.push({
                        month: momentDate.month(),
                        year: momentDate.year(),
                        total: savedData?.dailywork,
                        upad: (jama < 0) ? -jama : 0,
                        jama: (jama > 0) ? jama : 0,
                        status : 'pending'
                    });
                } else {
                    workersalary[index] = {
                        month: momentDate.month(),
                        year: momentDate.year(),
                        total: workersalary[index]?.total + savedData?.dailywork,
                        upad: workersalary[index]?.upad,
                        jama: workersalary[index]?.jama,
                        status : 'pending'
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
                    upad: 0,
                    jama: 0,
                    status : 'pending'
                },
            ],
        });
    }
};

const getEmployeeReport = async (req, res) => {
    let { to } = req.query;
    let { from } = req.query;
    let { emp_id } = req.query;
    if (from != "" && to != "") {
        start = new Date(from);
        end = new Date(to);
    }

    let report = []
    if (end != "") {
        report = await Report.find({
            date: {
                $gte: start,
                $lt: end,
            },
            workerid: emp_id
        });
    } else {
        report = await Report.find({
            workerid: emp_id
        })
    }
    res.json({ data: report });
}


const   getReport = async (req, res) => {
    let { process, to, from, adminId } = req.query;
    let isAdmin = false
    if(adminId === "639c4be0dd41dfe8ad122b5d"){
        isAdmin = true
    }
    let start = ""
    let end = ""
    if (from !== "" && to !== "") {
        start = new Date(from);
        end = new Date(to);
    }

    let report = []
    if(!isAdmin){
        if (end != "") {
            report = await Report.find({
                date: {
                    $gte: start,
                    $lt: end,
                },
                process: process,
                adminId : adminId
            });
        } else {
            report = await Report.find({
                process: process,
                adminId : adminId
            })
        }
    }else{
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
            })
        }
    }
    res.json({ data: report });
}


const ReportforSuperAdmin = async (req,res) => {
    const salary = await Salary.find()
    const user = await User.find()
    let data = []
    user.map((ele,index) => {
        if(!(index === 0)){
            data.push({
                id : index,
                Name : ele.name,
                AdminId : ele._id
            })
        }
    })

    res.json({ data: data });

}

module.exports = {
    addReport,
    addBulkReport,
    getReport,
    getEmployeeReport,
    ReportforSuperAdmin
};
