const SETTINGS = {
  // Change bride name here.
  brideName: "Aizhan",

  // Change event date label here. Keep this readable for guests.
  eventDateLabel: "20 тамыз 2026",

  // Change event time here.
  eventTime: "18:00",

  // Change address here.
  address: "Тараз қаласы, Ташкент көшесі 268, Golden Hall мейрамханасы",

  // Replace this with the final 2GIS link.
  mapUrl: "https://2gis.kz/taraz/geo/70000001053565927",

  // Add a music file path when ready, for example: "assets/music.mp3".
  musicFile: "assets/music.mp3",

  // Change countdown date here when the exact date is known.
  // Use ISO format so all phones parse it correctly.
  countdownDateISO: "2026-08-20T18:00:00+05:00",
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
let musicWanted = true;

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
    bgMusic.volume = 0.72;
    audioReady = true;
  } else {
    musicButton.title = "Музыка файлын script.js ішіндегі SETTINGS.musicFile жолына қосыңыз";
  }
}

function setMusicUi(isPlaying) {
  musicButton.classList.toggle("is-playing", isPlaying);
  musicIcon.src = isPlaying ? "assets/pauseicon.png" : "assets/musicicon.png";
  musicButton.setAttribute("aria-label", isPlaying ? "Музыканы тоқтату" : "Музыканы қосу");
}

async function startMusic() {
  if (!audioReady) return false;

  musicWanted = true;

  try {
    await bgMusic.play();
    setMusicUi(true);
    return true;
  } catch {
    setMusicUi(false);
    return false;
  }
}

function stopMusic() {
  musicWanted = false;
  bgMusic.pause();
  setMusicUi(false);
}

function unlockAutoplay(event) {
  if (event?.target?.closest?.("#musicButton")) return;
  if (musicWanted && bgMusic.paused) {
    void startMusic();
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
  void startMusic();

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
    await startMusic();
  } else {
    stopMusic();
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
void startMusic();
updateCountdown();
window.setInterval(updateCountdown, 1000);

openButton.addEventListener("click", openInvitation);
musicButton.addEventListener("click", toggleMusic);
window.addEventListener("pointerdown", unlockAutoplay, { capture: true });
window.addEventListener("keydown", unlockAutoplay, { capture: true });
rsvpForm.addEventListener("submit", handleRsvpSubmit);
