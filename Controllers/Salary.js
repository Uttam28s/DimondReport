const Salary = require("../Models/Salary");

const getSalary = async (req, res) => {
    const { workerid,to,from ,month} = req.query; 
    const salary = await Salary.findOne({ workerid: workerid });
    let resData= salary
    if(month==0||month) {
         resData.salary = salary.salary.filter(d => {
            if(d.month==month){
                return d
            }
         })
    }
    // if(to && from) {
    //     console.log("🚀 ~ file: Salary.js ~ line 15 ~ getSalary ~ to && from", to , from)
    // }
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
    let index = SalaryArray.findIndex((d) => {d.month == Number(month -1)});
    
    if(SalaryArray.length != 0) {
        SalaryArray[SalaryArray.length-1].upad = Number(SalaryArray[index]?.upad||0) + Number(upad)
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
};
