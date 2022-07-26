const Salary = require("../Models/Salary");

const getSalary = async (req, res) => {
    const { workerid } = req.query;
    const salary = await Salary.findOne({ workerid: workerid });
    if (salary) {
        res.json({
            data: salary,
        });
    } else {
        res.json({
            error: "somthing wrong",
        });
    }
};

const upad = async (req, res) => {
    const { workerid, upad, month } = req.query;
    const salary = await Salary.findOne({ workerid: workerid });
    let SalaryArray =[... salary.salary]
    let index = SalaryArray.findIndex((d) => d.month == month);
    SalaryArray[index].upad = Number(SalaryArray[index]?.upad||0) +Number( upad)
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
};
