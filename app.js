// Elements
const screens = document.querySelectorAll('.screen');
const navItems = document.querySelectorAll('.nav-item');
const bottomNav = document.querySelector('.bottom-nav');
const togglePwBtn = document.getElementById('toggle-pw');
const pwInput = document.getElementById('password-input');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // 1. Splash Screen Logic
    setTimeout(() => {
        navigateTo('auth-screen');
    }, 2500);

    // Toggle Password Visibility
    if (togglePwBtn && pwInput) {
        togglePwBtn.addEventListener('click', () => {
            const type = pwInput.getAttribute('type') === 'password' ? 'text' : 'password';
            pwInput.setAttribute('type', type);
            togglePwBtn.classList.toggle('fa-eye');
            togglePwBtn.classList.toggle('fa-eye-slash');
        });
    }

    // Bottom Nav Clicks
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            navigateTo(target);

            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Initialize Chart.js
    initChart();
    
    // Start simulations
    startMockData();
    simulateAlert();
});

// App Router
function navigateTo(screenId) {
    // Hide all screens
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
    }

    // Manage Bottom Nav Visibility
    if (screenId === 'auth-screen' || screenId === 'splash-screen') {
        bottomNav.style.display = 'none';
    } else {
        bottomNav.style.display = 'flex';
        // Sync nav active state if navigated via button instead of nav bar
        const activeNav = document.querySelector(`.nav-item[data-target="${screenId}"]`);
        if (activeNav) {
            navItems.forEach(nav => nav.classList.remove('active'));
            activeNav.classList.add('active');
        }
    }
}

// Chart.js Setup
let bpmChart;
const chartData = [72, 74, 73, 75, 72, 70, 71, 74, 76, 75, 73, 72];

function initChart() {
    const ctx = document.getElementById('bpmChart').getContext('2d');
    
    // Create gradient
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255, 71, 87, 0.5)'); // Soft red
    gradient.addColorStop(1, 'rgba(255, 71, 87, 0.0)');

    bpmChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', '', '', '', '', '', '', ''],
            datasets: [{
                label: 'Heart Rate',
                data: chartData,
                borderColor: '#ff4757',
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#ff4757',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: { 
                    display: false,
                    min: 60,
                    max: 100
                }
            },
            animation: {
                duration: 400
            }
        }
    });
}

// Mock Data Simulation
let currentBpm = 72;
function startMockData() {
    setInterval(() => {
        // Randomly adjust BPM slightly
        const variance = Math.floor(Math.random() * 5) - 2; // -2 to +2
        currentBpm += variance;
        
        // Keep in realistic bounds
        if (currentBpm < 65) currentBpm = 65;
        if (currentBpm > 85) currentBpm = 85;

        // Update DOM
        const homeBpm = document.getElementById('home-bpm');
        const liveBpm = document.getElementById('live-bpm-display');
        
        if (homeBpm) homeBpm.innerText = currentBpm;
        if (liveBpm) liveBpm.innerText = currentBpm;

        // Update Chart
        if (bpmChart) {
            bpmChart.data.datasets[0].data.push(currentBpm);
            bpmChart.data.datasets[0].data.shift();
            bpmChart.update();
        }

        // Randomly fluctuate BP slightly
        if (Math.random() > 0.7) {
            const sys = 118 + Math.floor(Math.random() * 6);
            const dia = 78 + Math.floor(Math.random() * 5);
            const bpEl = document.getElementById('home-bp');
            if (bpEl) {
                bpEl.innerHTML = `${sys}<span class="small-slash">/${dia}</span>`;
            }
        }

    }, 2000); // Update every 2 seconds
}

// Simulate showing an alert Notification logic
function simulateAlert() {
    setTimeout(() => {
        const badge = document.getElementById('alert-badge');
        if (badge) {
            badge.style.display = 'flex';
        }
    }, 8000); // Show unread badge after 8 seconds
}

// Settings Bluetooth Toggle Simulation
const btToggle = document.getElementById('bt-toggle');
if (btToggle) {
    btToggle.addEventListener('change', (e) => {
        const isConnected = e.target.checked;
        const statusCard = document.getElementById('device-status');
        const statusText = document.getElementById('status-text');

        if (isConnected) {
            statusCard.classList.add('connected');
            statusText.innerText = 'Smart Band Connected';
            statusCard.querySelector('.bt-icon').innerHTML = '<i class="fa-brands fa-bluetooth-b"></i>';
            statusCard.querySelector('p').innerText = 'Syncing in real-time';
        } else {
            statusCard.classList.remove('connected');
            statusText.innerText = 'Device Disconnected';
            statusCard.querySelector('.bt-icon').innerHTML = '<i class="fa-solid fa-bluetooth-slash"></i>';
            statusCard.querySelector('p').innerText = 'Check Bluetooth settings';
            
            // Optionally clear data values
            document.getElementById('home-bpm').innerText = '--';
            document.getElementById('home-bp').innerHTML = '--<span class="small-slash">/--</span>';
        }
    });
}
