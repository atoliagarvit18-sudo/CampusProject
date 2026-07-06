const express = require("express");
const Notice = require("../models/Notice");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch notices" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, category, description, date } = req.body;

    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const notice = await Notice.create({ title, category, description, date });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: "Could not create notice" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedNotice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedNotice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.json(updatedNotice);
  } catch (error) {
    res.status(500).json({ message: "Could not update notice" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedNotice = await Notice.findByIdAndDelete(req.params.id);

    if (!deletedNotice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete notice" });
  }
});

module.exports = router;
