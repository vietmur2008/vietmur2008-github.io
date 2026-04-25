// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');

let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal, .stat-row');

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || (i * 80);
      setTimeout(() => entry.target.classList.add('visible'), Number(delay));
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach((el, i) => {
  el.dataset.delay = i * 80;
  io.observe(el);
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── NAV ACTIVE HIGHLIGHT ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.style.color = 'var(--white)';
        }
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => navIO.observe(s));

// ── HERO TEXT GLITCH on load ──
const heroSlash = document.querySelector('.hero-slash');
if (heroSlash) {
  const original = heroSlash.innerHTML;
  let glitching = false;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$';

  function glitch() {
    if (glitching) return;
    glitching = true;
    let iter = 0;
    const interval = setInterval(() => {
      heroSlash.querySelectorAll('[data-val]').forEach(el => {
        if (iter > el.dataset.iter) {
          el.textContent = el.dataset.val;
        } else {
          el.textContent = chars[Math.floor(Math.random() * chars.length)];
        }
      });
      if (iter >= 12) { clearInterval(interval); glitching = false; }
      iter += 0.5;
    }, 60);
  }

  // Tag each letter for glitch
  heroSlash.querySelectorAll('.glitch-word').forEach(word => {
    const letters = word.textContent.split('');
    word.innerHTML = letters.map((ch, i) =>
      `<span data-val="${ch}" data-iter="${i}">${ch}</span>`
    ).join('');
  });

  // Trigger glitch on hover
  heroSlash.addEventListener('mouseenter', glitch);
  // Auto-glitch once after load
  setTimeout(glitch, 1400);
}
