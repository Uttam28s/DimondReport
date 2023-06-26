const mongoose = require("mongoose");


const WorkerDetails = new mongoose.Schema({
    name: {
        type: String,
    },
    joindate: {
        type: Date,
    },
    process: {
        type: String
    }

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
    extraPatlaPrice : {
        type: Number,
        default: 0,
    }
});




const Settings = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User._id",
        },
        priceDetails: {
            '4P': {
                type: Array,
            },
            tiching: {
                type: Array,
            },
            taliya: {
                type: Array,
            },
            table: {
                type: Array,
            },
            pel: {
                type: Array,
            },
            mathala: {
                type: Array,
            },
            russian: {
                type: Array,
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
