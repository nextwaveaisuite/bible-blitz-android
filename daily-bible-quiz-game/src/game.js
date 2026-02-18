// Main Game Logic
class BibleChallengeGame {
    constructor(stage, config) {
        this.stage = stage;
        this.config = config;
        this.container = new createjs.Container();
        this.stage.addChild(this.container);
        
        // Game state
        this.score = 0;
        this.currentQuestion = 0;
        this.streak = 0;
        this.questions = [];
        this.gameState = 'menu'; // menu, playing, gameover
        this.selectedAnswer = null;
        
        // UI reference
        this.ui = null;
        
        // Game objects
        this.balls = [];
        this.questionDisplay = null;
        this.answerButtons = [];
    }
    
    init(ui) {
        this.ui = ui;
        this.loadQuestions();
        this.showMenu();
        return this;
    }
    
    loadQuestions() {
        // Load mixed difficulty questions
        this.questions = getMixedQuestions(this.config.gameplay.questionsPerGame);
    }
    
    showMenu() {
        this.gameState = 'menu';
        this.container.removeAllChildren();
        
        const width = this.config.canvas.width;
        const height = this.config.canvas.height;
        
        // Game title
        const title = new createjs.Text(
            this.config.title,
            'bold 72px Arial',
            '#ffffff'
        );
        title.x = width / 2;
        title.y = height / 2 - 150;
        title.textAlign = 'center';
        title.shadow = new createjs.Shadow('#000000', 3, 3, 10);
        this.container.addChild(title);
        
        // Subtitle
        const subtitle = new createjs.Text(
            this.config.subtitle,
            'bold 32px Arial',
            '#FFD700'
        );
        subtitle.x = width / 2;
        subtitle.y = height / 2 - 80;
        subtitle.textAlign = 'center';
        subtitle.shadow = new createjs.Shadow('#000000', 2, 2, 5);
        this.container.addChild(subtitle);
        
        // Play button
        const playButton = this.createMenuButton(
            this.config.text.playButton,
            width / 2,
            height / 2 + 50,
            this.startGame.bind(this)
        );
        this.container.addChild(playButton);
        
        // How to play button
        const howToPlayButton = this.createMenuButton(
            this.config.text.howToPlayButton,
            width / 2,
            height / 2 + 130,
            this.showHowToPlay.bind(this)
        );
        this.container.addChild(howToPlayButton);
    }
    
    createMenuButton(label, x, y, callback) {
        const button = new createjs.Container();
        
        // Button background
        const bg = new createjs.Shape();
        bg.graphics.beginFill('#4CAF50').drawRoundRect(-120, -30, 240, 60, 10);
        button.addChild(bg);
        
        // Button text
        const text = new createjs.Text(label, 'bold 28px Arial', '#ffffff');
        text.textAlign = 'center';
        text.textBaseline = 'middle';
        button.addChild(text);
        
        button.x = x;
        button.y = y;
        button.cursor = 'pointer';
        
        // Hover effect
        button.on('mouseover', function() {
            bg.graphics.clear().beginFill('#66BB6A').drawRoundRect(-120, -30, 240, 60, 10);
            button.scaleX = button.scaleY = 1.05;
        });
        
        button.on('mouseout', function() {
            bg.graphics.clear().beginFill('#4CAF50').drawRoundRect(-120, -30, 240, 60, 10);
            button.scaleX = button.scaleY = 1;
        });
        
        button.on('click', callback);
        
        return button;
    }
    
    showHowToPlay() {
        alert('HOW TO PLAY:\n\n1. Tap on reveal balls to uncover Bible questions\n2. Choose the correct answer from 4 options\n3. Earn points for correct answers\n4. Build streaks for bonus points\n5. Use power-ups to help you\n6. Share your score with friends!');
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.currentQuestion = 0;
        this.streak = 0;
        this.container.removeAllChildren();
        
        this.loadQuestions();
        this.createBalls();
        this.showQuestion();
    }
    
    createBalls() {
        const width = this.config.canvas.width;
        const ballCount = this.config.gameplay.totalRevealBalls;
        const colors = this.config.visual.ballColors;
        
        this.balls = [];
        
        for (let i = 0; i < ballCount; i++) {
            const ball = new createjs.Container();
            
            // Ball shape
            const shape = new createjs.Shape();
            const color = colors[i % colors.length];
            shape.graphics.beginFill(color).drawCircle(0, 0, 30);
            ball.addChild(shape);
            
            // Ball number
            const number = new createjs.Text((i + 1).toString(), 'bold 24px Arial', '#ffffff');
            number.textAlign = 'center';
            number.textBaseline = 'middle';
            ball.addChild(number);
            
            // Position balls in a row at the top
            ball.x = (width / (ballCount + 1)) * (i + 1);
            ball.y = 120;
            ball.cursor = 'pointer';
            ball.revealed = false;
            ball.index = i;
            
            // Click handler
            ball.on('click', () => this.revealBall(ball));
            
            // Hover effect
            ball.on('mouseover', function() {
                if (!ball.revealed) {
                    ball.scaleX = ball.scaleY = 1.2;
                }
            });
            
            ball.on('mouseout', function() {
                ball.scaleX = ball.scaleY = 1;
            });
            
            this.container.addChild(ball);
            this.balls.push(ball);
        }
    }
    
    revealBall(ball) {
        if (ball.revealed || this.gameState !== 'playing') return;
        
        ball.revealed = true;
        
        // Animate ball reveal
        createjs.Tween.get(ball)
            .to({ scaleX: 1.5, scaleY: 1.5, alpha: 0.5 }, 300, createjs.Ease.backOut);
        
        // Show next question
        this.showQuestion();
    }
    
    showQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.endGame();
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        const width = this.config.canvas.width;
        const height = this.config.canvas.height;
        
        // Clear previous question display
        if (this.questionDisplay) {
            this.container.removeChild(this.questionDisplay);
        }
        this.answerButtons.forEach(btn => this.container.removeChild(btn));
        this.answerButtons = [];
        
        this.questionDisplay = new createjs.Container();
        
        // Question background
        const bg = new createjs.Shape();
        bg.graphics.beginFill('rgba(0,0,0,0.7)').drawRoundRect(0, 0, width - 100, 400, 10);
        bg.x = 50;
        bg.y = 200;
        this.questionDisplay.addChild(bg);
        
        // Question text
        const questionText = new createjs.Text(
            question.question,
            'bold 32px Arial',
            '#ffffff'
        );
        questionText.x = width / 2;
        questionText.y = 240;
        questionText.textAlign = 'center';
        questionText.lineWidth = width - 150;
        this.questionDisplay.addChild(questionText);
        
        // Category and verse
        const info = new createjs.Text(
            `${question.category} - ${question.verse}`,
            '18px Arial',
            '#FFD700'
        );
        info.x = width / 2;
        info.y = 300;
        info.textAlign = 'center';
        this.questionDisplay.addChild(info);
        
        this.container.addChild(this.questionDisplay);
        
        // Create answer buttons
        const buttonWidth = (width - 150) / 2 - 20;
        const buttonHeight = 60;
        const startY = 360;
        
        for (let i = 0; i < question.answers.length; i++) {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = 70 + col * (buttonWidth + 40);
            const y = startY + row * (buttonHeight + 20);
            
            const button = this.createAnswerButton(
                question.answers[i],
                x,
                y,
                buttonWidth,
                buttonHeight,
                i
            );
            
            this.container.addChild(button);
            this.answerButtons.push(button);
        }
        
        // Update UI
        this.ui.updateQuestionCounter(this.currentQuestion + 1, this.questions.length);
    }
    
    createAnswerButton(text, x, y, width, height, index) {
        const button = new createjs.Container();
        
        // Button background
        const bg = new createjs.Shape();
        bg.graphics.beginFill('#3498db').drawRoundRect(0, 0, width, height, 5);
        button.addChild(bg);
        
        // Button text
        const label = new createjs.Text(text, 'bold 20px Arial', '#ffffff');
        label.x = width / 2;
        label.y = height / 2;
        label.textAlign = 'center';
        label.textBaseline = 'middle';
        label.lineWidth = width - 20;
        button.addChild(label);
        
        button.x = x;
        button.y = y;
        button.cursor = 'pointer';
        button.answerIndex = index;
        
        // Hover effect
        button.on('mouseover', function() {
            bg.graphics.clear().beginFill('#5dade2').drawRoundRect(0, 0, width, height, 5);
        });
        
        button.on('mouseout', function() {
            bg.graphics.clear().beginFill('#3498db').drawRoundRect(0, 0, width, height, 5);
        });
        
        button.on('click', () => this.checkAnswer(index, button, bg, width, height));
        
        return button;
    }
    
    checkAnswer(selectedIndex, button, bg, width, height) {
        if (this.selectedAnswer !== null) return;
        
        this.selectedAnswer = selectedIndex;
        const question = this.questions[this.currentQuestion];
        const isCorrect = selectedIndex === question.correct;
        
        // Visual feedback
        if (isCorrect) {
            bg.graphics.clear().beginFill('#4CAF50').drawRoundRect(0, 0, width, height, 5);
            this.score += this.config.scoring.correctAnswer;
            this.streak++;
            
            // Streak bonus
            if (this.streak >= 3) {
                this.score += this.config.scoring.streakBonus;
            }
        } else {
            bg.graphics.clear().beginFill('#e74c3c').drawRoundRect(0, 0, width, height, 5);
            this.streak = 0;
            
            // Show correct answer
            this.answerButtons.forEach((btn, i) => {
                if (i === question.correct) {
                    const correctBg = btn.children[0];
                    correctBg.graphics.clear().beginFill('#4CAF50').drawRoundRect(0, 0, width, height, 5);
                }
            });
        }
        
        this.ui.updateScore(this.score);
        
        // Move to next question after delay
        setTimeout(() => {
            this.selectedAnswer = null;
            this.currentQuestion++;
            this.showQuestion();
        }, 1500);
    }
    
    endGame() {
        this.gameState = 'gameover';
        this.container.removeAllChildren();
        
        const width = this.config.canvas.width;
        const height = this.config.canvas.height;
        
        // Game over title
        const title = new createjs.Text(
            this.config.text.gameOver,
            'bold 64px Arial',
            '#ffffff'
        );
        title.x = width / 2;
        title.y = height / 2 - 150;
        title.textAlign = 'center';
        title.shadow = new createjs.Shadow('#000000', 3, 3, 10);
        this.container.addChild(title);
        
        // Final score
        const scoreText = new createjs.Text(
            `${this.config.text.finalScore} ${this.score}`,
            'bold 48px Arial',
            '#FFD700'
        );
        scoreText.x = width / 2;
        scoreText.y = height / 2 - 50;
        scoreText.textAlign = 'center';
        scoreText.shadow = new createjs.Shadow('#000000', 2, 2, 5);
        this.container.addChild(scoreText);
        
        // Play again button
        const playAgainButton = this.createMenuButton(
            this.config.text.playAgain,
            width / 2,
            height / 2 + 50,
            this.startGame.bind(this)
        );
        this.container.addChild(playAgainButton);
        
        // Share button
        const shareButton = this.createMenuButton(
            this.config.text.shareButton,
            width / 2,
            height / 2 + 130,
            () => this.ui.showShareDialog(this.score)
        );
        this.container.addChild(shareButton);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BibleChallengeGame;
}
