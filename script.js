// Simple interaction & demo data logic

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  // Close menu when clicking a link (mobile)
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
    });
  });
}

// Animated floating metrics (small pulsing effect)
function animateValue(id, base, amplitude, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = null;

  function frame(timestamp) {
    if (!start) start = timestamp;
    const progress = (timestamp - start) / duration;
    const angle = (progress % 1) * 2 * Math.PI;
    const value = base + Math.sin(angle) * amplitude;
    el.textContent =
      id === "co2Value"
        ? value.toFixed(0) + " ppm"
        : id === "seaValue"
        ? "+" + value.toFixed(0) + " mm"
        : "+" + value.toFixed(2) + "°C";
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

animateValue("tempValue", 1.09, 0.04, 6000);
animateValue("co2Value", 421, 3, 8000);
animateValue("seaValue", 230, 5, 7000);

// Simple trend chart using Canvas (no external libraries)
const canvas = document.getElementById("trendChart");
if (canvas && canvas.getContext) {
  // Make canvas responsive to its container
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = 220; // match CSS height

  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  // Background
  ctx.fillStyle = "#050915";
  ctx.fillRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 6; i++) {
    const y = (h / 6) * i;
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(w - 20, y);
    ctx.stroke();
  }

  // Years (x-axis)
  const years = [1900, 1920, 1940, 1960, 1980, 2000, 2020];
  const temps = [-0.1, -0.05, 0.0, 0.1, 0.25, 0.6, 1.1]; // anomaly °C (demo)
  const xStep = (w - 80) / (years.length - 1);
  const yMin = -0.2;
  const yMax = 1.4;

  ctx.font = "10px system-ui";
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.textAlign = "center";

  years.forEach((year, i) => {
    const x = 40 + i * xStep;
    ctx.fillText(year.toString(), x, h - 8);
  });

  // Line
  ctx.beginPath();
  temps.forEach((temp, i) => {
    const x = 40 + i * xStep;
    const norm = (temp - yMin) / (yMax - yMin);
    const y = h - 30 - norm * (h - 70);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  const gradient = ctx.createLinearGradient(40, 0, w - 40, 0);
  gradient.addColorStop(0, "#46c3ff");
  gradient.addColorStop(0.7, "#ffb347");
  gradient.addColorStop(1, "#ff5c7a");
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Fill under line
  ctx.lineTo(w - 40, h - 30);
  ctx.lineTo(40, h - 30);
  ctx.closePath();
  ctx.fillStyle = "rgba(70,195,255,0.10)";
  ctx.fill();

  // Axis label
  ctx.save();
  ctx.translate(12, h / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText("Global temperature anomaly (°C)", 0, 0);
  ctx.restore();
}

// Dashboard interactive logic
const warmingSlider = document.getElementById("warmingSlider");
const warmingLabel = document.getElementById("warmingLabel");
const meterFill = document.getElementById("meterFill");
const riskLevel = document.getElementById("riskLevel");
const riskDescription = document.getElementById("riskDescription");
const focusList = document.getElementById("focusList");

function updateDashboard(value) {
  const v = parseFloat(value);
  if (warmingLabel) {
    warmingLabel.textContent = v.toFixed(1) + "°C";
  }

  // Meter width: map 1.0–4.0°C to 15–95%
  const width = 15 + ((v - 1) / 3) * 80;
  if (meterFill) {
    meterFill.style.width = width + "%";
  }

  let level;
  let desc;
  let focusItems;

  if (v <= 1.6) {
    level = "Managed";
    desc =
      "Rapid decarbonization and strong adaptation limit many severe impacts, but vulnerable communities still face significant risks.";
    focusItems = [
      "Accelerate phase-out of unabated fossil fuels.",
      "Scale renewable energy and grid modernization.",
      "Protect and restore forests, wetlands, and blue carbon ecosystems.",
    ];
    if (riskLevel) riskLevel.style.color = "#5cffb0";
  } else if (v <= 2.3) {
    level = "High";
    desc =
      "Heat extremes, water stress, and ecosystem losses intensify. Strong adaptation and resilience planning become essential.";
    focusItems = [
      "Hardening infrastructure against heatwaves, floods, and storms.",
      "Support climate-smart agriculture and food security.",
      "Implement robust early warning and disaster risk systems.",
    ];
    if (riskLevel) riskLevel.style.color = "#ffb347";
  } else if (v <= 3.0) {
    level = "Very High";
    desc =
      "Irreversible losses for many ecosystems and severe risks to health, livelihoods, and infrastructure in most regions.";
    focusItems = [
      "Urgent emissions cuts across all sectors with just transition.",
      "Large-scale investments in adaptation for coastal and urban areas.",
      "Strengthen social safety nets and climate finance for vulnerable regions.",
    ];
    if (riskLevel) riskLevel.style.color = "#ff7a7a";
  } else {
    level = "Extreme";
    desc =
      "Widespread, dangerous, and often irreversible impacts, exceeding many current adaptation limits.";
    focusItems = [
      "Emergency global cooperation on mitigation and loss & damage.",
      "Relocation and managed retreat from high-risk areas.",
      "Transformational changes in energy, land use, and urban systems.",
    ];
    if (riskLevel) riskLevel.style.color = "#ff3355";
  }

  if (riskLevel) riskLevel.textContent = level;
  if (riskDescription) riskDescription.textContent = desc;

  if (focusList) {
    focusList.innerHTML = "";
    focusItems.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      focusList.appendChild(li);
    });
  }
}

if (warmingSlider) {
  updateDashboard(warmingSlider.value);
  warmingSlider.addEventListener("input", (e) =>
    updateDashboard(e.target.value)
  );
}

// Contact form -> open email client with prefilled fields
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName")?.value.trim() || "";
    const lastName = document.getElementById("lastName")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const phone = document.getElementById("phone")?.value.trim() || "";
    const message = document.getElementById("message")?.value.trim() || "";

    const fullName = (firstName + " " + lastName).trim() || "New visitor";

    const subject = `New contact from ${fullName}`;

    const bodyLines = [
      `Name: ${fullName}`,
      `Email: ${email || "N/A"}`,
      `Phone: ${phone || "N/A"}`,
      "",
      "Message:",
      message || "(No message provided)",
    ];

    const body = encodeURIComponent(bodyLines.join("\n"));
    const mailto = `mailto:zyrajanemarcopalejaro@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;

    window.location.href = mailto;
  });
}

// Footer year
const footerYear = document.getElementById("footerYear");
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}


