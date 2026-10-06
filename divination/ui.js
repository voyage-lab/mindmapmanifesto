// Rendering: card elements, the reading, the journal, the deck browser and the card dialog.
(function () {
  "use strict";
  var T = window.TAROT;
  var $ = function (s) { return document.querySelector(s); };
  var ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); };
  var ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function cardEl(card, rev) {
    var s = document.createElement("span");
    s.className = "card" + (rev ? " rev" : "");
    s.innerHTML = '<span class="card-in"><span class="side back"></span><span class="side front">' + T.art.face(card) + "</span></span>";
    return s;
  }
  function faceHTML(card, rev) { return '<span class="face' + (rev ? " rev" : "") + '">' + T.art.face(card) + "</span>"; }
  function kwList(card, rev) {
    return '<ul class="kw">' + (rev ? card.rv : card.up).map(function (k) { return "<li>" + esc(k) + "</li>"; }).join("") + "</ul>";
  }
  function fmtDate(t) {
    var d = new Date(t);
    return d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) + " · " +
      d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }
  function fmtShort(t) { return new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); }
  function corr(c) {
    return c.arcana === "major" ? "Major Arcana · " + ROMAN[c.num] + " · " + c.astro + " · " + c.heb
                                : c.suitName + " · " + c.element + " · " + c.astro;
  }

  // ---------- the card dialog ----------
  function openCard(d, pos) {
    var c = d.card, drawn = !!pos;
    var block = function (rev) {
      return '<div class="orient"><h3>' + (rev ? "Reversed" : "Upright") + (drawn && rev === d.rev ? "<small>as drawn</small>" : "") + "</h3>" +
        kwList(c, rev) + "<p>" + esc(rev ? c.r : c.u) + "</p></div>";
    };
    $("#dlg-body").innerHTML =
      '<div class="big rough">' + faceHTML(c, drawn && d.rev) + "</div>" +
      '<div><h2 id="dlg-title">' + esc(c.name) + '</h2><p class="corr">' + esc(corr(c)) + "</p>" +
      (drawn ? '<p class="where">In the place of ' + esc(pos.k) + ". " + esc(pos.d) + "</p>" : "") +
      (drawn && d.rev ? block(true) + block(false) : block(false) + block(true)) + "</div>";
    var dlg = $("#dlg");
    if (dlg.showModal) { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute("open", "");
  }

  // ---------- the reading ----------
  function showReading(S, onAgain, onRedraw) {
    var r = T.readSpread(S.id, S.drawn, S.revAllowed), sec = $("#reading");
    var html = '<h2 id="reading-h">the reading</h2><p class="when">' + esc(fmtDate(S.t)) + " · " + esc(S.sp.name) + "</p>" +
      '<p class="thread">' + esc(r.thread) + '</p><ol class="positions">';
    S.drawn.forEach(function (d, i) {
      var p = S.sp.pos[i], c = d.card;
      html += '<li class="pos"><button type="button" class="thumb" data-i="' + i + '" aria-label="Open ' + esc(c.name) + '">' + faceHTML(c, d.rev) + "</button>" +
        '<div><p class="lbl">' + (S.sp.labels ? "" : (i + 1) + " · ") + esc(p.k) + "<small>" + esc(p.d) + "</small></p>" +
        "<h3>" + esc(c.name) + (d.rev ? " <em>reversed</em>" : "") + "</h3>" + kwList(c, d.rev) +
        "<p>" + esc(d.rev ? c.r : c.u) + "</p></div></li>";
    });
    html += "</ol>";
    if (r.notes.length) {
      html += '<div class="signs">' + r.notes.map(function (n) { return '<div class="sign"><h4>' + esc(n.h) + "</h4><p>" + esc(n.p) + "</p></div>"; }).join("") + "</div>";
    }
    html += '<div class="reading-actions"><button class="btn" type="button" data-act="redraw">same question, new cards</button>' +
      '<button class="btn quiet" type="button" data-act="again">ask something else</button></div>';
    sec.innerHTML = html;
    sec.hidden = false;
    sec.querySelectorAll(".thumb").forEach(function (b) {
      b.addEventListener("click", function () { var i = +b.dataset.i; openCard(S.drawn[i], S.sp.pos[i]); });
    });
    sec.querySelector('[data-act="redraw"]').addEventListener("click", onRedraw);
    sec.querySelector('[data-act="again"]').addEventListener("click", onAgain);
  }

  // ---------- the journal ----------
  function renderJournal(onOpen) {
    var list = T.journal.load(), ol = $("#journal-list"), foot = $("#journal-foot");
    var valid = list.filter(function (e) {
      return e && T.spreads[e.s] && Array.isArray(e.c) && e.c.length === T.spreads[e.s].pos.length &&
        e.c.every(function (x) { return Array.isArray(x) && T.deck[x[0]]; });
    });
    if (!valid.length) {
      ol.innerHTML = '<li class="empty">No readings yet. Every finished spread is kept here.</li>';
      foot.innerHTML = "";
      return;
    }
    ol.innerHTML = valid.map(function (e, k) {
      var names = e.c.map(function (x) { return T.deck[x[0]].name + (x[1] ? " (reversed)" : ""); }).join(" · ");
      return '<li><span class="jdate">' + esc(fmtShort(e.t)) + '</span><div><p class="jq">' + esc(e.q || "An open question") +
        '</p><p class="jcards">' + esc(T.spreads[e.s].name) + " — " + esc(names) + '</p></div>' +
        '<button type="button" class="link" data-k="' + k + '">open</button></li>';
    }).join("");
    ol.querySelectorAll("[data-k]").forEach(function (b) {
      b.addEventListener("click", function () { onOpen(valid[+b.dataset.k]); });
    });
    foot.innerHTML = '<button type="button" class="link" id="jclear">clear the journal</button>';
    var armed = false;
    $("#jclear").addEventListener("click", function () {
      if (!armed) { armed = true; this.textContent = "tap again to delete every reading"; return; }
      T.journal.clear();
      renderJournal(onOpen);
    });
  }

  // ---------- the seventy-eight ----------
  function buildDeckGrid() {
    var groups = [{ h: "Major Arcana", sub: "the trumps", cards: T.deck.slice(0, 22) }].concat(T.suits.map(function (s) {
      return { h: s.name, sub: s.element, cards: T.deck.filter(function (c) { return c.suit === s.id; }) };
    }));
    var host = $("#deck-grid");
    host.innerHTML = groups.map(function (g) {
      return '<div class="group"><h3>' + g.h + "<small>" + g.sub + '</small></h3><div class="grid">' +
        g.cards.map(function (c) {
          return '<button type="button" class="mini-card" data-id="' + c.id + '" aria-label="' + esc(c.name) + '">' + faceHTML(c, false) + "</button>";
        }).join("") + "</div></div>";
    }).join("");
    host.addEventListener("click", function (e) {
      var b = e.target.closest(".mini-card");
      if (b) openCard({ card: T.deck[+b.dataset.id], rev: false }, null);
    });
  }

  // ---------- paper grain, drawn once ----------
  function grain() {
    try {
      var c = document.createElement("canvas"), n = 128;
      c.width = c.height = n;
      var x = c.getContext("2d"), img = x.createImageData(n, n), px = img.data;
      for (var i = 0; i < px.length; i += 4) {
        var v = Math.random() * 255;
        px[i] = 112; px[i + 1] = 84; px[i + 2] = 48; px[i + 3] = v < 170 ? 0 : (v - 170) * 0.45;
      }
      x.putImageData(img, 0, 0);
      x.strokeStyle = "rgba(110, 80, 40, .12)";
      x.lineWidth = 0.6;
      for (var k = 0; k < 24; k++) {
        var sx = Math.random() * n, sy = Math.random() * n;
        x.beginPath();
        x.moveTo(sx, sy);
        x.quadraticCurveTo(sx + Math.random() * 20 - 10, sy + Math.random() * 20 - 10, sx + Math.random() * 30 - 15, sy + Math.random() * 30 - 15);
        x.stroke();
      }
      return "url(" + c.toDataURL() + ")";
    } catch (e) { return "none"; }
  }

  T.ui = { $: $, esc: esc, reduced: reduced, cardEl: cardEl, faceHTML: faceHTML, openCard: openCard,
           showReading: showReading, renderJournal: renderJournal, buildDeckGrid: buildDeckGrid, grain: grain };
})();
