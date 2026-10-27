// Shared slide-deck runtime for the mind x brain decks (the brain waves and
// the rules of the mind). Each deck page loads it with ../deck.js and needs
// .slide sections (the first one with class "on"), #bar, #dots and #nav or
// #dnav prev/next buttons calling go(-1) / go(1).

(function () {
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
