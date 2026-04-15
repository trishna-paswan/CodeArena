document.addEventListener('DOMContentLoaded', () => {
    // --- UI ELEMENTS ---
    const theoryOverlay = document.getElementById('theory-overlay');
    const mainUI = document.getElementById('main-ui');
    const theoryTitle = document.getElementById('theory-title');
    const theoryText = document.getElementById('theory-text');
    
    const workspace = document.getElementById('block-workspace');
    const toolbox = document.getElementById('toolbox');
    const btnRun = document.getElementById('btn-run');
    
    const vehiclesContainer = document.getElementById('vehicles-container');
    const feedbackOverlay = document.getElementById('feedback-overlay');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackExplanation = document.getElementById('feedback-explanation');
    const btnNext = document.getElementById('btn-next');
    const btnRetry = document.getElementById('btn-retry');
    const starCountDisplay = document.getElementById('star-count');
    const starRewards = document.getElementById('star-rewards');
    
    // Traffic lights
    const lights = {
        top: document.getElementById('light-top'),
        bottom: document.getElementById('light-bottom'),
        left: document.getElementById('light-left'),
        right: document.getElementById('light-right')
    };
    
    let currentLevel = 1;
    let attempts = 0;
    let totalStars = parseInt(localStorage.getItem('trafficStars')) || 0;
    let simulationActive = false;
    let simulationInterval = null;
    let vehicles = [];
    
    starCountDisplay.textContent = totalStars;

    // --- LEVEL DATA ---
    const levels = [
        {
            num: 1,
            theoryTitle: "Level 1: The IF Statement",
            theoryText: "An IF statement runs a block of code only when a condition is TRUE.",
            hint: "A car is coming on the left road! Make the light RED to stop it.",
            workspaceHTML: `
                <div class="block block-if">
                    IF <span class="block-cond">Car is approaching Left</span> THEN <br><br>
                    <div class="drop-slot" data-slot="1"></div>
                </div>
            `,
            blocks: [
                { id: "act-right", class: "block-action danger", text: "Turn Left Light RED", value: "red" },
                { id: "act-wrong", class: "block-action success", text: "Turn Left Light GREEN", value: "green" }
            ],
            setupScenario: () => {
                setAllLights('green');
                spawnVehicle('car', 'left', -50, 160, '#3498db');
            },
            validate: (answers) => answers['1'] === 'red',
            feedbackSuccess: "Great! The vehicle stopped safely.",
            feedbackFail: "Oh no! The light stayed green and the car didn't stop in time!"
        },
        {
            num: 2,
            theoryTitle: "Level 2: IF-ELSE",
            theoryText: "An IF-ELSE statement gives your program two paths — one for TRUE, one for FALSE.",
            hint: "Set the Left light based on if there are cars.",
            workspaceHTML: `
                <div class="block block-if">
                    IF <span class="block-cond">Car is approaching Left</span> THEN <br><br>
                    &nbsp;&nbsp;<div class="drop-slot" data-slot="1"></div><br><br>
                    ELSE <br><br>
                    &nbsp;&nbsp;<div class="drop-slot" data-slot="2"></div>
                </div>
            `,
            blocks: [
                { id: "act-1", class: "block-action danger", text: "Turn Left Light RED", value: "red" },
                { id: "act-2", class: "block-action success", text: "Turn Left Light GREEN", value: "green" }
            ],
            setupScenario: () => {
                setAllLights('green');
                spawnVehicle('car', 'left', -50, 160, '#e74c3c');
            },
            validate: (answers) => answers['1'] === 'red' && answers['2'] === 'green',
            feedbackSuccess: "Perfect! You handled both conditions properly.",
            feedbackFail: "Crash! Remember: IF a car is coming, we need RED to stop it, else GREEN."
        },
        {
            num: 3,
            theoryTitle: "Level 3: Nested IF",
            theoryText: "You can put an IF inside another IF — this is called a nested conditional.",
            hint: "Clear the way for the Ambulance first!",
            workspaceHTML: `
                <div class="block block-if">
                    IF <span class="block-cond">Vehicle Approaching</span> THEN <br><br>
                    &nbsp;&nbsp;IF <span class="block-cond" style="background:#e74c3c">Is Ambulance</span> THEN<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;<div class="drop-slot" data-slot="1"></div><br>
                    &nbsp;&nbsp;ELSE<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;<div class="drop-slot" data-slot="2"></div><br>
                </div>
            `,
            blocks: [
                { id: "act-1", class: "block-action success", text: "All Lights GREEN", value: "green" },
                { id: "act-2", class: "block-action danger", text: "Follow Normal Rules", value: "normal" }
            ],
            setupScenario: () => {
                setAllLights('red');
                spawnVehicle('ambulance', 'bottom', 160, 500, '#fff');
            },
            validate: (answers) => answers['1'] === 'green' && answers['2'] === 'normal',
            feedbackSuccess: "Awesome! Priority routing for the ambulance works.",
            feedbackFail: "You blocked the ambulance! Emergency vehicles need green lights."
        },
        {
            num: 4,
            theoryTitle: "Level 4: AND / OR",
            theoryText: "Use AND when both conditions must be true. Use OR when either one is enough.",
            hint: "Make sure conflicting roads do not have green at the same time.",
            workspaceHTML: `
                <div class="block block-if">
                    IF <span class="block-cond">Top Road Green</span> <b>OR</b> <span class="block-cond">Bottom Road Green</span> THEN <br><br>
                    &nbsp;&nbsp;Left/Right Lights = <div class="drop-slot" data-slot="1"></div><br>
                </div>
            `,
            blocks: [
                { id: "act-1", class: "block-action danger", text: "RED", value: "red" },
                { id: "act-2", class: "block-action success", text: "GREEN", value: "green" }
            ],
            setupScenario: () => {
                setAllLights('green');
                spawnVehicle('car', 'top', 215, -50, '#9b59b6');
                spawnVehicle('car', 'left', -50, 160, '#f1c40f');
            },
            validate: (answers) => answers['1'] === 'red',
            feedbackSuccess: "Safe! Conflicting directions must not be green simultaneously.",
            feedbackFail: "Crash! Green on horizontal AND vertical roads at once is dangerous."
        },
        {
            num: 5,
            theoryTitle: "Level 5: Full Logic",
            theoryText: "Now combine everything you know to build a complete logic system!",
            hint: "Set proper safety rules for all intersections.",
            workspaceHTML: `
                <div class="block block-if" style="font-size: 0.9rem">
                    IF <span class="block-cond">Ambulance</span> THEN <div class="drop-slot" data-slot="1"></div><br><br>
                    ELSE IF <span class="block-cond">Vertical Traffic</span> THEN<br>
                    &nbsp;&nbsp;Vertical = <div class="drop-slot" data-slot="2"></div> & Horizontal = <div class="drop-slot" data-slot="3"></div><br>
                </div>
            `,
            blocks: [
                { id: "act-1", class: "block-action danger", text: "RED", value: "red" },
                { id: "act-2", class: "block-action success", text: "GREEN", value: "green" },
                { id: "act-3", class: "block-action warning", text: "All GREEN", value: "allgreen" },
            ],
            setupScenario: () => {
                setAllLights('green');
                spawnVehicle('car', 'top', 215, -50, '#3498db');
                spawnVehicle('car', 'bottom', 160, 450, '#e74c3c');
                spawnVehicle('ambulance', 'left', -100, 215, '#fff');
            },
            validate: (answers) => answers['1'] === 'allgreen' && answers['2'] === 'green' && answers['3'] === 'red',
            feedbackSuccess: "Traffic Controller Master! You've successfully navigated the intersection.",
            feedbackFail: "A crash occurred! Review conditions for Ambulance override and cross traffic logic."
        }
    ];

    // --- INITIALIZATION ---
    function initLevel(lvlIndex) {
        if(lvlIndex > levels.length) {
            alert("You completed all levels!");
            window.location.href = "/games";
            return;
        }

        const lvlData = levels[lvlIndex - 1];
        attempts = 0;
        simulationActive = false;
        
        // Show theory card
        mainUI.classList.add('hidden');
        theoryOverlay.classList.remove('hidden');
        theoryTitle.innerHTML = lvlData.theoryTitle;
        theoryText.innerHTML = lvlData.theoryText;
        
        setTimeout(() => {
            theoryOverlay.classList.add('hidden');
            mainUI.classList.remove('hidden');
            setupWorkspace(lvlData);
            resetSimulation();
        }, 3000);
    }
    
    function setupWorkspace(lvlData) {
        document.getElementById('hint-text').innerText = lvlData.hint;
        workspace.innerHTML = lvlData.workspaceHTML;
        toolbox.innerHTML = '';
        
        lvlData.blocks.forEach(b => {
            let el = document.createElement('div');
            el.className = b.class;
            el.draggable = true;
            el.innerText = b.text;
            el.dataset.value = b.value;
            el.id = b.id;
            
            el.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', e.target.id);
            });
            toolbox.appendChild(el);
        });
        
        initDragAndDrop();
    }
    
    function initDragAndDrop() {
        const slots = document.querySelectorAll('.drop-slot');
        slots.forEach(slot => {
            slot.addEventListener('dragover', e => {
                e.preventDefault();
                slot.classList.add('hovered');
            });
            slot.addEventListener('dragleave', e => {
                slot.classList.remove('hovered');
            });
            slot.addEventListener('drop', e => {
                e.preventDefault();
                slot.classList.remove('hovered');
                const id = e.dataTransfer.getData('text/plain');
                const draggedNode = document.getElementById(id);
                if(draggedNode) {
                    slot.innerHTML = ''; // prevent multiple
                    slot.appendChild(draggedNode);
                }
            });
        });
        
        toolbox.addEventListener('dragover', e => e.preventDefault());
        toolbox.addEventListener('drop', e => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            const draggedNode = document.getElementById(id);
            if(draggedNode) toolbox.appendChild(draggedNode);
        });
    }

    // --- SIMULATION LOGIC ---
    function setAllLights(color) {
        const states = {
            'red': { red: 'active', green: '' },
            'green': { red: '', green: 'active' }
        };
        
        for (let key in lights) {
            let L = lights[key];
            L.querySelector('.red').className = `bulb red ${states[color].red}`;
            L.querySelector('.green').className = `bulb green ${states[color].green}`;
        }
    }
    
    function setLight(dir, color) {
        if(!lights[dir]) return;
        const L = lights[dir];
        if (color === 'red') {
            L.querySelector('.red').classList.add('active');
            L.querySelector('.green').classList.remove('active');
        } else {
            L.querySelector('.red').classList.remove('active');
            L.querySelector('.green').classList.add('active');
        }
    }

    function spawnVehicle(type, direction, x, y, color) {
        const el = document.createElement('div');
        el.className = `vehicle ${type}`;
        el.style.backgroundColor = color;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.dataset.dir = direction;
        vehiclesContainer.appendChild(el);
        vehicles.push(el);
    }

    function resetSimulation() {
        clearInterval(simulationInterval);
        vehiclesContainer.innerHTML = '';
        vehicles = [];
        setAllLights('red');
        levels[currentLevel - 1].setupScenario();
    }
    
    btnRun.addEventListener('click', () => {
        if (simulationActive) return;
        attempts++;
        
        // Gather answers
        let answers = {};
        let allFilled = true;
        document.querySelectorAll('.drop-slot').forEach(s => {
            if(s.children.length === 0) allFilled = false;
            else answers[s.dataset.slot] = s.children[0].dataset.value;
        });
        
        if(!allFilled) {
            alert("Please fill all slots before running.");
            return;
        }

        simulationActive = true;
        const lvlData = levels[currentLevel - 1];
        const isCorrect = lvlData.validate(answers);
        
        // Apply user logic visually to lights based on their answers
        if(currentLevel === 1) {
            if(answers['1'] === 'red') setLight('left', 'red');
            else setLight('left', 'green');
        } else if(currentLevel === 2) {
            if(answers['1'] === 'red') setLight('left', 'red');
            if(answers['2'] === 'green') setLight('right', 'green'); // fake logic applying
        } else if(currentLevel === 4) {
            if(answers['1'] === 'red') { setLight('left', 'red'); setLight('right', 'red'); }
            else { setLight('left', 'green'); setLight('right', 'green'); }
        } else if(currentLevel === 5) {
             if(answers['1'] === 'allgreen') setAllLights('green');
        }
        
        // Run simple animation
        let ticks = 0;
        simulationInterval = setInterval(() => {
            ticks++;
            
            // Move vehicles
            vehicles.forEach(v => {
                let dir = v.dataset.dir;
                let top = parseInt(v.style.top);
                let left = parseInt(v.style.left);
                let speed = 4;
                
                // Super simple "collision" avoiding logic (if light is red and near intersection)
                let stop = false;
                
                if(!isCorrect && ticks > 30 && ticks < 50) {
                     // Force overlap / crash visual
                     speed = 8;
                } else if(isCorrect) {
                     if(ticks < 40 && top > 100 && top < 250 && dir==='bottom') stop = true;
                     if(ticks < 40 && left > 60 && left < 100 && dir==='left') stop = true;
                }
                
                if(!stop) {
                    if(dir === 'left') v.style.left = (left + speed) + 'px';
                    if(dir === 'right') v.style.left = (left - speed) + 'px';
                    if(dir === 'top') v.style.top = (top + speed) + 'px';
                    if(dir === 'bottom') v.style.top = (top - speed) + 'px';
                }
            });
            
            if (ticks > 60) {
                clearInterval(simulationInterval);
                simulationActive = false;
                showFeedback(isCorrect, lvlData);
            }
            
        }, 30);
    });
    
    function showFeedback(isCorrect, lvlData) {
        feedbackOverlay.classList.remove('hidden');
        feedbackTitle.innerText = isCorrect ? "Success!" : "Oh no!";
        feedbackExplanation.innerText = isCorrect ? lvlData.feedbackSuccess : lvlData.feedbackFail;
        
        if(isCorrect) {
            document.querySelector('.center-panel').style.boxShadow = "0 0 50px inset green";
            setTimeout(()=> document.querySelector('.center-panel').style.boxShadow = "none", 2000);
            
            btnNext.classList.remove('hidden');
            btnRetry.classList.add('hidden');
            
            let starsEarned = attempts === 1 ? 3 : (attempts === 2 ? 2 : 1);
            totalStars += starsEarned;
            localStorage.setItem('trafficStars', totalStars);
            starCountDisplay.textContent = totalStars;
            
            starRewards.innerHTML = '⭐'.repeat(starsEarned);
        } else {
            document.querySelector('.center-panel').classList.add('crash-anim');
            setTimeout(()=> document.querySelector('.center-panel').classList.remove('crash-anim'), 500);
            
            btnNext.classList.add('hidden');
            btnRetry.classList.remove('hidden');
            starRewards.innerHTML = '❌';
        }
    }
    
    btnRetry.addEventListener('click', () => {
        feedbackOverlay.classList.add('hidden');
        resetSimulation();
        // Return blocks to toolbox
        document.querySelectorAll('.drop-slot').forEach(s => {
            if(s.children.length > 0) toolbox.appendChild(s.children[0]);
        });
    });
    
    btnNext.addEventListener('click', () => {
        feedbackOverlay.classList.add('hidden');
        currentLevel++;
        initLevel(currentLevel);
    });

    // Start Phase
    initLevel(currentLevel);
});
