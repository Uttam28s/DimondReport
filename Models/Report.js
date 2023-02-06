const mongoose = require("mongoose");

const Report = new mongoose.Schema(
    {
        workerid: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Settings.worker",
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Settings.adminId",
        },
        process: {
            type: String,
        },
        date: {
            type: Date,
        },
        pcs : {
            type: Array,
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
