document.addEventListener('DOMContentLoaded', () => {
    let draggedStep = null;

    // SVG Data URIs for icons (moved inside for encapsulation, if not global)
    const DEFAULT_ICON_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 5v14M5 12h14'/%3E%3C/svg%3E";
    const DRAG_OVER_ICON_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 5v14m-7-7h14'/%3E%3Cpath d='M12 19l-4-4m4 4l4-4'/%3E%3C/svg%3E";
    const SUCCESS_ICON_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 11.08V12a10 10 0 11-5.93-9.14'/%3E%3Cpath d='M22 4L12 14.01l-3-3'/%3E%3C/svg%3E";

    // UI Elements
    const dropZone = document.querySelector(".drop-area");
    const dropAreaImg = document.getElementById("drop-area-img");
    const availableStepsContainer = document.querySelector(".available-steps");
    const robotFeedbackContainer = document.querySelector(".robot-feedback");
    const robotFeedbackText = document.getElementById("robot-text");
    const executeButton = document.querySelector('button[onclick="checkOrder()"]');
    const resetButton = document.querySelector('button[onclick="resetTask()"]');
    const mainTitle = document.querySelector('main.game-page h1');
    const mainDescription = document.querySelector('main.game-page p');

    // Game State
    let currentLevelIndex = 0;

    // Levels Configuration
    const levels = [
        {
            title: "The Algorithm of Tea",
            description: "Assemble the steps to brew a perfect cup of tea.",
            availableSteps: [
                { id: "step-sugar", name: "Add sugar", imageSrc: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHE4NWxzcTlvaDRienNsaGhtaTRmNWo2a3Z5YmNqMGo1bnVnZGhwYiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/TWqhnstUczX8gBRXb0/giphy.gif" },
                { id: "step-boil", name: "Boil water", imageSrc: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHFtZjFvbHR3dXd6amdpbnJmcWZiYm92MzR6MHMzZWxwNm1vaXI0ZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/vRIO1bIDhJxJCmB09g/giphy.gif" },
                { id: "step-pour", name: "Pour into cup", imageSrc: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2hldTF1OXptc2d4cDF6MmE4ZGVtM21zZmJ3ODEzc2VmM2s1dXM1bSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2ClHk5Bizke4vMDcfS/giphy.gif" },
                { id: "step-tea", name: "Add tea leaves", imageSrc: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExamwzMzd1c3B2OGo3N3RycGtpNGVuNXdreWxqcHNkeXp6eGRtYmhydiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/tICY62y39zFUAm3TxL/giphy.gif" }
            ],
            correctOrder: [
                "Boil water",
                "Add tea leaves",
                "Add sugar",
                "Pour into cup"
            ]
        },
        {
            title: "Loop: Count to Five",
            description: "Arrange the steps to print numbers from 1 to 5 using a loop.",
            availableSteps: [
                { id: "step-init", name: "Initialize counter = 1", imageSrc: DEFAULT_ICON_SVG }, // Placeholder images
                { id: "step-condition", name: "While counter <= 5", imageSrc: DEFAULT_ICON_SVG },
                { id: "step-print", name: "Print counter", imageSrc: DEFAULT_ICON_SVG },
                { id: "step-increment", name: "Increment counter", imageSrc: DEFAULT_ICON_SVG }
            ],
            correctOrder: [
                "Initialize counter = 1",
                "While counter <= 5",
                "Print counter",
                "Increment counter"
            ]
        },
        {
            title: "Conditional Loop: Even or Odd",
            description: "Use a loop and an if-else condition to identify even or odd numbers from 1 to 3.",
            availableSteps: [
                { id: "step-init-count", name: "Initialize count = 1", imageSrc: DEFAULT_ICON_SVG },
                { id: "step-loop-cond", name: "While count <= 3", imageSrc: DEFAULT_ICON_SVG },
                { id: "step-check-even", name: "If count % 2 == 0", imageSrc: DEFAULT_ICON_SVG },
                { id: "step-print-even", name: "Print 'Even'", imageSrc: DEFAULT_ICON_SVG },
                { id: "step-print-odd", name: "Else Print 'Odd'", imageSrc: DEFAULT_ICON_SVG },
                { id: "step-inc-count", name: "Increment count", imageSrc: DEFAULT_ICON_SVG }
            ],
            correctOrder: [
                "Initialize count = 1",
                "While count <= 3",
                "If count % 2 == 0",
                "Print 'Even'",
                "Else Print 'Odd'",
                "Increment count"
            ]
        }
    ];

    // --- Drag and Drop Logic (mostly unchanged, but dynamically populated steps) ---
    function enableDragForSteps() {
        document.querySelectorAll(".step").forEach(step => {
            step.addEventListener("dragstart", (event) => {
                draggedStep = event.target;
                event.target.classList.add('dragging');
                event.dataTransfer.setData('text/plain', event.target.dataset.stepName); // Set data for transfer
            });

            step.addEventListener("dragend", (event) => {
                event.target.classList.remove('dragging');
            });
        });
    }

    dropZone.addEventListener("dragover", e => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
        if (dropAreaImg) {
            dropAreaImg.src = DRAG_OVER_ICON_SVG;
            dropAreaImg.style.opacity = 1;
        }
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove('drag-over');
        if (dropAreaImg && dropZone.children.length <= 1) { // If only the image is left
            dropAreaImg.src = DEFAULT_ICON_SVG;
            dropAreaImg.style.opacity = 0.5;
        }
    });

    dropZone.addEventListener("drop", e => {
        e.preventDefault();
        if (draggedStep && !dropZone.contains(draggedStep)) {
            // Remove the dropped element from available steps if it's coming from there
            if (availableStepsContainer.contains(draggedStep)) {
                availableStepsContainer.removeChild(draggedStep);
            }
            dropZone.appendChild(draggedStep);
            draggedStep = null;
        }
        dropZone.classList.remove('drag-over');
        if (dropAreaImg) {
            dropAreaImg.src = SUCCESS_ICON_SVG;
            dropAreaImg.style.opacity = 1;
            setTimeout(() => {
                if (dropZone.children.length > 1) {
                    dropAreaImg.src = DEFAULT_ICON_SVG;
                    dropAreaImg.style.opacity = 0.1;
                } else {
                    dropAreaImg.src = DEFAULT_ICON_SVG;
                    dropAreaImg.style.opacity = 0.5;
                }
            }, 1000);
        }
        // After dropping, re-enable drag for new elements in availableSteps or ensure state is correct
        // enableDragForSteps(); // Might be needed if steps are regenerated
    });

    availableStepsContainer.addEventListener("dragover", e => {
        e.preventDefault();
        availableStepsContainer.classList.add('drag-over');
    });

    availableStepsContainer.addEventListener("dragleave", () => {
        availableStepsContainer.classList.remove('drag-over');
    });

    availableStepsContainer.addEventListener("drop", e => {
        e.preventDefault();
        if (draggedStep && dropZone.contains(draggedStep)) {
            availableStepsContainer.appendChild(draggedStep);
            draggedStep = null;
            if (dropAreaImg && dropZone.children.length === 1) {
                dropAreaImg.src = DEFAULT_ICON_SVG;
                dropAreaImg.style.opacity = 0.5;
            }
        }
        availableStepsContainer.classList.remove('drag-over');
    });

    // --- Level Management ---
    function initializeLevel(levelIndex) {
        if (levelIndex >= levels.length) {
            alert("Congratulations! You've mastered all algorithms!");
            currentLevelIndex = 0; // Loop back to first level
        } else {
            currentLevelIndex = levelIndex;
        }
        const currentLevel = levels[currentLevelIndex];

        // Update main title and description
        mainTitle.textContent = currentLevel.title;
        mainDescription.innerHTML = currentLevel.description; // Use innerHTML for potential span tags

        // Populate available steps
        availableStepsContainer.innerHTML = ''; // Clear previous steps
        currentLevel.availableSteps.forEach(stepData => {
            const stepElement = document.createElement('div');
            stepElement.className = "step glass-container p-4 rounded-lg text-gray-800 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-xl flex flex-col items-center justify-center border-2 border-[#8A2BE2] bg-white";
            stepElement.draggable = true;
            stepElement.id = stepData.id;
            stepElement.dataset.stepName = stepData.name;
            
            // Only show images for the first level (index 0)
            const imgHtml = (levelIndex === 0) 
                ? `<img src="${stepData.imageSrc}" alt="${stepData.name}" class="w-40 h-40 object-cover mb-2" draggable="false">` 
                : '';
                
            stepElement.innerHTML = `${imgHtml}
                                     <span class="text-sm block text-center mt-2">${stepData.name}</span>`;
            availableStepsContainer.appendChild(stepElement);
        });
        enableDragForSteps(); // Enable drag for newly created steps

        // Clear drop zone
        dropZone.innerHTML = '';
        dropZone.appendChild(dropAreaImg); // Add back the image placeholder
        dropAreaImg.src = DEFAULT_ICON_SVG;
        dropAreaImg.style.opacity = 0.5;


        // Reset robot feedback
        robotFeedbackText.innerHTML = "Awaiting your solution...";
        robotFeedbackContainer.classList.remove('success', 'error');

        // If level has custom setup, call it
        if (currentLevel.setupLevelUI) {
            currentLevel.setupLevelUI();
        }
    }

    // --- Buttons ---
    executeButton.onclick = checkOrder;
    resetButton.onclick = resetTask;

    function checkOrder() {
        const currentLevel = levels[currentLevelIndex];
        const userOrder = Array.from(dropZone.children)
            .filter(child => child.classList.contains('step'))
            .map(step => step.dataset.stepName);

        if (JSON.stringify(userOrder) === JSON.stringify(currentLevel.correctOrder)) {
            robotFeedbackText.innerHTML = "Algorithm correct. Execution successful. Moving to next challenge!";
            robotFeedbackContainer.classList.remove('error');
            robotFeedbackContainer.classList.add('success');
            // Move to next level after a delay
            setTimeout(() => {
                initializeLevel(currentLevelIndex + 1);
            }, 2000);
        } else {
            robotFeedbackText.innerHTML = "Algorithm flawed. The resulting sequence is incorrect. Re-evaluate your logic and try again.";
            robotFeedbackContainer.classList.remove('success');
            robotFeedbackContainer.classList.add('error');
        }
    }

    function resetTask() {
        const currentLevel = levels[currentLevelIndex];
        // Move all steps from dropZone back to availableStepsContainer
        Array.from(dropZone.children)
            .filter(child => child.classList.contains('step'))
            .forEach(child => availableStepsContainer.appendChild(child));

        // Reset dropZone image
        dropAreaImg.src = DEFAULT_ICON_SVG;
        dropAreaImg.style.opacity = 0.5;

        // Reset robot feedback
        robotFeedbackText.innerHTML = "Awaiting your solution...";
        robotFeedbackContainer.classList.remove('success', 'error');

        // Re-enable drag for all steps
        enableDragForSteps();
    }

    // Initialize the first level when the page loads
    initializeLevel(0);
});