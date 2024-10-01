const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const paddleImg1 = document.getElementById('paddleImg1');
const paddleImg2 = document.getElementById('paddleImg2');
const ballImg = document.getElementById('ballImg');

// Game variables
const paddleHeight = 300;
const paddleWidth = 150;
const ballSize = 100;
let playerY = canvas.height / 2 - paddleHeight / 2;
let computerY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 10;
let ballSpeedY = 6;
let playerScore = 0;
let computerScore = 0;
let ballRotation = 0;

function drawImage(img, x, y, width, height) {
    ctx.drawImage(img, x, y, width, height);
}

function drawText(text, x, y, color, fontSize = '30px') {
    ctx.fillStyle = color;
    ctx.font = `${fontSize} Arial`;
    ctx.fillText(text, x, y);
}

function drawRotatedImage(img, x, y, width, height, rotation) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(rotation);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();
}

function drawCenterLine() {
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

function resetBall() {
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function updateGame() {
    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Update ball rotation
    ballRotation += 0.1 * Math.sign(ballSpeedX);

    // Ball collision with top and bottom walls
    if (ballY < 0 || ballY + ballSize > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (
        (ballX < paddleWidth &&
            ballY + ballSize > playerY &&
            ballY < playerY + paddleHeight) ||
        (ballX + ballSize > canvas.width - paddleWidth &&
            ballY + ballSize > computerY &&
            ballY < computerY + paddleHeight)
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Score points
    if (ballX + ballSize < 0) {
        computerScore++;
        resetBall();
    } else if (ballX > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Simple AI for computer paddle
    const paddleSpeed = 4;
    if (computerY + paddleHeight / 2 < ballY + ballSize / 2) {
        computerY += paddleSpeed;
    } else {
        computerY -= paddleSpeed;
    }

    // Keep computer paddle within canvas bounds
    computerY = Math.max(0, Math.min(canvas.height - paddleHeight, computerY));
}

function drawGame() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    drawImage(paddleImg1, 20, playerY, paddleWidth, paddleHeight);
    drawImage(
        paddleImg2,
        canvas.width - paddleWidth -10,
        computerY,
        paddleWidth,
        paddleHeight
    );

    // Draw spinning ball
    drawRotatedImage(ballImg, ballX, ballY, ballSize, ballSize, ballRotation);

    // Draw scores
    drawText(playerScore.toString(), canvas.width / 4, 50, 'white');
    drawText(computerScore.toString(), (3 * canvas.width) / 4, 50, 'white');

    // Draw center line
    drawCenterLine();
}

function gameLoop() {
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}

function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;

    // Keep paddle within canvas bounds
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
}

canvas.addEventListener('mousemove', handleMouseMove);

// Ensure images are loaded before starting the game
window.onload = function () {
    // Start the game loop
    gameLoop();
};
