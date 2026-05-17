/* ========================================
   DEVI INTERIORS — script.js
   ======================================== */

/* ── Navbar scroll effect ── */
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Active nav link ── */
(function () {
  const links = document.querySelectorAll('.nav-links a, .mobile-nav a');
  const page = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── Mobile menu ── */
(function () {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-overlay');
  if (!hamburger) return;

  const close = () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    overlay.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  overlay.addEventListener('click', close);

  document.querySelectorAll('.mobile-nav a').forEach(a => {
    a.addEventListener('click', close);
  });
})();

/* ── Reveal on scroll ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach((el, i) => {
    if (!el.dataset.delay) el.dataset.delay = i * 80;
    observer.observe(el);
  });
})();

/* ── Particle canvas (hero) ── */
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const GOLD = 'rgba(212,175,55,';
  const COUNT = 55;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.8 + 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(Math.random() * 0.4 + 0.15);
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
  };

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife || this.y < -10) this.reset();
  };

  Particle.prototype.draw = function () {
    const progress = this.life / this.maxLife;
    const a = this.alpha * (1 - Math.pow(progress - 0.5, 2) * 4);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = GOLD + Math.max(0, a) + ')';
    ctx.fill();
  };

  function init() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  resize();
  init();
  loop();
  window.addEventListener('resize', () => { resize(); });
})();

/* ── Counter animation (stats) ── */
(function () {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
})();

/* ── Gallery Filter ── */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      items.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.style.transition = 'opacity 0.4s, transform 0.4s';
        if (match) {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
          item.style.display = 'block';
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => { if (!match) item.style.display = 'none'; }, 400);
        }
      });
    });
  });
})();

/* ── Lightbox ── */
(function () {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;
  const lbImg = lightbox.querySelector('.lightbox-img');
  const lbClose = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img')?.src;
      if (!src) return;
      lbImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => lbImg.src = '', 400);
  };

  lbClose.addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ── Smooth cursor glow (desktop) ── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;pointer-events:none;z-index:9999;
    width:280px;height:280px;border-radius:50%;
    background:radial-gradient(circle,rgba(212,175,55,0.045) 0%,transparent 70%);
    transform:translate(-50%,-50%);
    transition:left 0.18s ease,top 0.18s ease;
    will-change:left,top;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();
