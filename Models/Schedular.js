const Salary = require("./Salary")
const moment = require("moment");

const setSalary = async () => {
    let salaryData = await Salary.find()
    salaryData?.map((ele,index) => {
        if(ele?.salary?.length > 0){
            if(ele?.salary[ele?.salary?.length - 1].month < moment().month()){
                if(ele?.salary[ele?.salary?.length - 1].total !== 0){
                    ele.salary[ele?.salary?.length] = {
                        ...ele?.salary[ele?.salary?.length - 1],
                        month : moment().month(),
                        year : moment().year(),
                        upad : ele.salary[ele?.salary?.length - 1].status === 'pending' && ele?.salary?.[ele?.salary?.length - 1]?.total < 0 ? -ele?.salary?.[ele?.salary?.length - 1]?.total : 0,
                        jama :  ele.salary[ele?.salary?.length - 1].status === 'pending' && ele?.salary?.[ele?.salary?.length - 1]?.total > 0 ? ele?.salary?.[ele?.salary?.length - 1]?.total : 0 ,
                        total : 0,
                        status : 'pending'
                    }
                }
                ele?.save()
            }
        }
    
    })
}

module.exports = {
    setSalary
}