/* =========================================================
   ACCESSIBLE GLOBAL THEME (FIXED – NO DUPLICATES)
   ========================================================= */

const themePicker = document.getElementById("themeColor");
const DEFAULT_THEME = "#4f6cff";

/* Convert hex → RGB */
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

/* Calculate luminance */
function getLuminance({ r, g, b }) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function setTheme(color) {
  const rgb = hexToRgb(color);
  const luminance = getLuminance(rgb);

  const textColor = luminance < 0.55 ? "#ffffff" : "#1e1e1e";

  document.documentElement.style.setProperty("--primary", color);
  document.documentElement.style.setProperty("--bg", color + "22");
  document.documentElement.style.setProperty("--text", textColor);
  document.documentElement.style.setProperty("--card-text", "#1e1e1e");
}

/* 🔥 APPLY THEME ON LOAD (ONLY ONCE) */
const savedTheme = localStorage.getItem("theme") || DEFAULT_THEME;
setTheme(savedTheme);
themePicker.value = savedTheme;

/* Listen for user changes */
themePicker.addEventListener("input", (e) => {
  const color = e.target.value;
  setTheme(color);
  localStorage.setItem("theme", color);
});

/* =========================================================
   TASK MANAGEMENT
   ========================================================= */

const API_BASE = 'http://localhost:8080/api';

const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");

let tasks = [];

async function loadTasks() {
  try {
    const res = await fetch(`${API_BASE}/tasks`);
    if (!res.ok) throw new Error('Network response was not ok');
    tasks = await res.json();
    renderTasks();
  } catch (err) {
    console.error('Failed to load tasks', err);
  }
}

addTaskBtn.addEventListener("click", async () => {
  if (!taskInput.value || !subjectInput.value) return;

  const payload = {
    text: taskInput.value,
    subject: subjectInput.value,
    completed: false
  };

  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const created = res.ok ? await res.json() : null;
    tasks.push(created);
    taskInput.value = "";
    subjectInput.value = "";
    renderTasks();
  } catch (err) {
    console.error('Create task failed', err);
  }
});

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <span class="${task.completed ? "done-text" : ""}">
        ${task.text} <small>(${task.subject})</small>
      </span>
      <div>
        <button onclick="toggleTask(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  // Progress bar
  const completed = tasks.filter(t => t.completed).length;
  const percent = tasks.length ? (completed / tasks.length) * 100 : 0;
  progressBar.style.width = percent + "%";
}

window.toggleTask = async function (id) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}/toggle`, { method: 'POST' });
    const updated = res.ok ? await res.json() : null;
    tasks = tasks.map(t => (t.id === updated.id ? updated : t));
    renderTasks();
  } catch (err) {
    console.error('Toggle failed', err);
  }
}

window.deleteTask = async function (id) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    if (res.ok) {
      tasks = tasks.filter(t => t.id !== id);
      renderTasks();
    }
  } catch (err) {
    console.error('Delete failed', err);
  }
}

loadTasks();

/* =========================================================
   POMODORO TIMER + FOCUS MODE
   ========================================================= */

let time = 1500; // 25 min
let timer = null;
let running = false;

const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const taskSection = document.getElementById("taskSection");

function updateTime() {
  const m = Math.floor(time / 60);
  const s = time % 60;
  timeDisplay.textContent = `${m}:${s < 10 ? "0" : ""}${s}`;
}

startBtn.addEventListener("click", () => {
  if (running) return;
  running = true;

  // Focus mode ON
  taskSection.classList.add("hidden");

  timer = setInterval(() => {
    if (time > 0) {
      time--;
      updateTime();
    } else {
      clearInterval(timer);
      alert("Focus session complete 🎉");
      resetPomodoro();
    }
  }, 1000);
});

pauseBtn.addEventListener("click", () => {
  clearInterval(timer);
  running = false;
  taskSection.classList.remove("hidden");
});

resetBtn.addEventListener("click", () => {
  resetPomodoro();
});

function resetPomodoro() {
  clearInterval(timer);
  running = false;
  time = 1500;
  updateTime();
  taskSection.classList.remove("hidden");
}

updateTime();
fetch("http://localhost:8080/api/hello")
  .then(res => res.text())
  .then(data => {
    console.log(data);
  });
