document.addEventListener("DOMContentLoaded", () => {
    initLab();
});

const LAB_DB = [
    {
        level: 1,
        title: "LEVEL 1: ASSIGNMENT",
        instruction: "Let's store a number into a variable. <br/><span class='text-sky-400'>Store 5 in variable X</span>",
        variables: [ { name: "X", value: "?" } ],
        inputType: "assignment",   // asking for setting X
        targetVar: "X",
        correctAnswer: "5",
        explanation: "Assignment means storing a piece of information inside a named container!"
    },
    {
        level: 2,
        title: "LEVEL 2: BASIC EXPRESSION",
        instruction: "Variables can be used in math equations. <br/><span class='text-sky-400'>What is X + Y?</span>",
        variables: [ 
            { name: "X", value: "5" },
            { name: "+", type: "operator" },
            { name: "Y", value: "3" }
        ],
        inputType: "calculation", 
        correctAnswer: "8",
        explanation: "By reading the variables' values (5 and 3), the computer calculates 5 + 3 = 8."
    },
    {
        level: 3,
        title: "LEVEL 3: UPDATING VARIABLES",
        instruction: "Variables can CHANGE their values over time. <br/><span class='bg-slate-800 p-2 font-mono text-amber-400 rounded'>X = X + 2</span><br/>What is the NEW value of X?",
        variables: [ { name: "X", value: "10" } ],
        inputType: "update",
        targetVar: "X",
        correctAnswer: "12",
        explanation: "The computer reads the old value (10), adds 2, and overwrites the box with 12!"
    },
    {
        level: 4,
        title: "LEVEL 4: STORY PROBLEMS",
        instruction: "Programmers use variables to track things in games. <br/><span class='text-sky-400 font-mono'>You find 3 more coins!</span><br/>What is your combined total?",
        story: "You currently possess 5 coins.",
        variables: [ { name: "coins", value: "5" } ],
        inputType: "update",
        targetVar: "coins",
        correctAnswer: "8",
        explanation: "Internally, the code runs: <code>coins = coins + 3</code>"
    },
    {
        level: 5,
        title: "LEVEL 5: MEMORY MANIPULATION",
        instruction: "Evaluate the final output.<br/><span class='text-amber-400 font-mono'>Score = X * Y</span><br/>What number goes into Score?",
        variables: [ 
            { name: "X", value: "2" },
            { name: "*", type: "operator" },
            { name: "Y", value: "3" },
            { name: "=", type: "operator" },
            { name: "Score", value: "?" }
        ],
        inputType: "assignment",
        targetVar: "Score",
        correctAnswer: "6",
        explanation: "You successfully compiled the multiplication expression and assigned it to a new tracking variable!"
    }
];

let currentIndex = 0;
let isAnswered = false;

function initLab() {
    currentIndex = 0;
    loadLevel();
}

function loadLevel() {
    isAnswered = false;
    const levelData = LAB_DB[currentIndex];
    if (!levelData) return completeLab();

    // Reset Elements
    document.getElementById('action-btn-container').classList.add('hidden', 'opacity-0');
    document.getElementById('control-interface').classList.remove('hidden');
    
    const feedback = document.getElementById('feedback-area');
    feedback.className = 'w-full max-w-3xl text-center p-4 rounded-2xl mb-8 text-xl font-bold transition-all duration-300 opacity-0 transform translate-y-4';
    feedback.innerHTML = '';

    document.getElementById('level-indicator').innerText = levelData.title;
    document.getElementById('mode-instruction').innerHTML = levelData.instruction;

    const storyBlock = document.getElementById('story-context');
    if (levelData.story) {
        storyBlock.innerHTML = levelData.story;
        storyBlock.classList.remove('hidden');
    } else {
        storyBlock.classList.add('hidden');
    }

    renderVariables(levelData.variables);
    renderControls(levelData);
}

function renderVariables(variables) {
    const stage = document.getElementById('variables-stage');
    stage.innerHTML = '';

    variables.forEach(v => {
        if (v.type === 'operator') {
            const op = document.createElement('div');
            op.className = "math-symbol";
            op.innerText = v.name;
            stage.appendChild(op);
            return;
        }

        const container = document.createElement('div');
        container.className = "variable-container";
        
        container.innerHTML = `
            <div class="variable-box" id="varbox-${v.name}">
                <div class="variable-label">${v.name}</div>
                <div class="variable-value" id="val-${v.name}">${v.value}</div>
            </div>
        `;
        stage.appendChild(container);
    });
}

function renderControls(levelData) {
    const inputZone = document.getElementById('input-zone');
    inputZone.innerHTML = '';

    let labelTxt = "";
    if (levelData.inputType === "assignment" || levelData.inputType === "update") {
        labelTxt = `${levelData.targetVar} = `;
    } else {
        labelTxt = "Answer: ";
    }

    inputZone.innerHTML = `
        <span class="text-3xl font-mono text-white font-black">${labelTxt}</span>
        <input type="number" id="player-input" class="w-32 h-16 text-center text-3xl font-black bg-slate-900 border-2 border-indigo-500 rounded-xl text-white outline-none focus:border-sky-400 focus:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all" autocomplete="off" autofocus>
    `;

    const form = document.getElementById('action-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        const val = document.getElementById('player-input').value.trim();
        if (val === '') return;
        handleExecution(val, levelData);
    };
}

function handleExecution(submittedValue, levelData) {
    if (isAnswered) return;

    const isCorrect = (submittedValue === levelData.correctAnswer);
    const feedback = document.getElementById('feedback-area');
    feedback.classList.remove('opacity-0', 'translate-y-4');

    if (isCorrect) {
        isAnswered = true;

        // Perform Visual Physics
        if (levelData.inputType === "update") {
            const valEl = document.getElementById(`val-${levelData.targetVar}`);
            const boxEl = document.getElementById(`varbox-${levelData.targetVar}`);
            
            // Pop out old
            valEl.classList.add('anim-pop');
            setTimeout(() => {
                valEl.innerText = submittedValue;
                valEl.classList.remove('anim-pop');
                valEl.classList.add('anim-drop');
                boxEl.classList.add('updated');
            }, 400);
        } 
        else if (levelData.inputType === "assignment") {
            const valEl = document.getElementById(`val-${levelData.targetVar}`);
            const boxEl = document.getElementById(`varbox-${levelData.targetVar}`);
            
            valEl.innerText = submittedValue;
            valEl.classList.add('anim-drop');
            boxEl.classList.add('updated');
        }

        // Hide controls to prevent double submission
        document.getElementById('control-interface').classList.add('hidden');

        // Success UI
        feedback.innerHTML = `Correct! <br/> <span class="text-base text-slate-200 font-medium tracking-wide mt-2 block">${levelData.explanation}</span>`;
        feedback.className = 'w-full max-w-3xl text-center p-6 rounded-2xl mb-8 font-bold transition-all duration-300 opacity-100 transform translate-y-0 bg-green-500/20 border-2 border-green-400 text-white shadow-[0_0_30px_rgba(74,222,128,0.2)]';
        
        fireConfetti();

        // Reveal next button
        const nxtBtnContainer = document.getElementById('action-btn-container');
        nxtBtnContainer.classList.remove('hidden');
        setTimeout(() => nxtBtnContainer.classList.remove('opacity-0'), 100);

        if (currentIndex === LAB_DB.length - 1) {
            document.getElementById('action-btn').innerText = "COMPLETE EXPERIMENT";
        }
        
    } else {
        // Failure UI
        feedback.innerHTML = `Error! Incorrect variable logic. Try again.`;
        feedback.className = 'w-full max-w-3xl text-center p-4 rounded-2xl mb-8 text-xl font-bold transition-all duration-300 opacity-100 transform translate-y-0 bg-red-500/20 border-2 border-red-400 text-white shadow-[0_0_20px_rgba(248,113,113,0.3)]';
        
        const input = document.getElementById('player-input');
        input.classList.add('border-red-500');
        input.style.animation = 'shake 0.4s ease-in-out';
        setTimeout(() => { 
            input.style.animation = ''; 
            input.classList.remove('border-red-500');
        }, 400);
    }
}

function handleNextStep() {
    currentIndex++;
    if (currentIndex < LAB_DB.length) {
        loadLevel();
    } else {
        completeLab();
    }
}

function completeLab() {
    document.getElementById('variables-stage').innerHTML = '';
    document.getElementById('control-interface').classList.add('hidden');
    document.getElementById('action-btn-container').classList.add('hidden');
    document.getElementById('story-context').classList.add('hidden');
    document.getElementById('mode-instruction').innerText = "";
    document.getElementById('level-indicator').innerText = "LAB COMPLETED!";
    document.querySelector('h1').innerText = "MEMORY ALLOCATED";

    const feedback = document.getElementById('feedback-area');
    feedback.innerHTML = `
        <div class="text-3xl mb-4">You successfully manipulated system memory!</div>
        <p class="text-lg text-slate-300 font-normal">You can now confidently declare, reference, and update variables.</p>
        <button onclick="saveProgressAndExit()" class="mt-8 bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all border border-sky-400">
            RETURN TO DASHBOARD
        </button>
    `;
    feedback.className = 'w-full max-w-2xl text-center p-10 rounded-3xl mb-8 font-bold transition-all duration-500 opacity-100 transform translate-y-0 bg-slate-800/80 border border-sky-500/50 text-white shadow-2xl glass-panel';
}

function saveProgressAndExit() {
    try {
        const saved = localStorage.getItem("codeArena_progress");
        if (saved) {
            let progress = JSON.parse(saved);
            if (!progress.completedLevels.includes("7-1")) {
                progress.completedLevels.push("7-1");
                progress.stars += 3;
                if (!progress.unlockedLevels.includes("7-2")) {
                    progress.unlockedLevels.push("7-2"); // Unlock Traffic Game
                }
                localStorage.setItem("codeArena_progress", JSON.stringify(progress));
            }
        }
    } catch (e) {
        console.error(e);
    }
    window.location.href = "/game/grades-dashboard";
}

function fireConfetti() {
    var duration = 1500;
    var end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#38bdf8', '#8A2BE2']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#38bdf8', '#8A2BE2']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

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
