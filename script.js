/* ========================================
   DEVI INTERIORS — script.js  v2.0
   Premium Interior Design, Thiruthuraipoondi
   ======================================== */

/* ── Navbar scroll effect ── */
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
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
  const overlay   = document.querySelector('.mobile-overlay');
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
  document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', close));
})();

/* ── Reveal on scroll ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  els.forEach((el, i) => {
    if (!el.dataset.delay) el.dataset.delay = i * 70;
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

  function Particle() { this.reset(); }

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

  resize();
  particles = Array.from({ length: COUNT }, () => new Particle());

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  })();

  window.addEventListener('resize', resize);
})();

/* ── Counter animation (stats) ── */
(function () {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const start  = performance.now();
      const dur    = 1600;

      (function tick(now) {
        const progress = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      })(start);

      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
})();

/* ========================================
   GALLERY SYSTEM v2 — Dynamic, Scalable
   ======================================== */

/**
 * GALLERY DATA STORE
 * ─────────────────
 * To add photos in the future, simply add an entry here.
 * Each entry: { src, category, label }
 * Categories: kitchen | door | wardrobe | tvunit | ceiling | bedroom | pooja | glass
 *
 * In a future admin system, this array can be fetched from an API/JSON file.
 */
const GALLERY_ITEMS = [
  { src: 'images/p1.jpeg',  category: 'tvunit',   label: 'TV Unit Design'       },
  { src: 'images/p2.jpeg',  category: 'kitchen',  label: 'Modular Kitchen'      },
  { src: 'images/p5.jpeg',  category: 'tvunit',   label: 'Luxury TV Panel'      },
  { src: 'images/p7.jpeg',  category: 'wardrobe', label: 'PVC Wardrobe'         },
  { src: 'images/p8.jpeg',  category: 'ceiling',  label: 'False Ceiling'        },
  { src: 'images/p14.jpeg', category: 'kitchen',  label: 'Premium Kitchen'      },
  { src: 'images/p16.jpeg', category: 'door',     label: 'PVC Door'             },
  { src: 'images/p18.jpeg', category: 'wardrobe', label: 'Premium Cupboard'     },
  { src: 'images/p20.jpeg', category: 'pooja',    label: 'Pooja Unit'           },
  { src: 'images/p22.jpeg', category: 'bedroom',  label: 'Luxury Bedroom'       },
  { src: 'images/p29.jpeg', category: 'door',     label: 'Pooja Room Door'      },
  { src: 'images/p33.jpeg', category: 'tvunit',   label: 'TV Panel Design'      },
  { src: 'images/p34.jpeg', category: 'glass',    label: 'Glass Display Unit'   },
  { src: 'images/p37.jpeg', category: 'ceiling',  label: 'LED False Ceiling'    },
  { src: 'images/p38.jpeg', category: 'wardrobe', label: 'Cupboard Works'       },
];

/* ── Gallery Filter & Render ── */
(function () {
  const masonry     = document.querySelector('.gallery-masonry');
  const filterBtns  = document.querySelectorAll('.filter-btn');
  if (!masonry || !filterBtns.length) return;

  let activeFilter  = 'all';
  let visibleItems  = [];   // tracks currently visible srcs for lightbox

  /* Build gallery items from data store */
  function buildGallery(items) {
    masonry.innerHTML = '';
    visibleItems = [];

    items.forEach((item, i) => {
      visibleItems.push(item.src);

      const div = document.createElement('div');
      div.className = 'gallery-item reveal';
      div.dataset.category = item.category;
      div.dataset.delay = (i % 6) * 60;   // stagger in groups of 6
      div.dataset.index = i;

      div.innerHTML = `
        <img src="${item.src}" alt="${item.label}" loading="lazy" />
        <div class="gallery-overlay">
          <div class="gallery-label">${item.label}</div>
        </div>
      `;

      div.addEventListener('click', () => openLightbox(i));
      masonry.appendChild(div);
    });

    /* Re-trigger reveal for freshly injected elements */
    requestAnimationFrame(() => {
      const newEls = masonry.querySelectorAll('.reveal');
      newEls.forEach(el => {
        const delay = parseInt(el.dataset.delay) || 0;
        setTimeout(() => el.classList.add('visible'), delay);
      });
    });
  }

  function getFiltered(filter) {
    return filter === 'all'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter(i => i.category === filter);
  }

  /* Initial build */
  buildGallery(getFiltered('all'));

  /* Filter click */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      buildGallery(getFiltered(activeFilter));
    });
  });

  /* Expose for lightbox */
  window._galleryGetVisible = () => visibleItems;
})();

/* ── Premium Lightbox v2 — arrows, keyboard, swipe ── */
(function () {
  /* ── Build lightbox DOM ── */
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Image viewer');

  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <button class="lb-close" aria-label="Close">&times;</button>
    <button class="lb-arrow lb-prev" aria-label="Previous">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </button>
    <button class="lb-arrow lb-next" aria-label="Next">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </button>
    <div class="lb-content">
      <img class="lb-img" src="" alt="" />
      <div class="lb-caption"></div>
    </div>
    <div class="lb-counter"></div>
  `;
  document.body.appendChild(lb);

  const lbImg     = lb.querySelector('.lb-img');
  const lbCaption = lb.querySelector('.lb-caption');
  const lbCounter = lb.querySelector('.lb-counter');
  const lbClose   = lb.querySelector('.lb-close');
  const lbPrev    = lb.querySelector('.lb-prev');
  const lbNext    = lb.querySelector('.lb-next');
  const lbContent = lb.querySelector('.lb-content');
  const lbBackdrop= lb.querySelector('.lb-backdrop');

  let currentIndex = 0;
  let isAnimating  = false;

  function getItems() {
    return window._galleryGetVisible ? window._galleryGetVisible() : [];
  }

  function getLabel(src) {
    const found = GALLERY_ITEMS.find(i => i.src === src);
    return found ? found.label : '';
  }

  function openLightbox(idx) {
    const items = getItems();
    if (!items.length) return;
    currentIndex = idx;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadImage(currentIndex, 'none');
    updateNav();
  }

  function closeLightbox() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 350);
  }

  function loadImage(idx, direction) {
    const items = getItems();
    if (!items.length) return;
    const src = items[idx];

    /* Slide-out current */
    if (direction !== 'none') {
      lbContent.classList.add(direction === 'next' ? 'slide-out-left' : 'slide-out-right');
    }

    const newImg = new Image();
    newImg.onload = () => {
      lbImg.src = src;
      lbCaption.textContent = getLabel(src);
      lbCounter.textContent = `${idx + 1} / ${items.length}`;

      if (direction !== 'none') {
        lbContent.classList.remove('slide-out-left', 'slide-out-right');
        lbContent.classList.add(direction === 'next' ? 'slide-in-right' : 'slide-in-left');
        setTimeout(() => {
          lbContent.classList.remove('slide-in-right', 'slide-in-left');
          isAnimating = false;
        }, 350);
      } else {
        lbCounter.textContent = `${idx + 1} / ${items.length}`;
        isAnimating = false;
      }
    };
    newImg.onerror = () => {
      lbImg.src = src;   // still set it, browser will show broken img
      isAnimating = false;
    };
    newImg.src = src;
  }

  function navigate(direction) {
    if (isAnimating) return;
    const items = getItems();
    if (!items.length) return;
    isAnimating = true;

    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % items.length;
    } else {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
    }

    loadImage(currentIndex, direction);
    updateNav();
  }

  function updateNav() {
    const items = getItems();
    const total = items.length;
    lbPrev.style.display = total <= 1 ? 'none' : '';
    lbNext.style.display = total <= 1 ? 'none' : '';
    lbCounter.textContent = `${currentIndex + 1} / ${total}`;
  }

  /* Event listeners */
  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); navigate('prev'); });
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); navigate('next'); });

  /* Keyboard */
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowRight')  navigate('next');
    if (e.key === 'ArrowLeft')   navigate('prev');
  });

  /* Touch / Swipe */
  let touchStartX = 0;
  let touchStartY = 0;

  lbContent.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  lbContent.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      navigate(dx < 0 ? 'next' : 'prev');
    }
  }, { passive: true });

  /* Expose openLightbox globally so gallery render can call it */
  window.openLightbox = openLightbox;
})();

/* ── Smooth cursor glow (desktop only) ── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;pointer-events:none;z-index:9998;
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