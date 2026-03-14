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
    'kofein addict ☕',
    'introvert',
    'SCP Foundation fan (a možná něco více... 👀)',
    'miltinlingual person (Python, JavaScript, C#, a další...)',
    'ne prokrastinant, ale argumentátor',
];

// Split text into user-perceived characters so emoji are typed/deleted atomically.
const segmentPhrase = (() => {
    if (typeof Intl !== 'undefined' && typeof Intl.Segmenter !== 'undefined') {
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        return text => [...segmenter.segment(text)].map(s => s.segment);
    }
    // Fallback: code points are safer than UTF-16 code units.
    return text => Array.from(text);
})();

const segmentedPhrases = phrases.map(segmentPhrase);
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
const typeEl = document.getElementById('typewriter');

function typeWriter() {
    const current = segmentedPhrases[phraseIndex];
    if (deleting) {
        charIndex--;
        typeEl.textContent = current.slice(0, charIndex).join('');
        if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(typeWriter, 400);
            return;
        }
        setTimeout(typeWriter, 45);
    } else {
        charIndex++;
        typeEl.textContent = current.slice(0, charIndex).join('');
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

// ── Discord presence widget (Lanyard) ───────────────────────────────────────
const lanyardWidget = document.getElementById('discord-presence');

if (lanyardWidget) {
    const LANYARD_USER_ID = '1417165070214889550';
    const LANYARD_URL = `https://api.lanyard.rest/v1/users/${LANYARD_USER_ID}`;

    const avatarEl = document.getElementById('discord-avatar');
    const nameEl = document.getElementById('discord-name');
    const usernameEl = document.getElementById('discord-username');
    const statusEl = document.getElementById('discord-status');
    const statusDotEl = document.getElementById('discord-status-dot');
    const activityEl = document.getElementById('discord-activity');
    const errorEl = document.getElementById('discord-error');

    const statusMap = {
        online: 'Online',
        idle: 'Idle',
        dnd: 'Nerušit',
        offline: 'Offline'
    };

    function setStatusDot(status) {
        statusDotEl.classList.remove('is-online', 'is-idle', 'is-dnd', 'is-offline');
        statusDotEl.classList.add(`is-${status in statusMap ? status : 'offline'}`);
    }

    function normalizeActivityPart(value) {
        return String(value || '').trim().replace(/(?:\.{3}|…)+$/, '');
    }

    function buildActivityText(data) {
        if (data.listening_to_spotify && data.spotify) {
            const song = normalizeActivityPart(data.spotify.song);
            const artist = normalizeActivityPart(data.spotify.artist);
            return `Právě poslouchá:\n${song} - ${artist}`;
        }

        const activities = Array.isArray(data.activities) ? data.activities : [];
        const mainActivity = activities.find(activity => activity.type !== 4);
        if (mainActivity) {
            const activityName = normalizeActivityPart(mainActivity.name);
            const details = normalizeActivityPart(mainActivity.details);
            const state = normalizeActivityPart(mainActivity.state);
            const lines = [activityName, details, state].filter(Boolean);

            return lines.length > 0
                ? `Aktivita:\n${lines.join('\n')}`
                : 'Právě bez aktivity';
        }

        const customStatus = activities.find(activity => activity.type === 4 && activity.state);
        if (customStatus) {
            return `Status:\n${normalizeActivityPart(customStatus.state)}`;
        }

        return 'Právě bez aktivity';
    }

    async function refreshDiscordPresence() {
        try {
            const response = await fetch(LANYARD_URL, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`Lanyard request failed: ${response.status}`);
            }

            const payload = await response.json();
            if (!payload.success || !payload.data) {
                throw new Error('Invalid Lanyard payload');
            }

            const data = payload.data;
            const user = data.discord_user || {};
            const status = data.discord_status || 'offline';
            const displayName = user.global_name || user.username || 'Discord user';
            const username = user.username ? `@${user.username}` : '';

            let avatarUrl = 'https://cdn.discordapp.com/embed/avatars/0.png';
            if (user.avatar) {
                avatarUrl = `https://cdn.discordapp.com/avatars/${LANYARD_USER_ID}/${user.avatar}.png?size=128`;
            }

            nameEl.textContent = displayName;
            usernameEl.textContent = username;
            statusEl.textContent = statusMap[status] || statusMap.offline;
            setStatusDot(status);
            activityEl.textContent = buildActivityText(data);
            avatarEl.src = avatarUrl;
            errorEl.hidden = true;
        } catch (error) {
            statusEl.textContent = 'Data nedostupna';
            setStatusDot('offline');
            activityEl.textContent = 'Nelze nacist Discord data z Lanyard API.';
            errorEl.hidden = false;
        }
    }

    refreshDiscordPresence();
    const REFRESH_INTERVAL_MS = 30000;
    setInterval(refreshDiscordPresence, REFRESH_INTERVAL_MS);
}

