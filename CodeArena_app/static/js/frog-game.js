document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const panels = {
        story: document.getElementById('panel-1'),
        game: document.getElementById('panel-2'),
        code: document.getElementById('panel-3')
    };

    const ui = {
        storyText: document.getElementById('story-text'),
        btnNextStory: document.getElementById('btn-next-story'),
        btnYes: document.getElementById('btn-yes'),
        btnNo: document.getElementById('btn-no'),
        btnNextLevel: document.getElementById('btn-restart'), // Renamed for clarity
        btnRetry: document.getElementById('btn-retry'),
        frog: document.getElementById('game-frog'),
        feedbackOverlay: document.getElementById('feedback-overlay'),
        feedbackText: document.getElementById('feedback-text'),
        codeEditor: document.querySelector('#panel-3 .code-editor pre code'), // Added code editor element
        questionBox: document.querySelector('#panel-2 .question-box') // Reference to question box
    };

    // --- Game State ---
    let currentLevelIndex = 0;
    let currentStoryStep = 0;
    let levelSpecificState = {}; // To hold state like flies eaten for current level

    const levels = [
        {
            name: "Conditional Jump",
            storyLines: [
                "Froggy loves jumping across ponds.<br>But Froggy is a careful frog...",
                "He only jumps when the number is <span class='highlight'>greater than 5</span>.",
                "If the number is small, Froggy waits patiently."
            ],
            questionHTML: `<h2>The number is: <span class="number-display">6</span></h2>
                           <p>Will Froggy jump?</p>
                           <div class="btn-group">
                               <button id="btn-yes" class="btn success">YES ✅</button>
                               <button id="btn-no" class="btn danger">NO ❌</button>
                           </div>`,
            codeSnippet: `let number = 6;

if (number > 5) {
   console.log("Frog Jumps!");
} else {
   console.log("Frog Waits!");
}`,
            checkAnswer: (playerChoice, feedbackCallback) => {
                const targetNumber = 6; // This could be dynamic per level
                const threshold = 5;
                if (playerChoice === 'yes') {
                    if (targetNumber > threshold) {
                        feedbackCallback.correct();
                    } else {
                        feedbackCallback.incorrect("Oops! Froggy only jumps if number > 5.");
                    }
                } else if (playerChoice === 'no') {
                    if (targetNumber > threshold) {
                        feedbackCallback.incorrect("Oops! 6 is greater than 5. Try again!");
                    } else {
                        // Correct logic if number was <= 5
                        // (Logic placeholder for future levels)
                        feedbackCallback.correct(); // This case is not reached with hardcoded 6
                    }
                }
            }
        },
        {
            name: "For Loop: Eating Flies",
            storyLines: [
                "Froggy is super hungry and needs to eat 3 flies!",
                "Help him by writing a 'for' loop to eat exactly 3 flies."
            ],
            questionHTML: `<h2>Flies eaten: <span id="flies-eaten">0</span> / 3</h2>
                           <p>Tell Froggy to eat a fly!</p>
                           <div class="btn-group">
                               <button id="btn-eat-fly" class="btn primary">Eat Fly 🐛</button>
                           </div>`,
            codeSnippet: `let fliesToEat = 3;
let fliesEaten = 0;

for (let i = 0; i < fliesToEat; i++) {
   fliesEaten++; // Froggy eats a fly!
}

console.log("Froggy ate " + fliesEaten + " flies!");`,
            setupGame: () => {
                levelSpecificState.fliesEaten = 0;
                document.getElementById('flies-eaten').textContent = levelSpecificState.fliesEaten;
                const btnEatFly = document.getElementById('btn-eat-fly');
                if (btnEatFly) {
                    btnEatFly.onclick = () => {
                        levelSpecificState.fliesEaten++;
                        document.getElementById('flies-eaten').textContent = levelSpecificState.fliesEaten;
                        // Animate frog eating
                        ui.frog.classList.add('eat-animation');
                        setTimeout(() => ui.frog.classList.remove('eat-animation'), 500);
                        playSound('happy'); // Short sound for eating

                        if (levelSpecificState.fliesEaten === 3) {
                            setTimeout(() => {
                                handleCorrectAnswer();
                            }, 800);
                        } else if (levelSpecificState.fliesEaten > 3) {
                             setTimeout(() => {
                                handleIncorrectAnswer("Oops! Froggy ate too many flies. He only needed 3!");
                            }, 800);
                        }
                    };
                }
            },
            checkAnswer: (playerChoice, feedbackCallback) => {
                // This level is self-checking based on button clicks in setupGame
                // This function might not be directly used, or could be used for 'reset'
            }
        },
        {
            name: "For Loop: Conditional Jump",
            storyLines: [
                "Froggy needs to jump 5 lilypads. But wait, lilypad #3 is broken!",
                "Use a 'for' loop with an 'if' condition to help Froggy jump only the safe lilypads."
            ],
            questionHTML: `<h2>Lilypads to jump: 5</h2>
                           <p>Froggy needs to jump 5 lilypads, avoiding #3. Click 'Jump!' for each jump.</p>
                           <div class="btn-group">
                               <button id="btn-jump" class="btn primary">Jump! 🐸</button>
                           </div>
                           <div id="lilypad-status" class="mt-4 text-lg"></div>`,
            codeSnippet: `for (let i = 1; i <= 5; i++) {
   if (i !== 3) {
      jumpLilypad(i); // Froggy jumps!
   } else {
      console.log("Lilypad " + i + " is broken. Skipping.");
   }
}`,
            setupGame: () => {
                levelSpecificState.currentLilypad = 0;
                levelSpecificState.brokenLilypad = 3;
                levelSpecificState.totalLilypads = 5;
                const lilypadStatus = document.getElementById('lilypad-status');
                lilypadStatus.textContent = `Current Lilypad: ${levelSpecificState.currentLilypad}`;

                const btnJump = document.getElementById('btn-jump');
                if (btnJump) {
                    btnJump.onclick = () => {
                        levelSpecificState.currentLilypad++;
                        lilypadStatus.textContent = `Current Lilypad: ${levelSpecificState.currentLilypad}`;

                        // Simulate frog animation
                        ui.frog.classList.add('jump-animation');
                        setTimeout(() => ui.frog.classList.remove('jump-animation'), 500);
                        
                        if (levelSpecificState.currentLilypad === levelSpecificState.brokenLilypad) {
                            playSound('sad');
                            setTimeout(() => {
                                handleIncorrectAnswer("Oh no! Froggy tried to jump the broken lilypad!");
                            }, 800);
                        } else {
                            playSound('happy');
                            if (levelSpecificState.currentLilypad === levelSpecificState.totalLilypads) {
                                setTimeout(() => {
                                    handleCorrectAnswer();
                                }, 800);
                            } else if (levelSpecificState.currentLilypad > levelSpecificState.totalLilypads) {
                                setTimeout(() => {
                                    handleIncorrectAnswer("Froggy jumped too many lilypads!");
                                }, 800);
                            }
                        }
                    };
                }
            },
            checkAnswer: (playerChoice, feedbackCallback) => {
                // This level is self-checking based on button clicks in setupGame
            }
        }
    ];

    // --- Helpers ---
    function switchPanel(panelName) {
        Object.values(panels).forEach(p => {
            p.classList.add('hidden');
            p.classList.remove('active');
        });
        panels[panelName].classList.remove('hidden');
        panels[panelName].classList.add('active');
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
            osc.type = 'sine'; // Use .type for oscillator type
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

    // --- Core Game Logic ---
    function initializeLevel(levelIndex) {
        if (levelIndex >= levels.length) {
            alert("Congratulations! You've completed all levels!");
            window.location.href = "/games";
            return;
        }
        currentLevelIndex = levelIndex;
        currentStoryStep = 0;
        const currentLevel = levels[currentLevelIndex];

        // Setup Panel 1 (Story)
        ui.storyText.innerHTML = currentLevel.storyLines[currentStoryStep];
        if (ui.btnNextStory) {
            ui.btnNextStory.onclick = () => {
                currentStoryStep++;
                if (currentStoryStep < currentLevel.storyLines.length) {
                    ui.storyText.innerHTML = currentLevel.storyLines[currentStoryStep];
                } else {
                    switchPanel('game');
                    setupGamePanel(currentLevel);
                }
            };
        }

        // Setup Panel 3 (Code Reveal)
        ui.codeEditor.innerHTML = currentLevel.codeSnippet
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        if (window.hljs) {
            hljs.highlightElement(ui.codeEditor);
        }

        switchPanel('story'); // Always start with the story panel
    }

    function setupGamePanel(currentLevel) {
        ui.questionBox.innerHTML = currentLevel.questionHTML;

        // Ensure all previous dynamic event listeners are cleared or handled
        // For new buttons, we need to re-attach listeners specifically for them.
        // The default btnYes/btnNo are part of ui, so they need to be re-assigned.
        if (ui.btnYes) ui.btnYes.onclick = null;
        if (ui.btnNo) ui.btnNo.onclick = null;
        
        // This is a crucial point: since questionHTML fully replaces innerHTML,
        // any buttons defined within questionHTML will lose their event listeners.
        // We need to re-select and re-attach them AFTER questionHTML is set.
        const feedbackCallback = {
            correct: handleCorrectAnswer,
            incorrect: handleIncorrectAnswer
        };

        if (currentLevel.setupGame) {
            currentLevel.setupGame(); // Custom setup for interactive levels
        } else {
            // Default handlers for 'yes' / 'no' type levels
            // Re-select buttons after innerHTML is set
            const btnYes = document.getElementById('btn-yes');
            const btnNo = document.getElementById('btn-no');

            if (btnYes) {
                btnYes.onclick = () => currentLevel.checkAnswer('yes', feedbackCallback);
            }
            if (btnNo) {
                btnNo.onclick = () => currentLevel.checkAnswer('no', feedbackCallback);
            }
        }
    }


    // Make handleCorrectAnswer and handleIncorrectAnswer generic
    function handleCorrectAnswer() {
        // animate jump (or eating for loop level)
        ui.frog.src = '/static/assets/frog-jump.jpg'; // Switch sprite
        ui.frog.classList.add('jump-animation');

        playSound('happy');
        createConfetti();

        setTimeout(() => {
            showFeedback("Great job!", true);
            ui.frog.src = '/static/assets/frog-idle.jpg'; // Reset sprite after jump
            ui.frog.classList.remove('jump-animation'); // Ensure animation class is removed

            setTimeout(() => {
                switchPanel('code');
                hideFeedback();
            }, 2000);
        }, 1500);
    }

    function handleIncorrectAnswer(message) {
        ui.frog.classList.add('sad-shake');
        playSound('sad');

        setTimeout(() => {
            ui.frog.classList.remove('sad-shake');
            showFeedback(message, false);
        }, 500);
    }

    // Event listener for retry button
    ui.btnRetry.addEventListener('click', () => {
        hideFeedback();
        // Reset frog state
        ui.frog.classList.remove('jump-animation', 'sad-shake', 'eat-animation');
        ui.frog.src = '/static/assets/frog-idle.jpg';
        // Re-setup the current game panel
        switchPanel('game');
        const currentLevel = levels[currentLevelIndex];
        setupGamePanel(currentLevel);
    });

    // Event listener for next level button
    ui.btnNextLevel.addEventListener('click', () => {
        hideFeedback();
        initializeLevel(currentLevelIndex + 1);
    });

    // Initialize the first level
    initializeLevel(0);
});