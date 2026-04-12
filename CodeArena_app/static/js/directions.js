// directions.js
// Logic for "Directions - Help the Robot Reach Home"

document.addEventListener('DOMContentLoaded', () => {
    initLevel();
});

// Game State
const GAME_STATE = {
    level: 1, // 1 to 3
    robotPosition: { col: 0, row: 0 },
    commands: [], // array of { type: 'SINGLE'|'LOOP', dir: 'UP', count: 1 }
    isPlaying: false
};

// Level Configuration
const LEVELS = {
    1: {
        start: { col: 0, row: 0 },
        goal: { col: 5, row: 5 },
        obstacles: [],
        instruction: "Use UP, DOWN, LEFT, RIGHT to reach the green goal. You are writing an algorithm!"
    },
    2: {
        start: { col: 0, row: 0 },
        goal: { col: 5, row: 5 },
        obstacles: [{col: 2, row: 2}, {col: 2, row: 3}, {col: 3, row: 2}, {col: 4, row: 1}, {col: 4, row: 2}],
        instruction: "Avoid the red obstacles! If you hit one, that's a bug."
    },
    3: {
        start: { col: 0, row: 0 },
        goal: { col: 5, row: 5 },
        obstacles: [{col: 1, row: 0}, {col: 1, row: 1}, {col: 3, row: 4}, {col: 3, row: 5}, {col: 4, row: 2}],
        maxMoves: 10,
        instruction: "Use Loops! Repeating commands uses fewer total moves. Goal: Reach home in 10 moves or less."
    }
};

function initLevel() {
    GAME_STATE.isPlaying = false;
    GAME_STATE.commands = [];
    const config = LEVELS[GAME_STATE.level];
    GAME_STATE.robotPosition = { ...config.start };
    
    document.getElementById('level-indicator').innerText = 'Level: ' + GAME_STATE.level;
    renderFeedback(config.instruction, 'info');
    
    renderGrid();
    renderRobot();
    updateSequenceUI();
}

function renderGrid() {
    const gridEl = document.getElementById('game-grid');
    gridEl.innerHTML = ''; // clear
    const config = LEVELS[GAME_STATE.level];

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            
            // Check for goal
            if (col === config.goal.col && row === config.goal.row) {
                cell.classList.add('goal');
                cell.innerHTML = '<div class="absolute inset-0 flex items-center justify-center text-3xl">🏠</div>';
            }
            
            // Check for obstacle
            const isObstacle = config.obstacles.some(obs => obs.col === col && obs.row === row);
            if (isObstacle) {
                cell.classList.add('obstacle');
                cell.innerHTML = '<div class="absolute inset-0 flex items-center justify-center text-3xl">🚧</div>';
            }

            gridEl.appendChild(cell);
        }
    }
}

function renderRobot() {
    const robot = document.getElementById('robot-sprite');
    const cellWidth = 100 / 6; // percentage based
    const cellHeight = 100 / 6;

    robot.style.width = cellWidth + '%';
    robot.style.height = cellHeight + '%';
    robot.style.left = (GAME_STATE.robotPosition.col * cellWidth) + '%';
    robot.style.top = (GAME_STATE.robotPosition.row * cellHeight) + '%';
}

function renderFeedback(msg, type) {
    const fb = document.getElementById('feedback-area');
    fb.innerHTML = msg;
    fb.className = 'mt-6 w-full text-center py-4 rounded-lg font-medium text-lg min-h-[60px] flex items-center justify-center transition-colors shadow-sm';
    
    if (type === 'error') {
        fb.classList.add('bg-red-50', 'border', 'border-red-200', 'text-red-800');
    } else if (type === 'success') {
        fb.classList.add('bg-green-50', 'border', 'border-green-200', 'text-green-800');
    } else if (type === 'warning') {
        fb.classList.add('bg-orange-50', 'border', 'border-orange-200', 'text-orange-800');
    } else {
        fb.classList.add('bg-blue-50', 'border', 'border-blue-200', 'text-blue-800');
    }
}

function addCommand(direction) {
    if (GAME_STATE.isPlaying) return; // Disallow while running
    GAME_STATE.commands.push({ type: 'SINGLE', dir: direction, count: 1 });
    updateSequenceUI();
}

function addLoopCommand() {
    if (GAME_STATE.isPlaying) return;
    const count = parseInt(document.getElementById('loop-count').value);
    const dir = document.getElementById('loop-direction').value;
    
    GAME_STATE.commands.push({ type: 'LOOP', dir: dir, count: count });
    updateSequenceUI();
}

function clearCommands() {
    if (GAME_STATE.isPlaying) return;
    GAME_STATE.commands = [];
    updateSequenceUI();
}

function resetLevel(soft = false) {
    const config = LEVELS[GAME_STATE.level];
    GAME_STATE.robotPosition = { ...config.start };
    GAME_STATE.isPlaying = false;
    renderRobot();
    
    // reset UI highlights
    document.querySelectorAll('.command-badge').forEach(b => b.classList.remove('active'));
    
    if (!soft) {
        GAME_STATE.commands = [];
        updateSequenceUI();
        renderFeedback(config.instruction, 'info');
    }
}

function getEmoji(dir) {
    if (dir === 'UP') return '⬆️';
    if (dir === 'DOWN') return '⬇️';
    if (dir === 'LEFT') return '⬅️';
    if (dir === 'RIGHT') return '➡️';
    return '';
}

function updateSequenceUI() {
    const container = document.getElementById('sequence-container');
    const emptyState = document.getElementById('empty-state');
    const counter = document.getElementById('moves-counter');
    
    let totalMoves = 0;
    GAME_STATE.commands.forEach(c => { totalMoves += c.count; });
    counter.innerText = `Moves: ${totalMoves}`;

    const limit = LEVELS[GAME_STATE.level].maxMoves;
    if (limit) {
        counter.innerText += ` / ${limit}`;
        if (totalMoves > limit) {
            counter.classList.add('text-red-500');
        } else {
            counter.classList.remove('text-red-500');
        }
    }

    if (GAME_STATE.commands.length === 0) {
        emptyState.style.display = 'block';
        container.innerHTML = '';
        container.appendChild(emptyState);
        return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = '';

    GAME_STATE.commands.forEach((c, index) => {
        const div = document.createElement('div');
        div.className = 'command-badge bg-white border border-gray-200 rounded-lg p-2 shadow-sm font-semibold text-gray-700 flex items-center';
        div.id = 'cmd-idx-' + index;

        if (c.type === 'SINGLE') {
            div.innerHTML = `<span class="bg-indigo-100 text-indigo-800 w-6 h-6 rounded flex items-center justify-center mr-3 text-xs">${index+1}</span> Move ${c.dir} ${getEmoji(c.dir)}`;
        } else {
            div.innerHTML = `<span class="bg-purple-100 text-purple-800 w-6 h-6 rounded flex items-center justify-center mr-3 text-xs">${index+1}</span> <span class="text-purple-600 mr-1">Loop ${c.count}x:</span> Move ${c.dir} ${getEmoji(c.dir)}`;
            div.classList.add('border-purple-200');
        }
        
        container.appendChild(div);
    });
}

function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAlgorithm() {
    if (GAME_STATE.isPlaying) return;
    if (GAME_STATE.commands.length === 0) {
        renderFeedback("Add some commands before executing!", "warning");
        return;
    }

    // Soft reset visually but keep commands
    resetLevel(true);
    GAME_STATE.isPlaying = true;

    const config = LEVELS[GAME_STATE.level];
    
    // Check constraints before run
    let totalMoves = 0;
    GAME_STATE.commands.forEach(c => totalMoves += c.count);
    if (config.maxMoves && totalMoves > config.maxMoves) {
        renderFeedback(`Oops! You used ${totalMoves} moves. Try to solve it in ${config.maxMoves} or fewer!`, 'error');
        GAME_STATE.isPlaying = false;
        return;
    }

    renderFeedback("Executing Algorithm...", "info");

    for (let i = 0; i < GAME_STATE.commands.length; i++) {
        if (!GAME_STATE.isPlaying) break; // if somehow reset mid-run

        const cmd = GAME_STATE.commands[i];
        const uiEl = document.getElementById('cmd-idx-' + i);
        if (uiEl) uiEl.classList.add('active');

        for (let step = 0; step < cmd.count; step++) {
            await pause(400); // Animation delay
            
            if (cmd.dir === 'UP') GAME_STATE.robotPosition.row -= 1;
            if (cmd.dir === 'DOWN') GAME_STATE.robotPosition.row += 1;
            if (cmd.dir === 'LEFT') GAME_STATE.robotPosition.col -= 1;
            if (cmd.dir === 'RIGHT') GAME_STATE.robotPosition.col += 1;

            renderRobot();

            // Collision check
            const rCol = GAME_STATE.robotPosition.col;
            const rRow = GAME_STATE.robotPosition.row;

            if (rCol < 0 || rCol > 5 || rRow < 0 || rRow > 5) {
                renderFeedback("❌ Bug! The robot went out of bounds.", "error");
                if (uiEl) uiEl.classList.remove('active');
                GAME_STATE.isPlaying = false;
                return;
            }

            const hitObstacle = config.obstacles.some(o => o.col === rCol && o.row === rRow);
            if (hitObstacle) {
                renderFeedback("❌ Bug! The robot hit an obstacle.", "error");
                if (uiEl) uiEl.classList.remove('active');
                GAME_STATE.isPlaying = false;
                return;
            }
        }
        
        await pause(100);
        if (uiEl) uiEl.classList.remove('active');
    }

    // Execution finished, check if won
    await pause(300);
    const rCol = GAME_STATE.robotPosition.col;
    const rRow = GAME_STATE.robotPosition.row;
    
    if (rCol === config.goal.col && rRow === config.goal.row) {
        // WINNER
        renderFeedback("🎉 SUCCESS! You wrote a working algorithm!", "success");
        if (GAME_STATE.level < 3) {
            setTimeout(() => {
                GAME_STATE.level++;
                initLevel();
            }, 2500);
        } else {
            renderFeedback("🏆 AMAZING! You've mastered routing algorithms and loops!", "success");
            saveProgressToDashboard();
        }
    } else {
        renderFeedback("Oops! Execution finished but you didn't reach the goal. Try debugging.", "warning");
    }

    GAME_STATE.isPlaying = false;
}

function saveProgressToDashboard() {
    try {
        const saved = localStorage.getItem("codeArena_progress");
        if (saved) {
            let progress = JSON.parse(saved);
            if (!progress.completedLevels.includes("6-3")) {
                progress.completedLevels.push("6-3");
                progress.stars += 3;
                if (!progress.unlockedLevels.includes("6-4")) {
                    progress.unlockedLevels.push("6-4"); // Unlock the next class/level
                }
                localStorage.setItem("codeArena_progress", JSON.stringify(progress));
            }
        }
    } catch (e) {
        console.error(e);
    }
}
