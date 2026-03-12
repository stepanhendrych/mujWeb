// ── Starfield animation ──────────────────────────────────────────────────────
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const stars = [];
const starCount = 180;

for (let i = 0; i < starCount; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005
    });
}

let time = 0;

function animate() {
    ctx.fillStyle = 'rgba(2, 4, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(126, 232, 250, ${star.opacity * twinkle})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    time++;
    requestAnimationFrame(animate);
}

animate();

// ── Year ─────────────────────────────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Typewriter effect ─────────────────────────────────────────────────────────
const phrases = [
    'budoucí vývojář',
    'web nadšenec',
    'Linux uživatel',
    'night-coder 🌙',
    'problém solver',
];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
const typeEl = document.getElementById('typewriter');

function typeWriter() {
    const current = phrases[phraseIndex];
    if (deleting) {
        charIndex--;
        typeEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(typeWriter, 400);
            return;
        }
        setTimeout(typeWriter, 45);
    } else {
        charIndex++;
        typeEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
            deleting = true;
            setTimeout(typeWriter, 1800);
            return;
        }
        setTimeout(typeWriter, 75);
    }
}

if (typeEl) typeWriter();

// ── Active nav link on scroll (Intersection Observer) ────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

/* rootMargin: top offset keeps nav from stealing active state too early;
   bottom offset triggers a bit before center so the section feels "current" */
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// ── Section fade-in on scroll ─────────────────────────────────────────────────
const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section').forEach(s => fadeObserver.observe(s));

// ── Mobile nav toggle ─────────────────────────────────────────────────────────
const toggle = document.querySelector('.nav-toggle');
const navLinksEl = document.querySelector('.nav-links');

if (toggle && navLinksEl) {
    toggle.addEventListener('click', () => {
        const open = navLinksEl.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
    });

    navLinksEl.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            navLinksEl.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ── Skill bar animate on visible ──────────────────────────────────────────────
const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-fill').forEach(fill => {
                const pct = fill.style.getPropertyValue('--pct');
                // Reset to 0 first, then animate to target on next paint
                // (double rAF ensures the browser has painted the 0 state before transitioning)
                fill.style.setProperty('--pct', '0%');
                const ANIMATE_DELAY_MS = 80;
                requestAnimationFrame(() => {
                    setTimeout(() => fill.style.setProperty('--pct', pct), ANIMATE_DELAY_MS);
                });
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('#skills').forEach(s => skillObserver.observe(s));

