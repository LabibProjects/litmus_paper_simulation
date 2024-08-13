let initialColor = 'blue'; // Initial color of litmus paper
let acidColor = 'red';     // Color when submerged in acid
let baseColor = 'blue';    // Color when submerged in base

let lastReactionColor = initialColor; // Track the last reaction's color
let currentColor = initialColor;      // Track current color of litmus paper
let isDragging = false; // Flag to track mouse or touch dragging

let litmusPaper = document.getElementById('litmus-paper');

litmusPaper.addEventListener('mousedown', startDragging);
litmusPaper.addEventListener('touchstart', startDragging);

document.addEventListener('mouseup', stopDragging);
document.addEventListener('touchend', stopDragging);

function startDragging(event) {
  isDragging = true; // Set flag to true when mouse or touch is initiated
  let paper = event.target;
  let offsetX, offsetY;

  if (event.type === 'mousedown') {
    offsetX = event.clientX - paper.getBoundingClientRect().left;
    offsetY = event.clientY - paper.getBoundingClientRect().top;
  } else if (event.type === 'touchstart') {
    offsetX = event.touches[0].clientX - paper.getBoundingClientRect().left;
    offsetY = event.touches[0].clientY - paper.getBoundingClientRect().top;
  }

  function movePaper(event) {
    if (!isDragging) return; // Exit if mouse or touch interaction is stopped
    let posX, posY;

    if (event.type === 'mousemove') {
      posX = event.clientX - offsetX;
      posY = event.clientY - offsetY;
    } else if (event.type === 'touchmove') {
      posX = event.touches[0].clientX - offsetX;
      posY = event.touches[0].clientY - offsetY;
    }

    paper.style.left = `${posX}px`;
    paper.style.top = `${posY}px`;

    checkColorChange(paper, posX, posY); // Pass position as arguments
  }

  document.addEventListener('mousemove', movePaper);
  document.addEventListener('touchmove', movePaper);
}

function stopDragging() {
  isDragging = false; // Set flag to false when mouse or touch interaction is stopped
  let paper = document.getElementById('litmus-paper');
  paper.style.transition = ''; // Restore transitions after dragging
}

function checkColorChange(paper, posX, posY) {
  let acidJar = document.getElementById('acid-jar');
  let baseJar = document.getElementById('base-jar');

  let acidRect = acidJar.getBoundingClientRect();
  let baseRect = baseJar.getBoundingClientRect();
  let paperRect = paper.getBoundingClientRect();

  let acidOverlap = calculateOverlap(paperRect, acidRect);
  let baseOverlap = calculateOverlap(paperRect, baseRect);

  if (acidOverlap > 0) {
    currentColor = acidColor; // Change current color to red
    lastReactionColor = acidColor; // Update last reaction's color
  } else if (baseOverlap > 0) {
    currentColor = baseColor; // Change current color to blue
    lastReactionColor = baseColor; // Update last reaction's color
  } else {
    currentColor = lastReactionColor; // Use the last reaction's color
  }

  // Apply color change with transition
  paper.style.transition = 'background-color 4s ease'; // Transition duration of 4 seconds
  paper.style.backgroundColor = currentColor;
}

function calculateOverlap(paperRect, jarRect) {
  let overlapWidth = Math.min(paperRect.right, jarRect.right) - Math.max(paperRect.left, jarRect.left);
  let overlapHeight = Math.min(paperRect.bottom, jarRect.bottom) - Math.max(paperRect.top, jarRect.top);
  let paperArea = paperRect.width * paperRect.height;
  let overlapArea = overlapWidth * overlapHeight;
  let overlapPercentage = overlapArea / paperArea;
  return overlapPercentage;
}
