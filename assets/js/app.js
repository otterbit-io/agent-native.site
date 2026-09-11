(function () {
  "use strict";

  function isLiveBrowser() {
    // Embedded (design canvas, preview iframe, third-party embed).
    try {
      if (window.self !== window.top) return false;
    } catch (e) {
      return false; // cross-origin framing throws → treat as embedded
    }
    // Bootstrap Studio and similar visual editors are Electron apps.
    var ua = (navigator.userAgent || "");
    if (/Electron|BootstrapStudio/i.test(ua)) return false;
    // Respect the OS-level motion preference.
    try {
      if (window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    } catch (e) { /* matchMedia unavailable → fall through */ }
    return true;
  }

  if (!isLiveBrowser()) return;

  var root = document.documentElement;
  root.classList.add("anim");

  // Hero elements reveal right away (two frames in, so the initial
  // hidden state is painted first and the transition actually runs).
  var immediate = document.querySelectorAll(".reveal[data-immediate], .materialize[data-immediate]");
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      for (var i = 0; i < immediate.length; i++) {
        immediate[i].classList.add("in-view");
      }
    });
  });

  // Everything below the fold reveals as it scrolls into view.
  var rest = document.querySelectorAll(
    ".reveal:not([data-immediate]), .materialize:not([data-immediate])"
  );

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add("in-view");
          io.unobserve(entries[i].target);
        }
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });

    for (var j = 0; j < rest.length; j++) io.observe(rest[j]);
  } else {
    // No observer support → just show them.
    for (var k = 0; k < rest.length; k++) rest[k].classList.add("in-view");
  }

  // Strengthen the nav material once the page has scrolled a little.
  var nav = document.querySelector("[data-nav]");
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 8) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();
