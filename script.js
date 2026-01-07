// Starfield animation
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Create stars
const stars = [];
const starCount = 150;

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
    // Clear canvas with subtle background
    ctx.fillStyle = 'rgba(2, 4, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw and animate stars
    stars.forEach(star => {
        // Twinkling effect
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

// Update year in footer
document.getElementById('year').textContent = new Date().getFullYear();
