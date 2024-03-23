class SnakeGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.boxSize = 20;
        this.snake = [{ x: 0, y: 0 }];
        this.direction = "right";
        this.maxLength = 5;
        this.snakeSpeed = 150;
        this.gameLoopTimeout = null; // Initialize with null
        this.food = { x: 0, y: 0 }; // Initial position of the food
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

    generateFood() {
        // Generates random coordinates for the food within the boundaries of the canvas
        this.food.x = Math.floor(Math.random() * (this.canvas.width / this.boxSize)) * this.boxSize;
        this.food.y = Math.floor(Math.random() * (this.canvas.height / this.boxSize)) * this.boxSize;
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

        // Check if the snake's head has reached the food
        if (cabeçaDaCobra.x === this.food.x && cabeçaDaCobra.y === this.food.y) {
            // Generates new food and increases the size of the snake
            this.generateFood();
            this.maxLength++;
        }

        this.drawSnake();

        // Draw the food
        this.ctx.fillStyle = "#F00";
        this.ctx.fillRect(this.food.x, this.food.y, this.boxSize, this.boxSize);

        // Scheduling the next game cycle
        this.gameLoopTimeout = setTimeout(() => this.updateSnake(), this.snakeSpeed);
    }

    checkCollision() {
        const cabeçaDaCobra = this.snake[0];
        return (
            cabeçaDaCobra.x < 0 || cabeçaDaCobra.x >= this.canvas.width ||
            cabeçaDaCobra.y < 0 || cabeçaDaCobra.y >= this.canvas.height ||
            this.checkSelfCollision()
        );
    }

    checkSelfCollision() {
        const cabeçaDaCobra = this.snake[0];
        for (let i = 1; i < this.snake.length; i++) {
            if (cabeçaDaCobra.x === this.snake[i].x && cabeçaDaCobra.y === this.snake[i].y) {
                return true;
            }
        }
        return false;
    }

    gameOver() {
        const messageElement = document.getElementById("message");
        messageElement.innerHTML = "Game Over! Pressione Espaço para jogar novamente.";
        messageElement.style.display = "block";
        messageElement.style.color =  "#FFFFFF";
        document.removeEventListener("keydown", this.handleKeyPress);
        setTimeout(() => {
            document.addEventListener("keydown", this.handleKeyPress);
        }, 100);
    }

    resetGame() {
        this.snake = [{ x: 0, y: 0 }];
        this.direction = "right";
        this.snakeSpeed = 150;
        clearTimeout(this.gameLoopTimeout);
        const messageElement = document.getElementById("message");
        messageElement.style.display = "none";
        messageElement.innerHTML = "";
        document.removeEventListener("keydown", this.handleKeyPress);
        document.addEventListener("keydown", this.handleKeyPress);
        setTimeout(() => {
            this.gameLoop();
        }, 100);
    }

    gameLoop() {
        this.generateFood();
        this.updateSnake();
    }

    handleKeyPress = (event) => {
        if (event.key === " ") {
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

// Starts the game
const snakeGame = new SnakeGame("snakeCanvas");
snakeGame.init();
