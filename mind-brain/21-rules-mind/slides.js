// Keyboard + swipe nav only. No DOM creation.
document.addEventListener('keydown', e => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowDown'  && e.key !== 'ArrowUp') return;
  e.preventDefault(); // stop a focused radio from also moving, which skipped a slide
  const radios = document.querySelectorAll('input[name=s]');
  let i = [...radios].findIndex(r => r.checked);
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') i++;
  else i--;
  if (radios[i]) radios[i].checked = true;
});

let tx = 0;
document.addEventListener('touchstart', e => tx = e.touches[0].clientX, {passive:true});
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - tx;
  if (Math.abs(dx) < 45) return;
  const radios = document.querySelectorAll('input[name=s]');
  let i = [...radios].findIndex(r => r.checked);
  dx < 0 ? i++ : i--;
  if (radios[i]) radios[i].checked = true;
});
