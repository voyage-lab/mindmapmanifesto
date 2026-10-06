// Card art: ink line drawings on paper, with a stencil tint layer printed slightly
// off-register, the way old woodcut tarot was coloured by hand.
// Classes: k = solid ink, pf = paper fill, th = thin, w = wide, t1 rust, t2 glass, t3 bronze, tx = text.
(function () {
  "use strict";
  var T = window.TAROT;
  var f = function (n) { return Math.round(n * 100) / 100; };
  var D = function (s) { // tagged template that rounds numbers
    var out = s[0];
    for (var i = 1; i < arguments.length; i++) {
      var v = arguments[i];
      out += (typeof v === "number" ? f(v) : v) + s[i];
    }
    return out;
  };
  var cl = function (c) { return c ? ' class="' + c + '"' : ""; };
  var C = function (x, y, r, c) { return '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(r) + '"' + cl(c) + "/>"; };
  var E = function (x, y, rx, ry, c, rot) {
    return '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="' + f(rx) + '" ry="' + f(ry) + '"' + cl(c) +
      (rot ? ' transform="rotate(' + f(rot) + " " + f(x) + " " + f(y) + ')"' : "") + "/>";
  };
  var L = function (a, b, c2, d, c) { return '<line x1="' + f(a) + '" y1="' + f(b) + '" x2="' + f(c2) + '" y2="' + f(d) + '"' + cl(c) + "/>"; };
  var P = function (d, c) { return '<path d="' + d + '"' + cl(c) + "/>"; };
  var R = function (x, y, w, h, c, rx) { return '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(w) + '" height="' + f(h) + '"' + (rx ? ' rx="' + rx + '"' : "") + cl(c) + "/>"; };
  var X = function (x, y, s, size, c) { return '<text x="' + f(x) + '" y="' + f(y) + '" font-size="' + size + '" class="tx ' + (c || "") + '">' + s + "</text>"; };
  var G = function (tr, inner) { return '<g transform="' + tr + '">' + inner + "</g>"; };
  var rad = function (d) { return d * Math.PI / 180; };
  var pt = function (x, y, r, a) { return [x + r * Math.cos(rad(a)), y + r * Math.sin(rad(a))]; };

  function star(x, y, ro, ri, n, rot) {
    rot = rot === undefined ? -90 : rot;
    var d = "";
    for (var i = 0; i < n * 2; i++) {
      var p = pt(x, y, i % 2 ? ri : ro, rot + i * 180 / n);
      d += (i ? "L" : "M") + f(p[0]) + " " + f(p[1]);
    }
    return d + "Z";
  }
  function pentagram(x, y, r, rot) {
    rot = rot === undefined ? -90 : rot;
    var d = "";
    [0, 2, 4, 1, 3].forEach(function (k, i) {
      var p = pt(x, y, r, rot + k * 72);
      d += (i ? "L" : "M") + f(p[0]) + " " + f(p[1]);
    });
    return d + "Z";
  }
  // radiating hatch lines, like the starburst around "I am" on the map
  function rays(x, y, r1, r2, n, c, alt, off) {
    var s = "";
    for (var i = 0; i < n; i++) {
      var a = (off || 0) + i * 360 / n, rr = alt && i % 2 ? r1 + (r2 - r1) * alt : r2;
      var p = pt(x, y, r1, a), q = pt(x, y, rr, a);
      s += L(p[0], p[1], q[0], q[1], c === undefined ? "th" : c);
    }
    return s;
  }
  function crescent(x, y, r, rot, c) {
    return G("rotate(" + rot + " " + x + " " + y + ")",
      P(D`M${x - r} ${y}A${r} ${r} 0 0 0 ${x + r} ${y}A${r} ${r * 0.5} 0 0 1 ${x - r} ${y}Z`, c));
  }
  function leaf(x, y, len, ang) {
    var t = pt(x, y, len, ang), a = pt(x, y, len * 0.6, ang - 28), b = pt(x, y, len * 0.6, ang + 28);
    return P(D`M${x} ${y}Q${a[0]} ${a[1]} ${t[0]} ${t[1]}Q${b[0]} ${b[1]} ${x} ${y}Z`, "th");
  }
  function cloud(x, y, w, c) {
    var n = 4, step = 2 * w / n, d = D`M${x - w} ${y}`;
    for (var i = 0; i < n; i++) {
      var x0 = x - w + i * step;
      d += D`Q${x0 + step / 2} ${y - step * 0.9} ${x0 + step} ${y}`;
    }
    return P(d + "Z", c || "t2");
  }
  function rosette(x, y, r) {
    var s = "";
    for (var i = 0; i < 4; i++) s += E(x + (r * 0.55) * Math.cos(rad(i * 90)), y + (r * 0.55) * Math.sin(rad(i * 90)), r * 0.5, r * 0.28, "t1", i * 90);
    return s + C(x, y, r * 0.22, "k") + leaf(x - r, y, r * 0.9, 180) + leaf(x + r, y, r * 0.9, 0);
  }

  // ---------- suit icons (s = 1 is about 20 units tall) ----------
  function cup(x, y, s) {
    s = s || 1;
    return P(D`M${x - 6 * s} ${y - 7 * s}C${x - 6 * s} ${y + 1.5 * s} ${x + 6 * s} ${y + 1.5 * s} ${x + 6 * s} ${y - 7 * s}Z`, "t3") +
      E(x, y - 7 * s, 6 * s, 1.3 * s, "pf") +
      L(x, y - 0.6 * s, x, y + 6.8 * s) +
      E(x, y + 2.8 * s, 1.5 * s, 0.9 * s, "k") +
      P(D`M${x - 4.5 * s} ${y + 8.6 * s}Q${x} ${y + 5 * s} ${x + 4.5 * s} ${y + 8.6 * s}Z`, "t3");
  }
  function pent(x, y, s) {
    s = s || 1;
    return C(x, y, 8 * s, "t3") + C(x, y, 6.6 * s, "th") + P(pentagram(x, y, 6.5 * s), "th");
  }
  function sword(x, y, s, rot) {
    s = s || 1;
    var b = P(D`M${x} ${y - 11 * s}L${x + 1.3 * s} ${y - 8.6 * s}L${x + 1.3 * s} ${y + 5 * s}L${x - 1.3 * s} ${y + 5 * s}L${x - 1.3 * s} ${y - 8.6 * s}Z`, "t2") +
      L(x, y - 8 * s, x, y + 4 * s, "th") +
      L(x - 5 * s, y + 5.6 * s, x + 5 * s, y + 5.6 * s, "w") +
      C(x - 5.4 * s, y + 5.6 * s, 0.8 * s, "k") + C(x + 5.4 * s, y + 5.6 * s, 0.8 * s, "k") +
      L(x, y + 6 * s, x, y + 9.6 * s, "w") + C(x, y + 10.8 * s, 1.2 * s, "k");
    return rot ? G("rotate(" + rot + " " + f(x) + " " + f(y) + ")", b) : b;
  }
  function wand(x, y, s, rot) {
    s = s || 1;
    var b = P(D`M${x - 1.4 * s} ${y + 11 * s}L${x - 1.1 * s} ${y - 10 * s}Q${x} ${y - 11.6 * s} ${x + 1.1 * s} ${y - 10 * s}L${x + 1.4 * s} ${y + 11 * s}Z`, "t1") +
      L(x - 1.2 * s, y - 3 * s, x + 1.2 * s, y - 2.4 * s, "th") + L(x - 1.3 * s, y + 4 * s, x + 1.3 * s, y + 4.6 * s, "th") +
      leaf(x + 1.1 * s, y - 6 * s, 4 * s, -35) + leaf(x - 1.1 * s, y - 1 * s, 3.6 * s, 215);
    return rot ? G("rotate(" + rot + " " + f(x) + " " + f(y) + ")", b) : b;
  }
  var ICON = { wands: wand, cups: cup, swords: sword, pentacles: pent };

  // a long rod for the sheaf of wands, rotated about its foot
  function staff(x, yb, len, ang, leaves) {
    var yt = yb - len;
    var s = P(D`M${x - 1.6} ${yb}L${x - 1.2} ${yt + 2}Q${x} ${yt - 1} ${x + 1.2} ${yt + 2}L${x + 1.6} ${yb}Z`, "t1");
    for (var i = 1; i < 4; i++) { var yy = yb - len * i / 4.4; s += L(x - 1.4, yy, x + 1.4, yy + 0.6, "th"); }
    if (leaves) s += leaf(x + 1.2, yt + 9, 5.5, -40) + leaf(x - 1.2, yt + 16, 5, 220);
    return G("rotate(" + f(ang) + " " + x + " " + yb + ")", s);
  }
  // a full sword centred on (cx, cy), for the crossed fan of swords
  function blade(cx, cy, ang, guard) {
    var t = cy - 58, b = cy + 38;
    var s = P(D`M${cx} ${t}L${cx + 2.3} ${t + 6}L${cx + 2.3} ${b}L${cx - 2.3} ${b}L${cx - 2.3} ${t + 6}Z`, "t2") +
      L(cx, t + 8, cx, b - 3, "th") +
      L(cx - guard, b + 1.5, cx + guard, b + 1.5, "w") +
      C(cx - guard - 1.2, b + 1.5, 1.3, "k") + C(cx + guard + 1.2, b + 1.5, 1.3, "k") +
      L(cx, b + 3, cx, b + 15, "w") + C(cx, b + 17.5, 2.4, "k");
    return G("rotate(" + f(ang) + " " + cx + " " + cy + ")", s);
  }
  // alchemical element triangles
  function elem(el, x, y, s) {
    var h = 9 * s, w = 5 * s, up = el === "fire" || el === "air";
    var out = P(up ? D`M${x} ${y - h / 2}L${x + w} ${y + h / 2}L${x - w} ${y + h / 2}Z`
                   : D`M${x} ${y + h / 2}L${x + w} ${y - h / 2}L${x - w} ${y - h / 2}Z`, "");
    if (el === "air" || el === "earth") out += L(x - w * 0.9, y, x + w * 0.9, y);
    return out;
  }

  // ---------- minor arcana ----------
  var PIPS = {
    2: [[60, 52], [60, 150]],
    3: [[60, 50], [60, 101], [60, 152]],
    4: [[38, 58], [82, 58], [38, 144], [82, 144]],
    5: [[38, 54], [82, 54], [60, 101], [38, 148], [82, 148]],
    6: [[38, 50], [82, 50], [38, 101], [82, 101], [38, 152], [82, 152]],
    7: [[38, 48], [82, 48], [60, 74], [38, 101], [82, 101], [38, 154], [82, 154]],
    8: [[38, 46], [82, 46], [60, 72], [38, 101], [82, 101], [60, 130], [38, 156], [82, 156]],
    9: [[38, 44], [82, 44], [38, 80], [82, 80], [60, 101], [38, 122], [82, 122], [38, 158], [82, 158]],
    10: [[38, 44], [82, 44], [60, 62], [38, 80], [82, 80], [38, 122], [82, 122], [60, 140], [38, 158], [82, 158]]
  };
  var PIP_SCALE = { 2: 1.7, 3: 1.45, 4: 1.45, 5: 1.35, 6: 1.25, 7: 1.15, 8: 1.05, 9: 1, 10: 0.95 };
  var COURT_SCALE = { wands: 3.2, swords: 3, cups: 2.5, pentacles: 2.6 };
  var SWORD_SPREAD = { 2: 56, 3: 60, 4: 66, 5: 70, 6: 74, 7: 78, 8: 80, 9: 82, 10: 84 };
  var WAND_SPREAD = { 2: 22, 3: 28, 4: 32, 5: 34, 6: 36, 7: 37, 8: 38, 9: 39, 10: 40 };

  function pipArt(suit, n) {
    var s = "", i, a;
    if (suit === "swords") {
      var sp = SWORD_SPREAD[n], g = n > 6 ? 4.5 : n > 3 ? 6 : 8;
      for (i = 0; i < n; i++) { a = -sp / 2 + sp * i / (n - 1); s += blade(60, 101, a, g); }
      return s;
    }
    if (suit === "wands") {
      var ws = WAND_SPREAD[n];
      for (i = 0; i < n; i++) {
        a = -ws / 2 + ws * i / (n - 1);
        s += staff(60, 172, 126, a, n <= 5 || i === 0 || i === n - 1);
      }
      var half = 20 * Math.tan(rad(ws / 2)) + 2.6;
      return s + R(60 - half, 147, half * 2, 7, "t1", 1.5) + L(60 - half, 150.5, 60 + half, 150.5, "th");
    }
    if (n === 2 || n === 4) s += rosette(60, 101, 8);
    PIPS[n].forEach(function (p) { s += ICON[suit](p[0], p[1], PIP_SCALE[n]); });
    return s;
  }
  function aceArt(suit) {
    var s = rays(60, 96, 31, 46, 56, "th", 0.62) + cloud(60, 160, 26);
    if (suit === "wands") s += wand(60, 96, 2.7);
    if (suit === "cups") s += cup(60, 98, 2.5);
    if (suit === "pentacles") s += pent(60, 96, 3.1);
    if (suit === "swords") {
      s += sword(60, 102, 2.6) +
        P("M50 66 L50 58 L54 62 L60 54 L66 62 L70 58 L70 66 Z", "t3") + L(50, 66, 70, 66, "w");
    }
    return s;
  }
  function headgear(rank) {
    if (rank === 11) return P("M42 64 Q42 46 60 46 Q78 46 78 64 Z", "t2") + P("M38 64 L82 64 L80 69 L40 69 Z", "pf") +
      P("M70 50 C82 36 94 32 100 28 C95 39 86 47 72 54 Z", "t1") + L(72, 52, 98, 30, "th");
    if (rank === 12) return P("M60 38 C58 26 66 20 78 22 C71 24 66 30 66 39 Z", "t1") +
      P("M44 72 L44 54 Q44 38 60 38 Q76 38 76 54 L76 72 Z", "t2") + L(48, 56, 72, 56, "w") +
      C(52, 63, 1, "k") + C(56, 63, 1, "k") + C(64, 63, 1, "k") + C(68, 63, 1, "k") + L(60, 40, 60, 54, "th");
    if (rank === 13) return P("M42 62 L44 44 L51 54 L60 40 L69 54 L76 44 L78 62 Z", "t3") + R(42, 61, 36, 8, "t3") +
      C(44, 44, 2, "pf") + C(60, 40, 2.2, "pf") + C(76, 44, 2, "pf") +
      P("M42 69 Q35 82 38 96", "th") + P("M78 69 Q85 82 82 96", "th");
    var s = P("M40 62 L42 44 L51 53 L60 38 L69 53 L78 44 L80 62 Z", "t3") + R(40, 61, 40, 9, "t3") +
      C(50, 65.5, 1.6, "k") + C(60, 65.5, 2, "t1") + C(70, 65.5, 1.6, "k");
    [[42, 44], [60, 38], [78, 44]].forEach(function (p) {
      s += L(p[0], p[1] - 7, p[0], p[1]) + L(p[0] - 2.6, p[1] - 4.4, p[0] + 2.6, p[1] - 4.4);
    });
    return s;
  }
  function courtArt(suit, rank) {
    var s = rank >= 13 ? P("M28 172 L28 100 Q28 76 60 76 Q92 76 92 100 L92 172", "th") + L(28, 172, 92, 172, "th") : "";
    return s + ICON[suit](60, 124, COURT_SCALE[suit]) + headgear(rank);
  }

  // ---------- assembly ----------
  var ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
  var FRAME = R(5, 5, 110, 198, "", 3) + R(8.5, 8.5, 103, 191, "th", 2) + L(8.5, 28, 111.5, 28, "th") + L(8.5, 178, 111.5, 178, "th");

  function nameText(name) {
    var up = name.toUpperCase(), size = Math.min(9.4, 102 / (up.length * 0.74));
    return '<text class="nm" x="60" y="' + f(191 - (9.4 - size) * 0.3) + '" font-size="' + f(size) + '">' + up + "</text>";
  }
  function face(card) {
    var art, top;
    if (card.arcana === "major") {
      art = T.art.majors[card.num]();
      top = '<text class="nu" x="60" y="23" font-size="12">' + ROMAN[card.num] + "</text>";
    } else {
      var r = card.num;
      art = r === 1 ? aceArt(card.suit) : r > 10 ? courtArt(card.suit, r) : pipArt(card.suit, r);
      top = r === 1 || r > 10 ? elem(card.element, 60, 18, 0.9) : '<text class="nu" x="60" y="23" font-size="12">' + ROMAN[r] + "</text>";
    }
    return '<svg class="cf" viewBox="0 0 120 208" aria-hidden="true" focusable="false">' +
      '<g class="tint" transform="translate(1.1 0.8)">' + art + "</g>" +
      '<g class="ink">' + FRAME + top + art + nameText(card.name) + "</g></svg>";
  }

  // The back is symmetrical top to bottom, so nobody can tell a reversed card before it turns.
  function backURI() {
    var ln = "#cfc6b2", s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 208">' +
      '<defs><clipPath id="c"><rect x="8.5" y="8.5" width="103" height="191" rx="2"/></clipPath></defs>' +
      '<rect width="120" height="208" rx="6" fill="#161412"/>' +
      '<g fill="none" stroke="' + ln + '" stroke-linecap="round">' +
      '<g clip-path="url(#c)" stroke-width=".35" opacity=".16">';
    for (var i = -208; i <= 120; i += 9) s += L(i, 0, i + 208, 208) + L(120 - i, 0, 120 - i - 208, 208);
    s += '</g><rect x="5" y="5" width="110" height="198" rx="3" stroke-width=".8" opacity=".7"/>' +
      '<rect x="8.5" y="8.5" width="103" height="191" rx="2" stroke-width=".4" opacity=".5"/>' +
      '<circle cx="60" cy="104" r="44" fill="#161412" stroke-width=".7" opacity=".85"/>' +
      '<circle cx="60" cy="104" r="40.5" stroke-width=".4" opacity=".6"/>' +
      '<g stroke-width=".45" opacity=".8">' + rays(60, 104, 17, 37, 72, "", 0.72) + "</g>" +
      '<path d="M30 104 Q60 82 90 104 Q60 126 30 104Z" fill="#161412" stroke-width="1.1"/>' +
      '<circle cx="60" cy="104" r="8.5" stroke-width=".9"/><circle cx="60" cy="104" r="3.6" fill="' + ln + '" stroke="none"/>' +
      '<g stroke-width=".7" opacity=".8">' + crescent(60, 36, 7, 180, "").replace("<path", '<path fill="none"') +
      crescent(60, 172, 7, 0, "").replace("<path", '<path fill="none"') + "</g>";
    [[20, 20], [100, 20], [20, 188], [100, 188]].forEach(function (p) {
      s += '<path d="' + star(p[0], p[1], 4, 1, 4) + '" fill="' + ln + '" stroke="none" opacity=".7"/>';
    });
    return "data:image/svg+xml," + encodeURIComponent(s + "</g></svg>");
  }

  T.art = {
    face: face, backURI: backURI, elem: elem, icon: function (suit, x, y, s) { return ICON[suit](x, y, s); },
    h: { C: C, E: E, L: L, P: P, R: R, X: X, G: G, D: D, f: f, pt: pt, rad: rad, star: star, pentagram: pentagram,
         rays: rays, crescent: crescent, leaf: leaf, cloud: cloud, rosette: rosette,
         cup: cup, pent: pent, sword: sword, wand: wand }
  };
})();
