const express = require("express");
const CrowdReport = require("../models/CrowdReport");

const router = express.Router();

const levelScore = {
  Low: 1,
  Medium: 2,
  High: 3
};

const scoreLevel = (score) => {
  if (score >= 2.4) return "High";
  if (score >= 1.7) return "Medium";
  return "Low";
};

const getMealBaseLevel = (meal) => {
  const hour = new Date().getHours();
  if (meal === "Breakfast") return hour >= 8 && hour <= 10 ? "High" : "Medium";
  if (meal === "Lunch") return hour >= 13 && hour <= 15 ? "High" : "Medium";
  if (meal === "Snacks") return hour >= 17 && hour <= 18 ? "Medium" : "Low";
  if (meal === "Dinner") return hour >= 19 && hour <= 21 ? "High" : "Medium";
  return "Medium";
};

const getBusBaseLevel = (time) => {
  if (!time) return "Medium";
  const hour = Number(time.split(":")[0]);
  if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18)) return "High";
  if (hour >= 10 && hour <= 15) return "Medium";
  return "Low";
};

const getTimeBasedLevel = (serviceType) => {
  const hour = new Date().getHours();

  if (serviceType === "Mess") {
    if ((hour >= 8 && hour <= 10) || (hour >= 13 && hour <= 15) || (hour >= 19 && hour <= 21)) {
      return "High";
    }
    if ((hour >= 11 && hour <= 12) || (hour >= 17 && hour <= 18)) {
      return "Medium";
    }
    return "Low";
  }

  if (serviceType === "Bus") {
    if ((hour >= 8 && hour <= 9) || (hour >= 16 && hour <= 18)) {
      return "High";
    }
    if (hour >= 10 && hour <= 15) {
      return "Medium";
    }
    return "Low";
  }

  if (serviceType === "Library") {
    if (hour >= 18 && hour <= 22) return "High";
    if (hour >= 10 && hour <= 17) return "Medium";
    return "Low";
  }

  if (hour >= 12 && hour <= 17) return "Medium";
  return "Low";
};

const buildSuggestion = (serviceType, level) => {
  if (level === "High") {
    return serviceType === "Bus"
      ? "Crowd may be high. Try reaching the stop early or choose another bus timing."
      : "Crowd may be high. It is better to wait for some time if your work is not urgent.";
  }

  if (level === "Medium") {
    return "Moderate crowd expected. You can go now, but there may be some waiting time.";
  }

  return "Low crowd expected. This is a good time to visit.";
};

const combineWithReports = async (location, baseLevel) => {
  const recentReports = await CrowdReport.find({ serviceName: location })
    .sort({ createdAt: -1 })
    .limit(5);

  if (recentReports.length === 0) {
    return { finalLevel: baseLevel, reportsUsed: 0 };
  }

  const reportAverage = recentReports.reduce((sum, report) => {
    return sum + levelScore[report.crowdLevel];
  }, 0) / recentReports.length;

  const combinedScore = (levelScore[baseLevel] + reportAverage) / 2;
  return { finalLevel: scoreLevel(combinedScore), reportsUsed: recentReports.length };
};

const buildMessMessage = ({ day, meal, level, menuItems, reportsUsed }) => {
  const menuText = menuItems && menuItems.length > 0
    ? `Today's ${meal.toLowerCase()} includes ${menuItems.slice(0, 4).join(", ")}.`
    : `Menu data is available for ${day}.`;

  if (level === "High") {
    return `${menuText} Crowd may be high around this meal time. Recent reports used: ${reportsUsed}. Try going a little early or after the rush.`;
  }

  if (level === "Medium") {
    return `${menuText} Moderate crowd expected. Recent reports used: ${reportsUsed}. You can go now, but there may be a small queue.`;
  }

  return `${menuText} Low crowd expected. Recent reports used: ${reportsUsed}. This should be a good time to visit the mess.`;
};

const buildBusMessage = ({ route, time, bus, level, reportsUsed }) => {
  const busText = `${bus || "Selected bus"} at ${time} on ${route}.`;

  if (level === "High") {
    return `${busText} Crowd may be high for this timing. Recent reports used: ${reportsUsed}. Reach the stop early and keep another timing in mind.`;
  }

  if (level === "Medium") {
    return `${busText} Moderate rush expected. Recent reports used: ${reportsUsed}. Try reaching 10-15 minutes early.`;
  }

  return `${busText} Low rush expected. Recent reports used: ${reportsUsed}. This looks like a comfortable option.`;
};

router.get("/summary", async (req, res) => {
  try {
    const services = ["Mess", "Bus", "Library", "Canteen"];
    const summary = [];

    for (const serviceType of services) {
      const recentReports = await CrowdReport.find({ serviceType })
        .sort({ createdAt: -1 })
        .limit(5);

      const baseLevel = getTimeBasedLevel(serviceType);
      let finalLevel = baseLevel;

      if (recentReports.length > 0) {
        const reportAverage = recentReports.reduce((sum, report) => {
          return sum + levelScore[report.crowdLevel];
        }, 0) / recentReports.length;

        const combinedScore = (levelScore[baseLevel] + reportAverage) / 2;
        finalLevel = scoreLevel(combinedScore);
      }

      summary.push({
        serviceType,
        crowdLevel: finalLevel,
        suggestion: buildSuggestion(serviceType, finalLevel),
        reportsUsed: recentReports.length
      });
    }

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: "Could not calculate crowd summary" });
  }
});

router.get("/reports", async (req, res) => {
  try {
    const reports = await CrowdReport.find().sort({ createdAt: -1 }).limit(20);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch reports" });
  }
});

router.post("/estimate", async (req, res) => {
  try {
    const { type, day, meal, route, time, bus, menuItems = [] } = req.body;

    if (type === "mess") {
      if (!day || !meal) {
        return res.status(400).json({ message: "Day and meal are required" });
      }

      const baseLevel = getMealBaseLevel(meal);
      const { finalLevel, reportsUsed } = await combineWithReports("mess", baseLevel);

      return res.json({
        crowdLevel: finalLevel,
        reportsUsed,
        message: buildMessMessage({ day, meal, level: finalLevel, menuItems, reportsUsed })
      });
    }

    if (type === "bus") {
      if (!route || !time) {
        return res.status(400).json({ message: "Route and time are required" });
      }

      const location = `${route} ${time}`;
      const baseLevel = getBusBaseLevel(time);
      const { finalLevel, reportsUsed } = await combineWithReports(location, baseLevel);

      return res.json({
        crowdLevel: finalLevel,
        reportsUsed,
        message: buildBusMessage({ route, time, bus, level: finalLevel, reportsUsed })
      });
    }

    res.status(400).json({ message: "Invalid estimate type" });
  } catch (error) {
    res.status(500).json({ message: "Could not calculate estimate" });
  }
});

router.post("/reports", async (req, res) => {
  try {
    const { serviceType, serviceName, crowdLevel, note } = req.body;

    if (!serviceType || !serviceName || !crowdLevel) {
      return res.status(400).json({ message: "Service and crowd level are required" });
    }

    const report = await CrowdReport.create({ serviceType, serviceName, crowdLevel, note });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: "Could not submit report" });
  }
});

module.exports = router;
