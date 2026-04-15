document.addEventListener('DOMContentLoaded', () => {
    
    // UI Elements
    const theoryOverlay = document.getElementById('theory-overlay');
    const mainUI = document.getElementById('main-ui');
    const theoryTitle = document.getElementById('theory-title');
    const theoryText = document.getElementById('theory-text');
    
    const codeBlock = document.getElementById('code-block');
    const varDock = document.getElementById('variable-container-dock');
    const btnStep = document.getElementById('btn-step');
    const fixOptionsContainer = document.getElementById('fix-options');
    const optionsRack = document.getElementById('options-rack');
    const bugInstructions = document.getElementById('bug-instructions');
    const instructionMode = document.getElementById('instruction-mode');
    
    const feedbackOverlay = document.getElementById('feedback-overlay');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackExplanation = document.getElementById('feedback-explanation');
    const btnNext = document.getElementById('btn-next');
    const btnRetry = document.getElementById('btn-retry');
    const starCountDisplay = document.getElementById('star-count');
    const starRewards = document.getElementById('star-rewards');
    
    let currentLevel = 1;
    let attempts = 0;
    let totalStars = parseInt(localStorage.getItem('debugStars')) || 0;
    starCountDisplay.textContent = totalStars;

    let executionStep = 0;
    
    // --- LEVELS DATA ---
    const levels = [
        {
            num: 1,
            theoryTitle: "Level 1: The Wrong Operator",
            theoryText: "Sometimes we tell the computer to add, but it actually subtracts! Look out for wrong math symbols.",
            setupVars: [ { name: 'Score', initValue: '0' } ],
            code: [
                { text: 'let Score = 0;', update: { Score: '0' } },
                { text: '// We gain 5 points for winning!', update: {} },
                { text: 'Score = Score - 5;', isBug: true, update: { Score: '-5 (Wait, we lost points!)', error: true } }
            ],
            bugIndex: 2,
            bugContext: "We won the game, but our score went DOWN! Why?",
            fixes: [
                { text: 'Score = Score / 5;', correct: false },
                { text: 'Score = Score + 5;', correct: true },
                { text: 'Score = Score * 5;', correct: false }
            ],
            feedbackSuccess: "🎉 Bug Fixed! The '+' perfectly adds points together.",
            feedbackFail: "❌ Still buggy! We want our score to go UP."
        },
        {
            num: 2,
            theoryTitle: "Level 2: Spelling Mistakes",
            theoryText: "Computers are literal! If you spell a variable name incorrectly, the computer will crash because it gets confused.",
            setupVars: [ { name: 'PlayerName', initValue: '"Hero"' } ],
            code: [
                { text: 'let PlayerName = "Hero";', update: { PlayerName: '"Hero"' } },
                { text: '// Welcome the player!', update: {} },
                { text: 'console.log( PlayerNam );', isBug: true, update: { PlayerName: 'Error! undefined', error: true } }
            ],
            bugIndex: 2,
            bugContext: "The computer says 'PlayerNam' doesn't exist! Look very closely at the spelling.",
            fixes: [
                { text: 'console.log( PlayerName );', correct: true },
                { text: 'console.log( playername );', correct: false },
                { text: 'console.log( Player );', correct: false }
            ],
            feedbackSuccess: "🎉 Great job! Variable names must be spelled EXACTLY the same, including capital letters.",
            feedbackFail: "❌ That's not the right spelling. Remember that capital letters matter!"
        },
        {
            num: 3,
            theoryTitle: "Level 3: Logic Reversal",
            theoryText: "Conditionals use True/False. A less-than sign (<) can ruin a game if you meant to use the greater-than sign (>).",
            setupVars: [ { name: 'Points', initValue: '100' }, { name: 'Status', initValue: '"?"' } ],
            code: [
                { text: 'let Points = 100;', update: { Points: '100' } },
                { text: 'let Status = "Unknown";', update: { Status: '"Unknown"' } },
                { text: '// If we have 100 points, we win!', update: {} },
                { text: 'if (Points < 100) {', isBug: true, update: { Status: 'Waiting...', error: true } },
                { text: '   Status = "Winner!";', update: {} },
                { text: '}', update: {} }
            ],
            bugIndex: 3,
            bugContext: "We have exactly 10 points, but we didn't win because the math sign is checking the wrong thing!",
            fixes: [
                { text: 'if (Points > 200) {', correct: false },
                { text: 'if (Points == 100) {', correct: true },
                { text: 'if (Points < 50) {', correct: false }
            ],
            feedbackSuccess: "🎉 Fixed! The double equals '==' perfectly checks if we have exactly 100 points.",
            feedbackFail: "❌ Nope! The computer is still checking the wrong rules."
        },
        {
            num: 4,
            theoryTitle: "Level 4: Missing Updates",
            theoryText: "If you want a variable to store new information, you must assign the new value back into it using '='.",
            setupVars: [ { name: 'Coins', initValue: '10' } ],
            code: [
                { text: 'let Coins = 10;', update: { Coins: '10' } },
                { text: '// We spend 5 coins on an apple', update: {} },
                { text: 'Coins - 5;', isBug: true, update: { Coins: '10 (No Change!)', error: true } },
                { text: 'console.log(Coins);', update: {} }
            ],
            bugIndex: 2,
            bugContext: "We spent 5 coins, but we still have 10 left?! The computer did the math but forgot to save the answer.",
            fixes: [
                { text: 'Coins = 5;', correct: false },
                { text: 'Coins = Coins - 5;', correct: true },
                { text: 'Coins == Coins - 5;', correct: false }
            ],
            feedbackSuccess: "🎉 Excellent! You must use '=' to explicitly save the new value inside the variable.",
            feedbackFail: "❌ Still not saving. Remember the pattern: Variable = Old Value - Math."
        },
        {
            num: 5,
            theoryTitle: "Level 5: Master Detective",
            theoryText: "Combine everything you've learned. Check symbols, spellings, and rules carefully.",
            setupVars: [ { name: 'Health', initValue: '0' }, { name: 'GameOver', initValue: '"False"' } ],
            code: [
                { text: 'let Health = 0;', update: { Health: '0' } },
                { text: 'let GameOver = "False";', update: { GameOver: '"False"' } },
                { text: '// If health is zero, game is over!', update: {} },
                { text: 'if (Health = 0) {', isBug: true, update: { GameOver: 'Error! Assign instead of check' } },
                { text: '   GameOver = "True";', update: {} },
                { text: '}', update: {} }
            ],
            bugIndex: 3,
            bugContext: "A single '=' sign forces Health to become 0 instead of checking if it is 0. We need the equality checker!",
            fixes: [
                { text: 'if (Health - 0) {', correct: false },
                { text: 'if (Health < 0) {', correct: false },
                { text: 'if (Health == 0) {', correct: true }
            ],
            feedbackSuccess: "🎉 Masterful debugging! Double equals (==) checks for equality safely.",
            feedbackFail: "❌ Try again. Single '=' sets data, double '==' checks data."
        }
    ];

    // --- GAME ENGINE ---
    function initLevel(lvlIndex) {
        if(lvlIndex > levels.length) {
            alert("You conquered all debugging challenges!");
            window.location.href = "/games";
            return;
        }

        const lvlData = levels[lvlIndex - 1];
        attempts = 0;
        executionStep = 0;
        
        // Setup Theory
        theoryOverlay.classList.remove('opacity-0', 'pointer-events-none');
        mainUI.classList.add('opacity-0');
        theoryTitle.innerHTML = lvlData.theoryTitle;
        theoryText.innerHTML = lvlData.theoryText;
        
        setTimeout(() => {
            theoryOverlay.classList.add('opacity-0', 'pointer-events-none');
            mainUI.classList.remove('opacity-0');
            setupWorkspace(lvlData);
        }, 3000);
    }

    function setupWorkspace(lvlData) {
        // Build generic vars
        varDock.innerHTML = '';
        lvlData.setupVars.forEach(v => {
            varDock.innerHTML += `
                <div class="variable-container" id="var-cont-${v.name}">
                    <div class="variable-box" id="var-box-${v.name}">
                        <div class="variable-label">${v.name}</div>
                        <div class="variable-value" id="var-val-${v.name}">${v.initValue}</div>
                    </div>
                </div>
            `;
        });

        // Build Code Lines
        codeBlock.innerHTML = '';
        codeBlock.className = 'code-editor flex-grow flex flex-col py-4 mode-step';
        lvlData.code.forEach((line, idx) => {
            const div = document.createElement('div');
            div.className = 'code-line';
            div.id = `line-${idx}`;
            div.innerHTML = `<span class="line-num">${idx+1}</span> <span class="line-text">${line.text}</span>`;
            
            // Interaction for Investigation phase
            div.addEventListener('click', () => {
                if (codeBlock.classList.contains('mode-investigate')) {
                    handleLineClick(idx, lvlData);
                }
            });

            codeBlock.appendChild(div);
        });

        // Reset elements
        btnStep.style.display = 'block';
        btnStep.innerText = 'STEP FORWARD ➡';
        fixOptionsContainer.classList.add('hidden');
        bugInstructions.classList.add('opacity-0');
        instructionMode.innerText = "Mode: Step Check";
        instructionMode.className = "text-sm px-3 py-1 bg-sky-900/50 text-sky-200 rounded-full border border-sky-500/50";
    }

    btnStep.addEventListener('click', () => {
        const lvlData = levels[currentLevel - 1];
        
        // Remove active class from previous
        if (executionStep > 0) {
            document.getElementById(`line-${executionStep-1}`).classList.remove('active');
        }

        // Apply active to current line
        const currentLineElement = document.getElementById(`line-${executionStep}`);
        
        // If we've reached the end of the code
        if (!currentLineElement) {
            btnStep.style.display = 'none';
            codeBlock.classList.remove('mode-step');
            codeBlock.classList.add('mode-investigate');
            bugInstructions.classList.remove('opacity-0');
            instructionMode.innerText = "Mode: Investigation";
            instructionMode.className = "text-sm px-3 py-1 bg-violet-900/50 text-violet-200 rounded-full border border-violet-500/50";
            return;
        }

        currentLineElement.classList.add('active');

        // Apply Updates to Variable Memory
        const updates = lvlData.code[executionStep].update;
        if (updates) {
            Object.keys(updates).forEach(key => {
                if(key !== 'error') {
                    const valEl = document.getElementById(`var-val-${key}`);
                    const boxEl = document.getElementById(`var-box-${key}`);
                    if(valEl && boxEl) {
                        valEl.innerText = updates[key];
                        boxEl.classList.remove('updated', 'error-state');
                        // Trigger reflow
                        void boxEl.offsetWidth;
                        
                        if(updates.error) {
                            boxEl.classList.add('error-state');
                        } else {
                            boxEl.classList.add('updated');
                        }
                    }
                }
            });
        }

        executionStep++;
        
        if (executionStep >= lvlData.code.length) {
            btnStep.innerText = "FINISH EXECUTION";
        }
    });

    function handleLineClick(lineIdx, lvlData) {
        // Clear previous selections
        document.querySelectorAll('.code-line').forEach(el => el.classList.remove('selected-bug'));
        
        const lineEl = document.getElementById(`line-${lineIdx}`);
        lineEl.classList.add('selected-bug');

        if (lineIdx === lvlData.bugIndex) {
            // Correct logic error spotted!
            instructionMode.innerText = "Mode: Fix Code";
            instructionMode.className = "text-sm px-3 py-1 bg-emerald-900/50 text-emerald-200 rounded-full border border-emerald-500/50";
            codeBlock.classList.remove('mode-investigate');
            codeBlock.classList.add('mode-fixed');
            
            bugInstructions.innerHTML = `<span class="text-emerald-300">Target acquired!</span> ${lvlData.bugContext}`;
            bugInstructions.className = 'mt-4 p-4 bg-slate-800 border border-emerald-500/30 rounded-xl text-center font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)]';

            // Show Fix Options
            fixOptionsContainer.classList.remove('hidden');
            optionsRack.innerHTML = '';
            
            // Randomize options
            let opts = [...lvlData.fixes].sort(() => 0.5 - Math.random());

            opts.forEach((fix, index) => {
                const btn = document.createElement('button');
                btn.className = "fix-option text-white w-full py-4 text-left px-6 rounded-xl flex items-center";
                btn.innerHTML = `<span class="bg-violet-900/50 px-3 py-1 rounded border border-violet-500/30 mr-4 text-sm">OPT ${index+1}</span> ${fix.text}`;
                
                btn.addEventListener('click', () => {
                    attempts++;
                    if(fix.correct) {
                        // Celebration
                        lineEl.classList.remove('selected-bug');
                        lineEl.classList.add('fixed-line');
                        lineEl.querySelector('.line-text').innerText = fix.text;
                        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                        showFeedback(true, lvlData);
                    } else {
                        btn.classList.add('border-rose-500', 'bg-rose-900/20');
                        btn.classList.remove('hover:scale-102');
                        setTimeout(() => btn.classList.remove('border-rose-500', 'bg-rose-900/20'), 1000);
                        showFeedback(false, lvlData);
                    }
                });

                optionsRack.appendChild(btn);
            });

        } else {
            // Spotted wrong line
            bugInstructions.innerText = "No logical error detected here. Keep investigating!";
            bugInstructions.className = 'mt-4 p-4 bg-rose-900/20 border border-rose-500/30 rounded-xl text-rose-200 text-center font-medium';
        }
    }

    function showFeedback(isCorrect, lvlData) {
        feedbackOverlay.classList.remove('opacity-0', 'pointer-events-none');
        feedbackTitle.innerText = isCorrect ? "COMPILE SUCCESS!" : "COMPILE FAILED!";
        feedbackTitle.className = isCorrect ? "text-6xl font-black mb-4 text-emerald-400 neon-text" : "text-6xl font-black mb-4 text-rose-500 neon-text";
        feedbackExplanation.innerText = isCorrect ? lvlData.feedbackSuccess : lvlData.feedbackFail;
        
        if (isCorrect) {
            btnNext.classList.remove('hidden');
            btnRetry.classList.add('hidden');
            
            let starsEarned = attempts === 1 ? 3 : (attempts === 2 ? 2 : 1);
            totalStars += starsEarned;
            localStorage.setItem('debugStars', totalStars);
            starCountDisplay.textContent = totalStars;
            
            starRewards.innerHTML = '⭐'.repeat(starsEarned);
        } else {
            btnNext.classList.add('hidden');
            btnRetry.classList.remove('hidden');
            starRewards.innerHTML = '❌';
            attempts = 0; // reset local attempt so they don't get trapped accumulating
        }
    }

    btnRetry.addEventListener('click', () => {
        feedbackOverlay.classList.add('opacity-0', 'pointer-events-none');
        // Give them another shot at the current level options
    });

    btnNext.addEventListener('click', () => {
        feedbackOverlay.classList.add('opacity-0', 'pointer-events-none');
        currentLevel++;
        initLevel(currentLevel);
    });

    // Start Phase
    initLevel(currentLevel);
});
