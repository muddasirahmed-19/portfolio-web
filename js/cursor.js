/**
 * cursor.js — Windows-style arrow cursor cycling RGB colors
 */
(function () {
  const el = document.getElementById('rgbCursor');
  if (!el) return;

  el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="30" viewBox="0 0 22 30">
    <path d="M2 2 L2 24 L7.5 18.5 L12.5 28.5 L15.5 27 L10.5 17 L19 17 Z"
          fill="rgba(0,0,0,0.55)" transform="translate(0.8,0.8)"/>
    <path class="cursor-body"
          d="M2 2 L2 24 L7.5 18.5 L12.5 28.5 L15.5 27 L10.5 17 L19 17 Z"
          stroke="rgba(0,0,0,0.6)" stroke-width="0.8" stroke-linejoin="round"/>
  </svg>`;

  let mx = -100, my = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    el.style.left = mx + 'px';
    el.style.top  = my + 'px';
  });

  document.addEventListener('mouseleave', () => el.style.opacity = '0');
  document.addEventListener('mouseenter', () => el.style.opacity = '1');

  const hoverSel = 'a, button, .skill-pill, .project-card, .stat-card, .contact-card, .project-btn, .btn, .magnetic';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) el.classList.add('cursor-hover');
    else el.classList.remove('cursor-hover');
  });
})();
