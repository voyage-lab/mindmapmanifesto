// Keyboard + swipe nav for the mind x brain chapter apps.
// Right arrow / swipe left presses the screen's forward button,
// left arrow / swipe right presses its Back button. Up/down still scroll.
(function () {
  function buttons() { return [...document.querySelectorAll('#root button')]; }
  function back() { return buttons().find(b => /^\s*back\s*$/i.test(b.textContent)); }
  function next() {
    const bs = buttons().filter(b => b !== back());
    return bs[bs.length - 1];
  }
  function press(dir) {
    const b = dir > 0 ? next() : back();
    if (b) b.click();
  }

  document.addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('input, textarea, [contenteditable]')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); press(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); press(-1); }
  });

  let x0 = 0, y0 = 0;
  document.addEventListener('touchstart', e => {
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return; // ignore scrolls
    press(dx < 0 ? 1 : -1);
  });
})();
