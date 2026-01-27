// Get all elements
const containers = document.querySelectorAll('.question-container, .result-container');
const heartLoader = document.querySelector('.cssload-main');
let selectedGender = '';

// Function to show a specific container
function showContainer(containerId) {
  containers.forEach(container => {
    container.classList.remove('active');
  });
  
  const targetContainer = document.getElementById(containerId);
  if (targetContainer) {
    setTimeout(() => {
      targetContainer.classList.add('active');
    }, 300);
  }
}

// Handle choice buttons
document.querySelectorAll('.choice-btn').forEach(button => {
  button.addEventListener('click', function() {
    const nextQuestion = this.getAttribute('data-next');
    const gender = this.getAttribute('data-gender');
    
    // Store gender if provided
    if (gender) {
      selectedGender = gender;
      // Update pronouns in subsequent questions
      updatePronouns(gender);
    }
    
    // Show loading animation
    const currentContainer = this.closest('.container');
    currentContainer.classList.remove('active');
    heartLoader.style.display = 'block';
    
    // Transition to next question
    setTimeout(() => {
      heartLoader.style.display = 'none';
      showContainer(nextQuestion);
    }, 1500);
  });
});

// Update gender pronouns
function updatePronouns(gender) {
  const pronoun = gender === 'boyfriend' ? 'him' : 'her';
  const genderText = gender === 'boyfriend' ? 'your boyfriend' : 'your girlfriend';
  
  document.querySelectorAll('#genderPronoun, #genderPronoun2').forEach(el => {
    el.textContent = pronoun;
  });
}

// Handle "no love" button with fun interaction
const noLoveBtn = document.querySelector('.no-love-btn');
if (noLoveBtn) {
  let clickCount = 0;
  
  noLoveBtn.addEventListener('click', function() {
    clickCount++;
    
    if (clickCount === 1) {
      this.textContent = "Are you sure? 🤔";
    } else if (clickCount === 2) {
      this.textContent = "Really? Think again! 💭";
    } else if (clickCount === 3) {
      this.textContent = "Maybe reconsider? 💝";
    } else {
      // After multiple clicks, show a message and redirect to single path
      alert("That's okay! Maybe you just need to show them you care more! 💕");
      const currentContainer = this.closest('.container');
      currentContainer.classList.remove('active');
      heartLoader.style.display = 'block';
      
      setTimeout(() => {
        heartLoader.style.display = 'none';
        showContainer('result');
      }, 1500);
    }
  });
  
  // Add mouse movement for "no love" button (make it move away)
  noLoveBtn.addEventListener('mouseenter', function() {
    if (clickCount < 3) {
      const container = this.closest('.container');
      const containerRect = container.getBoundingClientRect();
      const buttonRect = this.getBoundingClientRect();
      
      // Calculate random position within container
      const maxX = containerRect.width - buttonRect.width - 40;
      const maxY = 400; // Limited vertical movement
      
      const newX = Math.random() * maxX;
      const newY = Math.random() * maxY;
      
      this.style.position = 'absolute';
      this.style.left = `${newX}px`;
      this.style.top = `${newY + 200}px`;
      this.style.transition = 'all 0.3s ease';
    }
  });
}

// Add tracking for analytics (you can integrate with Google Analytics or Facebook Pixel)
function trackEvent(eventName, eventData) {
  console.log('Event:', eventName, eventData);
  // Add your analytics code here
  // Example: gtag('event', eventName, eventData);
  // Example: fbq('track', eventName, eventData);
}

// Track when users reach the product page
document.addEventListener('DOMContentLoaded', () => {
  trackEvent('page_load', { page: 'quiz_start' });
});

// Track button clicks
document.querySelectorAll('.choice-btn').forEach(button => {
  button.addEventListener('click', function() {
    trackEvent('button_click', {
      button_text: this.textContent,
      next_screen: this.getAttribute('data-next')
    });
  });
});

// Track when buy button is clicked
document.querySelectorAll('.buy-btn').forEach(button => {
  button.addEventListener('click', function() {
    trackEvent('buy_button_click', {
      product: 'glow_bracelets',
      button_location: this.closest('.container').id
    });
  });
});

// Add some sparkle effect on hover for buy buttons
document.querySelectorAll('.buy-btn').forEach(button => {
  button.addEventListener('mouseenter', function() {
    createSparkles(this);
  });
});

function createSparkles(element) {
  for (let i = 0; i < 5; i++) {
    const sparkle = document.createElement('span');
    sparkle.textContent = '✨';
    sparkle.style.position = 'absolute';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.fontSize = '1.5rem';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.animation = 'sparkle 1s ease-out forwards';
    
    element.style.position = 'relative';
    element.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
  }
}

// Add sparkle animation
const style = document.createElement('style');
style.textContent = `
  @keyframes sparkle {
    0% {
      opacity: 1;
      transform: scale(0) rotate(0deg);
    }
    100% {
      opacity: 0;
      transform: scale(1.5) rotate(180deg) translateY(-30px);
    }
  }
`;
document.head.appendChild(style);

// Initialize - show first question
showContainer('question1');
