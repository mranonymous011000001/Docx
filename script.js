const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const canvasSize = canvas.width;

let snake = [
    { x: 10, y: 10 }
];
let food = {};
let direction = 'right';
let score = 0;
let gameOver = false;
let gameInterval;

function generateFood() {
    let newFoodX, newFoodY;
    let collisionWithSnake;
    do {
        newFoodX = Math.floor(Math.random() * (canvasSize / gridSize));
        newFoodY = Math.floor(Math.random() * (canvasSize / gridSize));
        collisionWithSnake = snake.some(segment => segment.x === newFoodX && segment.y === newFoodY);
    } while (collisionWithSnake);
    food = { x: newFoodX, y: newFoodY };
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw snake
    ctx.fillStyle = 'lightgreen';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 25);

    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvasSize / 2, canvasSize / 2 - 20);
        ctx.font = '20px Arial';
        ctx.fillText('Press R to Restart', canvasSize / 2, canvasSize / 2 + 20);
    }
}

function moveSnake() {
    if (gameOver) return;

    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    // Check for collision with walls
    if (head.x < 0 || head.x >= canvasSize / gridSize ||
        head.y < 0 || head.y >= canvasSize / gridSize) {
        gameOver = true;
        return;
    }

    // Check for collision with self
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            return;
        }
    }

    snake.unshift(head);

    // Check for food consumption
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }
}

function gameLoop() {
    moveSnake();
    draw();
    if (gameOver) {
        clearInterval(gameInterval);
    }
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    } else if (e.key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    } else if (e.key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    } else if (e.key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    } else if (e.key === 'r' && gameOver) {
        restartGame();
    }
});

function restartGame() {
    snake = [
        { x: 10, y: 10 }
    ];
    direction = 'right';
    score = 0;
    gameOver = false;
    generateFood();
    gameInterval = setInterval(gameLoop, 100);
}

generateFood();
gameInterval = setInterval(gameLoop, 100);
