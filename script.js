// ================================
// ESHWAR KADARI — PORTFOLIO JS
// ================================

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---- HAMBURGER MENU ---- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ---- NETWORK CANVAS ANIMATION ---- */
(function () {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, nodes, packets;
  const NODE_COUNT  = 28;
  const PACKET_SPEED = 1.2;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeNode() {
    return {
      x:   Math.random() * W,
      y:   Math.random() * H,
      vx:  (Math.random() - 0.5) * 0.3,
      vy:  (Math.random() - 0.5) * 0.3,
      r:   Math.random() * 2 + 1.5,
      pulse: Math.random() * Math.PI * 2,
    };
  }

  function init() {
    resize();
    nodes   = Array.from({ length: NODE_COUNT }, makeNode);
    packets = [];
  }

  function spawnPacket() {
    const a = Math.floor(Math.random() * nodes.length);
    let b = a;
    while (b === a) b = Math.floor(Math.random() * nodes.length);
    const src = nodes[a], dst = nodes[b];
    const dist = Math.hypot(dst.x - src.x, dst.y - src.y);
    if (dist > 350) return;
    packets.push({ src: a, dst: b, t: 0, speed: PACKET_SPEED / dist });
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        if (dist > 200) continue;
        const alpha = (1 - dist / 200) * 0.25;
        ctx.strokeStyle = `rgba(79, 70, 229, ${alpha})`;
        ctx.lineWidth   = 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // packets
    packets = packets.filter(p => {
      p.t += p.speed;
      if (p.t >= 1) return false;
      const src = nodes[p.src], dst = nodes[p.dst];
      const x = src.x + (dst.x - src.x) * p.t;
      const y = src.y + (dst.y - src.y) * p.t;
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 230, 118, ${1 - p.t * 0.6})`;
      ctx.fill();
      return true;
    });

    // nodes
    nodes.forEach(n => {
      n.pulse += 0.02;
      const glow = (Math.sin(n.pulse) + 1) * 0.5;

      // outer glow
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
      grad.addColorStop(0, `rgba(0, 180, 216, ${0.3 * glow})`);
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // core dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 180, 216, ${0.6 + 0.4 * glow})`;
      ctx.fill();

      // move
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    if (Math.random() < 0.04) spawnPacket();
    requestAnimationFrame(drawFrame);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  drawFrame();
})();

/* ---- TYPING ANIMATION ---- */
(function () {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const phrases = [
    'Python Developer',
    'Network Automation Engineer',
    'CCNA Certified',
    'Problem Solver',
    'ECE Student → SWE',
  ];
  let pi = 0, ci = 0, deleting = false, wait = 0;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; wait = 60; }
      setTimeout(type, 60);
    } else {
      if (wait-- > 0) { setTimeout(type, 30); return; }
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      setTimeout(type, 40);
    }
  }
  setTimeout(type, 1400);
})();

/* ---- SCROLL REVEAL ---- */
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-aos], .skill-category, .project-card, .timeline-item, .cert-card, .achievement-card').forEach(el => {
    observer.observe(el);
  });
})();

/* ---- ACTIVE NAV LINK ---- */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => obs.observe(s));
})();

/* ---- CONTACT FORM ---- */
document.getElementById('contact-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = 'Message Sent ✓';
  btn.style.background = 'var(--accent-green)';
  btn.style.color = '#050A13';
  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.style.background = '';
    btn.style.color = '';
    this.reset();
  }, 3000);
});

/* ---- SMOOTH NAV SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
