/* ═══════════════════════════════════════════
   河南工业和信息化职业学院 · 宣传页动效
   深蓝 + 科技金 · GSAP + Lenis 平滑滚动
   ═══════════════════════════════════════════ */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ────────── Lenis 平滑滚动 ────────── */
  var lenis = null;
  if (window.Lenis && !reduced) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* 预载期间锁定滚动 */
  document.body.style.overflow = "hidden";

  /* ────────── 顶部进度条 ────────── */
  var bar = document.getElementById("progressBar");
  if (bar) {
    gsap.to(bar, {
      scaleX: 1, ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.4 }
    });
  }

  /* ────────── 开场遮罩：计数 + 幕布 ────────── */
  var pre = document.getElementById("preloader");
  var preCount = document.getElementById("preCount");
  var preWords = document.getElementById("preWords");
  var preFill = document.getElementById("preFill");
  var words = ["匠心育人", "技能报国", "产教融合"];

  function openCurtains() {
    gsap.to(".pre-inner", { opacity: 0, y: -34, duration: 0.55, ease: "power2.in" });
    gsap.to(".pre-curtain-l", { xPercent: -102, duration: 0.95, ease: "power3.inOut", delay: 0.05 });
    gsap.to(".pre-curtain-r", {
      xPercent: 102, duration: 0.95, ease: "power3.inOut", delay: 0.05,
      onComplete: function () {
        if (pre) pre.style.display = "none";
        document.body.style.overflow = "";
        if (lenis) lenis.start();
        ScrollTrigger.refresh();
        playHero();
      }
    });
  }

  if (pre) {
    var obj = { n: 0 };
    gsap.to(obj, {
      n: 100, duration: 1.7, ease: "power2.inOut",
      onUpdate: function () {
        var v = Math.round(obj.n);
        if (preCount) preCount.textContent = v;
        if (preFill) preFill.style.transform = "scaleX(" + (v / 100) + ")";
        if (preWords) preWords.textContent = words[Math.min(Math.floor(v / 34), words.length - 1)];
      },
      onComplete: openCurtains
    });
  } else {
    document.body.style.overflow = "";
    playHero();
  }

  /* ────────── Hero 入场动画 ────────── */
  function playHero() {
    gsap.fromTo(".hero-watermark span", { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 1.8, ease: "power2.out" });
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo(".hero-eyebrow", { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9 }, 0.1)
      .fromTo(".ht-line", { opacity: 0, y: 74 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.14 }, 0.25)
      .fromTo(".hero-sub", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, 0.75)
      .fromTo(".hero-actions", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9 }, 0.9)
      .fromTo(".hero-meta", { opacity: 0 }, { opacity: 1, duration: 1 }, 1.05)
      .fromTo(".scroll-cue", { opacity: 0 }, { opacity: 1, duration: 1 }, 1.15);
  }

  /* ────────── Hero 轮播 ────────── */
  var slides = document.querySelectorAll(".hero-slide");
  var cur = 0;
  if (slides.length > 1) {
    setInterval(function () {
      var old = slides[cur];
      cur = (cur + 1) % slides.length;
      var nw = slides[cur];
      gsap.to(old, { opacity: 0, duration: 1.1, ease: "power2.out" });
      gsap.set(nw, { opacity: 1 });
      var img = nw.querySelector(".hero-img");
      if (img) gsap.fromTo(img, { scale: 1.22 }, { scale: 1, duration: 2.8, ease: "power2.out" });
    }, 5200);
  }

  /* ────────── Hero 滚动视差 ────────── */
  gsap.to(".hero-media", { yPercent: 16, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero-watermark", { yPercent: 24, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero-content", { yPercent: -18, opacity: 0.25, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "70% top", scrub: true } });

  /* ────────── 数字滚动 ────────── */
  document.querySelectorAll(".spec-value[data-count]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var o = { v: 0 };
    gsap.to(o, {
      v: target, duration: 2.2, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: function () { el.textContent = Math.round(o.v).toLocaleString(); }
    });
  });

  /* ────────── 滚动渐显 ────────── */
  gsap.utils.toArray(".section-head, .story-block, .model-card, .feature-cell, .honor-card, .spec-cell, .g-card").forEach(function (el) {
    gsap.fromTo(el, { opacity: 0, y: 54 }, {
      opacity: 1, y: 0, duration: 1.05, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true }
    });
  });

  /* ────────── 图集：鼠标悬停时滚轮水平滑动 ────────── */
  var gallery = document.getElementById("gallery");
  var gTrack = document.getElementById("galleryTrack");
  if (gallery && gTrack && !window.matchMedia("(pointer: coarse)").matches) {
    var galX = 0;
    var maxGalX = 0;
    function updateMaxGal() { maxGalX = Math.max(0, gTrack.scrollWidth - gallery.clientWidth); }
    updateMaxGal();
    window.addEventListener("resize", updateMaxGal);
    gallery.addEventListener("mouseenter", function () {
      gallery.classList.add("hovering");
      if (lenis) lenis.stop(); /* 悬停时锁定页面纵向滚动 */
    });
    gallery.addEventListener("mouseleave", function () {
      gallery.classList.remove("hovering");
      if (lenis) lenis.start();
    });
    gallery.addEventListener("wheel", function (e) {
      if (!gallery.classList.contains("hovering")) return;
      e.preventDefault();
      e.stopPropagation();
      galX -= e.deltaY;
      galX = Math.max(-maxGalX, Math.min(0, galX));
      gsap.to(gTrack, { x: galX, duration: 0.7, ease: "power2.out" });
    }, { passive: false });
  }

  /* ────────── 全站光尘 ────────── */
  var dust = document.getElementById("globalDust");
  if (dust) {
    for (var i = 0; i < 26; i++) {
      var p = document.createElement("span");
      p.style.cssText = "position:absolute;border-radius:50%;left:" + (Math.random() * 100) + "%;top:" + (Math.random() * 100) + "%;width:" + (Math.random() * 3 + 1) + "px;height:" + (Math.random() * 3 + 1) + "px;background:rgba(216,180,90," + (Math.random() * 0.5 + 0.15) + ");";
      dust.appendChild(p);
      gsap.to(p, { y: -(Math.random() * 140 + 70), x: (Math.random() - 0.5) * 70, opacity: 0, duration: Math.random() * 9 + 7, repeat: -1, delay: Math.random() * 8, ease: "none" });
    }
  }

  /* ────────── 自定义光标 ────────── */
  if (!window.matchMedia("(pointer: coarse)").matches) {
    var curEl = document.getElementById("cursor");
    var glowEl = document.querySelector(".cursor-glow");
    if (curEl) gsap.set(curEl, { xPercent: -50, yPercent: -50 });
    if (glowEl) gsap.set(glowEl, { xPercent: -50, yPercent: -50 });
    window.addEventListener("mousemove", function (e) {
      if (curEl) gsap.to(curEl, { x: e.clientX, y: e.clientY, duration: 0.18, ease: "power2.out" });
      if (glowEl) gsap.to(glowEl, { x: e.clientX, y: e.clientY, duration: 0.55, ease: "power2.out" });
    });
    document.querySelectorAll("a, .btn, .model-card, .honor-card, .g-card").forEach(function (el) {
      el.addEventListener("mouseenter", function () { if (curEl) curEl.classList.add("cursor-hover"); });
      el.addEventListener("mouseleave", function () { if (curEl) curEl.classList.remove("cursor-hover"); });
    });
  }

  /* ────────── 磁性按钮 ────────── */
  document.querySelectorAll(".magnetic").forEach(function (btn) {
    btn.addEventListener("mousemove", function (e) {
      var r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width / 2) * 0.3,
        y: (e.clientY - r.top - r.height / 2) * 0.3,
        duration: 0.3, ease: "power2.out"
      });
    });
    btn.addEventListener("mouseleave", function () {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
    });
  });

  /* ────────── 学院卡片 3D 倾斜 ────────── */
  document.querySelectorAll(".model-card.tilt").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      gsap.to(card, {
        rotationX: ((e.clientY - r.top) / r.height - 0.5) * -9,
        rotationY: ((e.clientX - r.left) / r.width - 0.5) * 9,
        duration: 0.45, ease: "power2.out", transformPerspective: 800
      });
    });
    card.addEventListener("mouseleave", function () {
      gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.7, ease: "power3.out" });
    });
  });

  /* ────────── 导航：滚动变色 + 移动端菜单 ────────── */
  var head = document.getElementById("siteHead");
  if (head) {
    window.addEventListener("scroll", function () {
      head.classList.toggle("scrolled", window.scrollY > 40);
    }, { passive: true });
  }
  var navToggle = document.getElementById("navToggle");
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      navToggle.setAttribute("aria-expanded", open);
    });
    document.querySelectorAll(".main-nav a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("menu-open"); });
    });
  }

  /* Lenis 锚点平滑跳转 */
  if (lenis) {
    document.querySelectorAll("a[data-lenis]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (href && href.charAt(0) === "#") {
          var target = document.querySelector(href);
          if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -10 }); }
        }
      });
    });
  }
})();
