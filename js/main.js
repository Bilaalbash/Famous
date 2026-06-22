// ===== SHIFT — driving handbook interactions =====
(function () {
  "use strict";

  /* ---------- mobile nav ---------- */
  var burger = document.getElementById("burger");
  var links = document.getElementById("navLinks");
  if (burger) {
    burger.addEventListener("click", function () { links.classList.toggle("open"); });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  /* ---------- reading progress ---------- */
  var bar = document.getElementById("progressBar");
  function onScroll() {
    var h = document.documentElement;
    var pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = pct + "%";
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add("in"); });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- cockpit controls ---------- */
  var controls = {
    wheel:  ["🎯 Steering wheel", "Feed the wheel hand-over-hand; never cross your arms fully. Smooth in, smooth out — the car follows your eyes."],
    clutch: ["🦶 Clutch (left pedal)", "Manual only. Find the 'biting point' where the car starts to pull. Master this and hill starts stop being scary."],
    brake:  ["🛑 Brake (middle pedal)", "Progressive pressure — squeeze, don't stamp. Brake early and gently for a smooth, confident stop."],
    gas:    ["⚡ Accelerator (right pedal)", "Gentle, even pressure. Think of an egg under your foot. Smooth power keeps the car settled and saves fuel."],
    gear:   ["🕹️ Gear stick", "Match the gear to your speed: lower for power and slow streets, higher for cruising. Palm the stick, eyes on the road."],
    mirror: ["🪞 Mirrors", "Interior + both wings. Glance every 5–8 seconds and before every move. Mirrors first — they're step one of everything."]
  };
  var ctrlTitle = document.getElementById("ctrlTitle");
  var ctrlText = document.getElementById("ctrlText");
  document.querySelectorAll(".hot").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".hot").forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
      var data = controls[b.dataset.ctrl];
      ctrlTitle.textContent = data[0];
      ctrlText.textContent = data[1];
    });
  });

  /* ---------- traffic lights ---------- */
  var red = document.querySelector(".bulb.red");
  var amber = document.querySelector(".bulb.amber");
  var green = document.querySelector(".bulb.green");
  var label = document.getElementById("lightLabel");
  var ltext = document.getElementById("lightText");
  var pauseBtn = document.getElementById("lightPause");
  var phases = [
    { on: ["red"], label: "RED", text: "Stop. Wait behind the line until the light changes." },
    { on: ["red", "amber"], label: "RED & AMBER", text: "Get ready — but do not go yet. Prepare to move off." },
    { on: ["green"], label: "GREEN", text: "Go — if the way is clear and it's safe to proceed." },
    { on: ["amber"], label: "AMBER", text: "Stop, unless you're so close that stopping would be unsafe." }
  ];
  var phase = 0, paused = false, timer;
  function render() {
    [red, amber, green].forEach(function (b) { b.classList.remove("on"); });
    var p = phases[phase];
    p.on.forEach(function (c) { document.querySelector(".bulb." + c).classList.add("on"); });
    label.textContent = p.label;
    ltext.textContent = p.text;
  }
  function tick() {
    if (!paused) { phase = (phase + 1) % phases.length; render(); }
    timer = setTimeout(tick, phase === 3 ? 1400 : 2200);
  }
  render(); timer = setTimeout(tick, 2200);
  if (pauseBtn) pauseBtn.addEventListener("click", function () {
    paused = !paused;
    pauseBtn.textContent = paused ? "Resume sequence" : "Pause sequence";
  });

  /* ---------- road signs ---------- */
  var signs = [
    { s: "🔺", n: "Warning", d: "Triangle = hazard ahead. Bend, junction, slippery road — slow down and read on." },
    { s: "🛑", n: "Stop", d: "The only octagon. Come to a complete stop at the line, every time." },
    { s: "⛔", n: "No entry", d: "Red circle with white bar. Do not pass — one-way the wrong way." },
    { s: "🚸", n: "Pedestrians", d: "Watch for people crossing, especially near schools and towns." },
    { s: "🚫", n: "No vehicles", d: "Red ring = prohibition. This route is closed to traffic." },
    { s: "↩️", n: "No U-turn", d: "Turning back here is not allowed. Find the next safe spot." },
    { s: "🅿️", n: "Parking", d: "Blue rectangle = information. Parking permitted here." },
    { s: "⬆️", n: "Ahead only", d: "Blue circle = positive instruction. You must go this direction." }
  ];
  var grid = document.getElementById("signs-grid");
  signs.forEach(function (x) {
    var c = document.createElement("div");
    c.className = "flip";
    c.innerHTML =
      '<div class="flip__in"><div class="flip__f"><span class="flip__sym">' + x.s +
      '</span><b>' + x.n + '</b></div><div class="flip__b">' + x.d + '</div></div>';
    c.addEventListener("click", function () { c.classList.toggle("flipped"); });
    grid.appendChild(c);
  });

  /* ---------- parallel park ---------- */
  var mover = document.getElementById("mover");
  var parkBtn = document.getElementById("parkBtn");
  if (parkBtn) parkBtn.addEventListener("click", function () {
    mover.classList.remove("go");
    void mover.offsetWidth; // reflow to restart animation
    mover.classList.add("go");
  });

  /* ---------- quiz ---------- */
  var QS = [
    { q: "What does the MSM routine stand for?", o: ["Mirror, Signal, Manoeuvre", "Move, Stop, Move", "Mirror, Steer, Move"], a: 0 },
    { q: "A red traffic light means…", o: ["Slow down", "Stop and wait", "Go if clear"], a: 1 },
    { q: "What shape are most warning signs?", o: ["Circle", "Triangle", "Square"], a: 1 },
    { q: "In dry conditions, the safe following gap is at least…", o: ["Half a second", "Two seconds", "Ten seconds"], a: 1 },
    { q: "The 'biting point' relates to which control?", o: ["Brake", "Clutch", "Handbrake"], a: 1 },
    { q: "When should you check your mirrors?", o: ["Only when parking", "Before every change of speed or direction", "Once per journey"], a: 1 },
    { q: "Red & amber together means…", o: ["Go now", "Get ready, but don't go yet", "Stop immediately"], a: 1 },
    { q: "A circular sign with a red ring usually…", o: ["Gives an order/prohibition", "Warns of a hazard", "Gives information"], a: 0 },
    { q: "In wet weather you should…", o: ["Drive closer to save time", "Increase your following distance", "Brake harder and later"], a: 1 },
    { q: "Best way to use the accelerator?", o: ["Stamp for quick response", "Smooth, gentle pressure", "Hold it flat"], a: 1 }
  ];
  var qi = 0, score = 0;
  var elQ = document.getElementById("quizQ"), elO = document.getElementById("quizOpts"),
      elC = document.getElementById("quizCount"), elS = document.getElementById("quizScore"),
      elP = document.getElementById("quizProgress"), box = document.getElementById("quizBox"),
      res = document.getElementById("quizResult"), rT = document.getElementById("resultTitle"),
      rX = document.getElementById("resultText"), retry = document.getElementById("quizRetry");

  function renderQ() {
    var item = QS[qi];
    elQ.textContent = item.q;
    elC.textContent = "Question " + (qi + 1) + " of " + QS.length;
    elS.textContent = "Score: " + score;
    elP.style.width = (qi / QS.length * 100) + "%";
    elO.innerHTML = "";
    item.o.forEach(function (text, idx) {
      var b = document.createElement("button");
      b.className = "opt"; b.textContent = text;
      b.addEventListener("click", function () { answer(idx, b); });
      elO.appendChild(b);
    });
  }
  function answer(idx, btn) {
    var item = QS[qi];
    var opts = elO.querySelectorAll(".opt");
    opts.forEach(function (o) { o.disabled = true; });
    if (idx === item.a) { btn.classList.add("correct"); score++; }
    else { btn.classList.add("wrong"); opts[item.a].classList.add("correct"); }
    elS.textContent = "Score: " + score;
    setTimeout(function () {
      qi++;
      if (qi < QS.length) renderQ();
      else finish();
    }, 850);
  }
  function finish() {
    elP.style.width = "100%";
    box.hidden = true; res.hidden = false;
    var pct = Math.round(score / QS.length * 100);
    rT.textContent = score + "/" + QS.length + " — " + pct + "%";
    rX.textContent = pct === 100 ? "Flawless. You're built for the open road. 🏆"
      : pct >= 70 ? "Solid drive! A little polish and you're test-ready. 🚗"
      : pct >= 40 ? "Decent start — give the chapters another read and retry. 📘"
      : "Buckle up and study the handbook — you've got this. 📖";
  }
  if (retry) retry.addEventListener("click", function () {
    qi = 0; score = 0; res.hidden = true; box.hidden = false; renderQ();
  });
  if (elQ) renderQ();

  /* ---------- footer year-free: nothing else ---------- */
})();
