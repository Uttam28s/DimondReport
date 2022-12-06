const Salary = require("../Models/Salary");

const changeStatus = async (req, res) => {
    const { workerid, month } = req.query;
    let status = 'paid'
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
    changeStatus
};
