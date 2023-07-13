const mongoose = require('mongoose');
const Jangad = new mongoose.Schema(
  {
    jangadNo: {
      type: Number,
    },
    name: {
      type: String,
    },
    process: {
      type: String,
    },
    date : {
      type : Date
    },
    jangadData: [
      {
        diamond: {
          type: Number,
        },
        weight: {
          type: Number,
        },
      }
    ],
    totalDiamond: {
      type: Number,
    },
    totalWeight: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Jangad", Jangad);
