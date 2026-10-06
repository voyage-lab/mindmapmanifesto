// Shared runtime for the 15 Brain Waves deck series.
// This logic was previously duplicated verbatim inside a <script> tag in
// every one of the 15 HTML files (confirmed byte-identical across all of
// them before extraction) — one copy here replaces all 15.

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // custom cursor (desktop only; CSS hides #cur under 700px)
  const cur = document.getElementById('cur');
  if (cur) {
    document.addEventListener('mousemove', e => {
      cur.style.left = e.clientX + 'px';
      cur.style.top = e.clientY + 'px';
    });
  }

  // ambient rising particles
  if (!reduceMotion) {
    const pts = document.getElementById('pts');
    if (pts) {
      for (let i = 0; i < 22; i++) {
        const p = document.createElement('div');
        p.className = 'pt';
        const sz = Math.random() * 2.5 + 1;
        p.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;background:rgba(160,198,248,${(Math.random() * .18 + .06).toFixed(2)});animation-duration:${Math.random() * 18 + 12}s;animation-delay:${Math.random() * 12}s`;
        pts.appendChild(p);
      }
    }
  }

  // slide deck navigation
  const slides = Array.from(document.querySelectorAll('.slide'));
  const N = slides.length;
  let cur_i = 0;

  const dotsEl = document.getElementById('dots');
  const bar = document.getElementById('bar');

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.className = 'dot' + (i === 0 ? ' on' : '');
    d.setAttribute('aria-label', `Go to slide ${i + 1} of ${N}`);
    d.onclick = () => go(i - cur_i);
    dotsEl.appendChild(d);
  });

  function go(delta) {
    const next = Math.max(0, Math.min(N - 1, cur_i + delta));
    if (next === cur_i) return;
    slides[cur_i].classList.remove('on');
    slides[cur_i].classList.add('off');
    setTimeout(() => slides[cur_i < next ? cur_i : next].classList.remove('off'), 400);
    cur_i = next;
    slides[cur_i].classList.add('on');
    document.querySelectorAll('.dot').forEach((d, i) => {
      const on = i === cur_i;
      d.classList.toggle('on', on);
      if (on) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
    });
    bar.style.width = ((cur_i + 1) / N * 100) + '%';
  }
  window.go = go; // used by the prev/next nav buttons' inline onclick

  bar.style.width = (1 / N * 100) + '%';

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') go(-1);
  });

  let tx = 0;
  document.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) < 45) return;
    go(dx < 0 ? 1 : -1);
  });
})();
