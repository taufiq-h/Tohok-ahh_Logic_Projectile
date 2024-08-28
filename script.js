document.addEventListener('DOMContentLoaded', () => {
    const startMenu = document.getElementById('start-menu');
    const gameContainer = document.getElementById('game-container');
    const retryMenu = document.getElementById('retry-menu');
    const startButton = document.getElementById('start-button');
    const retryButton = document.getElementById('retry-button');
    const player = document.getElementById('player');
    const enemy = document.getElementById('enemy');
    const scoreDisplay = document.getElementById('score');
    const finalScore = document.getElementById('final-score');
    const timeDisplay = document.getElementById('time');
    let score = 0;
    let bullets = [];
    let keys = {};
    let gameInterval;
    let bulletInterval;
    let enemyInterval;
    let moveBulletsInterval;
    let difficultyInterval;
    let timeInterval;
    let bulletSpeed = 2;
    let numBullets = 20;
    let gameTime = 0;

    startButton.addEventListener('click', startGame);
    retryButton.addEventListener('click', startGame);

    document.addEventListener('keydown', (event) => {
        keys[event.key] = true;
    });

    document.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    });

    function startGame() {
        startMenu.style.display = 'none';
        retryMenu.style.display = 'none';
        gameContainer.style.display = 'block';
        score = 0;
        gameTime = 0;
        scoreDisplay.textContent = 'Score: ' + score;
        timeDisplay.textContent = 'Time: 0:00';
        bullets = [];
        player.style.top = '580px';
        player.style.left = '50%';
        enemy.style.top = '20px';
        enemy.style.left = '50%';
        bulletSpeed = 2;
        numBullets = 20;

        clearInterval(gameInterval);
        clearInterval(bulletInterval);
        clearInterval(enemyInterval);
        clearInterval(moveBulletsInterval);
        clearInterval(difficultyInterval);
        clearInterval(timeInterval);

        gameInterval = setInterval(movePlayer, 20);
        bulletInterval = setInterval(randomPattern, 1000);
        enemyInterval = setInterval(moveEnemy, 2000);
        moveBulletsInterval = setInterval(moveBullets, 20);
        difficultyInterval = setInterval(increaseDifficulty, 10000); // Increase difficulty every 10 seconds
        timeInterval = setInterval(updateTime, 1000); // Update time every second
    }

    function endGame() {
        clearInterval(gameInterval);
        clearInterval(bulletInterval);
        clearInterval(enemyInterval);
        clearInterval(moveBulletsInterval);
        clearInterval(difficultyInterval);
        clearInterval(timeInterval);
        bullets.forEach(bullet => bullet.remove());
        bullets = [];
        gameContainer.style.display = 'none';
        finalScore.textContent = 'Your final score: ' + score;
        retryMenu.style.display = 'flex';
    }

    function movePlayer() {
        const playerRect = player.getBoundingClientRect();
        const containerRect = gameContainer.getBoundingClientRect();

        if (keys['ArrowUp'] && playerRect.top > containerRect.top) {
            player.style.top = player.offsetTop - 5 + 'px';
        }
        if (keys['ArrowDown'] && playerRect.bottom < containerRect.bottom) {
            player.style.top = player.offsetTop + 5 + 'px';
        }
        if (keys['ArrowLeft'] && playerRect.left > containerRect.left) {
            player.style.left = player.offsetLeft - 5 + 'px';
        }
        if (keys['ArrowRight'] && playerRect.right < containerRect.right) {
            player.style.left = player.offsetLeft + 5 + 'px';
        }

        const enemyRect = enemy.getBoundingClientRect();
        if (
            playerRect.left < enemyRect.right &&
            playerRect.right > enemyRect.left &&
            playerRect.top < enemyRect.bottom &&
            playerRect.bottom > enemyRect.top
        ) {
            endGame();
        }
    }

    function moveEnemy() {
        const containerRect = gameContainer.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();

        const newTop = Math.random() * (containerRect.height - enemyRect.height);
        const newLeft = Math.random() * (containerRect.width - enemyRect.width);

        enemy.style.top = newTop + 'px';
        enemy.style.left = newLeft + 'px';
    }

    function createBullet(angle, speed) {
        const bullet = document.createElement('div');
        bullet.classList.add('bullet');
        bullet.style.top = enemy.offsetTop + enemy.offsetHeight / 2 + 'px';
        bullet.style.left = enemy.offsetLeft + enemy.offsetWidth / 2 - 5 + 'px';

        bullet.dx = Math.cos(angle) * speed;
        bullet.dy = Math.sin(angle) * speed;

        gameContainer.appendChild(bullet);
        bullets.push(bullet);
    }

    function createBulletPattern() {
        const angleStep = (2 * Math.PI) / numBullets;

        for (let i = 0; i < numBullets; i++) {
            const angle = i * angleStep;
            const speed = bulletSpeed + Math.random(); // Random speed with base speed
            createBullet(angle, speed);
        }
    }

    function createSpiralPattern() {
        const angleStep = (2 * Math.PI) / numBullets;
        let angle = 0;

        for (let i = 0; i < numBullets; i++) {
            const speed = bulletSpeed + Math.random(); // Random speed with base speed
            createBullet(angle, speed);
            angle += angleStep;
        }
    }

    function createRandomPattern() {
        for (let i = 0; i < numBullets; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const speed = bulletSpeed + Math.random(); // Random speed with base speed
            createBullet(angle, speed);
        }
    }

    function createWavePattern() {
        const angleStep = (Math.PI / 4) / numBullets; // Spread bullets in a wave

        for (let i = -numBullets / 2; i < numBullets / 2; i++) {
            const angle = Math.PI / 2 + i * angleStep; // Bullets spread horizontally
            const speed = bulletSpeed + Math.random(); // Random speed with base speed
            createBullet(angle, speed);
        }
    }

    function createCirclePattern() {
        const angleStep = (2 * Math.PI) / numBullets;

        for (let i = 0; i < numBullets; i++) {
            const angle = i * angleStep;
            const speed = bulletSpeed + Math.random(); // Random speed with base speed
            createBullet(angle, speed);
        }
    }

    function createDirectedPattern() {
        const playerRect = player.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();
        const dx = (playerRect.left + playerRect.width / 2) - (enemyRect.left + enemyRect.width / 2);
        const dy = (playerRect.top + playerRect.height / 2) - (enemyRect.top + enemyRect.height / 2);
        const angle = Math.atan2(dy, dx);

        for (let i = 0; i < numBullets; i++) {
            const speed = bulletSpeed + Math.random(); // Random speed with base speed
            createBullet(angle, speed);
        }
    }

    function moveBullets() {
        bullets.forEach((bullet, index) => {
            bullet.style.left = bullet.offsetLeft + bullet.dx + 'px';
            bullet.style.top = bullet.offsetTop + bullet.dy + 'px';

            if (bullet.offsetTop > gameContainer.offsetHeight || bullet.offsetLeft > gameContainer.offsetWidth || bullet.offsetLeft < 0 || bullet.offsetTop < 0) {
                bullet.remove();
                bullets.splice(index, 1);
                score++;
                scoreDisplay.textContent = 'Score: ' + score;
            }

            const bulletRect = bullet.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();

            if (
                bulletRect.left < playerRect.right &&
                bulletRect.right > playerRect.left &&
                bulletRect.top < playerRect.bottom &&
                bulletRect.bottom > playerRect.top
            ) {
                endGame();
            }
        });
    }

    function randomPattern() {
        const patterns = [createBulletPattern, createSpiralPattern, createRandomPattern, createWavePattern, createCirclePattern, createDirectedPattern];
        const randomIndex = Math.floor(Math.random() * patterns.length);
        patterns[randomIndex]();
    }

    function increaseDifficulty() {
        bulletSpeed += 0.5; // Increase bullet speed
        numBullets += 5; // Increase number of bullets
    }

    function updateTime() {
        gameTime++;
        const minutes = Math.floor(gameTime / 60);
        const seconds = gameTime % 60;
        timeDisplay.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
});