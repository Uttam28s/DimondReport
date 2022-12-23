const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
    },
    flag: {
      type: Boolean,
    },
    diamondType : {
      type: Array
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", User);
