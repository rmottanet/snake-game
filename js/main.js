class SnakeGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.boxSize = 20;
        this.snake = [{ x: 0, y: 0 }];
        this.direction = "right";
        this.maxLength = 5;
        this.snakeSpeed = 150;
        this.gameLoopTimeout = null; // Inicializamos com null
    }

    drawSnake() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.snake.length; i++) {
            this.ctx.fillStyle = i === 0 ? "#00F" : "#0F0";
            this.ctx.fillRect(this.snake[i].x, this.snake[i].y, this.boxSize, this.boxSize);
            this.ctx.strokeStyle = "#000";
            this.ctx.strokeRect(this.snake[i].x, this.snake[i].y, this.boxSize, this.boxSize);
        }
    }

    updateSnake() {
        const cabeçaDaCobra = { x: this.snake[0].x, y: this.snake[0].y };

        switch (this.direction) {
            case "up":
                cabeçaDaCobra.y -= this.boxSize;
                break;
            case "down":
                cabeçaDaCobra.y += this.boxSize;
                break;
            case "left":
                cabeçaDaCobra.x -= this.boxSize;
                break;
            case "right":
                cabeçaDaCobra.x += this.boxSize;
                break;
        }

        this.snake.unshift(cabeçaDaCobra);

        if (this.snake.length > this.maxLength) {
            this.snake.pop();
        }

        if (this.checkCollision()) {
            this.gameOver();
            return;
        }

        this.drawSnake();

        // Agendamento do próximo ciclo de jogo
        this.gameLoopTimeout = setTimeout(() => this.updateSnake(), this.snakeSpeed);
    }

    checkCollision() {
        const cabeçaDaCobra = this.snake[0];
        return (
            cabeçaDaCobra.x < 0 || cabeçaDaCobra.x >= this.canvas.width ||
            cabeçaDaCobra.y < 0 || cabeçaDaCobra.y >= this.canvas.height
        );
    }

gameOver() {
        const messageElement = document.getElementById("message");
        
        // Define o conteúdo da mensagem
        messageElement.innerHTML = "Game Over! Pressione Espaço para jogar novamente.";

        // Exibe a mensagem
        messageElement.style.display = "block";
    
    
    // Remove o ouvinte de eventos "keydown" antes de adicionar novamente
    document.removeEventListener("keydown", this.handleKeyPress);
    
    // Adiciona o ouvinte de eventos "keydown" novamente após um breve intervalo
    setTimeout(() => {
        document.addEventListener("keydown", this.handleKeyPress);
    }, 100);

    // Aqui você pode adicionar lógica adicional, se necessário
}


    resetGame() {
        this.snake = [{ x: 0, y: 0 }];
        this.direction = "right";
        this.snakeSpeed = 150;
        clearTimeout(this.gameLoopTimeout);

        // Oculta a mensagem
        // Oculta e remove o conteúdo da mensagem
        const messageElement = document.getElementById("message");
        messageElement.style.display = "none";
        messageElement.innerHTML = "";
        
        // Remova o ouvinte de eventos "keydown" antes de adicionar novamente
        document.removeEventListener("keydown", this.handleKeyPress);

        // Adicione o ouvinte de eventos "keydown" novamente antes de iniciar o loop
        document.addEventListener("keydown", this.handleKeyPress);

        // Inicie o loop do jogo após um breve intervalo
        setTimeout(() => {
            this.gameLoop();
        }, 100);
    }



    gameLoop() {
        this.updateSnake();
    }

    handleKeyPress = (event) => {
        if (event.key === " ") { // Espaço
            this.resetGame();
        } else if (event.key.startsWith("Arrow") && this.isValidDirection(event.key.slice(5).toLowerCase())) {
            this.direction = event.key.slice(5).toLowerCase();
        }
    }
    
    isValidDirection(newDirection) {
        return (
            (this.direction === "up" && newDirection !== "down") ||
            (this.direction === "down" && newDirection !== "up") ||
            (this.direction === "left" && newDirection !== "right") ||
            (this.direction === "right" && newDirection !== "left")
        );
    }

    init() {
        this.resizeCanvas();
        this.gameLoop();
        document.addEventListener("keydown", (event) => this.handleKeyPress(event));
        window.addEventListener("resize", () => this.resizeCanvas());
    }

    resizeCanvas() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        this.canvas.width = windowWidth;
        this.canvas.height = windowHeight;

        const documentWidth = document.documentElement.clientWidth;
        const documentHeight = document.documentElement.clientHeight;

        if (documentWidth > windowWidth) {
            this.canvas.width = documentWidth;
        }

        if (documentHeight > windowHeight) {
            this.canvas.height = documentHeight;
        }

        this.maxLength = Math.floor(Math.min(windowWidth, windowHeight) / this.boxSize);
    }
}

// Inicializa o jogo
const snakeGame = new SnakeGame("snakeCanvas");
snakeGame.init();
