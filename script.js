document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const panels = {
        1: document.getElementById('panel-1'),
        2: document.getElementById('panel-2'),
        3: document.getElementById('panel-3')
    };

    const ui = {
        storyText: document.getElementById('story-text'),
        btnNextStory: document.getElementById('btn-next-story'),
        btnYes: document.getElementById('btn-yes'),
        btnNo: document.getElementById('btn-no'),
        btnRestart: document.getElementById('btn-restart'),
        btnRetry: document.getElementById('btn-retry'),
        frog: document.getElementById('game-frog'),
        feedbackOverlay: document.getElementById('feedback-overlay'),
        feedbackText: document.getElementById('feedback-text')
    };

    // --- State ---
    let currentStoryIndex = 0;
    const storyLines = [
        "Froggy loves jumping across ponds.<br>But Froggy is a careful frog...",
        "He only jumps when the number is <span class='highlight'>greater than 5</span>.",
        "If the number is small, Froggy waits patiently."
    ];

    // --- Story Logic ---
    function updateStory() {
        console.log('Updating story to index:', currentStoryIndex);
        ui.storyText.innerHTML = storyLines[currentStoryIndex];
    }

    if (ui.btnNextStory) {
        console.log('Next button found, attaching listener');
        ui.btnNextStory.addEventListener('click', () => {
            console.log('Next button clicked');
            currentStoryIndex++;
            console.log('New index:', currentStoryIndex);
            if (currentStoryIndex < storyLines.length) {
                updateStory();
            } else {
                console.log('End of story, switching panel');
                switchPanel(2);
            }
        });
    } else {
        console.error('Next button NOT found in DOM');
    }

    // --- Game Logic ---
    const targetNumber = 6;
    const threshold = 5;

    ui.btnYes.addEventListener('click', () => {
        if (targetNumber > threshold) {
            // Correct Answer
            handleCorrectAnswer();
        } else {
            // Incorrect (Shouldn't happen with hardcoded 6, but good logic)
            handleIncorrectAnswer("Oops! Froggy only jumps if number > 5.");
        }
    });

    ui.btnNo.addEventListener('click', () => {
        if (targetNumber > threshold) {
            // Incorrect - Frog WOULD jump
            handleIncorrectAnswer("Oops! 6 is greater than 5. Try again!");
        } else {
            // Correct logic if number was <= 5
            // (Logic placeholder for future levels)
        }
    });

    function handleCorrectAnswer() {
        // animate jump
        ui.frog.src = 'assets/frog-jump.jpg'; // Switch sprite
        ui.frog.classList.add('jump-animation');

        // Play sound (simulated)
        playSound('happy');

        // Confetti effect
        createConfetti();
        setTimeout(() => {
            showFeedback("Great job!", true);
            ui.frog.src = 'assets/frog-idle.jpg'; // Reset sprite after jump

            setTimeout(() => {
                switchPanel(3);
                hideFeedback();
            }, 2000);
        }, 1500); // Wait for jump animation part way
    }

    function handleIncorrectAnswer(message) {
        // animate shake/sad
        ui.frog.classList.add('sad-shake');

        setTimeout(() => {
            ui.frog.classList.remove('sad-shake');
            showFeedback(message, false);
        }, 500);
    }

    ui.btnRetry.addEventListener('click', () => {
        hideFeedback();
        // Reset frog position if needed (though CSS animation does it, might need JS reset)
        ui.frog.classList.remove('jump-animation');
        ui.frog.src = 'assets/frog-idle.jpg';
    });

    ui.btnRestart.addEventListener('click', () => {
        location.reload(); // Simple restart for now
    });

    // --- Helpers ---
    function switchPanel(panelId) {
        Object.values(panels).forEach(p => {
            p.classList.add('hidden');
            p.classList.remove('active');
        });
        panels[panelId].classList.remove('hidden');
        panels[panelId].classList.add('active');
    }

    function showFeedback(text, isSuccess) {
        ui.feedbackText.textContent = text;
        ui.feedbackOverlay.classList.remove('hidden');
        if (!isSuccess) {
            ui.btnRetry.classList.remove('hidden');
        } else {
            ui.btnRetry.classList.add('hidden');
        }
    }

    function hideFeedback() {
        ui.feedbackOverlay.classList.add('hidden');
    }

    function createConfetti() {
        const colors = ['#f44336', '#9c27b0', '#3f51b5', '#2196f3', '#4caf50', '#ffeb3b', '#ff9800'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.zIndex = '1000';
            confetti.style.transition = 'top 2s ease-in, transform 2s ease-in';
            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.style.top = '110vh';
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            }, 100);

            setTimeout(() => {
                confetti.remove();
            }, 2100);
        }
    }

    // --- Audio ---
    let audioCtx;

    function playSound(type) {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (type === 'happy') {
            osc.index = 'sine';
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } else if (type === 'sad') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        }
    }

    // Initialize
    updateStory();
});
