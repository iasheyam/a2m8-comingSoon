// Net Visualization
const canvas = document.getElementById('netCanvas');
const ctx = canvas.getContext('2d');
let points = [];
let mouseX = 0;
let mouseY = 0;

// Initialize canvas size
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createPoints();
}

// Create grid of points
function createPoints() {
    points = [];
    const spacing = 45; // Reduced spacing for denser grid
    // Add extra padding (one screen worth) to ensure full coverage even during interactions
    const rows = Math.ceil(canvas.height / spacing) + 4;
    const cols = Math.ceil(canvas.width / spacing) + 4;
    
    // Start grid from outside the viewport
    const startX = -spacing * 2;
    const startY = -spacing * 2;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            points.push({
                x: startX + (j * spacing),
                y: startY + (i * spacing),
                originalX: startX + (j * spacing),
                originalY: startY + (i * spacing)
            });
        }
    }
}

// Update points based on mouse position
function updatePoints() {
    const influenceRadius = 180; // Adjusted influence radius
    
    points.forEach(point => {
        const dx = point.x - mouseX;
        const dy = point.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < influenceRadius) {
            const angle = Math.atan2(dy, dx);
            const force = (influenceRadius - distance) / influenceRadius;
            const moveX = Math.cos(angle) * force * 12; // Slightly increased movement
            const moveY = Math.sin(angle) * force * 12;
            
            point.x = point.originalX + moveX;
            point.y = point.originalY + moveY;
        } else {
            point.x += (point.originalX - point.x) * 0.1;
            point.y += (point.originalY - point.y) * 0.1;
        }
    });
}

// Draw the net
function drawNet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'; // Slightly reduced opacity for multiple connections
    ctx.lineWidth = 0.5; // Thinner lines for neural net look
    
    // Draw connections
    points.forEach((point, i) => {
        points.forEach((otherPoint, j) => {
            if (i < j) {
                const dx = point.x - otherPoint.x;
                const dy = point.y - otherPoint.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 90) { // Slightly reduced connection distance for more focused connections
                    const opacity = (1 - distance / 90) * 0.15; // Fade connections based on distance
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.beginPath();
                    ctx.moveTo(point.x, point.y);
                    ctx.lineTo(otherPoint.x, otherPoint.y);
                    ctx.stroke();
                }
            }
        });
    });
    
    // Draw points
    points.forEach(point => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1, 0, Math.PI * 2); // Smaller points for neural net look
        ctx.fill();
    });
}

// Animation loop
function animate() {
    updatePoints();
    drawNet();
    requestAnimationFrame(animate);
}

// Event listeners
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

window.addEventListener('resize', () => {
    initCanvas();
});

// Initialize
initCanvas();
animate(); 