let draggedStep = null;

// SVG Data URIs for icons
const DEFAULT_ICON_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 5v14M5 12h14'/%3E%3C/svg%3E"; // Plus sign
const DRAG_OVER_ICON_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 5v14m-7-7h14'/%3E%3Cpath d='M12 19l-4-4m4 4l4-4'/%3E%3C/svg%3E"; // Down arrow / Add
const SUCCESS_ICON_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 11.08V12a10 10 0 11-5.93-9.14'/%3E%3Cpath d='M22 4L12 14.01l-3-3'/%3E%3C/svg%3E"; // Checkmark

document.querySelectorAll(".step").forEach(step => {
  step.addEventListener("dragstart", (event) => {
    draggedStep = event.target;
    event.target.classList.add('dragging');
  });

  step.addEventListener("dragend", (event) => {
    event.target.classList.remove('dragging');
  });
});

const dropZone = document.querySelector(".drop-area");
const dropAreaImg = document.getElementById("drop-area-img"); // Get reference to the image
const availableStepsContainer = document.querySelector(".available-steps"); // Get reference to available steps container

dropZone.addEventListener("dragover", e => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
    if (dropAreaImg) {
        dropAreaImg.src = DRAG_OVER_ICON_SVG;
        dropAreaImg.style.opacity = 1; // Make icon more visible
    }
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove('drag-over');
    if (dropAreaImg) {
        // Only revert if no steps are currently in the drop zone, or if a drag operation is not ongoing
        // This prevents the icon from reverting if dragging over a step within dropZone
        if (dropZone.children.length <= 1) { // If only the image is left
             dropAreaImg.src = DEFAULT_ICON_SVG;
             dropAreaImg.style.opacity = 0.5; // Revert opacity
        }
    }
});

dropZone.addEventListener("drop", e => {
  e.preventDefault();
  if (draggedStep && !dropZone.contains(draggedStep)) { // Only append if not already in dropZone
    dropZone.appendChild(draggedStep);
    draggedStep = null;
  }
  dropZone.classList.remove('drag-over');
  // Revert dropZone image after drop
  if (dropAreaImg) {
      dropAreaImg.src = SUCCESS_ICON_SVG; // Show success temporarily
      dropAreaImg.style.opacity = 1;
      setTimeout(() => {
          // Revert to default icon if no steps, otherwise keep icon if steps are present
          if (dropZone.children.length > 1) { // If steps are present besides the image
              dropAreaImg.src = DEFAULT_ICON_SVG; // Could be a different icon if steps are present
              dropAreaImg.style.opacity = 0.1; // Make it less prominent if steps are present
          } else {
              dropAreaImg.src = DEFAULT_ICON_SVG;
              dropAreaImg.style.opacity = 0.5;
          }

      }, 1000);
  }
});


// Add event listeners to availableStepsContainer for dropping back
availableStepsContainer.addEventListener("dragover", e => {
    e.preventDefault();
    availableStepsContainer.classList.add('drag-over');
});

availableStepsContainer.addEventListener("dragleave", () => {
    availableStepsContainer.classList.remove('drag-over');
});

availableStepsContainer.addEventListener("drop", e => {
    e.preventDefault();
    if (draggedStep && dropZone.contains(draggedStep)) { // Only append if dragged from dropZone
        availableStepsContainer.appendChild(draggedStep);
        draggedStep = null;
        // Adjust dropZone image if all steps are moved out
        if (dropAreaImg && dropZone.children.length === 1) { // If only the image is left in dropZone
            dropAreaImg.src = DEFAULT_ICON_SVG;
            dropAreaImg.style.opacity = 0.5;
        }
    }
    availableStepsContainer.classList.remove('drag-over');
});

function checkOrder() {
  const correctOrder = [
    "Boil water",
    "Add tea leaves",
    "Add sugar",
    "Pour into cup"
  ];

  const userOrder = Array.from(dropZone.children)
    .filter(child => child.classList.contains('step')) // Filter only step elements
    .map(step => step.dataset.stepName);

  const robotFeedbackContainer = document.querySelector(".robot-feedback");
  const robotFeedback = document.getElementById("robot-text");

  if (JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
    robotFeedback.innerHTML = "Algorithm correct. Execution successful. You have demonstrated a logical approach to problem-solving.";
    robotFeedbackContainer.classList.remove('error');
    robotFeedbackContainer.classList.add('success');
  } else {
    robotFeedback.innerHTML = "Algorithm flawed. The resulting sequence is incorrect. Re-evaluate your logic and try again.";
    robotFeedbackContainer.classList.remove('success');
    robotFeedbackContainer.classList.add('error');
  }
}

function resetTask() {
  // const availableStepsContainer is already declared above
  const dropZoneChildren = Array.from(dropZone.children);

  dropZoneChildren.forEach(child => {
    if (child.classList.contains('step')) {
      availableStepsContainer.appendChild(child);
    }
  });

  // Reset dropZone image
  if (dropAreaImg) {
      dropAreaImg.src = DEFAULT_ICON_SVG;
      dropAreaImg.style.opacity = 0.5;
  }

  // Reset robot feedback
  const robotFeedbackContainer = document.querySelector(".robot-feedback");
  const robotFeedback = document.getElementById("robot-text");
  robotFeedback.innerHTML = "Awaiting your solution...";
  robotFeedbackContainer.classList.remove('success', 'error');
}