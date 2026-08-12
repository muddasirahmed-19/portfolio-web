/**
 * animations.js
 * Handles: particle canvas, slide-in observer, 3D tilt, magnetic buttons,
 *          card shine, hero entrance, number counters, glitch
 */

/* ─────────────────────────────────────────
   1. PARTICLE CANVAS
───────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = 80;
  const COLORS = ['#ff2244', '#00ff88', '#3d8eff'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset = function () {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.6 + 0.1;
      this.life  = 0;
      this.maxLife = Math.random() * 300 + 200;
    };
    this.reset();
  }

  for (let i = 0; i < COUNT; i++) {
    const p = new Particle();
    p.life = Math.random() * p.maxLife; // stagger
    particles.push(p);
  }

  // Connect nearby particles with lines
  function drawConnections() {
    const DIST = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          const opacity = (1 - dist / DIST) * 0.12;
          ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      // Fade in/out over lifetime
      const halfLife = p.maxLife / 2;
      const fade = p.life < halfLife ? p.life / halfLife : (p.maxLife - p.life) / halfLife;
      const alpha = p.alpha * Math.max(0, fade);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.round(alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();

      // Wrap edges
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      if (p.life >= p.maxLife) p.reset();
    });

    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  animate();
})();


/* ─────────────────────────────────────────
   2. SLIDE-IN SCROLL OBSERVER
───────────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
})();


/* ─────────────────────────────────────────
   3. HERO ENTRANCE SEQUENCE
───────────────────────────────────────── */
(function () {
  const eyebrow = document.querySelector('.hero-eyebrow');
  const desc    = document.querySelector('.hero-desc');
  const cta     = document.querySelector('.hero-cta');
  const name    = document.getElementById('heroName');

  // Trigger eyebrow line expand immediately
  setTimeout(() => eyebrow && eyebrow.classList.add('in'), 300);

  // Desc + CTA appear after typing starts
  setTimeout(() => desc && desc.classList.add('in'), 1300);
  setTimeout(() => cta  && cta.classList.add('in'),  1550);

  // Glitch effect on name — set data-text and occasional trigger
  if (name) {
    name.setAttribute('data-text', name.textContent);
    setInterval(() => {
      name.classList.add('glitch');
      setTimeout(() => name.classList.remove('glitch'), 400);
    }, 5000);
  }
})();


/* ─────────────────────────────────────────
   4. 3D TILT ON CARDS
───────────────────────────────────────── */
(function () {
  const STRENGTH = 12; // degrees max

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rx =  dy * STRENGTH;
      const ry = -dx * STRENGTH;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;

      // Card shine position
      const shine = card.querySelector('.card-shine');
      if (shine) {
        const px = ((e.clientX - rect.left) / rect.width)  * 100;
        const py = ((e.clientY - rect.top)  / rect.height) * 100;
        shine.style.setProperty('--mx', px + '%');
        shine.style.setProperty('--my', py + '%');
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ─────────────────────────────────────────
   5. MAGNETIC BUTTONS
───────────────────────────────────────── */
(function () {
  const PULL = 0.35;

  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * PULL;
      const dy = (e.clientY - cy) * PULL;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();


/* ─────────────────────────────────────────
   6. NUMBER COUNTERS (stat cards)
───────────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el       = e.target;
      const target   = parseFloat(el.dataset.target);
      const decimal  = parseInt(el.dataset.decimal  || '0');
      const suffix   = el.dataset.suffix || '';
      const duration = 1400;
      const start    = performance.now();

      function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const ease     = 1 - Math.pow(1 - progress, 3);
        const value    = ease * target;
        el.textContent = value.toFixed(decimal) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
})();


/* ─────────────────────────────────────────
   7. TEXT SCRAMBLE on section titles (hover)
───────────────────────────────────────── */
(function () {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

  function scramble(el) {
    const original = el.dataset.original || el.textContent;
    el.dataset.original = original;
    let iteration = 0;
    const total = original.length * 3;

    clearInterval(el._scrambleTimer);
    el._scrambleTimer = setInterval(() => {
      el.textContent = original
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iteration / 3) return original[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');
      iteration++;
      if (iteration >= total) {
        el.textContent = original;
        clearInterval(el._scrambleTimer);
      }
    }, 30);
  }

  document.querySelectorAll('.section-title').forEach(el => {
    el.style.cursor = 'default';
    el.addEventListener('mouseenter', () => scramble(el));
  });
})();
