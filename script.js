console.log("JS Loaded");

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize charts
    initializeCropChart();
    initializeYieldChart();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe dashboard cards for animation
    document.querySelectorAll('.dashboard-card, .feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add button click handlers
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Update progress bars with animation
    setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach(progress => {
            const width = progress.style.width;
            progress.style.width = '0%';
            setTimeout(() => {
                progress.style.width = width;
            }, 500);
        });
    }, 1000);

    // Safe redirect button
    const redirectBtn = document.getElementById('redirect_id');
    if (redirectBtn) {
        redirectBtn.addEventListener('click', function() {
            window.location.href = 'test.html';
        });
    }

    // Safe start predict button
    const startBtn = document.getElementById("startPredictBtn");
    if (startBtn) {
        startBtn.addEventListener("click", () => {
            window.location.href = "crop-prediction.html";
        });
    }

    // Hover effects for stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
        });
    });

    // Update soil metrics with random variations
    setInterval(() => {
        const metrics = document.querySelectorAll('.progress-fill');
        metrics.forEach(metric => {
            const currentWidth = parseInt(metric.style.width);
            const variation = Math.random() * 6 - 3; // ±3%
            const newWidth = Math.max(0, Math.min(100, currentWidth + variation));
            metric.style.width = newWidth + '%';
        });
    }, 5000);

    // Simulate real-time weather updates
    setInterval(() => {
        const temp = document.querySelector('.weather-item span:last-child');
        if (temp && temp.textContent.includes('°C')) {
            const currentTemp = parseInt(temp.textContent);
            const newTemp = currentTemp + (Math.random() * 2 - 1); // ±1°C variation
            temp.textContent = Math.round(newTemp) + '°C';
        }
    }, 10000);
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize Crop Distribution Pie Chart
function initializeCropChart() {
    const canvas = document.getElementById('cropChart');
    if (!canvas) return; // Safety check
    const ctx = canvas.getContext('2d');
    
    const data = [
        { name: 'Corn', value: 45, color: '#22c55e' },
        { name: 'Wheat', value: 30, color: '#f59e0b' },
        { name: 'Soybeans', value: 25, color: '#3b82f6' }
    ];
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    
    let currentAngle = -Math.PI / 2;
    
    data.forEach(item => {
        const sliceAngle = (item.value / 100) * 2 * Math.PI;
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        
        // Add stroke
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        currentAngle += sliceAngle;
    });
    
    // Add inner circle for donut effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
}

// Initialize Yield Prediction Chart
function initializeYieldChart() {
    const canvas = document.getElementById('yieldChart');
    if (!canvas) return; // Safety check
    const ctx = canvas.getContext('2d');
    
    const data = [
        { month: 'Jan', predicted: 85, actual: 82 },
        { month: 'Feb', predicted: 88, actual: 90 },
        { month: 'Mar', predicted: 92, actual: 88 },
        { month: 'Apr', predicted: 96, actual: 94 },
        { month: 'May', predicted: 98, actual: 100 },
        { month: 'Jun', predicted: 95, actual: 0 }
    ];
    
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = 100;
    const barWidth = chartWidth / (data.length * 2);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bars
    data.forEach((item, index) => {
        const x = padding + (index * barWidth * 2);
        const predictedHeight = (item.predicted / maxValue) * chartHeight;
        const actualHeight = item.actual > 0 ? (item.actual / maxValue) * chartHeight : 0;
        
        // Predicted bar
        ctx.fillStyle = 'hsl(142, 70%, 45%)';
        ctx.fillRect(x, padding + chartHeight - predictedHeight, barWidth * 0.8, predictedHeight);
        
        // Actual bar (if exists)
        if (item.actual > 0) {
            ctx.fillStyle = 'hsl(38, 95%, 50%)';
            ctx.fillRect(x + barWidth * 0.8, padding + chartHeight - actualHeight, barWidth * 0.8, actualHeight);
        }
        
        // Month labels
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.month, x + barWidth, canvas.height - 10);
    });
    
    // Draw axes
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();
    
    // Y-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const y = padding + chartHeight - (i * chartHeight / 5);
        const value = (i * maxValue / 5).toFixed(0);
        ctx.fillText(value, padding - 5, y + 3);
    }
}

// Add weather animation
function animateWeatherIcons() {
    const weatherIcons = document.querySelectorAll('.weather-item i');
    weatherIcons.forEach((icon, index) => {
        setTimeout(() => {
            icon.style.animation = 'pulse 2s infinite';
        }, index * 200);
    });
}

// Initialize weather animation after page load
setTimeout(animateWeatherIcons, 2000);
