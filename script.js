// User Journey Tracker
let userJourney = {
    relationshipStatus: null,
    responses: []
};

// Get all screens
const screens = document.querySelectorAll('.screen');
const heartLoader = document.querySelector('.cssload-main');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers to all choice buttons
    const choiceButtons = document.querySelectorAll('.choice-btn');
    
    choiceButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const nextScreen = this.getAttribute('data-next');
            const value = this.getAttribute('data-value');
            
            // Track user response
            userJourney.responses.push(value);
            
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
