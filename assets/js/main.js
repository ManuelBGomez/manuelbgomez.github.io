/* Small progressive enhancements. The site works without JavaScript. */
(function () {
  "use strict";
  var root = document.documentElement;

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- Mobile menu ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navMenu = document.getElementById("nav-menu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navMenu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { revealObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Active menu item while scrolling (home page) ---------- */
  var spied = document.querySelectorAll("[data-spy]");
  var links = {};
  document.querySelectorAll(".nav-menu a[data-section]").forEach(function (a) {
    if (a.getAttribute("href").indexOf("#") !== -1) links[a.dataset.section] = a;
  });
  if (spied.length && "IntersectionObserver" in window) {
    var spyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.remove("active"); });
        if (links[entry.target.id]) links[entry.target.id].classList.add("active");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    spied.forEach(function (el) { spyObs.observe(el); });
  }

  /* ---------- News: show more ---------- */
  document.querySelectorAll("[data-news-more]").forEach(function (btn) {
    var label = btn.querySelector(".more-label");
    var original = label.textContent;
    btn.addEventListener("click", function () {
      var expand = btn.getAttribute("aria-expanded") !== "true";
      btn.closest("section").querySelectorAll("[data-extra]").forEach(function (li) { li.hidden = !expand; });
      btn.setAttribute("aria-expanded", String(expand));
      label.textContent = expand ? "Show less" : original;
    });
  });

  /* ---------- BibTeX: toggle + copy ---------- */
  document.addEventListener("click", function (e) {
    var toggle = e.target.closest("[data-bibtex-toggle]");
    if (toggle) {
      var box = toggle.closest(".pub").querySelector(".bibtex");
      var show = box.hidden;
      box.hidden = !show;
      toggle.setAttribute("aria-expanded", String(show));
      return;
    }
    var copy = e.target.closest("[data-copy]");
    if (copy) {
      var text = copy.parentElement.querySelector("code").textContent;
      var label = copy.querySelector("span");
      var done = function (msg) {
        label.textContent = msg;
        setTimeout(function () { label.textContent = "Copy"; }, 1500);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done("Copied!"); }, function () { done("Select & copy"); });
      } else {
        var range = document.createRange();
        range.selectNodeContents(copy.parentElement.querySelector("code"));
        var sel = window.getSelection();
        sel.removeAllRanges(); sel.addRange(range);
        try { document.execCommand("copy"); done("Copied!"); } catch (err) { done("Select & copy"); }
      }
    }
  });

  /* ---------- Publications page: filter + search ---------- */
  var filters = document.querySelectorAll(".filter[data-filter]");
  var search = document.querySelector("[data-pub-search]");
  if (filters.length || search) {
    var activeType = "all";
    var apply = function () {
      var q = search ? search.value.trim().toLowerCase() : "";
      var any = false;
      document.querySelectorAll("[data-year-group]").forEach(function (group) {
        var visibleInGroup = 0;
        group.querySelectorAll(".pub").forEach(function (pub) {
          var okType = activeType === "all" || pub.dataset.type === activeType;
          var okText = !q || Array.prototype.map.call(pub.querySelectorAll(".pub-title, .pub-authors, .pub-venue, .badge"), function (el) { return el.textContent; }).join(" ").toLowerCase().indexOf(q) !== -1;
          pub.hidden = !(okType && okText);
          if (!pub.hidden) visibleInGroup++;
        });
        group.hidden = visibleInGroup === 0;
        if (visibleInGroup) any = true;
      });
      var empty = document.querySelector("[data-pub-empty]");
      if (empty) empty.hidden = any;
    };
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filters.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        activeType = btn.dataset.filter;
        apply();
      });
    });
    if (search) search.addEventListener("input", apply);
  }
})();
