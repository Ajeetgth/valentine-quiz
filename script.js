// ============================================
// COLLAPSIBLE STATS SYSTEM
// ============================================

// Initial stats (fake data for trust building)
let statsData = {
    total: 2847,
    'bf-gf': 1196,
    'ex': 797,
    'both': 427,
    'single': 427
};

// Toggle stats visibility
function toggleStats() {
    const statsContainer = document.getElementById('statsContainer');
    const toggleBtn = document.getElementById('statsToggle');
    
    if (statsContainer.classList.contains('collapsed')) {
        statsContainer.classList.remove('collapsed');
        statsContainer.classList.add('expanded');
        toggleBtn.textContent = `📊 Hide Stats (${statsData.total.toLocaleString()} people voted)`;
    } else {
        statsContainer.classList.remove('expanded');
        statsContainer.classList.add('collapsed');
        toggleBtn.textContent = `📊 View Live Stats (${statsData.total.toLocaleString()} people voted)`;
    }
}

// Close stats
function closeStats() {
    const statsContainer = document.getElementById('statsContainer');
    const toggleBtn = document.getElementById('statsToggle');
    
    statsContainer.classList.remove('expanded');
    statsContainer.classList.add('collapsed');
    toggleBtn.textContent = `📊 View Live Stats (${statsData.total.toLocaleString()} people voted)`;
}

// Update stats when user clicks
function updateStats(selectedValue) {
    // Increase total count
    statsData.total += 1;
    
    // Increase selected option count
    if (statsData[selectedValue]) {
        statsData[selectedValue] += 1;
    }
    
    // Calculate new percentages
    const total = statsData.total;
    const bfgfPercent = Math.round((statsData['bf-gf'] / total) * 100);
    const exPercent = Math.round((statsData['ex'] / total) * 100);
    const bothPercent = Math.round((statsData['both'] / total) * 100);
    const singlePercent = Math.round((statsData['single'] / total) * 100);
    
    // Animate the changes
    animateStatUpdate('bf-gf', statsData['bf-gf'], bfgfPercent);
    animateStatUpdate('ex', statsData['ex'], exPercent);
    animateStatUpdate('both', statsData['both'], bothPercent);
    animateStatUpdate('single', statsData['single'], singlePercent);
    
    // Update total count with animation
    animateNumber('totalVotes', statsData.total);
    animateNumber('statsCount', statsData.total);
    
    // Save to localStorage for persistence
    localStorage.setItem('statsData', JSON.stringify(statsData));
}

// Animate stat updates
function animateStatUpdate(type, count, percent) {
    const countElement = document.getElementById(`count-${type}`);
    const percentElement = document.getElementById(`percent-${type}`);
    const barElement = document.getElementById(`bar-${type}`);
    
    if (!countElement || !percentElement || !barElement) return;
    
    // Animate count
    animateNumber(`count-${type}`, count);
    
    // Animate percentage
    percentElement.textContent = `${percent}%`;
    percentElement.style.animation = 'pulse-stat 0.5s ease';
    
    // Animate bar width
    barElement.style.transition = 'width 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    barElement.style.width = `${percent}%`;
    
    // Add highlight effect to selected option
    const statItem = countElement.closest('.stat-item');
    if (statItem) {
        statItem.style.animation = 'highlight-stat 1s ease';
        setTimeout(() => {
            statItem.style.animation = '';
        }, 1000);
    }
}

// Animate number counting
function animateNumber(elementId, targetNumber) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startNumber = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const duration = 800;
    const steps = 30;
    const increment = (targetNumber - startNumber) / steps;
    const stepDuration = duration / steps;
    
    let current = startNumber;
    let step = 0;
    
    const timer = setInterval(() => {
        step++;
        current += increment;
        
        if (step >= steps) {
            current = targetNumber;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current).toLocaleString();
    }, stepDuration);
}

// Load stats from localStorage on page load
function loadStats() {
    const saved = localStorage.getItem('statsData');
    if (saved) {
        statsData = JSON.parse(saved);
        
        // Update UI with saved stats
        document.getElementById('statsCount').textContent = statsData.total.toLocaleString();
        
        const total = statsData.total;
        ['bf-gf', 'ex', 'both', 'single'].forEach(type => {
            const percent = Math.round((statsData[type] / total) * 100);
            document.getElementById(`count-${type}`).textContent = statsData[type].toLocaleString();
            document.getElementById(`percent-${type}`).textContent = `${percent}%`;
            document.getElementById(`bar-${type}`).style.width = `${percent}%`;
        });
    }
}

// ============================================
// SHARE FUNCTIONS
// ============================================

function shareOnWhatsApp() {
    const text = "Take this fun quiz and find the perfect gift! 💝🎁";
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
}

function shareOnTwitter() {
    const text = "I just took this amazing quiz! Find out what gift suits you best! 💝";
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
}

function copyLink() {
    const url = window.location.href;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied! 🔗 Share it with your friends!');
        }).catch(err => {
            fallbackCopyLink(url);
        });
    } else {
        fallbackCopyLink(url);
    }
}

function fallbackCopyLink(url) {
    const tempInput = document.createElement('input');
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Link copied! 🔗 Share it with your friends!');
}

// ============================================
// USER JOURNEY TRACKER
// ============================================
let userJourney = {
    relationshipStatus: null,
    responses: []
};

const screens = document.querySelectorAll('.screen');
const heartLoader = document.querySelector('.cssload-main');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load saved stats
    loadStats();
    
    // Add stats toggle event
    const statsToggle = document.getElementById('statsToggle');
    const statsClose = document.getElementById('statsClose');
    
    if (statsToggle) {
        statsToggle.addEventListener('click', toggleStats);
    }
    
    if (statsClose) {
        statsClose.addEventListener('click', closeStats);
    }
    
    // Add random stat changes simulation
    simulateLiveActivity();
    
    // Add click handlers to all choice buttons
    const choiceButtons = document.querySelectorAll('.choice-btn');
    
    choiceButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const nextScreen = this.getAttribute('data-next');
            const value = this.getAttribute('data-value');
            
            userJourney.responses.push(value);
            
            const currentScreen = document.querySelector('.screen.active');
            if (currentScreen && currentScreen.id === 'screen1') {
                updateStats(value);
            }
            
            if (nextScreen) {
                transitionToScreen(nextScreen);
            }
            
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        });
    });
    
    trackProductClicks();
});

// Simulate live activity
function simulateLiveActivity() {
    setInterval(() => {
        const categories = ['bf-gf', 'ex', 'both', 'single'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        if (Math.random() < 0.2) {
            statsData.total += 1;
            statsData[randomCategory] += 1;
            
            const total = statsData.total;
            document.getElementById('statsCount').textContent = statsData.total.toLocaleString();
            
            ['bf-gf', 'ex', 'both', 'single'].forEach(type => {
                const percent = Math.round((statsData[type] / total) * 100);
                document.getElementById(`count-${type}`).textContent = statsData[type].toLocaleString();
                document.getElementById(`percent-${type}`).textContent = `${percent}%`;
                document.getElementById(`bar-${type}`).style.width = `${percent}%`;
            });
            
            localStorage.setItem('statsData', JSON.stringify(statsData));
        }
    }, 5000);
}

// Smooth screen transition
function transitionToScreen(screenId) {
    const currentScreen = document.querySelector('.screen.active');
    const nextScreen = document.getElementById(`screen${screenId}`);
    
    if (!nextScreen) return;
    
    showLoader();
    
    if (currentScreen) {
        currentScreen.classList.remove('active');
    }
    
    setTimeout(() => {
        hideLoader();
        nextScreen.classList.add('active');
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        nextScreen.style.animation = 'none';
        setTimeout(() => {
            nextScreen.style.animation = '';
        }, 10);
        
    }, 1200);
}

function showLoader() {
    heartLoader.classList.add('active');
}

function hideLoader() {
    heartLoader.classList.remove('active');
}

// Track product clicks
function trackProductClicks() {
    const productButtons = document.querySelectorAll('.buy-btn');
    
    productButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const productType = this.id || 'product';
            
            console.log('Product clicked:', productType);
            console.log('User journey:', userJourney);
            
            this.innerHTML = '✓ Added! Redirecting...';
            this.style.background = 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)';
            
            e.preventDefault();
            
            setTimeout(() => {
                window.location.href = this.href;
            }, 800);
            
            if ('vibrate' in navigator) {
                navigator.vibrate([50, 100, 50]);
            }
        });
    });
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse-stat {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); color: #ff6b81; }
    }
    
    @keyframes highlight-stat {
        0%, 100% { background: transparent; }
        50% { background: rgba(255, 107, 129, 0.1); }
    }
`;
document.head.appendChild(style);

// Prevent back navigation
let backPressed = false;
window.addEventListener('popstate', function(event) {
    if (!backPressed) {
        backPressed = true;
        const confirmLeave = confirm('Are you sure you want to leave? Your perfect gift is just a click away! 💝');
        if (!confirmLeave) {
            history.pushState(null, null, window.location.pathname);
            backPressed = false;
        }
    }
});

history.pushState(null, null, window.location.pathname);

// Add urgency timer
function addUrgencyTimer() {
    const urgencyTexts = document.querySelectorAll('.urgency-text');
    
    urgencyTexts.forEach(text => {
        const stock = Math.floor(Math.random() * 7) + 3;
        const originalText = text.innerHTML;
        
        if (originalText.includes('Only')) {
            text.innerHTML = `⚡ Only ${stock} left in stock!`;
        }
    });
}

addUrgencyTimer();

// Console messages
console.log('%c💝 Built with Love & Psychology! 💝', 'color: #ff6b81; font-size: 20px; font-weight: bold;');
console.log('%cUser Journey:', 'color: #667eea; font-size: 14px;', userJourney);
console.log('%cLive Stats:', 'color: #00b894; font-size: 14px;', statsData);

document.documentElement.style.scrollBehavior = 'smooth';
