// The game: ask, shuffle, pick from the fan, turn the cards, read.
(function () {
  "use strict";
  var T = window.TAROT, U = T.ui, $ = U.$;
  var RATIO = 208 / 120;
  var S = null, slots = [], fanCards = [], fanH = 200;
  var root = document.documentElement;

  root.style.setProperty("--back", 'url("' + T.art.backURI() + '")');
  root.style.setProperty("--grain", U.grain());
  $("#yr").textContent = new Date().getFullYear();

  // ---------- hero: a squared-up pack with three cards fanned on top ----------
  (function hero() {
    var html = "";
    for (var i = 4; i >= 0; i--) {
      html += '<span class="hc" style="--dx:' + (30 + i * 1.4) + "px;--dy:" + (20 - i * 1.6) + 'px;--r:5deg"><span class="side back"></span></span>';
    }
    [[0, -15, -58, 8], [10, -2, -8, -12], [17, 13, 46, 2]].forEach(function (h) {
      html += '<span class="hc rough" style="--dx:' + h[2] + "px;--dy:" + h[3] + "px;--r:" + h[1] + 'deg">' + U.faceHTML(T.deck[h[0]], false) + "</span>";
    });
    $("#deck-art").innerHTML = html;
  })();

  // ---------- spread picker: little layout diagrams, radio behaviour ----------
  document.querySelectorAll("[data-mini]").forEach(function (el) {
    var sp = T.spreads[el.dataset.mini], w = 10, h = w * RATIO, pad = 1.5;
    var svg = '<svg viewBox="' + -pad + " " + -pad + " " + (sp.uw * w + pad * 2).toFixed(1) + " " + (sp.uh * h + pad * 2).toFixed(1) + '" aria-hidden="true">';
    sp.at.forEach(function (a) {
      var cx = a[0] * w, cy = a[1] * h;
      svg += '<rect x="' + (cx - w / 2).toFixed(1) + '" y="' + (cy - h / 2).toFixed(1) + '" width="' + w + '" height="' + h.toFixed(1) + '" rx="1"' +
        (a[2] === "cross" ? ' transform="rotate(90 ' + cx.toFixed(1) + " " + cy.toFixed(1) + ')"' : "") + "/>";
    });
    el.innerHTML = svg + "</svg>";
  });
  var spreadBtns = Array.prototype.slice.call(document.querySelectorAll(".spread"));
  function choose(btn, focus) {
    spreadBtns.forEach(function (b) { var on = b === btn; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
    if (focus) btn.focus();
  }
  spreadBtns.forEach(function (b, i) {
    b.addEventListener("click", function () { choose(b); });
    b.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
      if (d) { e.preventDefault(); choose(spreadBtns[(i + d + spreadBtns.length) % spreadBtns.length], true); }
    });
  });
  choose(document.querySelector('.spread[aria-checked="true"]') || spreadBtns[1]);
  function chosen() { return document.querySelector('.spread[aria-checked="true"]').dataset.spread; }

  function hint(s) { $("#hint").textContent = s; }
  function scrollTo(el) {
    var y = el.getBoundingClientRect().top + window.scrollY - 8;
    window.scrollTo({ top: Math.max(0, y), behavior: U.reduced ? "auto" : "smooth" });
  }
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  // ---------- start a reading ----------
  function begin(id, q, revAllowed) {
    var sh = T.shuffle(78);
    S = { id: id, sp: T.spreads[id], q: q, revAllowed: revAllowed, order: sh.order, coin: sh.coin,
          picks: 0, landed: 0, revealed: 0, drawn: [], t: Date.now(), saved: false, phase: "shuffle" };
    showTable();
    buildBoard();
    var fan = $("#fan");
    fan.className = "fan";
    fanH = 200;
    fan.style.height = fanH + "px";
    fan.innerHTML = '<div class="riffle"><span class="half a"></span><span class="half b"></span></div>';
    fanCards = [];
    layoutBoard();
    hint("Shuffling the deck…");
    scrollTo($("#table-view"));
    var mine = S;
    setTimeout(function () { if (S === mine) deal(); }, U.reduced ? 60 : 1700);
  }
  function showTable() {
    $("#ask-view").hidden = true;
    $("#table-view").hidden = false;
    $("#reading").hidden = true;
    $("#turn-all").hidden = true;
    $("#asked").textContent = S.q ? "“" + S.q + "”" : "An open question";
    $("#spread-name").textContent = S.sp.name;
  }
  function askAgain() {
    S = null; slots = []; fanCards = [];
    $("#table-view").hidden = true;
    $("#reading").hidden = true;
    $("#ask-view").hidden = false;
    $("#board").innerHTML = "";
    $("#fan").innerHTML = "";
    window.scrollTo({ top: 0, behavior: U.reduced ? "auto" : "smooth" });
    $("#q").focus({ preventScroll: true });
  }

  // ---------- the board ----------
  function buildBoard() {
    var board = $("#board");
    board.innerHTML = "";
    slots = [];
    S.sp.pos.forEach(function (p, i) {
      var a = S.sp.at[i], el = document.createElement("button");
      el.type = "button";
      el.disabled = true;
      el.className = "slot" + (a[2] === "cross" ? " cross" : "");
      el.title = (i + 1) + " · " + p.k;
      el.setAttribute("aria-label", (i + 1) + ", " + p.k + ": no card yet");
      el.innerHTML = '<span class="ghost">' + (S.sp.labels ? "" : i + 1) + "</span>" +
        (S.sp.labels ? '<span class="slot-label">' + U.esc(p.k) + '<span class="cn"></span></span>'
                     : '<span class="seal ' + (a[2] === "l" ? "l" : "tl") + '">' + (i + 1) + "</span>");
      el.addEventListener("click", function () { onSlot(i); });
      board.appendChild(el);
      slots.push(el);
    });
  }
  function layoutBoard() {
    if (!S) return;
    var sp = S.sp, drawing = S.phase === "shuffle" || S.phase === "draw";
    var avW = $("#table-view").clientWidth, labelH = sp.labels ? 84 : 16;
    var avH = Math.max(drawing ? 140 : 230, window.innerHeight - (drawing ? fanH + 190 : 170) - labelH);
    var w = Math.max(44, Math.floor(Math.min(sp.maxW, avW / sp.uw, avH / (sp.uh * RATIO)))), h = w * RATIO;
    var board = $("#board");
    board.style.width = Math.round(sp.uw * w) + "px";
    board.style.height = Math.round(sp.uh * h + labelH) + "px";
    slots.forEach(function (el, i) {
      var a = sp.at[i];
      el.style.left = (a[0] * w - w / 2).toFixed(1) + "px";
      el.style.top = (a[1] * h - h / 2).toFixed(1) + "px";
      el.style.width = w + "px";
      el.style.height = h.toFixed(1) + "px";
    });
  }

  // ---------- the fan: one arc on a wide table, several rows on a phone ----------
  function fanLayout() {
    var W = $("#fan").clientWidth, n = 78;
    var coarse = window.matchMedia("(pointer: coarse)").matches;
    var fw = Math.round(Math.min(84, Math.max(46, W / 9))), fh = fw * RATIO;
    var rows = Math.min(6, Math.max(1, Math.ceil((n - 1) * (coarse ? 22 : 13) / Math.max(1, W - fw))));
    var per = Math.ceil(n / rows), step = (W - fw) / Math.max(1, per - 1);
    var arc = rows === 1 ? 28 : 10, tilt = rows === 1 ? 22 : 7, gap = fh * 0.45, pos = [];
    for (var i = 0; i < n; i++) {
      var row = Math.floor(i / per), col = i % per, inRow = Math.min(per, n - row * per);
      var t = inRow > 1 ? col / (inRow - 1) - 0.5 : 0;
      pos.push({ x: (per - inRow) * step / 2 + col * step, y: 18 + row * gap + arc * 4 * t * t, r: t * tilt });
    }
    return { W: W, fw: fw, pos: pos, height: Math.round(18 + (rows - 1) * gap + fh + arc + 12) };
  }
  function placeFan(L) {
    fanCards.forEach(function (b, i) {
      var p = L.pos[i];
      b.style.setProperty("--fw", L.fw + "px");
      b.style.setProperty("--x", p.x.toFixed(1) + "px");
      b.style.setProperty("--y", p.y.toFixed(1) + "px");
      b.style.setProperty("--r", p.r.toFixed(2) + "deg");
    });
    fanH = L.height;
    $("#fan").style.height = fanH + "px";
  }
  function deal() {
    S.phase = "draw";
    var fan = $("#fan"), L = fanLayout(), cx = ((L.W - L.fw) / 2).toFixed(1) + "px";
    fan.innerHTML = "";
    S.order.forEach(function (cardId, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "fc";
      b.setAttribute("aria-label", "Card " + (i + 1) + " of 78, face down");
      b.style.setProperty("--fw", L.fw + "px");
      b.style.setProperty("--x", cx);
      b.style.setProperty("--y", "18px");
      b.style.setProperty("--r", "0deg");
      b.style.transitionDelay = U.reduced ? "0s" : i * 7 + "ms";
      b.addEventListener("click", function () { pick(i, b); });
      fan.appendChild(b);
      fanCards.push(b);
    });
    fan.getBoundingClientRect(); // commit the squared-up pack before it spreads out
    placeFan(L);
    setTimeout(function () { fanCards.forEach(function (b) { b.style.transitionDelay = ""; }); }, 78 * 7 + 600);
    var n = S.sp.pos.length;
    hint(n === 1 ? "Choose one card." : "Choose " + n + " cards.");
    layoutBoard();
  }

  // ---------- drawing a card ----------
  function pick(i, b) {
    if (!S || S.phase !== "draw" || S.picks >= S.sp.pos.length || b.classList.contains("taken")) return;
    var k = S.picks++, n = S.sp.pos.length, mine = S;
    S.drawn[k] = { card: T.deck[S.order[i]], rev: S.revAllowed && S.coin() };
    var from = b.getBoundingClientRect(), r0 = parseFloat(b.style.getPropertyValue("--r")) || 0;
    var fw = parseFloat(b.style.getPropertyValue("--fw")) || 60;
    b.classList.add("taken");
    b.disabled = true;
    var left = n - S.picks;
    hint(left ? "Choose " + left + " more." : "Laying them down…");
    var slot = slots[k], br = $("#board").getBoundingClientRect();
    fly(from, r0, fw, { x: br.left + slot.offsetLeft, y: br.top + slot.offsetTop, w: slot.offsetWidth, h: slot.offsetHeight,
                        r: slot.classList.contains("cross") ? 90 : 0 }, function () { if (S === mine) land(k); });
  }
  function fly(from, r0, fw, to, done) {
    if (U.reduced || !document.body.animate) { done(); return; }
    var el = document.createElement("span");
    el.className = "fly back";
    el.style.width = to.w + "px";
    el.style.height = to.h + "px";
    document.body.appendChild(el);
    var a = "translate(" + (from.left + from.width / 2 - to.w / 2) + "px," + (from.top + from.height / 2 - to.h / 2) + "px) rotate(" + r0 + "deg) scale(" + fw / to.w + ")";
    var z = "translate(" + to.x + "px," + to.y + "px) rotate(" + to.r + "deg) scale(1)";
    var anim = el.animate([{ transform: a }, { transform: z }], { duration: 620, easing: "cubic-bezier(.3,.7,.2,1)" });
    anim.onfinish = function () { el.remove(); done(); };
  }
  function land(k) {
    var slot = slots[k], d = S.drawn[k];
    slot.insertBefore(U.cardEl(d.card, d.rev), slot.children[1] || null);
    slot.classList.add("filled", "ready");
    slot.disabled = false;
    slot.setAttribute("aria-label", (k + 1) + ", " + S.sp.pos[k].k + ": face down. Turn it over");
    S.landed++;
    if (S.landed < S.sp.pos.length) return;
    S.phase = "turn";
    $("#fan").classList.add("closed");
    hint(S.landed === 1 ? "Turn the card over." : "Turn the cards over, one at a time.");
    $("#turn-all").hidden = S.landed < 3;
    layoutBoard();
  }

  // ---------- turning the cards ----------
  function onSlot(k) {
    if (!S) return;
    var slot = slots[k];
    if (slot.classList.contains("ready")) {
      if (S.phase !== "turn") { hint("Choose all your cards first."); return; }
      flip(k);
    } else if (slot.classList.contains("open")) {
      U.openCard(S.drawn[k], S.sp.pos[k]);
    }
  }
  function markOpen(k) {
    var slot = slots[k], d = S.drawn[k], name = d.card.name + (d.rev ? ", reversed" : ""), cn = slot.querySelector(".cn");
    slot.classList.remove("ready");
    slot.classList.add("open");
    if (cn) cn.textContent = name;
    slot.title = (k + 1) + " · " + S.sp.pos[k].k + " · " + name;
    slot.setAttribute("aria-label", (k + 1) + ", " + S.sp.pos[k].k + ": " + name + ". Open the card");
  }
  function flip(k) {
    slots[k].querySelector(".card").classList.add("up");
    markOpen(k);
    S.revealed++;
    var left = S.sp.pos.length - S.revealed;
    if (left) { hint(left + (left === 1 ? " card" : " cards") + " left to turn."); return; }
    S.phase = "done";
    $("#turn-all").hidden = true;
    hint("Tap any card to read it closely.");
    var mine = S;
    setTimeout(function () { if (S === mine) finish(); }, U.reduced ? 0 : 900);
  }
  function turnAll() {
    var t = 0, mine = S;
    $("#turn-all").hidden = true;
    slots.forEach(function (s, k) {
      if (!s.classList.contains("ready")) return;
      setTimeout(function () { if (S === mine && s.classList.contains("ready")) flip(k); }, t);
      t += U.reduced ? 0 : 240;
    });
  }
  function finish() {
    U.showReading(S, askAgain, function () { begin(S.id, S.q, S.revAllowed); });
    if (!S.saved) {
      S.saved = true;
      T.journal.add({ t: S.t, q: S.q, s: S.id, rv: S.revAllowed ? 1 : 0, c: S.drawn.map(function (d) { return [d.card.id, d.rev ? 1 : 0]; }) });
      renderJournal();
    }
    scrollTo($("#reading"));
  }

  // ---------- reopening a reading from the journal ----------
  function openEntry(e) {
    S = { id: e.s, sp: T.spreads[e.s], q: e.q || "", revAllowed: !!e.rv, t: e.t, saved: true, phase: "done",
          drawn: e.c.map(function (x) { return { card: T.deck[x[0]], rev: !!x[1] }; }) };
    S.picks = S.landed = S.revealed = S.drawn.length;
    showTable();
    buildBoard();
    var fan = $("#fan");
    fan.innerHTML = "";
    fan.className = "fan closed";
    fanCards = [];
    S.drawn.forEach(function (d, k) {
      var card = U.cardEl(d.card, d.rev);
      card.classList.add("up");
      slots[k].insertBefore(card, slots[k].children[1] || null);
      slots[k].classList.add("filled");
      slots[k].disabled = false;
      markOpen(k);
    });
    layoutBoard();
    hint("From your journal. Tap any card to read it closely.");
    U.showReading(S, askAgain, function () { begin(S.id, S.q, S.revAllowed); });
    scrollTo($("#table-view"));
  }
  function renderJournal() { U.renderJournal(openEntry); }

  // ---------- wiring ----------
  $("#ask-form").addEventListener("submit", function (e) {
    e.preventDefault();
    begin(chosen(), $("#q").value.trim(), $("#rev").checked);
  });
  $("#restart").addEventListener("click", askAgain);
  $("#turn-all").addEventListener("click", turnAll);
  renderJournal();
  $("#deck-browser").addEventListener("toggle", function () {
    if (this.open && !this.dataset.built) { this.dataset.built = "1"; U.buildDeckGrid(); }
  });
  var dlg = $("#dlg");
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  var track = $("#track"), snd = $("#sound");
  snd.addEventListener("click", function () {
    if (!track.paused) { track.pause(); return; }
    var p = track.play();
    if (p && p.catch) p.catch(function () { snd.textContent = "sound unavailable"; });
  });
  track.addEventListener("play", function () { snd.textContent = "❚❚ pause"; snd.setAttribute("aria-pressed", "true"); });
  track.addEventListener("pause", function () { snd.textContent = "▶ play Under the Glass"; snd.setAttribute("aria-pressed", "false"); });

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      if (!S) return;
      if (S.phase === "draw") placeFan(fanLayout());
      layoutBoard();
    }, 120);
  });
})();
