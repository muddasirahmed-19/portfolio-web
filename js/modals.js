/**
 * modals.js — CV popup + Video demo popup
 */
(function () {

  /* ── Helpers ── */
  function openModal(overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    // Pause video if playing
    const vid = overlay.querySelector('video');
    if (vid) { vid.pause(); }
  }

  /* ── CV Modal ── */
  const cvModal      = document.getElementById('cvModal');
  const cvBtn        = document.getElementById('cvBtn');
  const cvModalClose = document.getElementById('cvModalClose');

  cvBtn        && cvBtn.addEventListener('click',        () => openModal(cvModal));
  cvModalClose && cvModalClose.addEventListener('click', () => closeModal(cvModal));
  cvModal      && cvModal.addEventListener('click', e => {
    if (e.target === cvModal) closeModal(cvModal);
  });

  /* ── Video Modal ── */
  const videoModal      = document.getElementById('videoModal');
  const demoBtn         = document.getElementById('demoBtn');
  const videoModalClose = document.getElementById('videoModalClose');
  const demoVideo       = document.getElementById('demoVideo');

  demoBtn && demoBtn.addEventListener('click', () => {
    openModal(videoModal);
    // Small delay so animation is visible before play
    setTimeout(() => { if (demoVideo) demoVideo.play().catch(() => {}); }, 350);
  });

  videoModalClose && videoModalClose.addEventListener('click', () => closeModal(videoModal));
  videoModal      && videoModal.addEventListener('click', e => {
    if (e.target === videoModal) closeModal(videoModal);
  });

  /* ── ESC to close any open modal ── */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (cvModal    && cvModal.classList.contains('open'))    closeModal(cvModal);
    if (videoModal && videoModal.classList.contains('open')) closeModal(videoModal);
  });

})();
