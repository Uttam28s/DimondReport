const mongoose = require("mongoose");

const Report = new mongoose.Schema(
    {
        workerid: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Settings.worker",
        },
        process: {
            type: String,
        },
        date: {
            type: Date,
        },
        jada: {
            type: Number,
        },
        patla: {
            type: Number,
        },
        extraJada: {
            type : Number,
        },
        patlaPrice: {
            type : Number,
        },
        jadaPrice: {
            type : Number,
        },
        extraJadaPrice: {
            type: Number,
        },
        total: {
            type: Number,
        },
        dailywork: {
            type: Number,
        },
        price: {
            type: Array
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Report", Report);
