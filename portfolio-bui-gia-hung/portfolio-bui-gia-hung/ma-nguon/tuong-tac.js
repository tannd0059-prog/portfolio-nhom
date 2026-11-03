"use strict";

const projectData = {
  cold: {
    title: "Cold-Chain-AI",
    image: "du-an/chuoi-lanh.png",
    role: "Full-stack development & monitoring pipeline",
    description:
      "Perishable goods and pharmaceuticals need consistent storage conditions during transport. This project connects environmental readings to alerts and a web console for operators.",
    contributions: [
      "Designed the flow from data ingestion to API endpoints and a web monitoring interface.",
      "Processed temperature, humidity and duration to assess anomalies and flag deviations or spoilage risks.",
      "Built a monitoring dashboard with trip-level diagnostics and exportable logs for quality reviews.",
    ],
    stack:
      "Python / Machine Learning / FastAPI / REST API / HTML / CSS / JavaScript / MySQL",
    url: "https://github.com/Buigiahung1/Cold-Chain-AI",
    linkLabel: "View source on GitHub",
  },
  alpr: {
    title: "License Plate Recognition — ALPR",
    image: "du-an/nhan-dien-bien-so.png",
    role: "Computer vision & application development",
    description:
      "Manual vehicle check-in can cause queues and transcription errors. This system processes camera images and checks a database to help verify vehicles at a gate.",
    contributions: [
      "Trained a custom YOLO detector with license plate data that includes low light, motion blur and varied viewing angles.",
      "Connected character recognition, plate text cleanup and database lookups for permitted vehicles.",
      "Linked camera processing to REST endpoints, a database and an admin interface for gate control.",
    ],
    stack: "Python / YOLO / OpenCV / FastAPI / React / Web UI / MySQL",
    url: "https://github.com/Buigiahung1/nh-n-di-n-bi-n-s-xe-",
    linkLabel: "View source on GitHub",
  },
  gold: {
    title: "Gold Price Forecasting",
    image: "du-an/du-doan-gia-vang.png",
    role: "Full-stack development & time-series modeling",
    description:
      "A web application for exploring historical price data and time-series predictions. The interface preview uses illustrative data.",
    contributions: [
      "Built the React frontend and a FastAPI backend with asynchronous endpoints.",
      "Designed a MySQL database for historical price queries and ongoing model input.",
      "Normalized data, built time-series models in Python and validated the application logic end to end.",
    ],
    stack: "React / FastAPI / Python / Scikit-Learn / MySQL",
    url: "https://github.com/Buigiahung1/web-du-doan-gia-vang",
    linkLabel: "View source on GitHub",
  },
  learning: {
    title: "Deep Learning Practice",
    image: "du-an/hoc-sau.png",
    role: "Model experiments & evaluation",
    description:
      "A repository for practicing deep learning, from data preprocessing to training and evaluating neural networks.",
    contributions: [
      "Maintained an experimental environment for classification and regression models.",
      "Compared hyperparameters and training configurations, then evaluated the results.",
      "Used NumPy, Pandas and Matplotlib to prepare, inspect and visualize data.",
    ],
    stack: "Python / Deep Learning Frameworks / NumPy / Pandas / Matplotlib",
    url: "https://github.com/Buigiahung1/deeplearning-practice",
    linkLabel: "Explore the experiments",
  },
  portfolio: {
    title: "Personal Portfolio & CV",
    image: "du-an/ho-so-ca-nhan.png",
    role: "Frontend development & interface design",
    description:
      "A personal website that brings together my projects, academic background and contact details.",
    contributions: [
      "Organized my background and repositories into a readable personal website.",
      "Built a responsive interface with HTML, CSS and JavaScript.",
      "Added interactions for exploring project details and finding contact information.",
    ],
    stack: "HTML5 / CSS3 / JavaScript / Responsive Design",
    url: "https://github.com/Buigiahung1/portfolio-cv-IT",
    linkLabel: "View source on GitHub",
  },
};

const root = document.documentElement;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const smooth = (start, end, value) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};
const css = (element, values) => {
  for (const [key, value] of Object.entries(values)) {
    const property = `--${key}`;
    if (element.style.getPropertyValue(property) !== String(value))
      element.style.setProperty(property, value);
  }
};
const fixed = (value) => Number(value.toFixed(4));
const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* Optional preference. */
    }
  },
};
const animationsEnabled = true;
root.dataset.motion = "full";

const header = document.querySelector(".site-header");
const menu = document.querySelector("#navigation");
const menuToggle = document.querySelector(".menu-toggle");
function closeMenu(focus = false) {
  const wasOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  if (focus && wasOpen) menuToggle.focus();
}
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menu.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
menu
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", () => closeMenu()));
document.addEventListener("click", (e) => {
  if (!e.target.closest(".site-header")) closeMenu();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu(true);
});
matchMedia("(min-width: 801px)").addEventListener("change", () => closeMenu());
// Separate the visible letters once; all scroll transforms are deterministic.
const scatterLetters = [];
document.querySelectorAll("[data-scatter]").forEach((line, row) => {
  const text = line.textContent;
  line.closest("h2").setAttribute("aria-label", "Selected work");
  line.setAttribute("aria-hidden", "true");
  line.textContent = "";
  [...text].forEach((character, index) => {
    const letter = document.createElement("span");
    letter.className = "scatter-letter";
    letter.textContent = character;
    letter.setAttribute("aria-hidden", "true");
    line.append(letter);
    scatterLetters.push({
      letter,
      row,
      index,
      x: Math.sin(index * 2.3 + row) * 190,
      y: Math.cos(index * 1.8 + row) * 135,
      rotation: Math.sin(index + row * 3) * 35,
    });
  });
});
const scenes = [...document.querySelectorAll("[data-scene]")].map(
  (element) => ({
    element,
    name: element.dataset.scene,
    pin: element.querySelector(".scene-pin"),
    start: 0,
    travel: 1,
    progress: -1,
  }),
);
const sceneByName = Object.fromEntries(
  scenes.map((scene) => [scene.name, scene]),
);
const pageSections = [...document.querySelectorAll("main > section")];
const hero = document.querySelector(".hero");
const inkScenes = ["focus"].map((name) => ({
  scene: sceneByName[name],
  lines: [...sceneByName[name].element.querySelectorAll(".ink-line")],
}));
const aboutParagraphs = [...document.querySelectorAll(".about-columns > p")];
const work = document.querySelector(".work-section");
const deck = document.querySelector(".deck-content");
const cards = [...document.querySelectorAll(".project-card")];
const projectKeys = ["cold", "alpr", "gold", "learning", "portfolio"];
const shortStacks = [
  "Python / FastAPI / MySQL",
  "YOLO / OpenCV / FastAPI",
  "React / FastAPI / Scikit-Learn",
  "Python / NumPy / Pandas",
  "HTML / CSS / JavaScript",
];
const shortDescriptions = [
  "Temperature, humidity and transit monitoring.",
  "From a camera frame to a verified vehicle.",
  "Historical data and predictive models in one application.",
  "Experiments, training and model evaluation.",
  "A home for projects, background and practical work.",
];
let selectedProject = -1;
function updateProjectCaption(index) {
  if (selectedProject === index) return;
  selectedProject = index;
  const project = projectData[projectKeys[index]];
  document.querySelector("#project-title").textContent = project.title;
  document.querySelector("#project-stack").textContent = shortStacks[index];
  document.querySelector("#project-description").textContent =
    shortDescriptions[index];
  document.querySelector("#project-count").textContent =
    `${String(index + 1).padStart(2, "0")} / 05`;
}
const kineticWords = [...document.querySelectorAll(".kinetic-type > span")];
const kineticLetters = kineticWords.map((word) => {
  const text = word.dataset.word || word.textContent.trim();
  word.dataset.word = text;
  word.textContent = "";
  const letters = [...text].map((character) => {
    const letter = document.createElement("span");
    letter.className = "kinetic-letter";
    letter.dataset.letter = character;
    word.append(letter);
    return letter;
  });
  word.classList.add("letters-ready");
  return letters;
});
const practice = document.querySelector(".practice-section");
const practiceCards = [...document.querySelectorAll("[data-practice-card]")];
const practiceEntries = [...document.querySelectorAll(".practice-entry")];
const recordElements = [...document.querySelectorAll("[data-record]")];
const recordDescriptions = [
  [
    "2024 — PRESENT / THIRD YEAR",
    "Smart Logistics &\nSupply Chain Engineering",
    "University of Transport Ho Chi Minh City (UTH)",
  ],
  [
    "SEMESTER 2 / YEAR 2",
    "3.6 / 4.0 GPA",
    "High distinction academic semester achievement.",
  ],
  [
    "GOOGLE FOR EDUCATION / UNIVERSITY",
    "Gemini Certified Student",
    "Google AI knowledge and foundational skills.",
  ],
  [
    "SELECTED COURSEWORK",
    "Software, data & logistics",
    "Software engineering, databases, Smart Logistics, ITS and applied machine learning.",
  ],
];
let selectedRecord = -1;
function updateRecordCaption(index) {
  if (selectedRecord === index) return;
  selectedRecord = index;
  const [label, title, description] = recordDescriptions[index];
  document.querySelector("#record-label").textContent = label;
  const titleNode = document.querySelector("#record-title");
  titleNode.textContent = "";
  title.split("\n").forEach((line, i) => {
    if (i) titleNode.append(document.createElement("br"));
    titleNode.append(document.createTextNode(line));
  });
  document.querySelector("#record-description").textContent = description;
  document.querySelector("#record-count").textContent =
    `${String(index + 1).padStart(2, "0")} / 04`;
}
const footerLines = [...document.querySelectorAll("[data-footer-line]")];
const footerCharacters = footerLines.map((line) => {
  line
    .closest("h2")
    .setAttribute("aria-label", "Let's build something remarkable together.");
  const text = line.textContent;
  line.setAttribute("aria-hidden", "true");
  line.textContent = "";
  return [...text].map((character) => {
    const letter = document.createElement("span");
    letter.className = "footer-letter";
    letter.textContent = character === " " ? "\u00a0" : character;
    line.append(letter);
    return letter;
  });
});
const contactDetails = [
  ...document.querySelectorAll(".contact-cta, .contact-bottom"),
];
const numbers = document.querySelector(".numbers-section");
const numberItems = [...numbers.querySelectorAll(".number-item")];
const skillsSection = document.querySelector("#skills");
const stackGroups = [...skillsSection.querySelectorAll(".stack-group")];
const stackLetters = [".stack-tech", ".stack-word"].map((selector) => {
  const word = skillsSection.querySelector(selector);
  const text = word.textContent;
  word.setAttribute("aria-hidden", "true");
  word.replaceChildren();
  return [...text].map((character) => {
    const mask = document.createElement("span");
    mask.className = "stack-glyph";
    const letter = document.createElement("span");
    letter.className = "stack-letter";
    letter.textContent = character;
    mask.append(letter);
    word.append(mask);
    return letter;
  });
});
skillsSection.querySelector("h2").setAttribute("aria-label", "Tech Stack");
const stackTextLines = stackGroups.map((group) => {
  const paragraph = group.querySelector("p");
  const lines = [document.createElement("span")];
  [...paragraph.childNodes].forEach((node) => {
    if (node.nodeName === "BR") lines.push(document.createElement("span"));
    else lines.at(-1).append(node);
  });
  lines.forEach((line) => {
    line.className = "stack-text-line";
  });
  paragraph.replaceChildren(...lines);
  return lines;
});
const stackLogos = stackGroups.map((group) => [
  ...group.querySelectorAll(".skill-logos img"),
]);
const approachSection = document.querySelector("#approach");
const approachRows = [...approachSection.querySelectorAll(".approach-row")];
let motion = false;
let entranceMotion = false;
let sceneScale = 1;
let workCenterOffset = 0;
const scatterGrid = [
  [
    [-2.2, 0],
    [-2, -0.95],
    [-0.9, 0],
    [-0.6, -0.95],
    [0.05, 0],
    [0.9, -0.95],
    [2.05, 0],
    [2.2, -0.95],
  ],
  [
    [-0.9, 1],
    [-0.05, 0],
    [0.8, 1],
    [0.95, 0],
  ],
];
function measureScenes() {
  entranceMotion = animationsEnabled;
  // Keep the same scenes on short laptop windows; fit their stage to the viewport.
  sceneScale = CSS.supports("zoom", "0.8") ? Math.min(1, innerHeight / 740) : 1;
  css(root, {
    "scene-scale": fixed(sceneScale),
    "scene-height": `${innerHeight / sceneScale}px`,
  });
  const nextMode = entranceMotion && CSS.supports("position", "sticky");
  root.classList.toggle("can-animate", entranceMotion);
  motion = nextMode;
  root.classList.toggle("has-motion", motion);
  scenes.forEach((scene) => {
    scene.start = scene.element.getBoundingClientRect().top + scrollY;
    scene.travel = Math.max(
      1,
      scene.element.offsetHeight - scene.pin.getBoundingClientRect().height,
    );
    scene.progress = -1;
  });
  if (motion) {
    css(work, { "work-word-scale": 1, "work-word-y": "0px" });
    scatterLetters.forEach(({ letter }) => {
      letter.style.transform = "none";
    });
    const stageRect = sceneByName.work.pin.getBoundingClientRect();
    const lastLine = work
      .querySelector(".work-title > span:last-child")
      .getBoundingClientRect();
    workCenterOffset =
      (lastLine.top +
        lastLine.height / 2 -
        (stageRect.top + stageRect.height / 2)) /
      sceneScale;
    const unit = Math.min(140, innerWidth * 0.11);
    scatterLetters.forEach((item) => {
      const rect = item.letter.getBoundingClientRect();
      const [gx, gy] = scatterGrid[item.row][item.index];
      item.x =
        (stageRect.left +
          stageRect.width / 2 +
          gx * unit -
          rect.left -
          rect.width / 2) /
        sceneScale;
      item.y =
        (stageRect.top +
          stageRect.height * 0.46 +
          gy * unit -
          rect.top -
          rect.height / 2) /
        sceneScale;
      item.rotation = 0;
    });
  }
  if (!motion) {
    scatterLetters.forEach(({ letter }) => {
      letter.style.transform = "none";
    });
    deck.inert = false;
    cards.forEach((card) => {
      card.removeAttribute("aria-hidden");
      card.tabIndex = 0;
    });
    recordElements.forEach((record) => {
      record.removeAttribute("aria-hidden");
      record.inert = false;
    });
    practiceEntries.forEach((entry) => entry.removeAttribute("aria-hidden"));
    contactDetails.forEach((element) => {
      element.inert = false;
    });
    if (!entranceMotion)
      numberItems.forEach((item) => {
        const value = item.querySelector("[data-count]");
        value.textContent = value.dataset.count;
        item.style.setProperty("--bar-progress", 1);
      });
  }
  scheduleFrame();
}
// Entrance sequences finish even when the wheel stops. Pinned scenes retain
// scroll control, with a short settling time shared across the whole page.
const entrances = new WeakMap();
let animationPending = false;
let lastFrameTime = 0;
function entranceProgress(element, now, duration = 1400, threshold = 0.3) {
  const rect = element.getBoundingClientRect();
  if (rect.top >= innerHeight) {
    entrances.delete(element);
    return 0;
  }
  if (rect.bottom <= 0) {
    entrances.delete(element);
    return 1;
  }
  let started = entrances.get(element);
  if (started === undefined) {
    if (rect.top > innerHeight * threshold) return 0;
    started = now;
    entrances.set(element, started);
  }
  const progress = clamp((now - started) / duration);
  if (progress < 1) animationPending = true;
  return progress;
}
function updateScenes(now, delta) {
  const mobile = innerWidth <= 540;
  const compact = innerWidth <= 800;
  const heroProgress = clamp(scrollY / Math.max(1, hero.offsetHeight));
  hero.classList.toggle("is-offscreen", heroProgress >= 1);
  css(hero, {
    "hero-copy-y": `${fixed(-35 * heroProgress)}px`,
    "hero-subject-y": `${fixed(-25 * heroProgress)}px`,
  });
  if (motion) {
    scenes.forEach((scene) => {
      const target = clamp((scrollY - scene.start) / scene.travel);
      const visible =
        scrollY + innerHeight > scene.start &&
        scrollY < scene.start + scene.element.offsetHeight;
      if (scene.progress < 0 || !visible) scene.progress = target;
      else {
        scene.progress +=
          (target - scene.progress) * (1 - Math.exp(-delta / 100));
        if (Math.abs(target - scene.progress) < 0.0001) scene.progress = target;
        else animationPending = true;
      }
    });
  }
  if (entranceMotion) {
    // Reference 03.5–06s: the muted block settles sideways as one unit.
    // Reference 28–29.5s: glyph roll, gray-to-indigo, then text and diagrams.
    const frameThreshold = (header.offsetHeight + 16) / innerHeight;
    const aboutSequence = Math.max(
      entranceProgress(sceneByName.about.element, now, 1800, frameThreshold),
      motion ? smooth(0.72, 1, sceneByName.about.progress) : 0,
    );
    const settle = smooth(0.04, 0.64, aboutSequence);
    const back = 2.7;
    const easedSettle =
      1 + (back + 1) * (settle - 1) ** 3 + back * (settle - 1) ** 2;
    css(sceneByName.about.element, {
      "about-shift-x": `${fixed((1 - easedSettle) * Math.min(64, innerWidth * 0.045))}px`,
      "about-shift-y": `${fixed((1 - smooth(0.04, 0.64, aboutSequence)) * 22)}px`,
    });
    aboutParagraphs.forEach((paragraph, index) => {
      const reveal = smooth(
        0.38 + index * 0.12,
        0.8 + index * 0.12,
        aboutSequence,
      );
      paragraph.classList.toggle("is-settled", reveal === 1);
      css(paragraph, { "copy-reveal": fixed(reveal) });
    });
    const stackEntry = entranceProgress(
      skillsSection,
      now,
      1450,
      frameThreshold,
    );
    css(skillsSection, {
      "stack-color": `${fixed(smooth(0.18, 0.38, stackEntry) * 100)}%`,
      "stack-tracking": `${fixed(0.035 * (1 - smooth(0.02, 0.3, stackEntry)))}em`,
      "stack-caption": fixed(smooth(0.15, 0.4, stackEntry)),
    });
    stackLetters.forEach((letters, row) => {
      letters.forEach((letter, index) => {
        const start = row * 0.035 + index * 0.012;
        const entry = smooth(start, start + 0.19, stackEntry);
        letter.parentElement.classList.toggle("is-settled", entry === 1);
        css(letter, {
          "glyph-opacity": fixed(entry),
          "glyph-y": `${fixed((1 - entry) * (row ? 55 : 70))}%`,
          "glyph-rotation": `${fixed((1 - entry) * -75)}deg`,
        });
      });
    });
    stackGroups.forEach((group, index) => {
      const start = 0.29 + index * 0.13;
      css(group, {
        "group-label": fixed(smooth(start - 0.08, start + 0.04, stackEntry)),
        "group-draw": fixed(
          smooth(start + 0.12, Math.min(1, start + 0.38), stackEntry),
        ),
      });
      stackTextLines[index].forEach((line, lineIndex) => {
        const delay = start + lineIndex * 0.05;
        const reveal = smooth(delay, delay + 0.19, stackEntry);
        line.classList.toggle("is-settled", reveal === 1);
        css(line, { "text-reveal": fixed(reveal) });
      });
      stackLogos[index].forEach((logo, logoIndex) => {
        const delay = start + 0.12 + logoIndex * 0.02;
        css(logo, {
          "logo-reveal": fixed(
            smooth(delay, Math.min(1, delay + 0.16), stackEntry),
          ),
        });
      });
    });
    const numberProgress = Math.max(
      motion ? sceneByName.numbers.progress : 0,
      entranceProgress(numbers, now, 1900, 0.28),
    );
    numberItems.forEach((item, index) => {
      const value = item.querySelector("[data-count]");
      const target = Number(value.dataset.count);
      const progress = smooth(
        index * 0.02,
        0.48 + index * 0.02,
        numberProgress,
      );
      const display =
        target % 1
          ? (target * progress).toFixed(1)
          : String(Math.round(target * progress));
      if (value.textContent !== display) value.textContent = display;
      css(item, {
        "bar-progress": fixed(
          smooth(0.26 + index * 0.025, 0.88 + index * 0.025, numberProgress),
        ),
      });
    });
    const approachEntry = smooth(
      0.95,
      0.1,
      approachSection.getBoundingClientRect().top / innerHeight,
    );
    approachSection.querySelectorAll(".ink-line").forEach((line, index) =>
      css(line, {
        "ink-fill": `${fixed(smooth(index * 0.15, 0.5 + index * 0.15, approachEntry) * 100)}%`,
      }),
    );
    approachRows.forEach((row) => {
      const entry = smooth(
        0.98,
        0.76,
        row.getBoundingClientRect().top / innerHeight,
      );
      const drawing = Math.max(entry, entranceProgress(row, now, 1000, 0.88));
      css(row, { "row-progress": fixed(drawing) });
    });
  }
  if (motion) {
    inkScenes.forEach(({ scene, lines }) => {
      scene.entrance = entranceProgress(scene.element, now, 1500, 0.3);
      const inkProgress = Math.max(scene.progress, scene.entrance * 0.8);
      lines.forEach((line, i) =>
        css(line, {
          "ink-fill": `${fixed(smooth(i * 0.15, 0.24 + i * 0.15, inkProgress) * 100)}%`,
        }),
      );
    });
    const fp = sceneByName.focus.progress;
    const laptopEnter = Math.max(
      smooth(0.015, 0.3, fp),
      smooth(0.08, 0.8, sceneByName.focus.entrance),
    );
    const laptopExit = smooth(0.82, 1, fp);
    css(sceneByName.focus.element, {
      "laptop-opacity": fixed(laptopEnter * (1 - laptopExit * 0.9)),
      "laptop-y": `${fixed((1 - laptopEnter) * 65 - laptopExit * 30)}px`,
      "laptop-scale": fixed(1.045 - laptopEnter * 0.045 - laptopExit * 0.025),
    });
    const wp = sceneByName.work.progress;
    const assemble = Math.max(
      smooth(0.015, 0.09, wp),
      smooth(0, 1, entranceProgress(work, now, 850, 0.35)),
    );
    const zoom = smooth(0.085, 0.185, wp);
    scatterLetters.forEach(({ letter, x, y, rotation, row }) => {
      const initialScale = row ? 0.455 : 0.735;
      letter.style.transform = `translate(${fixed(x * (1 - assemble))}px,${fixed(y * (1 - assemble))}px) rotate(${fixed(rotation * (1 - assemble))}deg) scale(${fixed(initialScale + assemble * (1 - initialScale))})`;
    });
    css(work, {
      "work-word-scale": fixed(1 + zoom * 19),
      "work-word-y": `${fixed(-workCenterOffset * zoom)}px`,
      "selected-opacity": fixed(1 - smooth(0.085, 0.14, wp)),
      "work-title-opacity": fixed(1 - smooth(0.16, 0.215, wp)),
      "deck-opacity": fixed(smooth(0.135, 0.2, wp)),
      "deck-y": `${fixed((1 - smooth(0.135, 0.22, wp)) * 45)}px`,
    });
    const rawDeck = clamp((wp - 0.26) / 0.66) * 4;
    const deckStep = Math.floor(rawDeck);
    const turn = smooth(0.18, 0.82, rawDeck - deckStep);
    const deckPosition = deckStep + turn;
    const currentCard = Math.round(deckPosition);
    const deckAvailable = wp >= 0.215;
    deck.inert = !deckAvailable;
    cards.forEach((card, i) => {
      const offset = i - deckPosition;
      const distance = Math.abs(offset);
      css(card, {
        "card-x": `${fixed(Math.sin(offset * 0.4) * (mobile ? 118 : compact ? 175 : 250))}px`,
        "card-y": `${fixed(distance * 14 + offset * 4 - Math.sin(turn * Math.PI) * Math.max(0, 1 - distance) * 45)}px`,
        "card-z": `${fixed(-distance * 100)}px`,
        "card-rotation": `${fixed(offset * 8)}deg`,
        "card-rotate-y": `${fixed(clamp(offset * -17, -65, 65))}deg`,
        "card-scale": fixed(Math.max(0.66, 1 - distance * 0.075)),
        "card-opacity": distance > 3.6 ? 0 : 1,
        "card-order": 100 - Math.round(distance * 10),
      });
      card.tabIndex = i === currentCard && deckAvailable ? 0 : -1;
      card.setAttribute(
        "aria-hidden",
        String(i !== currentCard || !deckAvailable),
      );
    });
    updateProjectCaption(currentCard);
    const kp = sceneByName.kinetic.progress * 4.3 - 0.3;
    kineticWords.forEach((word, i) => {
      const relative = kp - i;
      const enter = smooth(-0.6, 0.12, relative);
      const exit = smooth(0.25, 1, relative);
      const opacity =
        smooth(-0.58, -0.12, relative) * (1 - smooth(0.75, 0.97, relative));
      const direction = [-1, -0.4, 1, 0][i];
      css(word, {
        "word-opacity": fixed(opacity),
        "word-x": `${fixed(direction * innerWidth * 0.16 * exit)}px`,
        "word-z": `${fixed(relative < 0 ? -500 * (1 - enter) : Math.min(820, relative * 850))}px`,
        "word-rotate-y": `${fixed((1 - enter) * -22 + exit * direction * 10)}deg`,
        "word-scale": fixed(0.65 + enter * 0.35),
      });
      kineticLetters[i].forEach((letter, index) => {
        letter.style.transform = `translateY(${fixed((index % 2 ? -1 : 1) * 25 * (1 - enter))}px) rotate(${fixed((index - 2) * 8 * (1 - enter))}deg)`;
      });
    });
    css(sceneByName.kinetic.element, {
      "kinetic-pan": `${fixed(sceneByName.kinetic.progress * innerWidth * 0.13)}px`,
    });
    const pp = sceneByName.practice.progress;
    const practicePosition = clamp(pp / 0.73) * 3;
    const summary = smooth(0.79, 0.94, pp);
    css(practice, {
      "summary-opacity": fixed(summary),
      "summary-y": `${fixed((1 - summary) * 30)}px`,
      "practice-detail-opacity": fixed(1 - summary),
    });
    practiceEntries.forEach((entry, i) => {
      const current = Math.round(practicePosition);
      css(entry, {
        "entry-opacity": i === current ? 1 : 0,
        "entry-y": `${i === current ? 0 : i < current ? -18 : 18}px`,
      });
      entry.setAttribute(
        "aria-hidden",
        String(i !== Math.round(practicePosition) || summary > 0.5),
      );
    });
    practiceCards.forEach((card, i) => {
      const mapped = [0, 1, 2, 2.5, 3][i];
      const offset = mapped - practicePosition;
      const fanOffset = i - 2;
      const x =
        offset * (mobile ? 31 : 50) * (1 - summary) +
        fanOffset * (mobile ? 30 : 56) * summary;
      const rotation = offset * 10 * (1 - summary) + fanOffset * 10 * summary;
      css(card, {
        "practice-x": `${fixed(x)}px`,
        "practice-y": `${fixed(Math.abs(offset) * 9 * (1 - summary) + Math.abs(fanOffset) * 7 * summary)}px`,
        "practice-rotation": `${fixed(rotation)}deg`,
        "practice-rotate-y": `${fixed(offset * -12 * (1 - summary))}deg`,
        "practice-scale": fixed(
          1 - Math.min(3, Math.abs(offset)) * 0.08 - summary * 0.12,
        ),
        "practice-order": 100 - Math.round(Math.abs(offset) * 10),
        "practice-opacity": 1,
      });
    });
    const ep = sceneByName.education.progress;
    const recordPosition = clamp((ep - 0.05) / 0.73) * 3;
    const recordFan = smooth(0.86, 1, ep);
    const currentRecord = Math.round(recordPosition);
    css(sceneByName.education.element, {
      "education-note-opacity": fixed(smooth(0.88, 0.98, ep)),
    });
    recordElements.forEach((record, i) => {
      const offset = i - recordPosition;
      const distance = Math.abs(offset);
      css(record, {
        "record-x": `${fixed(offset * (mobile ? 9 : 23) * (1 - recordFan) + (i % 2 ? 1 : -1) * (mobile ? 70 : 115) * recordFan)}px`,
        "record-y": `${fixed(offset * (mobile ? 42 : 90) * (1 - recordFan) + (i < 2 ? -1 : 1) * (mobile ? 78 : 115) * recordFan)}px`,
        "record-rotation": `${fixed(offset * -5.5 * (1 - recordFan) + [-7, 5, 4, -6][i] * recordFan)}deg`,
        "record-scale": fixed(
          Math.max(0.75, 1 - distance * 0.07) * (1 - recordFan) +
            0.48 * recordFan,
        ),
        "record-opacity": recordFan > 0.1 || distance <= 1.55 ? 1 : 0,
        "record-order": 100 - Math.round(distance * 10),
      });
      record.inert = recordFan < 0.75 && i !== currentRecord;
      record.setAttribute(
        "aria-hidden",
        String(recordFan < 0.75 && i !== currentRecord),
      );
    });
    updateRecordCaption(currentRecord);
    const cp = sceneByName.contact.progress;
    css(sceneByName.contact.element, {
      "contact-curve": `${fixed((1 - smooth(0, 0.27, cp)) * innerWidth * 0.65)}px`,
      "contact-details": fixed(smooth(0.62, 0.85, cp)),
    });
    footerCharacters.forEach((line, i) => {
      line.forEach((letter, index) => {
        const delay = i * 0.08 + index * 0.004;
        const enter = smooth(0.28 + delay, 0.44 + delay, cp);
        css(letter, {
          "footer-x": `${fixed((1 - enter) * (index - line.length / 2) * 5)}px`,
          "footer-y": `${fixed((1 - enter) * 65)}px`,
          "footer-rotation": `${fixed((1 - enter) * (index % 2 ? 9 : -9))}deg`,
          "footer-opacity": fixed(enter),
        });
      });
    });
    contactDetails.forEach((element) => {
      element.inert = cp < 0.62;
    });
  }
  header.classList.toggle("scrolled", scrollY > 20);
  let active = "home";
  let darkHeader = false;
  for (const section of pageSections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= innerHeight * 0.34) active = section.id || active;
    if (rect.top <= 70 && rect.bottom > 70)
      darkHeader =
        section.classList.contains("dark-section") || section.id === "contact";
  }
  header.classList.toggle("is-dark", darkHeader);
  menu.querySelectorAll("a").forEach((link) => {
    if (link.hash === `#${active}`)
      link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

// Pointer motion is eased on demand; the frame loop stops once it has settled.
const pointerJobs = new Map();
let frame = 0;
let scrollDirty = true;
function scheduleFrame() {
  scrollDirty = true;
  if (!frame) frame = requestAnimationFrame(renderFrame);
}
function renderFrame(now) {
  frame = 0;
  const delta = lastFrameTime ? Math.min(48, now - lastFrameTime) : 16.7;
  lastFrameTime = now;
  if (scrollDirty || animationPending) {
    scrollDirty = false;
    animationPending = false;
    updateScenes(now, delta);
  }
  let moving = animationPending;
  pointerJobs.forEach((job) => {
    for (const key of ["x", "y"])
      job.current[key] += (job.target[key] - job.current[key]) * 0.16;
    const { x, y } = job.current;
    css(job.element, {
      "pointer-x": `${fixed(x * job.distance)}px`,
      "pointer-y": `${fixed(y * job.distance * 0.6)}px`,
      "tilt-x": `${fixed(y * -5)}deg`,
      "tilt-y": `${fixed(x * 7)}deg`,
      "pointer-scale": 1,
    });
    if (Math.abs(x - job.target.x) + Math.abs(y - job.target.y) > 0.002)
      moving = true;
  });
  if (moving && !frame) frame = requestAnimationFrame(renderFrame);
  else if (!frame) lastFrameTime = 0;
}
function addTilt(element, distance) {
  const job = {
    element,
    distance,
    current: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
  };
  pointerJobs.set(element, job);
  element.addEventListener("pointermove", (event) => {
    if (
      !entranceMotion ||
      !finePointer.matches ||
      event.pointerType === "touch"
    )
      return;
    const rect = element.getBoundingClientRect();
    job.target = {
      x: clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1),
      y: clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1),
    };
    if (!frame) frame = requestAnimationFrame(renderFrame);
  });
  element.addEventListener("pointerleave", () => {
    job.target = { x: 0, y: 0 };
    if (!frame) frame = requestAnimationFrame(renderFrame);
  });
}
addTilt(document.querySelector("[data-tilt]"), 5);
addTilt(document.querySelector(".work-portrait"), 5);
cards.forEach((card) => addTilt(card, 8));
recordElements.forEach((record) => addTilt(record, 5));
const portraitMotion = document.querySelector("#portrait-motion");
let portraitPaused = false;
function syncPortraitMotion() {
  hero.dataset.idle = portraitPaused ? "paused" : "running";
  portraitMotion.setAttribute("aria-pressed", String(portraitPaused));
  const label = portraitPaused
    ? "Resume portrait animation"
    : "Pause portrait animation";
  portraitMotion.setAttribute("aria-label", label);
  portraitMotion.title = label;
  portraitMotion
    .querySelector("path")
    .setAttribute("d", portraitPaused ? "M7 4l8 6-8 6V4Z" : "M7 5v10m6-10v10");
}
portraitMotion.addEventListener("click", () => {
  portraitPaused = !portraitPaused;
  syncPortraitMotion();
});
syncPortraitMotion();
document.addEventListener("visibilitychange", () =>
  root.classList.toggle("motion-suspended", document.hidden),
);
hero.addEventListener("pointermove", (event) => {
  if (!entranceMotion || !finePointer.matches) return;
  const rect = hero.getBoundingClientRect();
  css(hero, {
    "room-x": `${fixed((event.clientX / innerWidth - 0.5) * -16)}px`,
    "room-y": `${fixed(((event.clientY - rect.top) / rect.height - 0.5) * -10)}px`,
  });
});
hero.addEventListener("pointerleave", () =>
  css(hero, { "room-x": "0px", "room-y": "0px" }),
);
function goToScenePosition(name, value) {
  const scene = sceneByName[name];
  if (!motion) {
    scene.element.scrollIntoView({ behavior: "smooth" });
    return;
  }
  scrollTo({ top: scene.start + scene.travel * value, behavior: "smooth" });
}
function goToProject(index) {
  const next = (index + cards.length) % cards.length;
  if (motion) goToScenePosition("work", 0.26 + (0.66 * next) / 4);
  else {
    updateProjectCaption(next);
    cards[next].focus();
  }
}
document
  .querySelector("#project-prev")
  .addEventListener("click", () => goToProject(selectedProject - 1));
document
  .querySelector("#project-next")
  .addEventListener("click", () => goToProject(selectedProject + 1));
document.querySelector(".project-deck").addEventListener("keydown", (event) => {
  const indices = {
    ArrowLeft: selectedProject - 1,
    ArrowRight: selectedProject + 1,
    Home: 0,
    End: 4,
  };
  if (event.key in indices) {
    event.preventDefault();
    goToProject(indices[event.key]);
  }
});
function goToRecord(index) {
  const next = (index + 4) % 4;
  if (motion) goToScenePosition("education", 0.05 + (0.73 * next) / 3);
  else {
    updateRecordCaption(next);
    recordElements[next].scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }
}
document
  .querySelector("#record-prev")
  .addEventListener("click", () => goToRecord(selectedRecord - 1));
document
  .querySelector("#record-next")
  .addEventListener("click", () => goToRecord(selectedRecord + 1));
document.querySelectorAll('a[href="#contact"]').forEach((link) =>
  link.addEventListener("click", (event) => {
    if (!motion) return;
    event.preventDefault();
    goToScenePosition("contact", 0.9);
  }),
);

const revealElements = [...document.querySelectorAll(".reveal")];
if ("IntersectionObserver" in window && animationsEnabled) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("pending");
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }),
    { threshold: 0.08, rootMargin: "0px 0px -15px 0px" },
  );
  revealElements.forEach((element, i) => {
    element.classList.add("pending");
    element.style.transitionDelay = `${(i % 2) * 70}ms`;
    observer.observe(element);
  });
}
window.addEventListener("scroll", scheduleFrame, { passive: true });
window.addEventListener("resize", measureScenes);
window.addEventListener("pageshow", measureScenes);
window.addEventListener("load", measureScenes);
document.fonts.ready.then(measureScenes);
updateProjectCaption(0);
updateRecordCaption(0);
measureScenes();
document.querySelector("#current-year").textContent = new Date().getFullYear();

// Project details and contact drafts stay functional when index.html is opened.
const projectDialog = document.querySelector("#project-dialog");
const contactDialog = document.querySelector("#contact-dialog");
const certificateDialog = document.querySelector("#certificate-dialog");
const dialogOpeners = new WeakMap();
function showDialog(dialog, opener) {
  closeMenu();
  dialogOpeners.set(dialog, opener);
  dialog.showModal();
  document.body.style.overflow = "hidden";
}
function textElement(tag, className, content) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = content;
  return element;
}
function openProject(key, opener) {
  const project = projectData[key];
  if (!project) return;
  const content = document.querySelector("#project-detail-content");
  const image = document.createElement("img");
  image.className = "dialog-image";
  image.src = `tai-nguyen/hinh-anh/${project.image}`;
  image.alt = `${project.title} interface preview`;
  image.width = 960;
  image.height = 620;
  const heading = textElement("h2", "dialog-title", project.title);
  heading.id = "dialog-title";
  const list = document.createElement("ul");
  list.className = "dialog-contributions";
  project.contributions.forEach((point) =>
    list.append(textElement("li", "", point)),
  );
  const link = document.createElement("a");
  link.className = "dialog-link";
  link.href = project.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = `${project.linkLabel} ↗`;
  content.replaceChildren(
    image,
    heading,
    textElement("p", "dialog-role", project.role),
    textElement("p", "dialog-description", project.description),
    list,
    textElement("p", "dialog-stack", project.stack),
    link,
  );
  if (project.note)
    content.append(textElement("p", "dialog-source", project.note));
  showDialog(projectDialog, opener);
}
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-project]");
  if (!button) return;
  const index = Number(button.dataset.card);
  if (motion && button.hasAttribute("data-card") && index !== selectedProject)
    goToProject(index);
  else openProject(button.dataset.project, button);
});
document
  .querySelector("#project-open")
  .addEventListener("click", (event) =>
    openProject(projectKeys[selectedProject], event.currentTarget),
  );
document
  .querySelector("#close-project")
  .addEventListener("click", () => projectDialog.close());
document
  .querySelector("#open-contact")
  .addEventListener("click", (event) =>
    showDialog(contactDialog, event.currentTarget),
  );
document
  .querySelector("#close-contact")
  .addEventListener("click", () => contactDialog.close());
document.querySelectorAll("[data-certificate]").forEach((button) => {
  button.addEventListener("click", () => showDialog(certificateDialog, button));
});
document
  .querySelector("#close-certificate")
  .addEventListener("click", () => certificateDialog.close());
[projectDialog, contactDialog, certificateDialog].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.style.overflow = "";
    dialogOpeners.get(dialog)?.focus({ preventScroll: true });
    measureScenes();
  });
});

let toastTimeout;
function notify(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("visible"), 3500);
}
async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    notify(successMessage);
  } catch {
    const temporary = document.createElement("textarea");
    temporary.value = text;
    temporary.style.cssText = "position:fixed;left:-9999px;top:0";
    // Keep the fallback inside an open modal so focus is not blocked by inertness.
    const parent = document.querySelector("dialog[open]") || document.body;
    parent.append(temporary);
    temporary.select();
    const copied = document.execCommand("copy");
    temporary.remove();
    notify(
      copied
        ? successMessage
        : "Could not copy. Save a draft instead, or contact 0335 883 437.",
    );
  }
}
document
  .querySelector("#copy-phone")
  .addEventListener("click", () =>
    copyText("0335883437", "Phone number copied"),
  );

// No fictitious email address or simulated delivery. A validated draft can be
// copied to the supplied Zalo contact or downloaded locally by the visitor.
const form = document.querySelector("#contact-form");
const result = document.querySelector("#form-result");
const formFields = [...form.querySelectorAll("input, textarea")];
let messageDraft = "";
function validateField(field) {
  const value = field.value.trim();
  let error = "";
  if (!value) error = "Please fill in this field";
  else if (field.name === "name" && value.length < 2)
    error = "Please enter at least 2 characters";
  else if (
    field.name === "email" &&
    (!field.validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
  )
    error = "Please enter a valid email address";
  else if (field.name === "message" && value.length < 10)
    error = "Please add a little more detail (at least 10 characters)";
  else if (field.maxLength > 0 && value.length > field.maxLength)
    error = `Please keep this under ${field.maxLength} characters`;
  document.querySelector(`#${field.id}-error`).textContent = error;
  field.setAttribute("aria-invalid", String(Boolean(error)));
  return !error;
}
formFields.forEach((field) =>
  field.addEventListener("input", () => {
    messageDraft = "";
    result.hidden = true;
    if (field.hasAttribute("aria-invalid")) validateField(field);
  }),
);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const valid = formFields.map(validateField);
  if (valid.includes(false)) {
    result.hidden = true;
    formFields[valid.indexOf(false)].focus();
    return;
  }
  messageDraft = `Hi Hung,\n\nMy name is ${form.elements.name.value.trim()}.\nContact email: ${form.elements.email.value.trim()}\n\n${form.elements.message.value.trim()}\n`;
  document.querySelector("#download-message").href =
    `data:text/plain;charset=utf-8,${encodeURIComponent("\uFEFF" + messageDraft)}`;
  result.hidden = false;
  result.scrollIntoView({
    block: "nearest",
    behavior: "instant",
  });
});
document.querySelector("#copy-message").addEventListener("click", () => {
  if (messageDraft)
    copyText(messageDraft, "Message copied. You can paste it into Zalo");
});
