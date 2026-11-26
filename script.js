document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.textContent = isOpen ? "×" : "☰";
    });

    document.querySelectorAll(".nav a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰";
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰";
        menuButton.focus();
      }
    });
  }

  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const langToggleBtn = document.getElementById("lang-toggle");
  const elementsToTranslate = document.querySelectorAll("[data-en]");

  elementsToTranslate.forEach(el => {
    if (!el.dataset.es) {
      el.dataset.es = el.innerHTML;
    }
  });

  let currentLang = localStorage.getItem("portfolio-lang") || "es";

  const setLanguage = (lang) => {
    elementsToTranslate.forEach(el => {
      if (lang === "en") {
        el.innerHTML = el.dataset.en;
      } else {
        el.innerHTML = el.dataset.es;
      }
    });

    langToggleBtn.textContent = lang === "en" ? "ES" : "EN";
    document.documentElement.lang = lang;
    localStorage.setItem("portfolio-lang", lang);
    currentLang = lang;
  };

  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      setLanguage(currentLang === "es" ? "en" : "es");
    });
  }

  setLanguage(currentLang);

  const sectionLinks = [...document.querySelectorAll(".nav a[href^='#']")];
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      sectionLinks.forEach((link) => {
        link.removeAttribute("aria-current");
        if (link.getAttribute("href") === `#${visible.target.id}`) {
          link.setAttribute("aria-current", "page");
        }
      });
    }, { rootMargin: "-25% 0px -60%", threshold: [0.1, 0.35, 0.6] });

    sections.forEach((section) => observer.observe(section));
  }
});