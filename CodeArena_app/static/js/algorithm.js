// --- The Algorithm of Tea: Logic ---

document.addEventListener('DOMContentLoaded', () => {
    setupDragAndDrop();
});

function setupDragAndDrop() {
    const steps = document.querySelectorAll('.step');
    const dropArea = document.querySelector('.drop-area');
    const availableSteps = document.querySelector('.available-steps');

    steps.forEach(step => {
        step.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
            setTimeout(() => {
                e.target.classList.add('opacity-50');
            }, 0);
        });

        step.addEventListener('dragend', (e) => {
            e.target.classList.remove('opacity-50');
        });
    });

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('bg-purple-900/20');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('bg-purple-900/20');
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('bg-purple-900/20');
        const stepId = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(stepId);
        
        if (draggedElement) {
            // Hide the placeholder image if it's the first element
            const placeholder = document.getElementById('drop-area-img');
            if (placeholder) placeholder.classList.add('hidden');
            
            dropArea.appendChild(draggedElement);
            // Change style when in drop area
            draggedElement.classList.remove('flex-col', 'items-center', 'justify-center');
            draggedElement.classList.add('flex-row', 'items-center', 'gap-4', 'w-full');
            const img = draggedElement.querySelector('img');
            if (img) {
                img.classList.remove('w-40', 'h-40');
                img.classList.add('w-12', 'h-12');
            }
        }
    });
}

function checkOrder() {
    const dropArea = document.querySelector('.drop-area');
    const robotText = document.getElementById('robot-text');
    const feedbackBox = document.querySelector('.robot-feedback');
    const items = dropArea.querySelectorAll('.step');
    
    const correctOrder = ['step-boil', 'step-tea', 'step-sugar', 'step-pour'];
    const userOrder = Array.from(items).map(item => item.id);

    if (userOrder.length === 0) {
        updateFeedback("Your algorithm is empty! Drag some steps into the box.", "info");
        return;
    }

    if (userOrder.length < correctOrder.length) {
        updateFeedback("Wait, you're missing some steps! A good algorithm needs every detail.", "warning");
        return;
    }

    let isCorrect = true;
    // Basic check: Boil must be first
    if (userOrder[0] !== 'step-boil') {
        updateFeedback("Error! You can't make tea without boiling water first. Check your sequence!", "error");
        return;
    }

    // Check full sequence
    for (let i = 0; i < correctOrder.length; i++) {
        if (userOrder[i] !== correctOrder[i]) {
            isCorrect = false;
            break;
        }
    }

    if (isCorrect) {
        updateFeedback("SUCCESS! The tea is perfect. You've mastered the sequence algorithm!", "success");
        feedbackBox.classList.add('success');
        createConfetti();
    } else {
        updateFeedback("Almost there! But the tea doesn't taste right. Are the steps in the best order?", "error");
        feedbackBox.classList.add('error');
        setTimeout(() => feedbackBox.classList.remove('error'), 500);
    }
}

function updateFeedback(text, type) {
    const robotText = document.getElementById('robot-text');
    robotText.textContent = text;
}

function resetTask() {
    location.reload(); // Simplest way to reset the complex drag-and-drop UI
}

function createConfetti() {
    // Simple confetti implementation if no library is used
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
            confetti.style.transition = 'all 2s ease-out';
            confetti.style.top = '110vh';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        }, 100);

        setTimeout(() => {
            confetti.remove();
        }, 2100);
    }
}
