const SETTINGS = {
  // Change bride name here.
  brideName: "Aizhan",

  // Change event date label here. Keep this readable for guests.
  eventDateLabel: "11 шілде 2026",

  // Change event time here.
  eventTime: "18:00",

  // Change address here.
  address: "Алматы қаласы, Төле би көшесі 59, Grand Hall мейрамханасы",

  // Replace this with the final 2GIS link.
  mapUrl: "https://go.2gis.com/replace-this-link",

  // Add a music file path when ready, for example: "assets/music.mp3".
  musicFile: "",

  // Change countdown date here when the exact date is known.
  // Use ISO format so all phones parse it correctly.
  countdownDateISO: "2026-07-11T18:00:00+05:00",
};

const body = document.body;
const introSection = document.getElementById("introSection");
const openButton = document.getElementById("openInvitation");
const openStage = document.getElementById("openStage");
const closedStage = document.getElementById("closedStage");
const content = document.getElementById("content");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const bgMusic = document.getElementById("bgMusic");
const rsvpForm = document.getElementById("rsvpForm");
const formMessage = document.getElementById("formMessage");
const mapButton = document.getElementById("mapButton");

let invitationOpened = false;
let audioReady = false;

function renderSplitScriptText(node, text) {
  const letters = Array.from(text.trim());
  const capital = letters.shift() || "";
  const rest = letters.join("");
  const capitalSpan = document.createElement("span");
  const restSpan = document.createElement("span");

  capitalSpan.className = "name-capital";
  capitalSpan.textContent = capital;
  restSpan.className = "name-rest";
  restSpan.textContent = rest;

  node.replaceChildren(capitalSpan, restSpan);
}

function applySettings() {
  document.querySelectorAll("[data-bride-name]").forEach((node) => {
    if (node.classList.contains("script-split") || node.classList.contains("intro-name")) {
      renderSplitScriptText(node, SETTINGS.brideName);
      return;
    }

    node.textContent = SETTINGS.brideName;
  });

  document.querySelectorAll("[data-event-date]").forEach((node) => {
    node.textContent = SETTINGS.eventDateLabel;
  });

  document.querySelectorAll("[data-event-time]").forEach((node) => {
    node.textContent = SETTINGS.eventTime;
  });

  document.querySelectorAll("[data-address]").forEach((node) => {
    node.textContent = SETTINGS.address;
  });

  if (mapButton) {
    mapButton.href = SETTINGS.mapUrl;
  }

  if (SETTINGS.musicFile) {
    bgMusic.src = SETTINGS.musicFile;
    audioReady = true;
  } else {
    musicButton.title = "Музыка файлын script.js ішіндегі SETTINGS.musicFile жолына қосыңыз";
  }
}

function openInvitation() {
  if (invitationOpened) return;

  invitationOpened = true;
  introSection.classList.add("is-open");
  body.classList.remove("is-locked");
  openStage.setAttribute("aria-hidden", "false");
  closedStage.setAttribute("aria-hidden", "true");
  content.hidden = false;
  musicButton.hidden = false;

  window.setTimeout(() => {
    document.querySelectorAll("[data-reveal]").forEach((node) => revealObserver.observe(node));
  }, 80);
}

async function toggleMusic() {
  if (!audioReady) {
    musicButton.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.08)" },
        { transform: "scale(1)" },
      ],
      { duration: 360, easing: "ease-out" },
    );
    return;
  }

  if (bgMusic.paused) {
    try {
      await bgMusic.play();
      musicButton.classList.add("is-playing");
      musicIcon.src = "assets/pauseicon.png";
      musicButton.setAttribute("aria-label", "Музыканы тоқтату");
    } catch {
      musicButton.classList.remove("is-playing");
    }
  } else {
    bgMusic.pause();
    musicButton.classList.remove("is-playing");
    musicIcon.src = "assets/musicicon.png";
    musicButton.setAttribute("aria-label", "Музыканы қосу");
  }
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  },
);

function updateCountdown() {
  const target = new Date(SETTINGS.countdownDateISO).getTime();
  const now = Date.now();
  const distance = Number.isFinite(target) ? Math.max(target - now, 0) : 0;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

function handleRsvpSubmit(event) {
  event.preventDefault();

  const formData = new FormData(rsvpForm);
  const guestName = String(formData.get("guestName") || "").trim();
  const attendance = String(formData.get("attendance") || "").trim();

  formMessage.classList.remove("is-error", "is-success");

  if (!guestName || !attendance) {
    formMessage.textContent = "Атыңызды жазып, бір жауапты таңдаңыз.";
    formMessage.classList.add("is-error");
    return;
  }

  formMessage.textContent = "Рақмет! Жауабыңыз сақталды.";
  formMessage.classList.add("is-success");

  // Connect backend or messenger/API submission here when needed.
  console.info("RSVP response:", { guestName, attendance });
  rsvpForm.reset();
}

applySettings();
updateCountdown();
window.setInterval(updateCountdown, 1000);

openButton.addEventListener("click", openInvitation);
musicButton.addEventListener("click", toggleMusic);
rsvpForm.addEventListener("submit", handleRsvpSubmit);
