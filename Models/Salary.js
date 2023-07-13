const mongoose = require("mongoose");

const UppadDetails = new mongoose.Schema({
    date: {
        type: Date,
    },
    amount: {
        type: Number
    }
})


const MonthSalary = new mongoose.Schema({
    upad: {
        type: Number,
    },
    upadDetails: {
        type: [UppadDetails]
    },
    total: {
        type: Number,
    },
    jama: {
        type: Number,
    },
    month: {
        type: Number,
    },
    year: {
        type: String
    },
    status: {
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
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Settings._id",
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

