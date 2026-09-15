// Project pages always open at the hero, including when restored from history.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
const openAtTop = () => window.scrollTo(0, 0);
openAtTop();
window.addEventListener("pageshow", openAtTop);

const competitors = [
  {
    name: "Daylio",
    image: "Competitor Analysis/Daylio.svg",
    description: "Daylio is a mood-tracking and journaling app that helps users record their emotions and daily activities, identify patterns over time, and gain insights into their mental well-being.",
    strengths: ["Visual emotion icons & intuitive logging", "High customization for daily habits", "Clear monthly data visualizations", "Playful, friendly micro-interactions"],
    weaknesses: ["Does not explain psychological root causes", "Early paywall blocks key insights", "No empathetic AI chat or guided reflection", "Rigid streak counters trigger user guilt"]
  },
  {
    name: "Moodfit",
    image: "Competitor Analysis/Moodfit.svg",
    description: "Moodfit combines mood tracking with breathing, mindfulness and wellness exercises to help users build healthier emotional habits.",
    strengths: ["Tracks several wellness variables", "Includes CBT-inspired exercises", "Clear progress visualizations", "Useful educational content"],
    weaknesses: ["Dense dashboard-style interface", "Limited personal guidance", "No conversational reflection", "Important insights require effort"]
  },
  {
    name: "Wysa",
    image: "Competitor Analysis/Wysa.svg",
    description: "Wysa offers conversational mental wellness support through an empathetic AI companion and a library of guided self-care tools.",
    strengths: ["Always-available chat support", "CBT and DBT exercises", "Friendly conversational tone", "Optional therapist connection"],
    weaknesses: ["Conversation can feel scripted", "Limited long-term memory", "Few visual mood insights", "Personalization remains shallow"]
  },
  {
    name: "Calm",
    image: "Competitor Analysis/Calm.svg",
    description: "Calm is a mindfulness and wellness app centered on meditation, relaxation, sleep stories and high-quality audio content.",
    strengths: ["Polished, calming interface", "Excellent audio library", "Strong content variety", "Trusted wellness brand"],
    weaknesses: ["No root-cause mood analysis", "Mostly passive consumption", "Limited emotional journaling", "Premium content is costly"]
  },
  {
    name: "Happify",
    image: "Competitor Analysis/Happify.svg",
    description: "Happify uses positive psychology, games and guided activities to help users manage negative thoughts and build positive habits.",
    strengths: ["Engaging gamified activities", "Science-informed programs", "Easy activities to start", "Positive, friendly tone"],
    weaknesses: ["No deep mood insights", "Long onboarding", "Game format is not universal", "Limited contextual reflection"]
  },
  {
    name: "Woebot",
    image: "Competitor Analysis/Woebot.svg",
    description: "Woebot is a mental health chatbot that uses evidence-based psychological techniques and guided exercises to support emotional reflection.",
    strengths: ["24/7 conversational check-ins", "Structured CBT framework", "Short learning exercises", "Quick emotional support"],
    weaknesses: ["Rigid scripted pathways", "Limited conversational memory", "No rich mood dashboard", "Less useful for complex needs"]
  }
];

const dots = document.getElementById("competitor-dots");
const nameEl = document.getElementById("competitor-name");
const descriptionEl = document.getElementById("competitor-description");
const imageEl = document.getElementById("competitor-image");
const strengthsEl = document.getElementById("competitor-strengths");
const weaknessesEl = document.getElementById("competitor-weaknesses");
const competitorStop = document.getElementById("competitor-stop");
const competitorNext = document.getElementById("competitor-next");
const competitorDynamic = document.getElementById("competitor-dynamic");
const competitorProgressBar = document.getElementById("competitor-progress-bar");
const competitorDuration = 6500;
let currentCompetitor = 0;
let competitorTimer = null;
let competitorPaused = false;
let competitorTransition = null;
let competitorRemaining = competitorDuration;
let competitorProgressStartedAt = null;

function renderCompetitor(index) {
  currentCompetitor = index;
  const item = competitors[currentCompetitor];
  nameEl.textContent = item.name;
  descriptionEl.textContent = item.description;
  imageEl.src = item.image;
  imageEl.alt = item.name + " mobile app";
  strengthsEl.innerHTML = item.strengths.map(value => `<li>${value}</li>`).join("");
  weaknessesEl.innerHTML = item.weaknesses.map(value => `<li>${value}</li>`).join("");
  [...dots.children].forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === currentCompetitor));
}

function restartCompetitorProgress() {
  competitorRemaining = competitorDuration;
  competitorProgressStartedAt = competitorPaused ? null : performance.now();
  competitorProgressBar.classList.remove("running");
  competitorProgressBar.style.animationPlayState = "running";
  void competitorProgressBar.offsetWidth;
  if (!competitorPaused) competitorProgressBar.classList.add("running");
}

function setStopButtonMode(isPaused) {
  competitorStop.innerHTML = isPaused
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 6 9 6-9 6z"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6v12M16 6v12"/></svg>';
  competitorStop.title = isPaused ? "Play" : "Stop";
  competitorStop.setAttribute("aria-label", isPaused ? "Resume automatic competitor slideshow" : "Stop automatic competitor slideshow");
}

function selectCompetitor(index, restartTimer = true, dissolve = true) {
  const nextIndex = (index + competitors.length) % competitors.length;
  clearTimeout(competitorTransition);
  restartCompetitorProgress();

  if (!dissolve) {
    renderCompetitor(nextIndex);
  } else {
    competitorDynamic.classList.add("is-dissolving");
    imageEl.classList.add("is-dissolving");
    competitorTransition = setTimeout(() => {
      renderCompetitor(nextIndex);
      requestAnimationFrame(() => {
        competitorDynamic.classList.remove("is-dissolving");
        imageEl.classList.remove("is-dissolving");
      });
    }, 280);
  }

  currentCompetitor = nextIndex;
  if (restartTimer && !competitorPaused) startCompetitorTimer();
}

function startCompetitorTimer(resume = false) {
  clearTimeout(competitorTimer);
  const delay = resume ? competitorRemaining : competitorDuration;

  if (resume) {
    if (!competitorProgressBar.classList.contains("running")) {
      void competitorProgressBar.offsetWidth;
      competitorProgressBar.classList.add("running");
    }
    competitorProgressStartedAt = performance.now();
    competitorProgressBar.style.animationPlayState = "running";
  } else {
    restartCompetitorProgress();
  }

  competitorTimer = setTimeout(() => selectCompetitor(currentCompetitor + 1, false), delay);
  setStopButtonMode(false);
}

competitors.forEach((competitor, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = index === 0 ? "active" : "";
  dot.setAttribute("aria-label", `View ${competitor.name}`);
  dot.addEventListener("click", () => selectCompetitor(index));
  dots.appendChild(dot);
});

competitorStop.addEventListener("click", () => {
  if (competitorPaused) {
    competitorPaused = false;
    startCompetitorTimer(true);
    return;
  }

  competitorPaused = true;
  if (competitorProgressStartedAt !== null) {
    competitorRemaining = Math.max(0, competitorRemaining - (performance.now() - competitorProgressStartedAt));
    competitorProgressStartedAt = null;
  }
  clearTimeout(competitorTimer);
  competitorTimer = null;
  competitorProgressBar.style.animationPlayState = "paused";
  setStopButtonMode(true);
});

competitorNext.addEventListener("click", () => selectCompetitor(currentCompetitor + 1));
selectCompetitor(0, false, false);
startCompetitorTimer();

const entryParam = new URLSearchParams(window.location.search).get("from");
let entryPoint = entryParam === "home" || entryParam === "works" ? entryParam : "works";

if (!entryParam && document.referrer) {
  try {
    const referrerPath = new URL(document.referrer).pathname;
    entryPoint = referrerPath.endsWith("/work.html") ? "works" : "home";
  } catch (_) {}
}

const navHome = document.getElementById("nav-home");
const navWorks = document.getElementById("nav-works");
const backLink = document.getElementById("back-link");
if (entryPoint === "home") {
  navHome.setAttribute("aria-current", "page");
  navWorks.removeAttribute("aria-current");
} else {
  navWorks.setAttribute("aria-current", "page");
  navHome.removeAttribute("aria-current");
}
if (backLink) backLink.href = entryPoint === "home" ? "../../index.html" : "../../work.html";

const contentNavLinks = [...document.querySelectorAll(".content-nav a")];
const contentSections = contentNavLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActiveContentSection(sectionId) {
  contentNavLinks.forEach(link => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    if (isActive) {
      link.setAttribute("aria-current", "location");
      const track = link.closest(".content-nav-track");
      if (track) {
        track.scrollTo({ left: link.offsetLeft - (track.clientWidth - link.clientWidth) / 2, behavior: "smooth" });
      }
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if (contentSections.length) {
  setActiveContentSection(contentSections[0].id);
  const contentSectionObserver = new IntersectionObserver(entries => {
    const visibleSection = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visibleSection) setActiveContentSection(visibleSection.target.id);
  }, { rootMargin: "-18% 0px -62%", threshold: [0, .15, .35, .6] });
  contentSections.forEach(section => contentSectionObserver.observe(section));
}

const ambientStarPatterns = [
  [["✧", -4, 18, 10, "soft-green"], ["✦", 104, 34, 12, "soft-coral"], ["⋆", -3, 62, 9, ""], ["★", 103, 84, 8, "soft-green"]],
  [["✦", 104, 16, 9, "soft-coral"], ["✧", -4, 39, 12, "soft-green"], ["★", 103, 66, 8, ""], ["⋆", -3, 88, 10, "soft-coral"]],
  [["⋆", -4, 15, 9, "soft-green"], ["★", 104, 38, 8, "soft-coral"], ["✧", -3, 64, 12, ""], ["✦", 103, 86, 10, "soft-green"]],
  [["★", 104, 13, 8, "soft-coral"], ["⋆", -4, 35, 10, "soft-green"], ["✦", 103, 61, 11, ""], ["✧", -3, 87, 9, "soft-coral"]],
  [["✧", -4, 17, 11, "soft-green"], ["★", 104, 41, 8, "soft-coral"], ["⋆", -3, 68, 9, ""], ["✦", 103, 88, 11, "soft-green"]],
  [["✦", 104, 15, 10, "soft-coral"], ["✧", -4, 43, 12, "soft-green"], ["★", 103, 70, 8, ""], ["⋆", -3, 89, 9, "soft-coral"]],
  [["⋆", -4, 10, 9, "soft-green"], ["✦", 104, 25, 11, "soft-coral"], ["✧", -3, 40, 10, ""], ["★", 103, 56, 8, "soft-green"], ["⋆", -4, 72, 10, "soft-coral"], ["✦", 104, 89, 9, ""]],
  [["★", 104, 16, 8, "soft-coral"], ["✧", -4, 38, 11, "soft-green"], ["⋆", 103, 65, 9, ""], ["✦", -3, 87, 10, "soft-coral"]]
];

document.querySelectorAll(".hero, .section").forEach((section, sectionIndex) => {
  const pattern = ambientStarPatterns[sectionIndex] || ambientStarPatterns[0];
  pattern.forEach(([symbol, left, top, size, tone], starIndex) => {
    const star = document.createElement("span");
    star.className = `star ambient-star ${tone}`.trim();
    star.textContent = symbol;
    star.setAttribute("aria-hidden", "true");
    star.style.left = `${left}%`;
    star.style.top = `${top}%`;
    star.style.setProperty("--star-size", `${size}px`);
    star.style.setProperty("--star-speed", `${4.2 + ((sectionIndex + starIndex) % 4) * .55}s`);
    star.style.setProperty("--star-delay", `${-(sectionIndex * .63 + starIndex * 1.17)}s`);
    section.appendChild(star);
  });
});

const prototypeVideos = [...document.querySelectorAll(".prototype-video")];
const featureItems = [...document.querySelectorAll(".feature-item")];
const featureList = document.getElementById("feature-list");
let activeVideoIndex = 0;
let currentFeatureIndex = 0;
let featureTransitionId = 0;
let featureProgressFrame = 0;

function renderFeatureProgress() {
  const video = prototypeVideos[activeVideoIndex];
  const progress = video.duration ? Math.min(video.currentTime / video.duration, 1) : 0;
  featureItems[currentFeatureIndex].querySelector(".feature-progress span").style.transform = `scaleX(${progress})`;
}

function startFeatureProgress() {
  cancelAnimationFrame(featureProgressFrame);
  const update = () => {
    renderFeatureProgress();
    const video = prototypeVideos[activeVideoIndex];
    if (!video.paused && !video.ended) featureProgressFrame = requestAnimationFrame(update);
  };
  featureProgressFrame = requestAnimationFrame(update);
}

function arrangeFeatureItems(index) {
  const previousPositions = new Map(
    featureItems.map(item => [item, item.getBoundingClientRect()])
  );

  for (let offset = 0; offset < featureItems.length; offset += 1) {
    featureList.append(featureItems[(index + offset) % featureItems.length]);
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  featureItems.forEach(item => {
    const previousPosition = previousPositions.get(item);
    const currentPosition = item.getBoundingClientRect();
    const offsetX = previousPosition.left - currentPosition.left;
    const offsetY = previousPosition.top - currentPosition.top;
    if (!offsetX && !offsetY) return;

    item.getAnimations().forEach(animation => animation.cancel());
    item.animate(
      [
        { transform: `translate(${offsetX}px, ${offsetY}px)`, zIndex: 2 },
        { transform: "translate(0, 0)", zIndex: 2 }
      ],
      { duration: 620, easing: "cubic-bezier(.2, .9, .25, 1)", fill: "both" }
    );
  });
}

function selectFeature(index, autoplay = true) {
  const item = featureItems[index];
  const transitionId = ++featureTransitionId;
  featureItems.forEach((button, buttonIndex) => button.classList.toggle("active", buttonIndex === index));
  featureItems.forEach(button => {
    if (button !== item) button.querySelector(".feature-progress span").style.transform = "scaleX(0)";
  });
  arrangeFeatureItems(index);

  const currentVideo = prototypeVideos[activeVideoIndex];
  if (index === currentFeatureIndex && currentVideo.currentSrc) {
    currentVideo.currentTime = 0;
    if (autoplay) currentVideo.play().catch(() => {});
    return;
  }

  const nextVideoIndex = activeVideoIndex === 0 ? 1 : 0;
  const nextVideo = prototypeVideos[nextVideoIndex];
  nextVideo.classList.remove("is-active");
  nextVideo.src = item.dataset.video;
  nextVideo.load();

  const revealNextVideo = () => {
    if (transitionId !== featureTransitionId) return;
    nextVideo.currentTime = 0;
    const playback = autoplay ? nextVideo.play() : Promise.resolve();
    playback.catch(() => {}).finally(() => {
      if (transitionId !== featureTransitionId) return;
      nextVideo.classList.add("is-active");
      currentVideo.classList.remove("is-active");
      activeVideoIndex = nextVideoIndex;
      currentFeatureIndex = index;
      startFeatureProgress();
      setTimeout(() => currentVideo.pause(), 340);
    });
  };

  if (nextVideo.readyState >= 2) revealNextVideo();
  else nextVideo.addEventListener("loadeddata", revealNextVideo, { once: true });
}

featureItems.forEach((item, index) => {
  item.addEventListener("click", () => selectFeature(index));
  item.addEventListener("keydown", event => {
    if (event.target !== item) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    selectFeature(index);
  });

  item.querySelector(".feature-stop").addEventListener("click", event => {
    event.stopPropagation();
    if (!item.classList.contains("active")) return;
    const activeVideo = prototypeVideos[activeVideoIndex];
    if (activeVideo.paused) activeVideo.play().catch(() => {});
    else activeVideo.pause();
  });
});
prototypeVideos.forEach(video => {
  const syncPlaybackButton = () => {
    if (!video.classList.contains("is-active")) return;
    const button = featureItems[currentFeatureIndex].querySelector(".feature-stop");
    const isPaused = video.paused;
    button.querySelector("span").textContent = "";
    button.classList.toggle("is-play", isPaused);
    button.setAttribute("aria-label", `${isPaused ? "Play" : "Pause"} ${featureItems[currentFeatureIndex].querySelector("h3").textContent} video`);
    button.title = isPaused ? "Play" : "Pause";
  };

  video.addEventListener("play", syncPlaybackButton);
  video.addEventListener("play", startFeatureProgress);
  video.addEventListener("pause", () => {
    syncPlaybackButton();
    if (!video.classList.contains("is-active")) return;
    cancelAnimationFrame(featureProgressFrame);
    renderFeatureProgress();
  });

  video.addEventListener("ended", () => {
  if (!video.classList.contains("is-active")) return;
  const completedItem = featureItems[currentFeatureIndex];
  completedItem.querySelector(".feature-progress span").style.transform = "scaleX(1)";
  selectFeature((currentFeatureIndex + 1) % featureItems.length);
  });
});

prototypeVideos[0].addEventListener("loadeddata", () => {
  prototypeVideos[0].currentTime = 0;
  prototypeVideos[0].play().catch(() => {});
});
if (prototypeVideos[0].readyState >= 2) prototypeVideos[0].play().catch(() => {});
