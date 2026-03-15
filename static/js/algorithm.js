// --- Python Pilot: The Sequence Factory ---

let currentLevelIdx = 0;
let draggedBlock = null;

const levels = [
    {
        name: "Mission 1: The Hello Loop",
        byteInitial: "Welcome! To start our factory, we need to say Hello. But remember, the computer reads from TOP to BOTTOM!",
        byteSuccess: "Great! You printed the messages in the right order. Computers always follow your sequence!",
        blocks: [
            { id: "b1", code: '<span class="python-func">print</span>(<span class="python-string">"Hello!"</span>)', order: 0, output: "Hello!" },
            { id: "b2", code: '<span class="python-func">print</span>(<span class="python-string">"Welcome to the Factory."</span>)', order: 1, output: "Welcome to the Factory." }
        ],
        hint: "Which message should come first?"
    },
    {
        name: "Mission 2: The Variable Prep",
        byteInitial: "Variables are like boxes. You must put something in the box (Milk) before you can show it!",
        byteSuccess: "Exactly! You defined 'milk' first, then printed it. That's perfect logic.",
        blocks: [
            { id: "b1", code: 'milk = <span class="python-string">"Chocolate Milk"</span>', order: 0, output: "" },
            { id: "b2", code: '<span class="python-func">print</span>(milk)', order: 1, output: "Chocolate Milk" }
        ],
        hint: "Can you show 'milk' before you decide what it is? Try defining it first!"
    },
    {
        name: "Mission 3: Changing Mind",
        byteInitial: "Variables can change! Arrange these so we start with Cold and end with Hot.",
        byteSuccess: "Smart! The computer updated the 'temp' variable just as you told it to.",
        blocks: [
            { id: "b1", code: 'temp = <span class="python-string">"Cold"</span>', order: 0, output: "" },
            { id: "b2", code: '<span class="python-func">print</span>(temp)', order: 1, output: "Cold" },
            { id: "b3", code: 'temp = <span class="python-string">"Hot"</span>', order: 2, output: "" },
            { id: "b4", code: '<span class="python-func">print</span>(temp)', order: 3, output: "Hot" }
        ],
        hint: "Follow the story: First it's Cold, then we print it, then we make it Hot!"
    },
    {
        name: "Mission 4: Math Machine",
        byteInitial: "Let's do some math! We need to define X and Y before we can add them together.",
        byteSuccess: "Math complete! You organized the calculation sequence perfectly.",
        blocks: [
            { id: "b1", code: 'x = <span class="text-orange-500">10</span>', order: 0, output: "" },
            { id: "b2", code: 'y = <span class="text-orange-500">5</span>', order: 1, output: "" },
            { id: "b3", code: 'total = x + y', order: 2, output: "" },
            { id: "b4", code: '<span class="python-func">print</span>(total)', order: 3, output: "15" }
        ],
        hint: "Make sure X and Y exist before you try to add them!"
    },
    {
        name: "Mission 5: The Greeting",
        byteInitial: "Ask for a name, then say Hi. You can't greet someone before knowing who they are!",
        byteSuccess: "You're a Python Pro! You mastered the sequence of Input and Output.",
        blocks: [
            { id: "b1", code: 'name = <span class="python-func">input</span>()', order: 0, output: "<i>*User enters 'Byte'*</i>" },
            { id: "b2", code: 'msg = <span class="python-string">"Hi "</span> + name', order: 1, output: "" },
            { id: "b3", code: '<span class="python-func">print</span>(msg)', order: 2, output: "Hi Byte" }
        ],
        hint: "Get the name first, then create the message, then print it!"
    },
    {
        name: "Mission 6: The Grocery List",
        byteInitial: "Lists are like containers. Let's create a list and then peek inside it!",
        byteSuccess: "List master! You created the collection before asking the computer to show it.",
        blocks: [
            { id: "b1", code: 'items = [<span class="python-string">"Apple"</span>, <span class="python-string">"Banana"</span>]', order: 0, output: "" },
            { id: "b2", code: '<span class="python-func">print</span>(items)', order: 1, output: "['Apple', 'Banana']" }
        ],
        hint: "Define the 'items' list first!"
    },
    {
        name: "Mission 7: Boolean States",
        byteInitial: "Booleans can be True or False. Let's toggle a robot's power state!",
        byteSuccess: "System Online! You correctly updated the boolean state in order.",
        blocks: [
            { id: "b1", code: 'power_on = <span class="python-keyword">True</span>', order: 0, output: "" },
            { id: "b2", code: '<span class="python-func">print</span>(<span class="python-string">"Status:"</span>, power_on)', order: 1, output: "Status: True" },
            { id: "b3", code: 'power_on = <span class="python-keyword">False</span>', order: 2, output: "" },
            { id: "b4", code: '<span class="python-func">print</span>(<span class="python-string">"Status:"</span>, power_on)', order: 3, output: "Status: False" }
        ],
        hint: "Think about the sequence: Turn it ON, show it, then turn it OFF, show it."
    },
    {
        name: "Mission 8: Loud Strings",
        byteInitial: "We can transform text! Let's take a quiet word and make it LOUD using .upper().",
        byteSuccess: "SHOUTING SUCCESS! You transformed the string before printing it.",
        blocks: [
            { id: "b1", code: 'msg = <span class="python-string">"shout"</span>', order: 0, output: "" },
            { id: "b2", code: 'msg = msg.upper()', order: 1, output: "" },
            { id: "b3", code: '<span class="python-func">print</span>(msg)', order: 2, output: "SHOUT" }
        ],
        hint: "First the word, then the transformation, then the print!"
    },
    {
        name: "Mission 9: The Checkout Counter",
        byteInitial: "This is a tough one! We need to calculate a total price with tax.",
        byteSuccess: "Checkout complete! You followed the mathematical sequence perfectly.",
        blocks: [
            { id: "b1", code: 'price = <span class="text-orange-500">100</span>', order: 0, output: "" },
            { id: "b2", code: 'tax = <span class="text-orange-500">0.1</span>', order: 1, output: "" },
            { id: "b3", code: 'total = price + (price * tax)', order: 2, output: "" },
            { id: "b4", code: '<span class="python-func">print</span>(<span class="python-string">"Total:"</span>, total)', order: 3, output: "Total: 110.0" }
        ],
        hint: "You need price and tax values before you can calculate the total!"
    },
    {
        name: "Mission 10: Final Scoring Logic",
        byteInitial: "The Grand Finale! Update a player's score and format a final message.",
        byteSuccess: "MISSION ACCOMPLISHED! You are officially a Master of the Sequence.",
        blocks: [
            { id: "b1", code: 'score = <span class="text-orange-500">0</span>', order: 0, output: "" },
            { id: "b2", code: 'score = score + <span class="text-orange-500">50</span>', order: 1, output: "" },
            { id: "b3", code: 'result = <span class="python-string">"Final Score: "</span> + <span class="python-func">str</span>(score)', order: 2, output: "" },
            { id: "b4", code: '<span class="python-func">print</span>(result)', order: 3, output: "Final Score: 50" }
        ],
        hint: "Start at zero, add points, convert to string, then print the result!"
    }
];

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    loadLevel(0);
    setupDragAndDrop();
    
    // Initial cinematic entrance for the bubble
    setTimeout(() => {
        const bubble = document.getElementById('byte-text');
        if (bubble) {
            gsap.to(bubble, {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                ease: "back.out(2)"
            });
        }
    }, 500);
});

function loadLevel(idx) {
    if (idx >= levels.length) {
        showFinalSuccess();
        return;
    }
    currentLevelIdx = idx;
    const level = levels[idx];

    // UI Updates
    document.getElementById('level-name').textContent = level.name;
    updateByte(level.byteInitial);
    document.getElementById('console-output').innerHTML = '> Waiting for instructions...';
    document.getElementById('status-msg').classList.remove('show');

    // Load Toolbox (Scrambled)
    const toolbox = document.getElementById('toolbox');
    toolbox.innerHTML = '';
    const scrambledBlocks = [...level.blocks].sort(() => Math.random() - 0.5);
    
    scrambledBlocks.forEach(block => {
        const el = document.createElement('div');
        el.className = 'py-block';
        el.draggable = true;
        el.dataset.id = block.id;
        el.innerHTML = `<span>⚡</span><code>${block.code}</code>`;
        el.addEventListener('dragstart', handleDragStart);
        el.addEventListener('dragend', handleDragEnd);
        toolbox.appendChild(el);
    });

    document.getElementById('workspace').innerHTML = '';
}

// --- Drag & Drop ---

function setupDragAndDrop() {
    const workspace = document.getElementById('workspace');
    const toolbox = document.getElementById('toolbox');

    [workspace, toolbox].forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(zone, e.clientY);
            if (draggedBlock) {
                if (afterElement == null) zone.appendChild(draggedBlock);
                else zone.insertBefore(draggedBlock, afterElement);
            }
        });
    });
}

function handleDragStart(e) {
    draggedBlock = this;
    this.classList.add('dragging');
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedBlock = null;
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.py-block:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset, element: child };
        else return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// --- Game Logic ---

window.runCode = async () => {
    const workspaceBlocks = [...document.querySelectorAll('#workspace .py-block')];
    const consoleOut = document.getElementById('console-output');
    const level = levels[currentLevelIdx];

    if (workspaceBlocks.length < level.blocks.length) {
        updateByte("You missed some blocks! We need the whole sequence to run the factory.");
        return;
    }

    consoleOut.innerHTML = '> Running script.py...<br>';
    let success = true;
    let outputs = [];

    // Check Sequence
    workspaceBlocks.forEach((block, index) => {
        const blockData = level.blocks.find(b => b.id === block.dataset.id);
        if (blockData.order !== index) {
            success = false;
        }
        if (blockData.output) outputs.push(blockData.output);
    });

    // Animate console output
    for (let out of outputs) {
        if (out) {
            await new Promise(r => setTimeout(r, 400));
            consoleOut.innerHTML += `> ${out}<br>`;
        }
    }

    if (success) {
        updateByte(level.byteSuccess);
        showStatus(true);
    } else {
        await new Promise(r => setTimeout(r, 400));
        consoleOut.innerHTML += `<span class="text-red-500">> NameError: execution out of sequence</span>`;
        updateByte("Oh no! The computer got confused. " + level.hint);
        showStatus(false);
    }
};

function updateByte(text) {
    const bubble = document.getElementById('byte-text');
    const robot = document.getElementById('byte-img');
    if (!bubble || !robot) return;

    // Talking Animation (Hop)
    const talkTimeline = gsap.timeline({ repeat: 5 });
    talkTimeline.to(robot, { y: -10, duration: 0.1 })
                .to(robot, { y: 0, duration: 0.1 });

    // Cinematic Text Appearance
    gsap.to(bubble, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "back.in(1.7)",
        onComplete: () => {
            bubble.textContent = text;
            gsap.to(bubble, {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
        }
    });
}
function showStatus(isSuccess) {
    const msg = document.getElementById('status-msg');
    const title = document.getElementById('status-title');
    const desc = document.getElementById('status-desc');
    const icon = document.getElementById('status-icon');
    const btn = document.getElementById('status-btn');

    if (isSuccess) {
        icon.textContent = "🌟";
        title.textContent = "Awesome!";
        desc.textContent = "You mastered this sequence perfectly.";
        btn.textContent = "Next Mission";
        btn.onclick = () => { 
            msg.classList.remove('show'); 
            window.nextLevel(); 
        };
    } else {
        icon.textContent = "❌";
        title.textContent = "Not Quite!";
        desc.textContent = "The order isn't right yet. Try again!";
        btn.textContent = "Try Again";
        btn.onclick = () => { 
            msg.classList.remove('show'); 
            window.resetTask(); 
        };
    }
    msg.classList.add('show');
}

function showFinalSuccess() {
    document.getElementById('status-msg').classList.remove('show');
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="col-span-12 flex flex-col items-center justify-center text-center p-20">
            <div class="text-9xl mb-8">🏆</div>
            <h1 class="text-5xl font-bold text-indigo-900 mb-4">Python Pilot Graduated!</h1>
            <p class="text-xl text-gray-600 mb-8">You understand exactly how computers read code. You're ready for real Python!</p>
            <div class="flex gap-4">
                <button onclick="location.reload()" class="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:bg-indigo-500 transition-all">Play Again</button>
                <button onclick="window.location.href='/games'" class="bg-white border-4 border-indigo-600 text-indigo-600 px-12 py-4 rounded-2xl font-bold text-xl hover:bg-indigo-50 transition-all">Back to Lobby</button>
            </div>
        </div>
    `;
    updateByte("I'm so proud of you! You're a natural coder.");
}

window.nextLevel = () => loadLevel(currentLevelIdx + 1);
window.resetTask = () => loadLevel(currentLevelIdx);