const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("[data-site-header]");
const scrollTop = document.querySelector("[data-scroll-top]");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const revealItems = document.querySelectorAll(".reveal");
const storyRevealItems = document.querySelectorAll("[data-story-reveal]");
const pinnedStorybooks = document.querySelectorAll("[data-pinned-storybook]");
const pinnedBookSections = document.querySelectorAll("[data-pinned-books]");
const homeHero = document.querySelector("main#home .hero");
const characterImage = document.querySelector(".character-image");
const characterButtons = document.querySelectorAll("[data-character-src]");
let characterResetTimer;
let pointerX = 0;
let pointerY = 0;

document.body.classList.add("is-ready");

const setActiveNavigation = () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const currentHash = window.location.hash;

  document.querySelectorAll(".main-nav a").forEach((link) => {
    const linkUrl = new URL(link.href, window.location.href);
    const linkPage = linkUrl.pathname.split("/").pop() || "index.html";
    const isHome = currentPage === "index.html" && linkPage === "index.html";
    const isSamePage = currentPage === linkPage && !isHome;
    const isHomeActive = isHome && linkUrl.hash === "#home" && (!currentHash || currentHash === "#home");
    const isActive = isSamePage || isHomeActive;

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const updateChrome = () => {
  const scrolled = window.scrollY > 18;
  header?.classList.toggle("is-scrolled", scrolled);
  scrollTop?.classList.toggle("is-visible", window.scrollY > 620);
};

const updateParallax = () => {
  if (prefersReducedMotion) return;

  const viewportHeight = window.innerHeight || 1;

  parallaxItems.forEach((item) => {
    if (item.closest("[data-pinned-books]")) {
      item.style.removeProperty("--parallax-y");
      item.style.removeProperty("--parallax-x");
      item.style.removeProperty("--parallax-hover-y");
      return;
    }

    const speed = Number(item.dataset.parallax || 0);
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const distanceFromCenter = itemCenter - viewportHeight / 2;
    const depth = Math.max(0.12, Math.abs(speed));
    const offset = Math.max(-120, Math.min(120, distanceFromCenter * speed * -0.48));
    const pointerOffsetX = pointerX * depth * 88;
    const pointerOffsetY = pointerY * depth * 46;

    item.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
    item.style.setProperty("--parallax-x", `${pointerOffsetX.toFixed(2)}px`);
    item.style.setProperty("--parallax-hover-y", `${pointerOffsetY.toFixed(2)}px`);
  });
};

const updatePinnedBookCards = () => {
  pinnedBookSections.forEach((section) => {
    const cards = section.querySelectorAll(".child-book-card");
    if (!cards.length) return;

    if (prefersReducedMotion || window.innerWidth < 900) {
      cards.forEach((card) => {
        card.style.removeProperty("--book-x");
        card.style.removeProperty("--book-opacity");
        card.style.removeProperty("--book-scale");
      });
      return;
    }

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const scrollable = Math.max(1, rect.height - viewportHeight);
    const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
    const segmentCount = Math.max(1, cards.length - 1);
    const startHold = 0.04;
    const endHold = 0.12;
    const travelProgress = Math.max(0, Math.min(1, (progress - startHold) / (1 - startHold - endHold)));
    const gap = 0.42;
    const activeWidth = 1 / (segmentCount + 1);

    cards.forEach((card, index) => {
      const target = index / segmentCount;
      const rawDistance = travelProgress - target;
      const restingDistance = Math.abs(rawDistance) < activeWidth * gap ? 0 : rawDistance;
      const clamped = Math.max(-1, Math.min(1, restingDistance * segmentCount));
      const direction = index % 2 === 0 ? -1 : 1;
      const x = clamped * -128 + direction * Math.max(0, Math.abs(clamped) - 0.16) * 40;
      const opacity = Math.max(0, 1 - Math.abs(clamped) * 1.72);
      const scale = 0.95 + Math.max(0, 1 - Math.abs(clamped)) * 0.05;

      card.style.setProperty("--book-x", `${x.toFixed(2)}vw`);
      card.style.setProperty("--book-opacity", opacity.toFixed(3));
      card.style.setProperty("--book-scale", scale.toFixed(3));
      card.classList.toggle("is-visible", opacity > 0.2);
    });
  });
};

const updateHomeHeroStage = () => {
  if (!homeHero || window.innerWidth < 1000) {
    document.body.classList.remove("home-hero-stage-active");
    return;
  }

  const rect = homeHero.getBoundingClientRect();
  const isActive = rect.top < window.innerHeight * 0.72 && rect.bottom > 120;
  document.body.classList.toggle("home-hero-stage-active", isActive);
};

const updateStoryReveal = () => {
  storyRevealItems.forEach((item) => {
    const words = item.querySelectorAll("span");
    if (!words.length) return;

    if (prefersReducedMotion) {
      words.forEach((word) => word.classList.add("is-visible"));
      return;
    }

    const viewportHeight = window.innerHeight || 1;
    const hero = item.closest(".hero");
    const heroTop = hero ? hero.getBoundingClientRect().top : item.getBoundingClientRect().top;
    const progress = Math.max(0, Math.min(1, (-heroTop + viewportHeight * 0.08) / (viewportHeight * 0.58)));
    const finalLine = item.querySelector("[data-story-final]");
    const leadWords = finalLine ? Array.from(words).filter((word) => word !== finalLine) : Array.from(words);
    const leadProgress = Math.max(0, Math.min(1, progress / 0.78));
    const visibleCount = Math.max(3, Math.ceil(leadProgress * leadWords.length));

    leadWords.forEach((word, index) => {
      word.classList.toggle("is-visible", index < visibleCount);
    });

    if (finalLine) {
      const finalIsVisible = progress >= 0.9;
      finalLine.classList.toggle("is-visible", finalIsVisible);
      item.classList.toggle("story-is-complete", finalIsVisible);
      hero?.classList.toggle("story-is-complete", finalIsVisible);
    }
  });
};

const updatePinnedStorybooks = () => {
  pinnedStorybooks.forEach((story) => {
    const slides = story.querySelectorAll(".storybook-panel");
    if (!slides.length) return;

    if (prefersReducedMotion || window.innerWidth < 900) {
      slides.forEach((slide) => {
        slide.style.removeProperty("--slide-x");
        slide.style.removeProperty("--slide-opacity");
        slide.style.removeProperty("--slide-scale");
      });
      return;
    }

    const rect = story.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const scrollable = Math.max(1, rect.height - viewportHeight);
    const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
    const segmentCount = Math.max(1, slides.length - 1);
    const startHold = 0.08;
    const endHold = 0.16;
    const travelProgress = Math.max(0, Math.min(1, (progress - startHold) / (1 - startHold - endHold)));
    const gap = 0.34;
    const activeWidth = 1 / (segmentCount + 1);

    slides.forEach((slide, index) => {
      const target = index / segmentCount;
      const rawDistance = travelProgress - target;
      const restingDistance = Math.abs(rawDistance) < activeWidth * gap ? 0 : rawDistance;
      const clamped = Math.max(-1, Math.min(1, restingDistance * segmentCount));
      const direction = index % 2 === 0 ? -1 : 1;
      const x = clamped * -134 + direction * Math.max(0, Math.abs(clamped) - 0.18) * 46;
      const opacity = Math.max(0, 1 - Math.abs(clamped) * 1.65);
      const scale = 0.94 + Math.max(0, 1 - Math.abs(clamped)) * 0.06;

      slide.style.setProperty("--slide-x", `${x.toFixed(2)}vw`);
      slide.style.setProperty("--slide-opacity", opacity.toFixed(3));
      slide.style.setProperty("--slide-scale", scale.toFixed(3));
      slide.classList.toggle("is-visible", opacity > 0.18);
    });
  });
};

const updatePointerParallax = (event) => {
  if (prefersReducedMotion || window.innerWidth < 1000) return;

  pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
  pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
  updateParallax();
};

if ("IntersectionObserver" in window) {
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
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

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
    updateHomeHeroStage();
    updateParallax();
    updateStoryReveal();
    updatePinnedStorybooks();
    updatePinnedBookCards();
    ticking = false;
  });

  ticking = true;
};

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updateParallax);
window.addEventListener("resize", updateHomeHeroStage);
window.addEventListener("resize", updateStoryReveal);
window.addEventListener("resize", updatePinnedStorybooks);
window.addEventListener("resize", updatePinnedBookCards);
window.addEventListener("pointermove", updatePointerParallax, { passive: true });
window.addEventListener("hashchange", setActiveNavigation);

setActiveNavigation();
updateChrome();
updateHomeHeroStage();
updateParallax();
updateStoryReveal();
updatePinnedStorybooks();
updatePinnedBookCards();
