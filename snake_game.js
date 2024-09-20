// Constants
const gridSize = 20; // Grid size
let cellSize = 20; // Pixel size for each grid cell
const canvasSize = gridSize * cellSize; // Canvas size

// Get canvas and context
const canvas = document.getElementById('gameCanvas');
canvas.width = canvasSize;
canvas.height = canvasSize;
const ctx = canvas.getContext('2d');

// Get counter element
const counterDisplay = document.getElementById('counter');

// Generate a list from 0 to gridSize^2 - 1
const positions = Array.from({ length: gridSize * gridSize }, (_, index) => index);

// Create position set
let positionSet = new Set(positions);

// Functions to convert position and coordinates
function posToCoord(pos) {
    const x = pos % gridSize;
    const y = Math.floor(pos / gridSize);
    return { x, y };
}

function coordToPos(x, y) {
    return y * gridSize + x;
}

// Snake linked list node
class ListNode {
    constructor(value) {
        this.value = value; // Position value
        this.next = null;   // Next node
    }
}

// Snake linked list class
class Snake {
    constructor(initialPos) {
        this.head = new ListNode(initialPos); // Initialize head node
        this.tail = this.head;               // Head and tail node are the same
        this.length = 1;                     // Initial length is 1
    }

    // Add new node to the head
    addToHead(newPos) {
        const newNode = new ListNode(newPos);
        newNode.next = this.head;
        this.head = newNode;
        this.length++;
    }

    // Remove node from tail
    popTail() {
        if (this.head === this.tail) {
            // Only one node
            const value = this.tail.value;
            this.head = null;
            this.tail = null;
            this.length--;
            return value;
        }

        let current = this.head;
        while (current.next !== this.tail) {
            current = current.next;
        }
        const value = this.tail.value;
        current.next = null;
        this.tail = current;
        this.length--;
        return value;
    }
}

// Initialize snake in the center position
const initialX = Math.floor(gridSize / 2);
const initialY = Math.floor(gridSize / 2);
const initialPos = coordToPos(initialX, initialY);

// Remove snake's initial position from the set
positionSet.delete(initialPos);

// Initialize snake
let snake = new Snake(initialPos);

// Randomly generate food position (but don't remove it from the set)
function getRandomFood() {
    const availablePositions = Array.from(positionSet);
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    return availablePositions[randomIndex];
}

let foodPos = getRandomFood();
let foodChanged = true; // Flag to indicate food position change

// Direction variables
let direction = 'right'; // Initial direction
let new_direction = 'right';
let gameOver = false;

// Listen for keyboard events
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        // Restart game
        restartGame();
        return;
    }

    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') new_direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') new_direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') new_direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') new_direction = 'right';
            break;
    }
});

// Add event listeners for control buttons
document.getElementById('upButton').addEventListener('click', () => {
    if (direction !== 'down') new_direction = 'up';
});

document.getElementById('downButton').addEventListener('click', () => {
    if (direction !== 'up') new_direction = 'down';
});

document.getElementById('leftButton').addEventListener('click', () => {
    if (direction !== 'right') new_direction = 'left';
});

document.getElementById('rightButton').addEventListener('click', () => {
    if (direction !== 'left') new_direction = 'right';
});

document.getElementById('restartButton').addEventListener('click', () => {
    // Restart game
    restartGame();
});

// Game loop
function gameLoop() {
    direction = new_direction;
    if (gameOver) return;

    // Calculate new head position based on the current direction
    const headCoord = posToCoord(snake.head.value);
    let newX = headCoord.x;
    let newY = headCoord.y;

    switch (direction) {
        case 'up':
            newY -= 1;
            break;
        case 'down':
            newY += 1;
            break;
        case 'left':
            newX -= 1;
            break;
        case 'right':
            newX += 1;
            break;
    }

    // Check if the snake hits the wall
    if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
        alert(currentLanguage === 'en'
            ? 'Hit the wall, Lose!'
            : '撞墙了，游戏结束！');
        gameOver = true;
        return;
    }

    const newPos = coordToPos(newX, newY);

    // Check if the snake bites itself
    if (!positionSet.has(newPos)) {
        alert(currentLanguage === 'en'
            ? 'Bit Yourself, Lose!'
            : '咬到自己了，游戏结束！');
        gameOver = true;
        return;
    }

    // Draw the previous snake head as green
    const prevHeadCoord = posToCoord(snake.head.value);
    ctx.fillStyle = '#0f0'; // Green
    ctx.fillRect(prevHeadCoord.x * cellSize + 1, prevHeadCoord.y * cellSize + 1, cellSize - 2, cellSize - 2);

    // Add new position to the snake's head
    snake.addToHead(newPos);
    positionSet.delete(newPos);

    // Draw the new snake head as yellow
    ctx.fillStyle = '#ff0'; // Yellow
    ctx.fillRect(newX * cellSize + 1, newY * cellSize + 1, cellSize - 2, cellSize - 2);

    // Check if the snake eats food
    if (newPos === foodPos) {
        // Generate new food
        if (positionSet.size === 0) {
            alert(currentLanguage === 'en'
                ? 'Victory!'
                : '你赢了！');
            gameOver = true;
            return;
        }
        foodPos = getRandomFood();
        foodChanged = true;

        // Update counter
        counterDisplay.textContent = currentLanguage === 'en'
            ? `Length: ${snake.length}`
            : `长度：${snake.length}`;
    } else {
        // If not eating food, remove the tail
        const tailPos = snake.popTail();
        positionSet.add(tailPos);
        const tailCoord = posToCoord(tailPos);
        // Erase the snake's tail
        ctx.clearRect(tailCoord.x * cellSize, tailCoord.y * cellSize, cellSize, cellSize);
    }

    // Redraw the food if its position has changed
    if (foodChanged) {
        // Erase the old food
        const oldFoodCoord = posToCoord(foodPos);
        ctx.clearRect(oldFoodCoord.x * cellSize, oldFoodCoord.y * cellSize, cellSize, cellSize);

        // Draw the new food
        const foodCoord = posToCoord(foodPos);
        ctx.fillStyle = '#f00'; // Red
        ctx.fillRect(foodCoord.x * cellSize + 1, foodCoord.y * cellSize + 1, cellSize - 2, cellSize - 2);
        foodChanged = false;
    }
}

// Resize the game canvas based on screen size
function resizeGame() {
    const headerHeight = document.getElementById('header').offsetHeight;
    const controlsHeight = document.getElementById('controls').offsetHeight;

    const availableHeight = window.innerHeight - headerHeight - controlsHeight;
    const availableWidth = window.innerWidth;

    // Calculate the minimum dimension to keep the game square
    const minDimension = Math.min(availableHeight, availableWidth);
    const gameSize = minDimension * 0.8; // Canvas occupies 80% of available space

    // Set canvas size
    canvas.style.width = `${gameSize}px`;
    canvas.style.height = `${gameSize}px`;

    // Update actual canvas size for clear drawing
    canvas.width = gameSize;
    canvas.height = gameSize;

    // Update cell size
    cellSize = gameSize / gridSize;

    // Restart the game
    gameOver = true;

    restartGame();
}

// Ensure the game resizes when the window size changes
window.addEventListener('resize', resizeGame);

// Restart game function
function restartGame() {
    // Reset position set
    positionSet.clear();
    for (let i = 0; i < gridSize * gridSize; i++) {
        positionSet.add(i);
    }

    // Initialize snake
    const initialX = Math.floor(gridSize / 2);
    const initialY = Math.floor(gridSize / 2);
    const initialPos = coordToPos(initialX, initialY);

    positionSet.delete(initialPos);
    snake = new Snake(initialPos);

    // Reset direction and game state
    direction = 'right';
    gameOver = false;

    // Reset food
    foodPos = getRandomFood();
    foodChanged = true;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the initial snake head
    ctx.fillStyle = '#ff0'; // Yellow
    ctx.fillRect(initialX * cellSize + 1, initialY * cellSize + 1, cellSize - 2, cellSize - 2);

    // Draw the food
    const foodCoord = posToCoord(foodPos);
    ctx.fillStyle = '#f00'; // Red
    ctx.fillRect(foodCoord.x * cellSize + 1, foodCoord.y * cellSize + 1, cellSize - 2, cellSize - 2);

    // Reset counter
    counterDisplay.textContent = currentLanguage === 'en'
        ? `Length: ${snake.length}`
        : `长度：${snake.length}`;
}

// Start the game
restartGame();

// Set the game loop interval
setInterval(gameLoop, 200);
