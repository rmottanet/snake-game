const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

const boxSize = 20;
let snake = [{ x: 0, y: 0 }];
let direction = "right";

// Função para ajustar o tamanho do canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Ajusta o tamanho do canvas na inicialização
resizeCanvas();

// Função para desenhar a cobrinha
function drawSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#00F" : "#0F0"; // Cabeça azul, corpo verde
        ctx.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(snake[i].x, snake[i].y, boxSize, boxSize);
    }
}

// Função para atualizar a posição da cobrinha
function updateSnake() {
    const cabeçaDaCobra = { x: snake[0].x, y: snake[0].y };

    // Lógica para mover a cobrinha na direção correta
    switch (direction) {
        case "up":
            cabeçaDaCobra.y -= boxSize;
            break;
        case "down":
            cabeçaDaCobra.y += boxSize;
            break;
        case "left":
            cabeçaDaCobra.x -= boxSize;
            break;
        case "right":
            cabeçaDaCobra.x += boxSize;
            break;
    }

    // Adiciona um novo quadrado à cabeça da cobra
    snake.unshift(cabeçaDaCobra);

    // Lógica para manter o tamanho máximo da cobra
    if (snake.length > 1) {
        snake.pop(); // Remove o último segmento
    }

    // Lógica para verificar colisões com as bordas do canvas
    if (
        cabeçaDaCobra.x < 0 || cabeçaDaCobra.x >= canvas.width ||
        cabeçaDaCobra.y < 0 || cabeçaDaCobra.y >= canvas.height
    ) {
        // Encerre o jogo
        gameOver();
        return;
    }

    // Desenha a cobrinha
    drawSnake();

    // Agendamento do próximo ciclo de jogo
    setTimeout(updateSnake, 100);
}

function resetGame() {
    snake = [{ x: 0, y: 0 }];
    direction = "right";
    // Inicie o loop do jogo
    updateSnake();
}

function gameOver() {
    // Exiba uma mensagem de fim de jogo no console por enquanto
    console.log("Game Over! Pressione qualquer tecla para recomeçar.");

    // Adicione um ouvinte de eventos para recomeçar o jogo
    document.addEventListener("keydown", handleRestartKeyPress);
}

function handleRestartKeyPress() {
    // Remova o ouvinte de eventos
    document.removeEventListener("keydown", handleRestartKeyPress);

    // Reinicie o jogo
    resetGame();
}

// Ouvinte de eventos para redimensionamento da janela
window.addEventListener("resize", resizeCanvas);

// Inicie o loop do jogo
resetGame();

// Ouvinte de eventos para capturar as teclas de seta
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp" && direction !== "down") {
        direction = "up";
    } else if (event.key === "ArrowDown" && direction !== "up") {
        direction = "down";
    } else if (event.key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    } else if (event.key === "ArrowRight" && direction !== "left") {
        direction = "right";
    }
});
