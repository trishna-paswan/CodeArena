document.addEventListener("DOMContentLoaded", () => {
    initGame();
});

const LEVELS_DB = [
    {
        level: 1,
        title: "LEVEL 1: COLOR PATTERNS",
        instruction: "Predict the next color in the sequence!",
        mode: "Predict",
        sequence: [
            { type: 'color', val: '#EF4444' }, // Red
            { type: 'color', val: '#3B82F6' }, // Blue
            { type: 'color', val: '#EF4444' },
            { type: 'color', val: '#3B82F6' },
            { type: 'missing' }
        ],
        options: [
            { id: 0, text: "Red Color", display: { type: 'color', val: '#EF4444' } },
            { id: 1, text: "Blue Color", display: { type: 'color', val: '#3B82F6' } },
            { id: 2, text: "Green Color", display: { type: 'color', val: '#10B981' } },
            { id: 3, text: "Yellow Color", display: { type: 'color', val: '#F59E0B' } }
        ],
        correct: 0,
        explanation: "This pattern strictly alternates between Red and Blue!"
    },
    {
        level: 2,
        title: "LEVEL 2: SHAPE SEQUENCES",
        instruction: "What shape comes next?",
        mode: "Predict",
        sequence: [
            { type: 'shape', val: 'shape-square', color: '#10B981' }, // Green
            { type: 'shape', val: 'shape-circle', color: '#10B981' },
            { type: 'shape', val: 'shape-square', color: '#10B981' },
            { type: 'shape', val: 'shape-circle', color: '#10B981' },
            { type: 'shape', val: 'shape-square', color: '#10B981' },
            { type: 'missing' }
        ],
        options: [
            { id: 0, text: "", display: { type: 'shape', val: 'shape-square', color: '#10B981' } },
            { id: 1, text: "", display: { type: 'shape', val: 'shape-triangle', color: '#10B981' } },
            { id: 2, text: "", display: { type: 'shape', val: 'shape-circle', color: '#10B981' } },
            { id: 3, text: "", display: { type: 'shape', val: 'shape-circle', color: '#EF4444' } }
        ],
        correct: 2,
        explanation: "The pattern repeats Square, then Circle, staying Green."
    },
    {
        level: 3,
        title: "LEVEL 3: NUMBER MATH",
        instruction: "Analyze the sequence. What rule is creating these numbers?",
        mode: "FindRule",
        sequence: [
            { type: 'text', val: '2' },
            { type: 'text', val: '4' },
            { type: 'text', val: '6' },
            { type: 'text', val: '8' },
            { type: 'text', val: '10' }
        ],
        options: [
            { id: 0, text: "Multiply by 2", display: null },
            { id: 1, text: "Add 2 each time", display: null },
            { id: 2, text: "Add 4 each time", display: null },
            { id: 3, text: "Square the number", display: null }
        ],
        correct: 1,
        explanation: "Every subsequent number adds exactly +2 to the previous one (4 - 2 = 2, 6 - 4 = 2)."
    },
    {
        level: 4,
        title: "LEVEL 4: MIXED VARIABLES",
        instruction: "Both shapes and colors are changing. Predict the missing element!",
        mode: "Predict",
        sequence: [
            { type: 'shape', val: 'shape-square', color: '#EF4444' }, // Red Square
            { type: 'shape', val: 'shape-circle', color: '#3B82F6' }, // Blue Circle
            { type: 'shape', val: 'shape-square', color: '#EF4444' }, // Red Square
            { type: 'shape', val: 'shape-circle', color: '#3B82F6' }, // Blue Circle
            { type: 'missing' },
            { type: 'shape', val: 'shape-circle', color: '#3B82F6' } // Blue Circle
        ],
        options: [
            { id: 0, text: "", display: { type: 'shape', val: 'shape-circle', color: '#EF4444' } },
            { id: 1, text: "", display: { type: 'shape', val: 'shape-square', color: '#3B82F6' } },
            { id: 2, text: "", display: { type: 'shape', val: 'shape-square', color: '#EF4444' } },
            { id: 3, text: "", display: { type: 'shape', val: 'shape-triangle', color: '#10B981' } }
        ],
        correct: 2,
        explanation: "The entire element (Red Square) repeats every odd step!"
    },
    {
        level: 5,
        title: "LEVEL 5: CONDITIONAL LOGIC",
        instruction: "Read the programmer's rule below and predict the 5th element in the sequence!",
        mode: "Conditional",
        logicHint: "IF position is even -> Blue 🔵 <br/> ELSE IF position is odd -> Red 🔴",
        sequence: [
            { type: 'text', val: '1', sub: 'Red' },
            { type: 'text', val: '2', sub: 'Blue' },
            { type: 'text', val: '3', sub: 'Red' },
            { type: 'text', val: '4', sub: 'Blue' },
            { type: 'text', val: '5', sub: '?' } // 5 is odd, so Red.
        ],
        options: [
            { id: 0, text: "Blue Color", display: { type: 'color', val: '#3B82F6' } },
            { id: 1, text: "Green Color", display: { type: 'color', val: '#10B981' } },
            { id: 2, text: "Red Color", display: { type: 'color', val: '#EF4444' } },
            { id: 3, text: "Yellow Color", display: { type: 'color', val: '#F59E0B' } }
        ],
        correct: 2,
        explanation: "Position 5 is an ODD number. The ELSE IF condition triggers, resulting in Red!"
    }
];

let currentLevelIndex = 0;
let isAnswered = false;

function initGame() {
    currentLevelIndex = 0;
    loadLevel();
}

function loadLevel() {
    isAnswered = false;
    const levelData = LEVELS_DB[currentLevelIndex];
    if (!levelData) return completeGame();

    // Reset UI
    document.getElementById('action-btn-container').classList.add('opacity-0');
    document.getElementById('action-btn-container').classList.remove('opacity-100');
    const feedback = document.getElementById('feedback-area');
    feedback.className = 'w-full max-w-2xl text-center p-4 rounded-2xl mb-8 text-xl font-bold transition-all duration-300 opacity-0 transform translate-y-4';
    feedback.innerHTML = '';

    // Set texts
    document.getElementById('level-indicator').innerText = levelData.title;
    document.getElementById('mode-instruction').innerText = levelData.instruction;

    // Handle Optional Logic Hint
    const logicHint = document.getElementById('logic-hint');
    if (levelData.logicHint) {
        logicHint.innerHTML = levelData.logicHint;
        logicHint.classList.remove('hidden');
    } else {
        logicHint.classList.add('hidden');
    }

    renderSequence(levelData.sequence);
    renderOptions(levelData);
}

function renderSequence(sequence) {
    const container = document.getElementById('pattern-container');
    container.innerHTML = '';

    sequence.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = `pattern-item delay-${Math.min(idx, 5)}`;
        
        if (item.type === 'color') {
            div.style.backgroundColor = item.val;
            div.style.borderColor = item.val;
            div.style.boxShadow = `0 0 20px ${item.val}66`;
        } 
        else if (item.type === 'shape') {
            div.style.color = item.color;
            div.innerHTML = `<div class="${item.val}"></div>`;
            div.style.boxShadow = `0 0 20px ${item.color}44`;
            div.style.borderColor = 'rgba(255,255,255,0.2)';
        }
        else if (item.type === 'text') {
            div.innerHTML = `<span class="text-4xl text-white font-black">${item.val}</span>`;
            if (item.sub) {
                div.innerHTML += `<span class="absolute -bottom-6 text-xs text-slate-400 w-full text-center">${item.sub}</span>`;
            }
        }
        else if (item.type === 'missing') {
            div.classList.add('missing-item');
            div.innerText = '?';
            div.id = 'missing-slot';
        }

        container.appendChild(div);
    });
}

function renderOptions(levelData) {
    const container = document.getElementById('options-container');
    container.innerHTML = '';

    levelData.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn flex flex-col items-center justify-center p-6 rounded-2xl w-full relative overflow-hidden';
        btn.onclick = () => handleChoice(opt.id);

        if (opt.display) {
            const disp = document.createElement('div');
            disp.className = "w-12 h-12 mb-3 flex items-center justify-center";
            if (opt.display.type === 'color') {
                disp.style.backgroundColor = opt.display.val;
                disp.className += " rounded-lg shadow-lg";
                disp.style.boxShadow = `0 0 15px ${opt.display.val}88`;
            } else if (opt.display.type === 'shape') {
                disp.style.color = opt.display.color;
                disp.innerHTML = `<div class="${opt.display.val}"></div>`;
            }
            btn.appendChild(disp);
        }

        if (opt.text) {
            const span = document.createElement('span');
            span.className = "text-lg font-bold text-white tracking-wide z-10";
            span.innerText = opt.text;
            btn.appendChild(span);
        }

        // Add subtle background decoration
        const dec = document.createElement('div');
        dec.className = "absolute -right-4 -bottom-4 opacity-5 text-6xl pointer-events-none";
        dec.innerText = "{}";
        btn.appendChild(dec);

        container.appendChild(btn);
    });
}

function handleChoice(id) {
    if (isAnswered) return;
    
    const levelData = LEVELS_DB[currentLevelIndex];
    const isCorrect = (id === levelData.correct);
    
    const feedback = document.getElementById('feedback-area');
    feedback.classList.remove('opacity-0', 'translate-y-4');

    if (isCorrect) {
        isAnswered = true;
        
        // Fill the missing slot with animation visually
        const missingSlot = document.getElementById('missing-slot');
        if (missingSlot) {
            const correctOpt = levelData.options.find(o => o.id === id);
            missingSlot.classList.remove('missing-item');
            missingSlot.innerText = '';
            
            if (correctOpt.display) {
                if (correctOpt.display.type === 'color') {
                    missingSlot.style.backgroundColor = correctOpt.display.val;
                    missingSlot.style.borderColor = correctOpt.display.val;
                } else if (correctOpt.display.type === 'shape') {
                    missingSlot.style.color = correctOpt.display.color;
                    missingSlot.innerHTML = `<div class="${correctOpt.display.val}"></div>`;
                }
            } else if (correctOpt.text) {
                missingSlot.innerText = correctOpt.text;
                missingSlot.style.fontSize = '1rem';
            }
            
            // Pop effect
            missingSlot.style.transform = 'scale(1.2)';
            setTimeout(() => { missingSlot.style.transform = 'scale(1)'; }, 200);
        }

        // Feedback UI
        feedback.innerHTML = `🎉 Correct! <br/> <span class="text-base text-slate-200 font-medium tracking-wide mt-2 block">${levelData.explanation}</span>`;
        feedback.className = 'w-full max-w-2xl text-center p-6 rounded-2xl mb-8 font-bold transition-all duration-300 opacity-100 transform translate-y-0 bg-green-500/20 border-2 border-green-400 text-white shadow-[0_0_30px_rgba(74,222,128,0.2)]';
        
        fireConfetti();

        // Show Next Button
        const nextBtnCtx = document.getElementById('action-btn-container');
        nextBtnCtx.classList.remove('opacity-0');
        nextBtnCtx.classList.add('opacity-100');

        if (currentLevelIndex === LEVELS_DB.length - 1) {
            document.getElementById('action-btn').innerText = "COMPLETE QUEST 🏆";
        }
        
    } else {
        feedback.innerHTML = `❌ Bug detected! That's not the right pattern. Try again.`;
        feedback.className = 'w-full max-w-2xl text-center p-4 rounded-2xl mb-8 text-xl font-bold transition-all duration-300 opacity-100 transform translate-y-0 bg-red-500/20 border-2 border-red-400 text-white shadow-[0_0_20px_rgba(248,113,113,0.3)]';
        
        // Shake feedback
        feedback.style.animation = 'shake 0.4s ease-in-out';
        setTimeout(() => { feedback.style.animation = ''; }, 400);
    }
}

function handleNextStep() {
    currentLevelIndex++;
    if (currentLevelIndex < LEVELS_DB.length) {
        loadLevel();
    } else {
        completeGame();
    }
}

function completeGame() {
    // Clear screen UI
    document.getElementById('pattern-container').innerHTML = '';
    document.getElementById('options-container').innerHTML = '';
    document.getElementById('action-btn-container').classList.add('opacity-0');
    document.getElementById('logic-hint').classList.add('hidden');
    document.getElementById('mode-instruction').innerText = "";
    document.getElementById('level-indicator').innerText = "QUEST ACCOMPLISHED!";
    
    document.querySelector('h1').innerText = "SYSTEM UNLOCKED";

    const feedback = document.getElementById('feedback-area');
    feedback.innerHTML = `
        <div class="text-3xl mb-4">You are thinking entirely like a programmer!</div>
        <p class="text-lg text-slate-300 font-normal">You've mastered sequence predictions, math rules, and conditional IF/ELSE logic.</p>
        <button onclick="saveProgressAndExit()" class="mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-colors border border-indigo-400">
            RETURN TO DASHBOARD
        </button>
    `;
    feedback.className = 'w-full max-w-2xl text-center p-10 rounded-3xl mb-8 font-bold transition-all duration-500 opacity-100 transform translate-y-0 bg-slate-800/80 border border-indigo-500/50 text-white shadow-2xl glass-panel';
}

function saveProgressAndExit() {
    try {
        const saved = localStorage.getItem("codeArena_progress");
        if (saved) {
            let progress = JSON.parse(saved);
            if (!progress.completedLevels.includes("6-4")) {
                progress.completedLevels.push("6-4");
                progress.stars += 3;
                if (!progress.unlockedLevels.includes("6-5")) {
                    progress.unlockedLevels.push("6-5"); // Unlock Maze Game
                }
                localStorage.setItem("codeArena_progress", JSON.stringify(progress));
            }
        }
    } catch (e) {
        console.error(e);
    }
    
    // Redirect back to dashboard
    window.location.href = "/game/grades-dashboard";
}

// Visual Effects
function fireConfetti() {
    var duration = 1500;
    var end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#8A2BE2', '#38bdf8']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#8A2BE2', '#38bdf8']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// Add CSS keyframes dynamically
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}`;
document.head.appendChild(style);
