const mongoose = require("mongoose");


const WorkerDetails = new mongoose.Schema({
    name: {
        type: String,
    },
    joindate: {
        type: Date,
    },

});

const Prices = new mongoose.Schema({
    process: {
        type: String,
    },
    jadaPrice: {
        type: Number,
        default: 0,
    },
    extrajadaPrice: {
        type: Number,
        default: 0,
    },
    patlaPrice: {
        type: Number,
        default: 0,
    },
});




const Settings = new mongoose.Schema(
    {
        priceDetails: {
            taliya: {
                type: Prices,
            },
            table: {
                type: Prices,
            },
            pel: {
                type: Prices,
            },
            mathala: {
                type: Prices,
            },
            russian: {
                type: Prices,
            },
        },
        worker: {
            type: [WorkerDetails],
        },
    },
    {
        timestamps: true,
    }
);



module.exports = mongoose.model("Settings", Settings);
