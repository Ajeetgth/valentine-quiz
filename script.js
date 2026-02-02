// ============================================
// LIVE STATS SYSTEM - NAYA FEATURE
// ============================================

// Initial stats (fake data for trust building)
let statsData = {
    total: 2847,
    'bf-gf': 1196,
    'ex': 797,
    'both': 427,
    'single': 427
};

// Function to update stats when user clicks
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
    const duration = 800; // ms
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
        
        // Format with comma for thousands
        element.textContent = Math.floor(current).toLocaleString();
    }, stepDuration);
}

// Load stats from localStorage on page load
function loadStats() {
    const saved = localStorage.getItem('statsData');
    if (saved) {
        statsData = JSON.parse(saved);
        
        // Update UI with saved stats
        document.getElementById('totalVotes').textContent = statsData.total.toLocaleString();
        
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
// USER JOURNEY TRACKER (ORIGINAL CODE)
// ============================================
let userJourney = {
    relationshipStatus: null,
    responses: []
};

// Get all screens
const screens = document.querySelectorAll('.screen');
const heartLoader = document.querySelector('.cssload-main');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load saved stats
    loadStats();
    
    // Add random stat changes simulation (makes it feel more real)
    simulateLiveActivity();
    
    // Add click handlers to all choice buttons
    const choiceButtons = document.querySelectorAll('.choice-btn');
    
    choiceButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const nextScreen = this.getAttribute('data-next');
            const value = this.getAttribute('data-value');
            
            // Track user response
            userJourney.responses.push(value);
            
            // Update stats if on first screen
            const currentScreen = document.querySelector('.screen.active');
            if (currentScreen && currentScreen.id === 'screen1') {
                updateStats(value);
            }
            
            // Handle screen transition
            if (nextScreen) {
                transitionToScreen(nextScreen);
            }
            
            // Add haptic feedback on mobile
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        });
        
        // Add subtle hover sound effect (optional)
        btn.addEventListener('mouseenter', () => {
            // You can add sound here if needed
        });
    });
    
    // Track product clicks for analytics
    trackProductClicks();
});

// Simulate live activity (random stat changes every few seconds)
function simulateLiveActivity() {
    setInterval(() => {
        // Randomly pick a category to increment
        const categories = ['bf-gf', 'ex', 'both', 'single'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        // Small chance to update (1 in 5 seconds)
        if (Math.random() < 0.2) {
            statsData.total += 1;
            statsData[randomCategory] += 1;
            
            // Update UI
            const total = statsData.total;
            const percent = Math.round((statsData[randomCategory] / total) * 100);
            
            document.getElementById('totalVotes').textContent = statsData.total.toLocaleString();
            document.getElementById(`count-${randomCategory}`).textContent = statsData[randomCategory].toLocaleString();
            document.getElementById(`percent-${randomCategory}`).textContent = `${percent}%`;
            document.getElementById(`bar-${randomCategory}`).style.width = `${percent}%`;
            
            // Recalculate all percentages
            ['bf-gf', 'ex', 'both', 'single'].forEach(type => {
                const p = Math.round((statsData[type] / total) * 100);
                document.getElementById(`percent-${type}`).textContent = `${p}%`;
                document.getElementById(`bar-${type}`).style.width = `${p}%`;
            });
            
            // Save to localStorage
            localStorage.setItem('statsData', JSON.stringify(statsData));
        }
    }, 5000); // Every 5 seconds
}

// Smooth screen transition with loader
function transitionToScreen(screenId) {
    const currentScreen = document.querySelector('.screen.active');
    const nextScreen = document.getElementById(`screen${screenId}`);
    
    if (!nextScreen) return;
    
    // Show loader for emotional buildup
    showLoader();
    
    // Hide current screen
    if (currentScreen) {
        currentScreen.classList.remove('active');
    }
    
    // Show next screen after delay
    setTimeout(() => {
        hideLoader();
        nextScreen.classList.add('active');
        
        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Add entrance animation
        nextScreen.style.animation = 'none';
        setTimeout(() => {
            nextScreen.style.animation = '';
        }, 10);
        
    }, 1200); // Psychological sweet spot - not too fast, not too slow
}

// Show heart loader
function showLoader() {
    heartLoader.classList.add('active');
}

// Hide heart loader
function hideLoader() {
    heartLoader.classList.remove('active');
}

// Track product button clicks for conversion analytics
function trackProductClicks() {
    const productButtons = document.querySelectorAll('.buy-btn');
    
    productButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Track which product was clicked
            const productType = this.id || 'product';
            
            // You can send this to your analytics
            console.log('Product clicked:', productType);
            console.log('User journey:', userJourney);
            
            // Optional: Add to cart animation before redirect
            this.innerHTML = '✓ Added! Redirecting...';
            this.style.background = 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)';
            
            // Prevent immediate redirect for better UX
            e.preventDefault();
            
            // Redirect after brief delay
            setTimeout(() => {
                window.location.href = this.href;
            }, 800);
            
            // Haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate([50, 100, 50]);
            }
        });
    });
}

// Add pulse effect to buttons when they appear
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out';
        }
    });
}, observerOptions);

// Observe all buttons
document.querySelectorAll('.choice-btn, .buy-btn').forEach(btn => {
    observer.observe(btn);
});

// Add fadeInUp animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
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

// Prevent accidental back navigation
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

// Add initial state to history
history.pushState(null, null, window.location.pathname);

// Responsive touch handling for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    // Optional: Add swipe to continue gesture
    if (Math.abs(diff) > swipeThreshold) {
        // Swipe detected - can add functionality if needed
    }
}

// Performance: Lazy load images if added later
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for older browsers
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Add urgency timer (optional enhancement)
function addUrgencyTimer() {
    const urgencyTexts = document.querySelectorAll('.urgency-text');
    
    urgencyTexts.forEach(text => {
        // Random stock number between 3-9
        const stock = Math.floor(Math.random() * 7) + 3;
        const originalText = text.innerHTML;
        
        // Update with dynamic stock
        if (originalText.includes('Only')) {
            text.innerHTML = `⚡ Only ${stock} left in stock!`;
        }
    });
}

// Call on load
addUrgencyTimer();

// Tab visibility - pause animations when tab is hidden (performance)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations
        document.body.style.animationPlayState = 'running';
    }
});

// Console easter egg for developers
console.log('%c💝 Built with Love & Psychology! 💝', 'color: #ff6b81; font-size: 20px; font-weight: bold;');
console.log('%cUser Journey:', 'color: #667eea; font-size: 14px;', userJourney);
console.log('%cLive Stats:', 'color: #00b894; font-size: 14px;', statsData);

// Error handling for product links
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'A') {
        console.error('Product link error:', e);
        alert('Oops! Something went wrong. Please try again or contact support.');
    }
}, true);

// Prefetch product pages for faster loading (optional)
function prefetchProductPages() {
    const productLinks = document.querySelectorAll('.buy-btn');
    
    productLinks.forEach(link => {
        const prefetch = document.createElement('link');
        prefetch.rel = 'prefetch';
        prefetch.href = link.href;
        document.head.appendChild(prefetch);
    });
}

// Call when user shows buying intent (e.g., on product screen)
const productScreens = document.querySelectorAll('.product-screen');
productScreens.forEach(screen => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                prefetchProductPages();
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(screen);
});

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Prevent zoom on double tap (iOS)
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// Add meta viewport for better mobile experience
const metaViewport = document.querySelector('meta[name="viewport"]');
if (metaViewport) {
    metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}
