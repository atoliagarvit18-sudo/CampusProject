const NOTICE_API_URL = "/api/notices";
const CROWD_ESTIMATE_API_URL = "/api/crowd/estimate";
const CROWD_REPORT_API_URL = "/api/crowd/reports";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const daySelect = document.getElementById("day");
const mealSelect = document.getElementById("meal");
const busSelect = document.getElementById("busSelect");
const messControls = document.getElementById("messControls");
const busControls = document.getElementById("busControls");
const messTab = document.getElementById("messTab");
const busTab = document.getElementById("busTab");
const guideForm = document.getElementById("guideForm");
const resultBox = document.getElementById("resultBox");
const dataView = document.getElementById("dataView");
const dataTitle = document.getElementById("dataTitle");
const dataSubtitle = document.getElementById("dataSubtitle");
const formTitle = document.getElementById("formTitle");
const todayText = document.getElementById("todayText");
const clockText = document.getElementById("clockText");

const reportForm = document.getElementById("reportForm");
const reportService = document.getElementById("reportService");
const reportTarget = document.getElementById("reportTarget");
const reportLevel = document.getElementById("reportLevel");
const reportNote = document.getElementById("reportNote");
const recentReports = document.getElementById("recentReports");

const noticeForm = document.getElementById("noticeForm");
const noticeId = document.getElementById("noticeId");
const title = document.getElementById("title");
const category = document.getElementById("category");
const date = document.getElementById("date");
const description = document.getElementById("description");
const noticeList = document.getElementById("noticeList");
const filter = document.getElementById("filter");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

let mode = "mess";
let notices = [];

function getTodayName() {
  return days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
}

function updateClock() {
  const now = new Date();
  todayText.textContent = getTodayName();
  clockText.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function setupDays() {
  daySelect.innerHTML = days.map((day) => `<option value="${day}">${day}</option>`).join("");
  daySelect.value = getTodayName();
}

function setMode(nextMode) {
  mode = nextMode;
  const isMess = mode === "mess";

  messTab.classList.toggle("active", isMess);
  busTab.classList.toggle("active", !isMess);
  messControls.classList.toggle("hidden", !isMess);
  busControls.classList.toggle("hidden", isMess);
  formTitle.textContent = isMess ? "Mess Crowd Guide" : "Bus Crowd Guide";

  renderDataView();
  resultBox.innerHTML = "<p>Select a service to see guidance.</p>";
}

function renderDataView() {
  const day = daySelect.value;

  if (mode === "mess") {
    dataTitle.textContent = "Mess Menu";
    dataSubtitle.textContent = `${day} menu from the original project data.`;
    const menu = window.MENU[day] || {};

    dataView.innerHTML = Object.keys(menu)
      .map((meal) => `
        <article class="meal-card">
          <h3>${meal}</h3>
          <div class="meal-items">
            ${menu[meal].map((item) => `<span class="tag">${item}</span>`).join("")}
          </div>
        </article>
      `)
      .join("");
    return;
  }

  dataTitle.textContent = "Bus Timetable";
  dataSubtitle.textContent = `${day} timetable from the original project data.`;
  const buses = window.getBusesForDay(day, false);

  busSelect.innerHTML = '<option value="">Select bus</option>' + buses
    .map((bus, index) => `<option value="${index}">${bus.time} - ${bus.route} (${bus.bus})</option>`)
    .join("");

  dataView.innerHTML = buses
    .map((bus) => `
      <article class="bus-card">
        <h3>${bus.time} - ${bus.route}</h3>
        <p><strong>${bus.bus}</strong>${bus.note ? ` | ${bus.note}` : ""}</p>
      </article>
    `)
    .join("");
}

guideForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const day = daySelect.value;
  let body;

  if (mode === "mess") {
    const meal = mealSelect.value;
    if (!meal) {
      alert("Please select a meal");
      return;
    }

    body = {
      type: "mess",
      day,
      meal,
      menuItems: window.MENU[day][meal]
    };
  } else {
    const buses = window.getBusesForDay(day, false);
    const selectedBus = buses[Number(busSelect.value)];
    if (!selectedBus) {
      alert("Please select a bus");
      return;
    }

    body = {
      type: "bus",
      day,
      route: selectedBus.route,
      time: selectedBus.time,
      bus: selectedBus.bus
    };

    reportTarget.value = `${selectedBus.route} ${selectedBus.time}`;
    reportService.value = "bus";
  }

  try {
    const response = await fetch(CROWD_ESTIMATE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const result = await response.json();
    const levelClass = result.crowdLevel.toLowerCase();

    resultBox.innerHTML = `
      <span class="level level-${levelClass}">${result.crowdLevel}</span>
      <p>${result.message}</p>
    `;
  } catch (error) {
    resultBox.innerHTML = '<p>Could not get suggestion. Please check server connection.</p>';
  }
});

reportForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const reportData = {
    serviceType: reportService.value === "mess" ? "Mess" : "Bus",
    serviceName: reportTarget.value.trim(),
    crowdLevel: reportLevel.value,
    note: reportNote.value.trim()
  };

  if (!reportData.serviceName || !reportData.crowdLevel) {
    alert("Please fill report fields");
    return;
  }

  try {
    await fetch(CROWD_REPORT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reportData)
    });

    reportForm.reset();
    reportTarget.value = "mess";
    loadReports();
  } catch (error) {
    alert("Could not submit feedback");
  }
});

async function loadReports() {
  try {
    const response = await fetch(CROWD_REPORT_API_URL);
    const reports = await response.json();

    if (reports.length === 0) {
      recentReports.innerHTML = '<div class="empty">No feedback submitted yet.</div>';
      return;
    }

    recentReports.innerHTML = reports.slice(0, 6)
      .map((report) => {
        const levelClass = report.crowdLevel.toLowerCase();
        return `
          <article class="report-card">
            <h3>${report.serviceName}</h3>
            <span class="tag">${report.serviceType}</span>
            <span class="level level-${levelClass}">${report.crowdLevel}</span>
            <p>${report.note || "No note added."}</p>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    recentReports.innerHTML = '<div class="empty">Could not load feedback.</div>';
  }
}

async function loadNotices() {
  try {
    const response = await fetch(NOTICE_API_URL);
    notices = await response.json();
    showNotices();
  } catch (error) {
    noticeList.innerHTML = '<div class="empty">Could not load notices.</div>';
  }
}

function showNotices() {
  const selectedCategory = filter.value;
  const filteredNotices = selectedCategory === "All"
    ? notices
    : notices.filter((notice) => notice.category === selectedCategory);

  if (filteredNotices.length === 0) {
    noticeList.innerHTML = '<div class="empty">No campus notices found.</div>';
    return;
  }

  noticeList.innerHTML = filteredNotices
    .map((notice) => `
      <article class="notice-card">
        <span class="tag">${notice.category}</span>
        <h3>${notice.title}</h3>
        <p>${notice.description}</p>
        <p><strong>Date:</strong> ${notice.date}</p>
        <div class="actions">
          <button onclick="startEdit('${notice._id}')">Edit</button>
          <button class="delete" onclick="deleteNotice('${notice._id}')">Delete</button>
        </div>
      </article>
    `)
    .join("");
}

noticeForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const noticeData = {
    title: title.value.trim(),
    category: category.value,
    date: date.value,
    description: description.value.trim()
  };

  if (!noticeData.title || !noticeData.category || !noticeData.date || !noticeData.description) {
    alert("Please fill all notice fields");
    return;
  }

  const isEditing = Boolean(noticeId.value);
  const url = isEditing ? `${NOTICE_API_URL}/${noticeId.value}` : NOTICE_API_URL;
  const method = isEditing ? "PUT" : "POST";

  try {
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noticeData)
    });

    resetNoticeForm();
    loadNotices();
  } catch (error) {
    alert("Something went wrong. Please try again.");
  }
});

function startEdit(id) {
  const notice = notices.find((item) => item._id === id);
  if (!notice) return;

  noticeId.value = notice._id;
  title.value = notice.title;
  category.value = notice.category;
  date.value = notice.date;
  description.value = notice.description;
  submitBtn.textContent = "Update Notice";
  cancelBtn.classList.remove("hidden");
}

async function deleteNotice(id) {
  const confirmDelete = confirm("Do you want to delete this notice?");
  if (!confirmDelete) return;

  try {
    await fetch(`${NOTICE_API_URL}/${id}`, { method: "DELETE" });
    loadNotices();
  } catch (error) {
    alert("Could not delete notice.");
  }
}

function resetNoticeForm() {
  noticeForm.reset();
  noticeId.value = "";
  submitBtn.textContent = "Add Notice";
  cancelBtn.classList.add("hidden");
}

messTab.addEventListener("click", () => setMode("mess"));
busTab.addEventListener("click", () => setMode("bus"));
daySelect.addEventListener("change", renderDataView);
reportService.addEventListener("change", () => {
  reportTarget.value = reportService.value === "mess" ? "mess" : "";
});
cancelBtn.addEventListener("click", resetNoticeForm);
filter.addEventListener("change", showNotices);

setupDays();
updateClock();
setInterval(updateClock, 30000);
renderDataView();
loadReports();
loadNotices();
