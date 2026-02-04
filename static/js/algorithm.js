let draggedStep = null;

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

dropZone.addEventListener("dragover", e => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener("drop", e => {
  e.preventDefault();
  if (draggedStep) {
    dropZone.appendChild(draggedStep);
    draggedStep = null;
  }
  dropZone.classList.remove('drag-over');
});

function checkOrder() {
  const correctOrder = [
    "Boil water",
    "Add tea leaves",
    "Add sugar",
    "Pour into cup"
  ];

  const userOrder = Array.from(dropZone.children)
    .map(step => step.innerText.trim());

  const robotFeedbackContainer = document.querySelector(".robot-feedback");
  const robotFeedback = document.getElementById("robot-text");

  if (JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
<<<<<<< HEAD
    robotFeedback.innerHTML = " PERFECT! You've created a correct algorithm. An algorithm is just a set of steps to complete a task. You're a natural! ";
    robotFeedbackContainer.classList.remove('error');
    robotFeedbackContainer.classList.add('success');
  } else {
    robotFeedback.innerHTML = " Not quite right! That tea might taste a bit... experimental. Give it another try! ";
    robotFeedbackContainer.classList.remove('success');
    robotFeedbackContainer.classList.add('error');
  }
}
=======
    robotFeedback.innerHTML = "Algorithm correct. Execution successful. You have demonstrated a logical approach to problem-solving.";
    robotFeedbackContainer.classList.remove('error');
    robotFeedbackContainer.classList.add('success');
  } else {
    robotFeedback.innerHTML = "Algorithm flawed. The resulting sequence is incorrect. Re-evaluate your logic and try again.";
    robotFeedbackContainer.classList.remove('success');
    robotFeedbackContainer.classList.add('error');
  }
}
>>>>>>> c8a7da4 (changes)
