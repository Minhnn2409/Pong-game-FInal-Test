const canvas = document.getElementById("pong");
const ctx = canvas.getContext('2d');

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "white"
}

const player = {
    x: 0,                           
    y: (canvas.height - 100) / 2, 
    width: 10,
    height: 100,
    score: 0,
    color: "WHITE"
}

const com = {
    x: canvas.width - 10,           
    y: (canvas.height - 100) / 2,  
    width: 10,
    height: 100,
    score: 0,
    color: "WHITE"
}

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawArc(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

canvas.addEventListener("mousemove", getMousePos);
function getMousePos(e) {
    player.y = e.clientY - player.height / 2;        
}
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX; 
    ball.speed = 7;
}

function drawNet() {
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, canvas.height/2);
    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.stroke();
}

function drawText(text, x, y) {
    ctx.fillStyle = "#FFF";
    ctx.font = "60px fantasy";
    ctx.fillText(text, x, y);
}

function collision(b, p) { 
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function update() {

    if (ball.x - ball.radius < 0) {
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
    }
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    com.y += ((ball.y - (com.y + com.height / 2))) * 0.1;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    let playerCheck = (ball.x + ball.radius < canvas.width / 2) ? player : com;

    if (collision(ball, playerCheck)) {

        let collidePoint = (ball.y - (playerCheck.y + playerCheck.height / 2));
        collidePoint = collidePoint / (playerCheck.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;

        let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.1;
    }
}

function draw() {

    drawRect(0, 0, canvas.width, canvas.height, "#000");

    drawText(player.score, canvas.width / 4, canvas.height / 5);

    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5);
    drawNet();

    drawRect(player.x, player.y, player.width, player.height, player.color);

    drawRect(com.x, com.y, com.width, com.height, com.color);
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function action() { 
    update();
    draw();
}
let framePerSecond = 50;
let loop = setInterval(action, 1000 / framePerSecond);

