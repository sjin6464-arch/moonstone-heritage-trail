const stations = {
  food: {
    number: "01",
    name: "Food Stalls",
    icon: "🥢",
    prompt: "Check in when you arrive",
    content:
      "The food stalls around Moonstone Lane are everyday social landmarks. They offer affordable meals, familiar faces and a natural reason to spend time in the estate.",
    info: `
      <strong>Sample stall guide</strong><br>
      Morning drinks &amp; toast — 7:00am–2:00pm<br>
      Local rice &amp; noodle dishes — 10:30am–8:00pm<br>
      Snacks &amp; cold drinks — 11:00am–9:00pm<br>
      <small>
        Opening hours and stalls are placeholders—verify before publishing.
      </small>
    `,
    activity: `
      <p>
        Tap below while you are at the station. We will save the time on
        this device.
      </p>

      <button class="button secondary" id="check-in">
        Create check-in timestamp
      </button>

      <p class="activity-status" id="activity-status"></p>
    `
  },

  temple: {
    number: "02",
    name: "Chinese Temple",
    icon: "🏮",
    prompt: "Temple respect quiz",
    content:
      "This Chinese temple is part of Moonstone Lane's living cultural landscape. Beyond its architecture, it carries community practices, memories and relationships across generations.",
    info: `
      <strong>Visit respectfully</strong><br>
      Keep voices low, follow posted signs, do not block entrances and ask
      before photographing people or ceremonies.
    `,
    activity: `
      <p>
        Which is the most respectful action in an active cultural space?
      </p>

      <label class="radio-option">
        <input type="radio" name="quiz" value="a">
        Photograph worshippers without asking
      </label>

      <label class="radio-option">
        <input type="radio" name="quiz" value="b">
        Speak quietly and follow posted guidance
      </label>

      <label class="radio-option">
        <input type="radio" name="quiz" value="c">
        Move ritual objects for a better view
      </label>

      <button class="button secondary" id="check-quiz">
        Check answer
      </button>

      <p class="activity-status" id="activity-status"></p>
    `
  },

  keramat: {
    number: "03",
    name: "Warehouse & Keramat",
    icon: "🌿",
    prompt: "Pause and reflect",
    content:
      "Near the warehouse area is a quiet grave or keramat—a hidden heritage feature that reveals how different layers of memory remain within a changing urban landscape. Its presence calls for care, not spectacle.",
    info: `
      <strong>Respect first</strong><br>
      Please do not photograph the grave or enter restricted areas. Observe
      only from a safe, public location and avoid disturbing offerings or
      the surrounding space.
    `,
    activity: `
      <label for="reflection">
        How can a neighbourhood protect quiet or sacred heritage while
        helping people understand it?
      </label>

      <textarea
        id="reflection"
        maxlength="300"
        placeholder="Write a short reflection…"
      ></textarea>

      <button class="button secondary" id="save-reflection">
        Save reflection
      </button>

      <p class="activity-status" id="activity-status"></p>
    `
  },

  factory: {
    number: "04",
    name: "Former Water Factory",
    icon: "🏭",
    prompt: "Then versus now",
    content:
      "The former water factory reflects Moonstone Lane's industrial past. Building scale, materials, loading areas and older façades can offer clues to how the estate once worked and changed.",
    info: `
      <strong>Look from public space</strong><br>
      Compare the older industrial form with today's uses. Do not enter
      private property or block vehicle access.
    `,
    activity: `
      <label for="then-now">
        What feature best reveals the area's industrial past?
      </label>

      <select id="then-now">
        <option value="">Choose one…</option>
        <option>Building shape or façade</option>
        <option>Loading and access areas</option>
        <option>Materials and old signage</option>
        <option>Another detail I noticed</option>
      </select>

      <button class="button secondary" id="save-factory">
        Save observation
      </button>

      <p class="activity-status" id="activity-status"></p>
    `
  }
};

const checkpoints = [
  {
    id: "food",
    name: "Food Stalls",
    address: "Moonstone Lane food-stall area (verify stall)",
    lat: 1.32735,
    lng: 103.8662
  },
  {
    id: "temple",
    name: "Sin Choon Huat / Fu De Ci Temple",
    address: "17D Moonstone Lane, Singapore 328459",
    lat: 1.32748,
    lng: 103.86582
  },
  {
    id: "keramat",
    name: "Warehouse & Keramat vicinity",
    address: "Approx. 49 Moonstone Lane, Singapore",
    lat: 1.32818,
    lng: 103.86453
  },
  {
    id: "factory",
    name: "Former National Aerated Water Company Factory",
    address: "1177 Serangoon Road, Singapore 328231",
    lat: 1.32583,
    lng: 103.86583
  }
];

const storageKey = "moonstoneTrailProgressV1";

let progress = loadProgress();

const stationDialog = document.querySelector("#station-dialog");
const keepsakeDialog = document.querySelector("#keepsake-dialog");

function loadProgress() {
  try {
    return (
      JSON.parse(localStorage.getItem(storageKey)) || {
        stamps: {},
        startedAt: null,
        completedAt: null
      }
    );
  } catch {
    return {
      stamps: {},
      startedAt: null,
      completedAt: null
    };
  }
}

function saveProgress() {
  localStorage.setItem(storageKey, JSON.stringify(progress));
  render();
}

function completedCount() {
  return Object.keys(progress.stamps).length;
}

function formatTime(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function toast(message) {
  const element = document.querySelector("#toast");

  element.textContent = message;
  element.classList.add("show");

  setTimeout(() => {
    element.classList.remove("show");
  }, 2600);
}

function render() {
  const count = completedCount();

  document.querySelector("#nav-count").textContent = `${count}/4`;
  document.querySelector("#trail-count").textContent = count;

  document.querySelectorAll(".station-card").forEach((card) => {
    const stationCompleted = Boolean(
      progress.stamps[card.dataset.station]
    );

    card.classList.toggle("completed", stationCompleted);
  });

  document.querySelector("#stamp-card").innerHTML = Object.entries(
    stations
  )
    .map(([id, station]) => {
      const collected = progress.stamps[id];

      return `
        <article class="stamp ${collected ? "collected" : ""}">
          <div>
            <div class="stamp-seal">
              ${collected ? station.icon : "?"}
            </div>

            <strong>${station.name}</strong>

            <small>
              ${
                collected
                  ? formatTime(progress.stamps[id])
                  : "Not collected yet"
              }
            </small>
          </div>
        </article>
      `;
    })
    .join("");

  const reward = document.querySelector("#reward");

  reward.classList.toggle("locked", count < 4);

  document.querySelector("#view-keepsake").hidden = count < 4;

  document.querySelector("#reward-title").textContent =
    count === 4
      ? "Moonstone Explorer unlocked!"
      : "Keep exploring";

  document.querySelector("#reward-copy").textContent =
    count === 4
      ? `Trail completed ${formatTime(
          progress.completedAt
        )}. Your digital keepsake is ready.`
      : "Collect all four stamps to unlock your Moonstone Explorer digital keepsake.";
}

function openStation(id) {
  const station = stations[id];

  if (!station) {
    return;
  }

  if (!progress.startedAt) {
    progress.startedAt = new Date().toISOString();
    saveProgress();
  }

  const photoNote =
    id === "keramat"
      ? "Photograph only the public warehouse streetscape—never the grave, offerings or people."
      : "Photograph the checkpoint exterior from a safe public place. Avoid faces unless you have permission.";

  document.querySelector("#dialog-content").innerHTML = `
    <div class="dialog-hero">
      <p class="eyebrow">Station ${station.number}</p>
      <h2>${station.name}</h2>
      <p>${station.content}</p>
    </div>

    <div class="dialog-body">
      <div class="info-box">
        ${station.info}
      </div>

      <div class="activity">
        <p class="eyebrow">Activity</p>
        <h3>${station.prompt}</h3>

        ${station.activity}

        <div class="camera-box">
          <strong>Optional photo memory</strong>
          <p>${photoNote}</p>

          <input
            type="file"
            class="station-camera"
            accept="image/*"
            capture="environment"
          >

          <img
            class="photo-preview"
            alt="Preview of your checkpoint photo"
          >
        </div>
      </div>

      <button
        class="button primary collect-button"
        id="collect-stamp"
        disabled
      >
        ${
          progress.stamps[id]
            ? "Stamp collected ✓"
            : "Complete activity to collect stamp"
        }
      </button>
    </div>
  `;

  stationDialog.showModal();
  wireActivity(id);

  if (progress.stamps[id]) {
    document.querySelector("#collect-stamp").disabled = true;
  }
}

function unlockActivity(message) {
  document.querySelector("#activity-status").textContent = message;

  const button = document.querySelector("#collect-stamp");

  button.disabled = false;
  button.textContent = "Collect this stamp";
}

function wireActivity(id) {
  if (id === "food") {
    document.querySelector("#check-in").onclick = () => {
      unlockActivity(
        `Checked in: ${formatTime(new Date().toISOString())}`
      );
    };
  }

  if (id === "temple") {
    document.querySelector("#check-quiz").onclick = () => {
      const answer = document.querySelector(
        'i
