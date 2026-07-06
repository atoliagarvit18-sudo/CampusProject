const mongoose = require("mongoose");

const crowdReportSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      required: true,
      enum: ["Mess", "Bus", "Library", "Canteen"]
    },
    serviceName: {
      type: String,
      required: true,
      trim: true
    },
    crowdLevel: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"]
    },
    note: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CrowdReport", crowdReportSchema);
