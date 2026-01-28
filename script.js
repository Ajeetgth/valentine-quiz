const questionBox = document.getElementById("questionBox");
const resultBox = document.getElementById("resultBox");
const loader = document.getElementById("loader");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.querySelector(".js-yes-btn");
const questionText = document.getElementById("questionText");
const subText = document.getElementById("subText");

// Questions that relate to the product
const questions = [
    {
        q: "Is Your Date Night Getting Boring? 🥱",
        sub: "Netflix & chill again tonight?",
        yes: "Yes! Help us 😍",
        no: "No, we're fine"
    },
    {
        q: "Same Routine Every Weekend? 😴",
        sub: "Don't you want some spark back?",
        yes: "Absolutely! 🔥",
        no: "Routine is good"
    },
    {
        q: "Want Mystery Date Ideas? 🎁",
        sub: "Scratch cards for couples!",
        yes: "Yes Please! 💝",
        no: "I don't like fun"
    }
];

let currentQ = 0;

// NO BUTTON - Works on BOTH Mobile & Desktop
function moveButton() {
    const isMobile = window.innerWidth < 768;
    const btnRect = noBtn.getBoundingClientRect();
    
    let newX, newY;
    
    if (isMobile) {
        // For mobile - move within screen bounds
        newX = Math.random() * (window.innerWidth - 100);
        newY = Math.random() * (window.innerHeight - 100);
    } else {
        // For desktop - move around question box
        const container = questionBox.getBoundingClientRect();
        newX = Math.random() * (container.width - btnRect.width);
        newY = Math.random() * (container.height - btnRect.height);
    }
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = Math.max(10, newX) + 'px';
    noBtn.style.top = Math.max(10, newY) + 'px';
    noBtn.style.zIndex = '9999';
    
    // Change text to guilt trip
    const guiltTexts = ["No", "Really?", "Think again!", "Don't click me!", "Please say yes!"];
    noBtn.textContent = guiltTexts[Math.floor(Math.random() * guiltTexts.length)];
}

// BOTH mouse and touch events
noBtn.addEventListener("mouseover", moveButton);
noBtn.addEventListener("touchstart", function(e) {
    e.preventDefault();
    moveButton();
});
noBtn.addEventListener("click", function(e) {
    e.preventDefault();
    moveButton();
});

// YES BUTTON
yesBtn.addEventListener("click", () => {
    if (currentQ < questions.length - 1) {
        // Next question
        currentQ++;
        updateQuestion();
    } else {
        // Show result
        showResult();
    }
});

function updateQuestion() {
    questionText.style.opacity = 0;
    subText.style.opacity = 0;
    
    setTimeout(() => {
        questionText.textContent = questions[currentQ].q;
        subText.textContent = questions[currentQ].sub;
        yesBtn.textContent = questions[currentQ].yes;
        noBtn.textContent = questions[currentQ].no;
        
        questionText.style.opacity = 1;
        subText.style.opacity = 1;
    }, 300);
}

function showResult() {
    questionBox.style.display = "none";
    loader.style.display = "block";
    
    setTimeout(() => {
        loader.style.display = "none";
        resultBox.style.display = "block";
    }, 2500);
}

// Add fade transition
questionText.style.transition = "opacity 0.3s";
subText.style.transition = "opacity 0.3s";
