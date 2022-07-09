const mongoose = require("mongoose");


const MonthSalary = new mongoose.Schema({
    upad: {
        type: Number,
    },
    total: {
        type: Number,
    },
    month: {
        type: Date,
    },
    jama: {
        type: Number,
    },
    month: {
        type: String
    }
})


const Salary = new mongoose.Schema(
    {
        workerid: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Settings.worker",
        },
        salary: {
            type: [MonthSalary],
        },
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model("Salary", Salary);

