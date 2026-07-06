const MONDAY = [
  { time: "06:00", route: "LNMIIT to Raja Park", bus: "Bus 1" },
  { time: "07:00", route: "Raja Park to LNMIIT", bus: "Bus 1" },
  { time: "07:00", route: "LNMIIT to Ajmeri Gate", bus: "Bus 2" },
  { time: "07:00", route: "LNMIIT to Ajmeri Gate", bus: "Bus 3", note: "Extra Mon only" },
  { time: "08:00", route: "Ajmeri Gate to LNMIIT", bus: "Bus 2" },
  { time: "08:00", route: "Ajmeri Gate to LNMIIT", bus: "Bus 3", note: "Extra Mon only" },
  { time: "10:00", route: "LNMIIT to Raja Park", bus: "Bus 4" },
  { time: "11:00", route: "Raja Park to LNMIIT", bus: "Bus 4" },
  { time: "14:00", route: "LNMIIT to Raja Park", bus: "Bus 2" },
  { time: "16:00", route: "Raja Park to LNMIIT", bus: "Bus 2" },
  { time: "16:30", route: "LNMIIT to Raja Park", bus: "Bus 3" },
  { time: "18:05", route: "LNMIIT to Ajmeri Gate", bus: "Bus 1" },
  { time: "18:45", route: "LNMIIT to Ajmeri Gate", bus: "Bus 2" },
  { time: "20:15", route: "Ajmeri Gate to LNMIIT", bus: "Bus 1" },
  { time: "21:00", route: "Raja Park to LNMIIT", bus: "Bus 3" },
  { time: "21:00", route: "Ajmeri Gate to LNMIIT", bus: "Bus 2" }
];

const WEEKDAY = [
  { time: "06:00", route: "LNMIIT to Raja Park", bus: "Bus 1" },
  { time: "07:00", route: "Raja Park to LNMIIT", bus: "Bus 1" },
  { time: "07:00", route: "LNMIIT to Ajmeri Gate", bus: "Bus 2" },
  { time: "08:00", route: "Ajmeri Gate to LNMIIT", bus: "Bus 2" },
  { time: "10:00", route: "LNMIIT to Raja Park", bus: "Bus 4" },
  { time: "11:00", route: "Raja Park to LNMIIT", bus: "Bus 4" },
  { time: "14:00", route: "LNMIIT to Raja Park", bus: "Bus 2" },
  { time: "16:00", route: "Raja Park to LNMIIT", bus: "Bus 2" },
  { time: "16:30", route: "LNMIIT to Raja Park", bus: "Bus 3" },
  { time: "18:05", route: "LNMIIT to Ajmeri Gate", bus: "Bus 1" },
  { time: "18:45", route: "LNMIIT to Ajmeri Gate", bus: "Bus 2" },
  { time: "20:15", route: "Ajmeri Gate to LNMIIT", bus: "Bus 1" },
  { time: "21:00", route: "Raja Park to LNMIIT", bus: "Bus 3" },
  { time: "21:00", route: "Ajmeri Gate to LNMIIT", bus: "Bus 2" }
];

const FRIDAY = [
  ...WEEKDAY.slice(0, 9),
  { time: "17:30", route: "Raja Park to LNMIIT", bus: "Bus 3", note: "Extra Fri only" },
  ...WEEKDAY.slice(9, 11),
  { time: "19:30", route: "LNMIIT to Raja Park", bus: "Bus 3", note: "Extra Fri only" },
  ...WEEKDAY.slice(11)
];

const WEEKEND = [
  { time: "07:00", route: "LNMIIT to Ajmeri Gate", bus: "Bus 1" },
  { time: "08:00", route: "Ajmeri Gate to LNMIIT", bus: "Bus 1" },
  { time: "10:00", route: "LNMIIT to Raja Park", bus: "Bus 2" },
  { time: "12:00", route: "Raja Park to LNMIIT", bus: "Bus 2" },
  { time: "13:00", route: "LNMIIT to Raja Park", bus: "Bus 3" },
  { time: "15:00", route: "Raja Park to LNMIIT", bus: "Bus 3" },
  { time: "16:00", route: "LNMIIT to Raja Park", bus: "Bus 2" },
  { time: "16:30", route: "LNMIIT to Ajmeri Gate", bus: "Bus 3" },
  { time: "17:00", route: "LNMIIT to Raja Park", bus: "Bus 1" },
  { time: "17:15", route: "Raja Park to LNMIIT", bus: "Bus 2" },
  { time: "18:00", route: "LNMIIT to Ajmeri Gate", bus: "Bus 2" },
  { time: "20:15", route: "Ajmeri Gate to LNMIIT", bus: "Bus 3" },
  { time: "21:00", route: "Raja Park to LNMIIT", bus: "Bus 1" },
  { time: "21:00", route: "Ajmeri Gate to LNMIIT", bus: "Bus 2" }
];

window.BUS_DATA = {
  Monday: MONDAY,
  Tuesday: WEEKDAY,
  Wednesday: WEEKDAY,
  Thursday: WEEKDAY,
  Friday: FRIDAY,
  Saturday: WEEKEND,
  Sunday: WEEKEND
};

window.getBusesForDay = function getBusesForDay(day, isHoliday) {
  if (isHoliday) return WEEKEND;
  return window.BUS_DATA[day] || WEEKDAY;
};
