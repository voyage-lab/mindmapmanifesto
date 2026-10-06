// The deck, the spreads, the shuffle, and how a finished spread is read.
(function () {
  "use strict";
  var T = window.TAROT;

  // ---------- the deck: 0–21 majors, then 14 of each suit ----------
  var deck = [];
  T.majors.forEach(function (m, i) {
    deck.push({ id: i, arcana: "major", num: i, name: m.name, astro: m.astro, heb: m.heb, up: m.up, rv: m.rv, u: m.u, r: m.r });
  });
  T.suits.forEach(function (s) {
    T.minors[s.id].forEach(function (c, ri) {
      deck.push({ id: deck.length, arcana: "minor", num: ri + 1, suit: s.id, suitName: s.name, element: s.element,
        name: T.ranks[ri] + " of " + s.name, astro: c[0], up: c[1], rv: c[2], u: c[3], r: c[4] });
    });
  });
  T.deck = deck;

  // ---------- spreads: x in card widths, y in card heights, to each card's centre ----------
  T.spreads = {
    one: { name: "one card", labels: true, maxW: 210, uw: 1, uh: 1,
      pos: [{ k: "the card", d: "The heart of the matter, or a straight answer." }],
      at: [[0.5, 0.5]] },
    three: { name: "three cards", labels: true, maxW: 170, uw: 3.9, uh: 1,
      pos: [{ k: "past", d: "What brought you here." },
            { k: "present", d: "Where you stand now." },
            { k: "future", d: "Where this is heading if nothing changes." }],
      at: [[0.5, 0.5], [1.95, 0.5], [3.4, 0.5]] },
    fate: { name: "fate & will", labels: true, maxW: 160, uw: 3.9, uh: 1.62,
      pos: [{ k: "fate", d: "What is given: circumstances outside your control." },
            { k: "will", d: "What is yours to choose." },
            { k: "where they meet", d: "What comes of the two together." }],
      at: [[0.5, 0.5], [3.4, 0.5], [1.95, 1.12]] },
    cross: { name: "celtic cross", labels: false, maxW: 118, uw: 5.6, uh: 4.06,
      pos: [{ k: "the heart", d: "The situation as it stands." },
            { k: "the crossing", d: "What stands in the way, or must be reckoned with." },
            { k: "the root", d: "The foundation underneath, including what you may not see." },
            { k: "the recent past", d: "What is passing away." },
            { k: "the crown", d: "Your aim, or the best that can come of this." },
            { k: "the near future", d: "What is coming next." },
            { k: "yourself", d: "Your attitude, and how you are showing up." },
            { k: "your surroundings", d: "Other people and the world around you." },
            { k: "hopes and fears", d: "What you long for and what you dread. Often the same thing." },
            { k: "the outcome", d: "Where this leads if the current continues." }],
      at: [[2.05, 2.03], [2.05, 2.03, "cross"], [2.05, 3.28], [0.5, 2.03], [2.05, 0.78], [3.6, 2.03],
           [5.1, 3.56], [5.1, 2.54], [5.1, 1.52], [5.1, 0.5]] }
  };

  // ---------- shuffle: Fisher–Yates on the crypto generator ----------
  T.shuffle = function (n) {
    var buf = new Uint32Array(1), hasCrypto = !!(window.crypto && crypto.getRandomValues);
    function rnd(k) {
      if (!hasCrypto) return Math.floor(Math.random() * k);
      var lim = Math.floor(0x100000000 / k) * k, x;
      do { crypto.getRandomValues(buf); x = buf[0]; } while (x >= lim);
      return x % k;
    }
    var a = [];
    for (var i = 0; i < n; i++) a.push(i);
    for (var j = n - 1; j > 0; j--) { var r = rnd(j + 1), t = a[j]; a[j] = a[r]; a[r] = t; }
    return { order: a, coin: function () { return rnd(2) === 1; } };
  };

  // ---------- reading a finished spread ----------
  var COUNT = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  var NUM_NAME = ["", "Aces", "Twos", "Threes", "Fours", "Fives", "Sixes", "Sevens", "Eights", "Nines", "Tens"];
  var NUM = { 1: "new beginnings", 2: "choices and partnership", 3: "growth and expression", 4: "stability, or standing still",
    5: "conflict and change", 6: "harmony and recovery", 7: "assessment and challenge", 8: "movement and mastery",
    9: "something nearly complete", 10: "an ending that completes a cycle" };
  var MISSING = { wands: "Drive and passion are missing from the picture.", cups: "Feelings are being left out of the calculation.",
    swords: "Nobody has thought this through out loud yet.", pentacles: "Money and practical matters aren't the real issue." };
  var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var kw = function (d) { return (d.rev ? d.card.rv : d.card.up)[0]; };
  var isMajor = function (d) { return d.card.arcana === "major"; };

  T.readSpread = function (spreadId, drawn, revAllowed) {
    var n = drawn.length, notes = [], thread, d0 = drawn[0];
    if (spreadId === "one") thread = d0.card.name + (d0.rev ? ", reversed" : "") + ": " + (d0.rev ? d0.card.rv : d0.card.up).join(", ") + ".";
    else if (spreadId === "three") thread = "From " + kw(drawn[0]) + ", through " + kw(drawn[1]) + ", toward " + kw(drawn[2]) + ".";
    else if (spreadId === "fate") thread = "Given " + kw(drawn[0]) + " and choosing " + kw(drawn[1]) + ", you arrive at " + kw(drawn[2]) + ".";
    else thread = "At the heart, " + kw(drawn[0]) + ". Across it, " + kw(drawn[1]) + ". It leans toward " + kw(drawn[9]) + ".";

    if (spreadId === "fate") {
      var fm = isMajor(drawn[0]), wm = isMajor(drawn[1]);
      if (fm && !wm) notes.push({ h: "Fate leads", p: "Circumstance sets the tone right now. Work with what is given, not against it." });
      else if (wm && !fm) notes.push({ h: "Will leads", p: "The outcome is mostly your call. What you choose matters more than what happens." });
      else notes.push({ h: "Level", p: "Fate and will are evenly matched. A hinge point, where the current can turn." });
    }

    var majors = drawn.filter(isMajor), M = majors.length;
    if (n === 1) {
      notes.push(M ? { h: "A Major Arcana card", p: "The answer points to a larger theme in your life, not just today." }
                   : { h: "A Minor Arcana card", p: "This is an everyday matter, and it's in your hands." });
    } else if (M === 0) {
      notes.push({ h: "No Major Arcana", p: "Nothing here is fated. What you do counts for more than what happens to you." });
    } else if (M * 2 >= n) {
      notes.push({ h: cap(COUNT[M]) + " of " + COUNT[n] + " from the Major Arcana", p: "Big forces are at work. Treat this as a chapter of your life, not a passing week." });
    } else {
      notes.push({ h: cap(COUNT[M]) + " Major Arcana", p: "A larger theme runs under the details. Read " + majors.map(function (d) { return d.card.name; }).join(" and ") + " first." });
    }

    if (n >= 3) {
      var suitCount = {}, rankCount = {}, courts = 0;
      T.suits.forEach(function (s) { suitCount[s.id] = 0; });
      drawn.forEach(function (d) {
        if (isMajor(d)) return;
        suitCount[d.card.suit]++;
        if (d.card.num > 10) courts++; else rankCount[d.card.num] = (rankCount[d.card.num] || 0) + 1;
      });
      var top = T.suits.slice().sort(function (a, b) { return suitCount[b.id] - suitCount[a.id]; });
      if (suitCount[top[0].id] >= 2 && suitCount[top[0].id] > suitCount[top[1].id]) {
        notes.push({ h: top[0].name + " lead", p: cap(COUNT[suitCount[top[0].id]]) + " " + top[0].name.toLowerCase() + " (" + top[0].element + "): this is mostly about " + top[0].theme + "." });
      }
      if (n >= 10) {
        T.suits.filter(function (s) { return !suitCount[s.id]; }).slice(0, 2).forEach(function (s) {
          notes.push({ h: "No " + s.name, p: MISSING[s.id] });
        });
      }
      var repeats = Object.keys(rankCount).filter(function (r) { return rankCount[r] >= 2; });
      if (repeats.length === 1) {
        var r1 = repeats[0];
        notes.push({ h: cap(COUNT[rankCount[r1]]) + " " + NUM_NAME[r1], p: "A repeated number points to " + NUM[r1] + "." });
      } else if (repeats.length > 1) {
        notes.push({ h: "Repeated numbers", p: repeats.map(function (r) {
          return cap(COUNT[rankCount[r]]) + " " + NUM_NAME[r] + ": " + NUM[r] + ".";
        }).join(" ") });
      }
      if (courts >= 2) notes.push({ h: cap(COUNT[courts]) + " court cards", p: "Other people, or different sides of you, are central here." });
    }

    var R = drawn.filter(function (d) { return d.rev; }).length;
    if (n === 1 && R) notes.push({ h: "Reversed", p: "The energy is blocked, delayed or turned inward. Read the card as a question as much as an answer." });
    else if (n >= 3 && R * 2 > n) notes.push({ h: cap(COUNT[R]) + " of " + COUNT[n] + " reversed", p: "Much is blocked, delayed or turned inward. Look at what you're resisting." });
    else if (n >= 3 && R === 0 && revAllowed) notes.push({ h: "Every card upright", p: "The energy moves outward. Things are free to happen." });

    return { thread: thread, notes: notes };
  };

  // ---------- journal: the last readings, in this browser only ----------
  var KEY = "mmm-divination-journal";
  T.journal = {
    load: function () {
      try { var v = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(v) ? v : []; } catch (e) { return []; }
    },
    add: function (entry) {
      var list = this.load();
      list.unshift(entry);
      try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, 40))); } catch (e) { /* storage blocked: the reading still shows */ }
    },
    clear: function () { try { localStorage.removeItem(KEY); } catch (e) { /* nothing to clear */ } }
  };
})();
