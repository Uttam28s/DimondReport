const Salary = require("../Models/Salary");
const Settings = require("../Models/Settings");
const Report = require("../Models/Report")
const moment = require('moment');

const getMonthWise = async (req, res) => {

    const { month } = req.query;    
    const salary = await Salary.find();
    const workerDetails = await Settings.find()
    const workers = workerDetails[0].worker
    const report = await Report.find()
    data = []
    salary.map((ele,index) => {
        let data1 = ele.salary.findIndex((ele) => {
            return ele.month === Number(month)
        })
        if(data1 !== -1){
            let workerName = workers.filter((ele1) => {
                return String(ele1._id) === String(ele.workerid)
            })
            const reportData = report.filter((eleReport) => {
                return eleReport.date.getMonth() === moment().month() - 1 && String(eleReport.workerid) === String(ele?.workerid) 
            })
            let jadapcs = 0
            let patlapcs = 0
            let extrajadapcs = 0
            reportData.map((ele) => {
                jadapcs = jadapcs + ele.jada
                patlapcs = patlapcs + ele.patla
                extrajadapcs = extrajadapcs + ele.extraJada
            })
            data[index] = {
                _id : index,
                workerid : ele?.workerid,
                workerName : workerName[0]?.name,
                process : workerName[0]?.process,
                total : ele.salary[data1]?.total,
                uppad : ele.salary[data1]?.upad,
                jama : ele.salary[data1]?.jama,
                status : ele.salary[data1]?.status,
                jadapcs : jadapcs,
                patlapcs : patlapcs,
                extrajadapcs : extrajadapcs,
                salary : ele.salary[data1]?.total - ele.salary[data1]?.upad + ele.salary[data1]?.jama
            }
        }
    })
    let MathalaData = []
    let TaliyaData= []
    let PelData = []
    let TableData = []
    let RussianData = []
    let totaljadapcs = 0
    let totalextrajadapcs = 0
    let totaltotal = 0
    let totaluppad = 0
    let totaljama = 0
    let totalsalary = 0
    data.map((ele) => {
        totaljadapcs = ele.jadapcs + totaljadapcs
        totalextrajadapcs = ele.extrajadapcs + totalextrajadapcs
        totaltotal = ele.total + totaltotal
        totaluppad = ele.uppad + totaluppad
        totaljama = ele.jama + totaljama
        totalsalary = ele.salary + totalsalary

        if((ele.process) === 'mathala'){
            MathalaData.push(ele)
        }
        if((ele.process) === 'taliya'){
            TaliyaData.push(ele)
        }
        if((ele.process) === 'pel'){
            PelData.push(ele)
        }
        if((ele.process) === 'russian'){
            TableData.push(ele)
        }
        if((ele.process) === 'table'){
            RussianData.push(ele)
        }
    })
    console.log("🚀 ~ file: Salary.js:99 ~ getMonthWise ~ totaljadapcs", totaljadapcs)
    finalData = {
        MathalaData : MathalaData,
        TaliyaData : TaliyaData,
        PelData : PelData,
        TableData : TableData,
        RussianData : RussianData,
        Total : {
            totaljadapcs : totaljadapcs,
            totalextrajadapcs : totalextrajadapcs,
            totaltotal : totaltotal,
            totaluppad : totaluppad,
            totaljama : totaljama,
            totalsalary : totalsalary
        } 
    }
    res.json({
        data : finalData,
        message: "Data fetched successfully Successfully "
    });

}

const changeStatus = async (req, res) => {
    try{
        const { workerid, month } = req.query;
        const salary = await Salary.findOne({ workerid: workerid });
        let SalaryArray = [...salary.salary]
        let index = SalaryArray.findIndex((d) => {
            return d.month === Number(month)
        });
        SalaryArray[index].status = "paid"
    
        await Salary.updateOne(
            { workerid: workerid },
            {
                $set: {
                    salary: SalaryArray
                },
            }
        );
        res.json({
            message: "Updated Successfully "
        });
    }catch{
        res.status(400).json({ message: "Status Not Updated SuccessFully" });
    }
}

const getSalary = async (req, res) => {
    const { workerid, month } = req.query;
    const salary = await Salary.findOne({ workerid: workerid });
    let resData = salary
    if (month == 0 || month && salary) {
        resData.salary = salary?.salary.filter(d => {
            if (d.month == month) {
                return d
            }
        })
    }

    if (salary && salary?.salary?.length !== 0) {
        res.status(200).json({ data: salary, message: "Get Month Report SuccessFully" });
    } else {
        res.status(400).json({ message: "No Data Found for this Month and Employee" });
    }
};

const upad = async (req, res) => {
    const { workerid, upad, month } = req.query;
    const salary = await Salary.findOne({ workerid: workerid });
    console.log("🚀 ~ file: Salary.js:54 ~ upad ~ salary", salary)
    let SalaryArray = [...salary.salary]
    let index = SalaryArray.findIndex((d) => {
        return d.month === month - 1
    });
    if (index == -1) {
        return res.json({
            error: "You Can not Add Uppad for Upcoming Month"
        });
    }
    if (SalaryArray.length !== 0) {
        SalaryArray[SalaryArray.length - 1].upad = Number(SalaryArray[index]?.upad || 0) + Number(upad)
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
    getMonthWise
};
