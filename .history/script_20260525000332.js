/* ══════════════════════════════════════════════════════════════
   ROHIT MORE — PORTFOLIO  |  script.js
   Particles · Typewriter · Globe · Scroll Animations · Nav
══════════════════════════════════════════════════════════════ */

/* ── CUSTOM CURSOR ── */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function animateCursor() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
})();

/* ── NAVBAR ── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
  });

  hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: .4 });
  sections.forEach(s => observer.observe(s));
})();

/* ── PARTICLES CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', () => { resize(); createParticles(); });
  resize();

  const COLORS = ['rgba(124,58,237,', 'rgba(37,99,235,', 'rgba(168,85,247,', 'rgba(96,165,250,', 'rgba(6,182,212,'];

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((W * H) / 10000), 120);
    for (let i = 0; i < count; i++) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x: rand(0, W), y: rand(0, H),
        vx: rand(-.4, .4), vy: rand(-.4, .4),
        size: rand(1, 3),
        alpha: rand(.2, .7),
        color,
        pulse: rand(0, Math.PI * 2),
        pulseSpeed: rand(.01, .03)
      });
    }
  }
  createParticles();

  let mouseX = -1000, mouseY = -1000;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const opacity = (1 - dist / 140) * .15;
          ctx.strokeStyle = `rgba(124,58,237,${opacity})`;
          ctx.lineWidth = .5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => {
      p.pulse += p.pulseSpeed;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Mouse repulsion
      const mdx = p.x - mouseX, mdy = p.y - mouseY;
      const md = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 100) {
        p.x += (mdx / md) * 1.2;
        p.y += (mdy / md) * 1.2;
      }

      const a = p.alpha * (.7 + .3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + a + ')';
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color + (a * .15) + ')';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── TYPEWRITER ── */
(function initTypewriter() {
  const el = document.getElementById('typewriterText');
  if (!el) return;
  const phrases = [
    'Frontend Developer',
    'UI/UX Enthusiast',
    'React Specialist',
    'WordPress Expert',
    'Mobile App Developer'
  ];
  let pi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 80, SPEED_DELETE = 40, PAUSE = 1800;

  function type() {
    const current = phrases[pi];
    if (!deleting) {
      el.textContent = current.substring(0, ci + 1);
      ci++;
      if (ci === current.length) {
        setTimeout(() => { deleting = true; type(); }, PAUSE);
        return;
      }
    } else {
      el.textContent = current.substring(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? SPEED_DELETE : SPEED_TYPE);
  }
  type();
})();

/* ── COUNTER ANIMATION ── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  let started = false;

  function startCounters() {
    counters.forEach(c => {
      const target = parseInt(c.dataset.count, 10);
      let current = 0;
      const step = target / 60;
      const interval = setInterval(() => {
        current = Math.min(current + step, target);
        c.textContent = Math.floor(current);
        if (current >= target) clearInterval(interval);
      }, 25);
    });
  }

  const hero = document.querySelector('.hero');
  if (!hero) return;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      startCounters();
    }
  }, { threshold: .5 });
  obs.observe(hero);
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay, 10));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });
  elements.forEach(el => obs.observe(el));
})();

/* ── TIMELINE REVEAL (also triggers node glow) ── */
(function initTimelineReveal() {
  const items = document.querySelectorAll('.timeline-item');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible', 'reveal');
          entry.target.querySelector('.tl-card') && entry.target.querySelector('.tl-card').classList.add('visible');
        }, idx * 120);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: .2 });
  items.forEach(item => {
    item.classList.add('reveal');
    obs.observe(item);
  });
})();

/* ── 3D GLOBE CANVAS ── */
(function initGlobe() {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const R = 155;
  let angle = 0;

  // Random cities on globe
  function latLonToXYZ(lat, lon, r) {
    const phi   = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return {
      x: -r * Math.sin(phi) * Math.cos(theta),
      y:  r * Math.cos(phi),
      z:  r * Math.sin(phi) * Math.sin(theta)
    };
  }

  const cities = [
    { lat: 19.07,  lon: 72.87,  name: 'Mumbai' },
    { lat: 51.5,   lon: -0.12,  name: 'London' },
    { lat: 40.71,  lon: -74.01, name: 'New York' },
    { lat: 35.68,  lon: 139.69, name: 'Tokyo' },
    { lat: 37.77,  lon: -122.4, name: 'SF' },
    { lat: -33.86, lon: 151.2,  name: 'Sydney' },
    { lat: 48.85,  lon: 2.35,   name: 'Paris' },
    { lat: 55.75,  lon: 37.61,  name: 'Moscow' },
    { lat: 1.35,   lon: 103.82, name: 'Singapore' },
    { lat: 25.2,   lon: 55.27,  name: 'Dubai' },
  ];

  // Arc connections
  const arcs = [
    { from: 0, to: 1 }, { from: 0, to: 2 },
    { from: 0, to: 9 }, { from: 2, to: 4 },
    { from: 1, to: 6 }, { from: 3, to: 8 },
  ];

  let arcProgress = arcs.map(() => 0);

  function project(x, y, z) {
    const cosA = Math.cos(angle), sinA = Math.sin(angle);
    const rx = x * cosA - z * sinA;
    const rz = x * sinA + z * cosA;
    return { px: cx + rx, py: cy + y, z: rz };
  }

  function drawGlobe() {
    ctx.clearRect(0, 0, W, H);

    // Outer glow
    const grd = ctx.createRadialGradient(cx, cy, R * .7, cx, cy, R * 1.3);
    grd.addColorStop(0, 'rgba(124,58,237,.12)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2); ctx.fill();

    // Globe base
    const globeGrd = ctx.createRadialGradient(cx - 30, cy - 30, R * .1, cx, cy, R);
    globeGrd.addColorStop(0, 'rgba(37,99,235,.12)');
    globeGrd.addColorStop(.5, 'rgba(124,58,237,.06)');
    globeGrd.addColorStop(1, 'rgba(8,11,20,.8)');
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = globeGrd;
    ctx.fill();
    ctx.strokeStyle = 'rgba(124,58,237,.25)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Lat lines
    for (let lat = -75; lat <= 75; lat += 30) {
      const phi = lat * Math.PI / 180;
      const yr = R * Math.sin(phi);
      const lr = R * Math.cos(phi);
      ctx.beginPath();
      for (let lon = -180; lon <= 180; lon += 2) {
        const theta = lon * Math.PI / 180;
        const x3 = lr * Math.cos(theta), z3 = lr * Math.sin(theta);
        const p = project(x3, -yr, z3);
        lon === -180 ? ctx.moveTo(p.px, p.py) : ctx.lineTo(p.px, p.py);
      }
      ctx.strokeStyle = `rgba(96,165,250,${Math.abs(p => p) * 0 + .07})`;
      ctx.lineWidth = .4;
      ctx.stroke();
    }

    // Lon lines
    for (let lon = 0; lon < 360; lon += 30) {
      const theta = lon * Math.PI / 180;
      ctx.beginPath();
      for (let lat = -90; lat <= 90; lat += 2) {
        const phi = lat * Math.PI / 180;
        const x3 = R * Math.cos(phi) * Math.cos(theta);
        const y3 = -R * Math.sin(phi);
        const z3 = R * Math.cos(phi) * Math.sin(theta);
        const p = project(x3, y3, z3);
        lat === -90 ? ctx.moveTo(p.px, p.py) : ctx.lineTo(p.px, p.py);
      }
      ctx.strokeStyle = 'rgba(96,165,250,.07)';
      ctx.lineWidth = .4;
      ctx.stroke();
    }

    // Arc connections
    arcs.forEach((arc, i) => {
      const p1 = latLonToXYZ(cities[arc.from].lat, cities[arc.from].lon, R);
      const p2 = latLonToXYZ(cities[arc.to].lat, cities[arc.to].lon, R);
      const mid = {
        x: (p1.x + p2.x) * .5,
        y: (p1.y + p2.y) * .5 - 40,
        z: (p1.z + p2.z) * .5
      };
      arcProgress[i] = (arcProgress[i] + .004) % 1;
      const steps = 40;
      ctx.beginPath();
      let started = false;
      for (let t = 0; t <= arcProgress[i]; t += 1 / steps) {
        const tt = 1 - t, ts = tt * tt;
        const bx = ts * p1.x + 2 * tt * t * mid.x + t * t * p2.x;
        const by = ts * p1.y + 2 * tt * t * mid.y + t * t * p2.y;
        const bz = ts * p1.z + 2 * tt * t * mid.z + t * t * p2.z;
        const pp = project(bx, by, bz);
        if (pp.z > -R * .3) {
          started ? ctx.lineTo(pp.px, pp.py) : (ctx.moveTo(pp.px, pp.py), started = true);
        }
      }
      ctx.strokeStyle = 'rgba(168,85,247,.5)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Moving dot on arc
      const td = arcProgress[i];
      const ttd = 1 - td;
      const dotX = ttd * ttd * p1.x + 2 * ttd * td * mid.x + td * td * p2.x;
      const dotY = ttd * ttd * p1.y + 2 * ttd * td * mid.y + td * td * p2.y;
      const dotZ = ttd * ttd * p1.z + 2 * ttd * td * mid.z + td * td * p2.z;
      const dotP = project(dotX, dotY, dotZ);
      if (dotP.z > -R * .3) {
        ctx.beginPath(); ctx.arc(dotP.px, dotP.py, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#a855f7';
        ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 10;
        ctx.fill(); ctx.shadowBlur = 0;
      }
    });

    // City dots
    cities.forEach((city, i) => {
      const pos = latLonToXYZ(city.lat, city.lon, R);
      const p = project(pos.x, pos.y, pos.z);
      if (p.z < -10) return;
      const alpha = Math.min(1, (p.z + R) / (R * .6));
      ctx.beginPath(); ctx.arc(p.px, p.py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96,165,250,${alpha})`;
      ctx.shadowColor = '#60a5fa'; ctx.shadowBlur = 8;
      ctx.fill(); ctx.shadowBlur = 0;

      // Ring
      ctx.beginPath(); ctx.arc(p.px, p.py, 6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(96,165,250,${alpha * .4})`;
      ctx.lineWidth = 1; ctx.stroke();

      // Hometown highlight
      if (i === 0) {
        ctx.beginPath(); ctx.arc(p.px, p.py, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,85,247,${alpha})`;
        ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 14;
        ctx.fill(); ctx.shadowBlur = 0;
      }
    });

    // Shine
    const shine = ctx.createRadialGradient(cx - R * .35, cy - R * .35, 0, cx - R * .35, cy - R * .35, R * .5);
    shine.addColorStop(0, 'rgba(255,255,255,.06)');
    shine.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = shine; ctx.fill();

    angle += .004;
    requestAnimationFrame(drawGlobe);
  }
  drawGlobe();
})();

/* ── CONTACT FORM ── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.style.display = 'none';
      success.classList.add('show');
      form.reset();
    }, 1400);
  });
})();

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

document.querySelectorAll('.skill-hex').forEach(hex => {
  hex.addEventListener('mousemove', e => {
    const rect = hex.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    hex.querySelector('.hex-wrap').style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.06)`;
  });
  hex.addEventListener('mouseleave', () => {
    hex.querySelector('.hex-wrap').style.transform = '';
  });
});

/* ── PROJECT CARD TILT ── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - .5;
    const y = (e.clientY - rect.top)  / rect.height - .5;
    card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── PAGE LOAD ANIMATION ── */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .6s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});

/* ── FEATURE CARD MOUSE SPOTLIGHT ── */
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});