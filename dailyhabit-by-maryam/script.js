/* =========================================================
   DailyHabitByMaryam — Vanilla JS
   - Light/dark theme with localStorage persistence
   - Sticky header state
   - Mobile nav toggle + smooth scroll close
   - Form validation (email + non-empty message)
   - Source code download (zips index.html, style.css, script.js)
   - Subtle reveal-on-scroll animations
   ========================================================= */

(function () {
  "use strict";

  /* -------- Theme: light / dark with localStorage -------- */
  const STORAGE_KEY = "dhm-theme";
  const root = document.documentElement;
  const themeBtn = document.getElementById("themeToggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeBtn) {
      themeBtn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      themeBtn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  }

  function getInitialTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch (e) {
      /* ignore */
    }
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }

  applyTheme(getInitialTheme());

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* ignore */
      }
    });
  }

  /* -------- Sticky header shadow on scroll -------- */
  const header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* -------- Mobile nav toggle -------- */
  const menuBtn = document.getElementById("menuToggle");
  const nav = document.getElementById("primaryNav");

  function closeNav() {
    if (!nav || !menuBtn) return;
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Close mobile nav when a link is tapped (smooth-scroll anchors)
  document.querySelectorAll('.nav-link, a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 860) closeNav();
    });
  });

  /* -------- Footer year -------- */
  const yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* -------- Reveal-on-scroll -------- */
  const revealEls = [
    ".section-head",
    ".mission-copy",
    ".mission-image",
    ".program-card",
    ".price-card",
    ".masonry-item",
    ".contact-copy",
    ".contact-form",
  ];
  const targets = document.querySelectorAll(revealEls.join(","));
  targets.forEach(function (el) {
    el.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach(function (el) {
      io.observe(el);
    });
  } else {
    targets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* -------- Contact form validation -------- */
  const form = document.getElementById("contactForm");
  const successEl = document.getElementById("formSuccess");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(name, msg) {
    const input = document.getElementById(name);
    const errEl = document.getElementById("error-" + name);
    if (!input || !errEl) return;
    const field = input.closest(".field");
    if (msg) {
      errEl.textContent = msg;
      if (field) field.classList.add("has-error");
      input.setAttribute("aria-invalid", "true");
    } else {
      errEl.textContent = "";
      if (field) field.classList.remove("has-error");
      input.removeAttribute("aria-invalid");
    }
  }

  function validateField(name, value) {
    const v = (value || "").trim();
    switch (name) {
      case "name":
        if (v.length < 2) return "Please enter your name.";
        return "";
      case "email":
        if (!v) return "Email is required.";
        if (!EMAIL_RE.test(v)) return "Please enter a valid email address.";
        return "";
      case "message":
        if (v.length < 10) return "Please write at least a short message (10+ characters).";
        return "";
      default:
        return "";
    }
  }

  if (form) {
    ["name", "email", "message"].forEach(function (name) {
      const el = document.getElementById(name);
      if (!el) return;
      el.addEventListener("input", function () {
        setFieldError(name, validateField(name, el.value));
        if (successEl) successEl.hidden = true;
      });
      el.addEventListener("blur", function () {
        setFieldError(name, validateField(name, el.value));
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = new FormData(form);
      let firstInvalid = null;
      ["name", "email", "message"].forEach(function (name) {
        const msg = validateField(name, data.get(name));
        setFieldError(name, msg);
        if (msg && !firstInvalid) firstInvalid = document.getElementById(name);
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      // Demo: no backend — show success and reset form
      form.reset();
      if (successEl) {
        successEl.hidden = false;
        successEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  /* -------- Source code download -------- */
  const downloadBtn = document.getElementById("downloadBtn");

  async function fetchText(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch " + url + " (" + res.status + ")");
    return await res.text();
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", async function () {
      if (typeof window.JSZip === "undefined") {
        alert("Download library not loaded yet — please try again in a moment.");
        return;
      }

      const original = downloadBtn.innerHTML;
      downloadBtn.disabled = true;
      downloadBtn.innerHTML =
        '<span class="btn-icon-label" style="display:inline">Preparing…</span>';

      try {
        // Fetch the live files served by the site
        const base = document.baseURI;
        const indexUrl = new URL("./", base).href;
        const cssUrl = new URL("./style.css", base).href;
        const jsUrl = new URL("./script.js", base).href;

        const [htmlRaw, cssText, jsText] = await Promise.all([
          fetchText(indexUrl),
          fetchText(cssUrl),
          fetchText(jsUrl),
        ]);

        // Strip Vite dev-injected scripts so the downloaded file is pure
        const htmlText = htmlRaw
          .replace(/<script[^>]*type=["']module["'][^>]*src=["'][^"']*\/@vite\/client["'][^>]*><\/script>/gi, "")
          .replace(/<script[^>]*src=["'][^"']*\/@vite\/[^"']*["'][^>]*><\/script>/gi, "")
          .replace(/<script[^>]*\/@react-refresh[^<]*<\/script>/gi, "")
          .replace(/<!--[\s\S]*?vite[\s\S]*?-->/gi, "");

        const readme =
          "DailyHabitByMaryam — Source Code\n" +
          "================================\n\n" +
          "Pure HTML5, CSS3 and Vanilla JavaScript. No frameworks.\n\n" +
          "Files:\n" +
          "  - index.html   Single-page site\n" +
          "  - style.css    Theme tokens, layout, components\n" +
          "  - script.js    Theme toggle, nav, validation, animations\n\n" +
          "How to run:\n" +
          "  1. Unzip this folder.\n" +
          "  2. Open index.html in any modern browser.\n" +
          "     (Or serve the folder with any static server.)\n\n" +
          "Generated: " + new Date().toISOString() + "\n";

        const zip = new window.JSZip();
        const folder = zip.folder("dailyhabit-by-maryam");
        folder.file("index.html", htmlText);
        folder.file("style.css", cssText);
        folder.file("script.js", jsText);
        folder.file("README.txt", readme);

        const blob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "dailyhabit-by-maryam.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () {
          URL.revokeObjectURL(url);
        }, 1500);
      } catch (err) {
        console.error(err);
        alert("Sorry, the source code could not be prepared. Please try again.");
      } finally {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = original;
      }
    });
  }
})();
