/**
 * typing.js — Typewriter effect cycling through roles
 */
(function () {
  const el = document.getElementById('typed');
  if (!el) return;

  const phrases = [
    'Full Stack Developer',
    'Flutter & Firebase Expert',
    'Frontend Craftsman',
    'Backend Architect',
    'Python & AI/ML Explorer',
    'Game Dev Enthusiast',
  ];

  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const current = phrases[pi];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 40 : 70);
  }
  tick();
})();
