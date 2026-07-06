const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const noticeRoutes = require("./routes/notices");
const crowdRoutes = require("./routes/crowd");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/notices", noticeRoutes);
app.use("/api/crowd", crowdRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "CampusPulse API is running" });
});

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campuspulse_basic")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
