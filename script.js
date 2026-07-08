// LOADER
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 600);
});

// YEAR
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// THEME TOGGLE
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
let currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
  root.setAttribute('data-theme', 'light');
  if (themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    if (currentTheme === 'light') {
      root.setAttribute('data-theme', 'light');
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
      localStorage.setItem('theme', 'light');
    } else {
      root.removeAttribute('data-theme');
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem('theme', 'dark');
    }
  });
}

// MOBILE NAV
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
function toggleNav(open) {
  if (!navLinks) return;
  navLinks.classList.toggle('open', open === undefined ? !navLinks.classList.contains('open') : open);
}
if (hamburger) {
  hamburger.addEventListener('click', () => {
    toggleNav();
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
  });
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); hamburger.click();
    }
  });
}
if (navLinks) {
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleNav(false));
  });
}

// ACTIVE NAV ON SCROLL
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
function highlightNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
  });
}
window.addEventListener('scroll', highlightNav);

// TYPING EFFECT
const roles = ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'Python Developer'];
const typedEl = document.getElementById('typed-text');
let roleIndex = 0, charIndex = 0, deleting = false;
function typeLoop() {
  if (!typedEl) return;
  const current = roles[roleIndex];
  if (!deleting) {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1500);
      return;
    }
  } else {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 90);
}
typeLoop();

// BACK TO TOP
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (backToTop) backToTop.classList.toggle('show', window.scrollY > 400);
});
if (backToTop) backToTop.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

// SCROLL REVEAL + COUNTERS + SKILL BARS
document.querySelectorAll('.section, .stat-card, .timeline-item, .skill-card, .cert-card, .project-card')
  .forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      if (entry.target.classList.contains('stats')) animateCounters();
      if (entry.target.id === 'skills') animateSkillBars();
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
const statsSection = document.querySelector('.stats');
if (statsSection) observer.observe(statsSection);
const skillsSection = document.getElementById('skills');
if (skillsSection) observer.observe(skillsSection);

let countersAnimated = false;
function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;
  document.querySelectorAll('.counter').forEach(counter => {
    const target = +counter.dataset.target;
    let count = 0;
    const step = Math.max(target / 60, 1);
    const update = () => {
      count += step;
      if (count < target) { counter.textContent = Math.floor(count); requestAnimationFrame(update); }
      else counter.textContent = target;
    };
    update();
  });
}

let skillsAnimated = false;
function animateSkillBars() {
  if (skillsAnimated) return;
  skillsAnimated = true;
  document.querySelectorAll('.progress-ring').forEach(ring => {
    const percent = ring.dataset.percent;
    ring.style.setProperty('--fill', percent + '%');
    ring.classList.add('filled');
  });
}

// PARTICLE CANVAS
const canvas = document.getElementById('particles');
const ctx = canvas ? canvas.getContext('2d') : null;
function resizeCanvas() { if (!canvas) return; canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.random() * 1.8 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX; this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 217, 255, ${this.opacity})`;
    ctx.fill();
  }
}

const particleCount = canvas ? Math.min(90, Math.floor((canvas.width * canvas.height) / 18000)) : 0;
const particlesArr = [];
if (canvas && ctx) {
  for (let i = 0; i < particleCount; i++) particlesArr.push(new Particle());
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArr.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// CONTACT FORM
const EMAILJS_SERVICE_ID = 'service_cbqun6a';
const EMAILJS_TEMPLATE_ID = '';
const EMAILJS_PUBLIC_KEY = '';
const contactForm = document.getElementById('contactForm');

if (window.emailjs && EMAILJS_PUBLIC_KEY) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

if (contactForm && window.emailjs && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const subject = formData.get('subject') || 'Portfolio message';
    const message = formData.get('message') || '';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    if (status) {
      status.textContent = 'Sending your message...';
      status.className = 'form-status';
    }

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        subject,
        message,
        reply_to: email,
        to_email: 'sahooritendra302@gmail.com'
      });

      if (status) {
        status.textContent = 'Message sent successfully!';
        status.className = 'form-status success';
      }
      contactForm.reset();
    } catch (error) {
      if (status) {
        status.textContent = 'Message could not be sent. Please email me directly.';
        status.className = 'form-status error';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
      setTimeout(() => { if (status) status.textContent = ''; }, 5000);
    }
  });
}
