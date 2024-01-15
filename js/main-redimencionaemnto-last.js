// Definindo variáveis
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
// Ajuste o tamanho do canvas para corresponder às dimensões da janela


const maxLength = 5; 

// Velocidade da cobra (em milissegundos)
let snakeSpeed = 100; // ajuste conforme necessário

const boxSize = 20;
let snake = [{ x: 0, y: 0 }];
let direction = "right"; // Pode ser inicializado com "up", "down", "left" ou "right"



// Ajusta o tamanho do canvas na inicialização
resizeCanvas();

// Restante do seu código...

// Função para ajustar o tamanho do canvas
// Função para ajustar o tamanho do canvas
function resizeCanvas() {
    // Obtenha as dimensões da janela
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Ajuste o tamanho do canvas para corresponder às dimensões da janela
    canvas.width = windowWidth;
    canvas.height = windowHeight;

    // Verifique se ainda há barras de rolagem após o ajuste
    const documentWidth = document.documentElement.clientWidth;
    const documentHeight = document.documentElement.clientHeight;

    if (documentWidth > windowWidth) {
        // Ajuste novamente o tamanho do canvas para compensar a barra de rolagem vertical
        canvas.width = documentWidth;
    }

    if (documentHeight > windowHeight) {
        // Ajuste novamente o tamanho do canvas para compensar a barra de rolagem horizontal
        canvas.height = documentHeight;
    }
}

// Função para lidar com o redimensionamento da janela
function handleWindowResize() {
    resizeCanvas();

    // Limpe qualquer setTimeout pendente (parar o loop anterior)
    clearTimeout(gameLoopTimeout);

    // Inicie o loop do jogo após o redimensionamento
    gameLoopTimeout = setTimeout(gameLoop, 0);
}


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
    const cabeçaDaCobra = { x: snake[0].x, y: snake[0].y }; // Cabeça da cobra

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

    // Lógica para verificar colisões com as bordas do canvas
    if (
        cabeçaDaCobra.x < 0 || cabeçaDaCobra.x >= canvas.width ||
        cabeçaDaCobra.y < 0 || cabeçaDaCobra.y >= canvas.height
    ) {
        // Encerre o jogo (pode exibir uma mensagem ou reiniciar o jogo)
        alert("Game Over!");
        // Pode adicionar lógica para reiniciar o jogo
        // Dentro da função updateSnake, após o alert("Game Over!");
		resetGame();
		return;


    }

    // Lógica para manter o tamanho máximo da cobra
    if (snake.length > maxLength) {
        snake.pop(); // Remove o último segmento
    }

}

function resetGame() {
    snake = [{ x: 0, y: 0 }];
    direction = "right";
    snakeSpeed = 150;
    // Outras variáveis de jogo podem ser reinicializadas aqui

    // Limpar qualquer setTimeout pendente (parar o loop anterior)
    clearTimeout(gameLoopTimeout);
    
    // Reinicialize o jogo chamando a função principal
    gameLoop();
}

// Função principal do jogo
function gameLoop() {
    // Atualiza a posição da cobrinha
    updateSnake();

    // Desenha a cobrinha na tela
    drawSnake();

    // Agendamento do próximo ciclo de jogo
    gameLoopTimeout = setTimeout(gameLoop, snakeSpeed);
    
    // Agendamento do próximo ciclo de jogo primeira versão
    //requestAnimationFrame(gameLoop);
}

// Variável para armazenar o ID do setTimeout
let gameLoopTimeout;

// Inicialização do jogo
gameLoop();

// Ouvinte de eventos para capturar as teclas de seta
document.addEventListener("keydown", (event) => {
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


// ouvinte de eventos para redimensionamento da janela
window.addEventListener("resize", handleWindowResize);
