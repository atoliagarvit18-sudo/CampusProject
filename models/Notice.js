const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ["Event", "Announcement", "Canteen", "Transport"]
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);
