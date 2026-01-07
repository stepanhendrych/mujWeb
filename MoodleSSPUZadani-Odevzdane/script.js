// Starfield animation
function initStarfield() {
	const canvas = document.getElementById('starfield');
	const ctx = canvas.getContext('2d');
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	const stars = [];
	const starCount = 150;
	
	for (let i = 0; i < starCount; i++) {
		stars.push({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			radius: Math.random() * 1.5,
			opacity: Math.random() * 0.5 + 0.5
		});
	}
	
	function drawStars() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'white';
		
		stars.forEach(star => {
			ctx.globalAlpha = star.opacity;
			ctx.beginPath();
			ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
			ctx.fill();
		});
		
		ctx.globalAlpha = 1;
	}
	
	function animate() {
		drawStars();
		requestAnimationFrame(animate);
	}
	
	animate();
	
	// Handle window resize
	window.addEventListener('resize', () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});
}

// Active link highlighting
function highlightActiveLink() {
	document.querySelectorAll('.nav-links a').forEach(link => {
		const isActive = link.getAttribute('href') === window.location.pathname.split('/').pop() || 
						(window.location.pathname.endsWith('/') && link.getAttribute('href') === 'index.html');
		if (isActive || link.classList.contains('active')) {
			link.classList.add('active');
		}
	});
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	initStarfield();
	highlightActiveLink();
});
