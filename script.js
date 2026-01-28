// Device Detection
const deviceInfo = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    width: window.innerWidth
};

document.addEventListener('DOMContentLoaded', function() {
    if (deviceInfo.isMobile || deviceInfo.width < 768) {
        document.body.classList.add('mobile-device');
        document.getElementById('device-info').textContent = 'mobile';
    } else {
        document.body.classList.add('desktop-device');
        document.getElementById('device-info').textContent = 'desktop';
    }
    
    initEvadeButton();
    initScratchCard();
    initExitIntent();
    startStockTimer();
    rotateProof();
});

// Step Navigation
function nextStep(stepNumber) {
    const currentStep = document.querySelector('.step-container.active');
    if (currentStep) {
        currentStep.classList.remove('active');
    }
    
    const nextStepEl = document.getElementById('step' + stepNumber);
    if (nextStepEl) {
        nextStepEl.classList.add('active');
        const progress = (stepNumber / 4) * 100;
        document.getElementById('progressBar').style.width = progress + '%';
        
        if (stepNumber === 3) simulateLoading();
        if (stepNumber === 4) animateStockCount();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// EVADE BUTTON - Works on both Mobile & Desktop
function initEvadeButton() {
    const btn = document.getElementById('evadeBtn');
    if (!btn) return;
    
    let moveCount = 0;
    const guiltMessages = [
        "No, I like boring dates",
        "No, routine is fine",
        "I don't want fun",
        "Reject happiness?",
        "Say no to love?",
        "Choose boredom?"
    ];
    
    // Mouse for desktop
    btn.addEventListener('mouseenter', function() {
        if (!deviceInfo.isMobile) moveButton();
    });
    
    // Touch for mobile + auto-move
    if (deviceInfo.isMobile) {
        btn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            moveButton();
        }, {passive: false});
        
        // Auto move every 2 seconds on mobile
        setInterval(() => {
            if (document.getElementById('step2').classList.contains('active')) {
                moveButton();
            }
        }, 2000);
    }
    
    window.moveButton = function() {
        moveCount++;
        
        // Change text occasionally (guilt trip)
        if (moveCount % 3 === 0) {
            const msg = guiltMessages[Math.floor(Math.random() * guiltMessages.length)];
            btn.querySelector('span').textContent = msg;
        }
        
        // Calculate position
        const btnRect = btn.getBoundingClientRect();
        const maxX = window.innerWidth - btnRect.width - 40;
        const maxY = window.innerHeight - btnRect.height - 100;
        
        let newX, newY;
        
        if (deviceInfo.isMobile) {
            newX = Math.random() * (maxX * 0.8) + (maxX * 0.1);
            newY = maxY - 50 + (Math.random() * 100);
        } else {
            const container = document.querySelector('.button-wrapper');
            const containerRect = container.getBoundingClientRect();
            newX = Math.random() * (containerRect.width - btnRect.width);
            newY = Math.random() * (containerRect.height - btnRect.height);
        }
        
        // Ensure minimum movement distance
        const currentX = parseFloat(btn.style.left) || 0;
        if (Math.abs(newX - currentX) < 50) newX += 50;
        
        btn.style.position = 'absolute';
        btn.style.left = Math.min(Math.max(10, newX), maxX) + 'px';
        btn.style.top = Math.min(Math.max(10, newY), maxY) + 'px';
        btn.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        const rotation = (Math.random() - 0.5) * 20;
        btn.style.transform = `rotate(${rotation}deg)`;
    };
}

// Loading Simulation
function simulateLoading() {
    const statusEl = document.getElementById('loading-status');
    const messages = [
        { text: "Checking date night potential 💕", delay: 0 },
        { text: "Analyzing boredom levels... 📊", delay: 800 },
        { text: "Scanning compatibility... 🔍", delay: 1600 },
        { text: "Calculating spark revival chance... ✨", delay: 2400 },
        { text: "SOLUTION FOUND! 🎯", delay: 3200 }
    ];
    
    messages.forEach(({text, delay}) => {
        setTimeout(() => {
            if (statusEl) {
                statusEl.textContent = text;
                statusEl.style.animation = 'none';
                setTimeout(() => statusEl.style.animation = 'fadeIn 0.3s', 10);
            }
        }, delay);
    });
    
    setTimeout(() => nextStep(4), 4000);
}

// Social Proof Rotation
function rotateProof() {
    const proofs = [
        "🔥 Priya & Rahul just ordered!",
        "💕 New order from Mumbai",
        "⚡ 24 people viewing now",
        "🎁 3 sold in last hour",
        "💝 Ships to Delhi today"
    ];
    
    let index = 0;
    const container = document.querySelector('.social-proof-float');
    
    setInterval(() => {
        if (document.getElementById('step3').classList.contains('active')) {
            index = (index + 1) % proofs.length;
            const newProof = document.createElement('div');
            newProof.className = 'proof-item';
            newProof.textContent = proofs[index];
            
            if (container) {
                container.appendChild(newProof);
                if (container.children.length > 3) {
                    container.removeChild(container.firstChild);
                }
            }
        }
    }, 3000);
}

// Stock Countdown (Urgency)
function startStockTimer() {
    let stock = 12;
    const stockEl = document.getElementById('stockCount');
    
    setInterval(() => {
        if (document.getElementById('step4').classList.contains('active')) {
            if (stock > 3 && Math.random() > 0.6) {
                stock--;
                if (stockEl) {
                    stockEl.textContent = stock;
                    stockEl.style.animation = 'pulse 0.5s';
                    setTimeout(() => stockEl.style.animation = '', 500);
                }
                
                const fill = document.querySelector('.progress-fill');
                if (fill) fill.style.width = (stock / 20) * 100 + '%';
            }
        }
    }, 8000);
}

function animateStockCount() {
    let count = 20;
    const el = document.getElementById('stockCount');
    const interval = setInterval(() => {
        count--;
        if (el) el.textContent = count;
        if (count <= 7) clearInterval(interval);
    }, 100);
}

// Interactive Scratch Card
function initScratchCard() {
    const card = document.querySelector('.scratch-card');
    if (!card) return;
    
    setTimeout(() => card.classList.add('scratched'), 2000);
    card.addEventListener('click', () => card.classList.toggle('scratched'));
}

// Exit Intent (Desktop)
function initExitIntent() {
    if (deviceInfo.isMobile) return;
    
    let exitShown = false;
    document.addEventListener('mouseout', (e) => {
        if (e.clientY < 10 && !exitShown) {
            showExitPopup();
            exitShown = true;
        }
    });
}

function showExitPopup() {
    const popup = document.getElementById('exitPopup');
    if (popup) popup.classList.add('show');
}

function closePopup() {
    const popup = document.getElementById('exitPopup');
    if (popup) popup.classList.remove('show');
}

function convertEvent() {
    console.log('Purchase clicked!');
    const btn = document.querySelector('.cta-button');
    if (btn) {
        btn.innerHTML = '<span class="btn-main-text">🚀 Redirecting to Secure Checkout...</span>';
        btn.style.background = '#00b894';
    }
}

// Handle Resize
window.addEventListener('resize', () => {
    deviceInfo.width = window.innerWidth;
    if (deviceInfo.width < 768) {
        document.body.classList.remove('desktop-device');
        document.body.classList.add('mobile-device');
    } else {
        document.body.classList.remove('mobile-device');
        document.body.classList.add('desktop-device');
    }
});

// Prevent accidental back
history.pushState(null, '', location.href);
window.addEventListener('popstate', () => {
    if (!document.getElementById('step4').classList.contains('active')) {
        history.pushState(null, '');
        alert('⚠️ Wait! Don\'t miss out on saving your relationship! Complete the quiz first! 🔥');
    }
});
