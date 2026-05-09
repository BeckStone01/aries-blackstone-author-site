const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("[data-site-header]");
const scrollTop = document.querySelector("[data-scroll-top]");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const revealItems = document.querySelectorAll(".reveal");
const characterImage = document.querySelector(".character-image");
const characterButtons = document.querySelectorAll("[data-character-src]");
let characterResetTimer;

document.body.classList.add("is-ready");

const updateChrome = () => {
  const scrolled = window.scrollY > 18;
  header?.classList.toggle("is-scrolled", scrolled);
  scrollTop?.classList.toggle("is-visible", window.scrollY > 620);
};

const updateParallax = () => {
  if (prefersReducedMotion) return;

  const viewportHeight = window.innerHeight;

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax || 0);
    const rect = item.getBoundingClientRect();
    const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
    const clamped = Math.max(0, Math.min(1, progress));
    const offset = (clamped - 0.5) * speed * 120;

    item.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const resetCharacter = () => {
  if (!characterImage) return;

  const defaultSrc = characterImage.dataset.defaultSrc;
  const defaultAlt = characterImage.dataset.defaultAlt;

  window.clearTimeout(characterResetTimer);

  characterButtons.forEach((item) => {
    item.classList.remove("is-selected");
    item.setAttribute("aria-pressed", "false");
  });

  if (!defaultSrc || characterImage.getAttribute("src") === defaultSrc) return;

  characterImage.classList.add("is-changing");

  window.setTimeout(() => {
    characterImage.src = defaultSrc;
    characterImage.alt = defaultAlt || "";
    characterImage.classList.remove("is-changing");
  }, prefersReducedMotion ? 0 : 180);
};

const scheduleCharacterReset = () => {
  window.clearTimeout(characterResetTimer);
  characterResetTimer = window.setTimeout(resetCharacter, 5000);
};

const showCharacter = (button) => {
  if (!characterImage || !button) return;

  const src = button.dataset.characterSrc;
  const alt = button.dataset.characterAlt;

  if (!src) return;

  characterButtons.forEach((item) => {
    item.classList.toggle("is-selected", item === button);
    item.setAttribute("aria-pressed", item === button ? "true" : "false");
  });

  scheduleCharacterReset();

  if (characterImage.getAttribute("src") === src) return;

  characterImage.classList.add("is-changing");

  window.setTimeout(() => {
    characterImage.src = src;
    characterImage.alt = alt || "";
    characterImage.classList.remove("is-changing");
  }, prefersReducedMotion ? 0 : 180);
};

characterButtons.forEach((button) => {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => showCharacter(button));
  button.addEventListener("pointerenter", () => showCharacter(button));
});

let ticking = false;

const onScroll = () => {
  if (ticking) return;

  window.requestAnimationFrame(() => {
    updateChrome();
    updateParallax();
    ticking = false;
  });

  ticking = true;
};

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updateParallax);

updateChrome();
updateParallax();
