/**
 * Survival Mode Manager
 * One mistake = Game Over
 */

class SurvivalMode {
    constructor(config) {
        this.config = config.survivalMode;
        this.active = false;
        this.lives = 0;
        this.questionsAnswered = 0;
        this.highScore = this.loadHighScore() || 0;
    }
    
    /**
     * Check if survival mode is unlocked
     */
    isUnlocked(currentLevel) {
        return currentLevel >= this.config.rules.unlockLevel;
    }
    
    /**
     * Start survival mode
     */
    start() {
        if (!this.config.enabled) {
            return { success: false, message: "Survival mode not enabled" };
        }
        
        this.active = true;
        this.lives = this.config.rules.livesTotal;
        this.questionsAnswered = 0;
        
        return {
            success: true,
            message: "Survival Mode Started!",
            lives: this.lives
        };
    }
    
    /**
     * End survival mode
     */
    end() {
        this.active = false;
        
        // Update high score
        if (this.questionsAnswered > this.highScore) {
            this.highScore = this.questionsAnswered;
            this.saveHighScore();
            return { newRecord: true, score: this.highScore };
        }
        
        return { newRecord: false, score: this.questionsAnswered };
    }
    
    /**
     * Record an answer
     */
    recordAnswer(correct) {
        if (!this.active) return { gameOver: false };
        
        if (correct) {
            this.questionsAnswered++;
            return {
                gameOver: false,
                questionsAnswered: this.questionsAnswered,
                message: `${this.questionsAnswered} correct! Keep going!`
            };
        } else {
            // Wrong answer in survival mode
            if (this.config.rules.wrongAnswerEndsGame) {
                return {
                    gameOver: true,
                    finalScore: this.questionsAnswered,
                    message: "Game Over! One mistake ends it all!"
                };
            } else {
                this.lives--;
                if (this.lives <= 0) {
                    return {
                        gameOver: true,
                        finalScore: this.questionsAnswered,
                        message: "Game Over! No lives left!"
                    };
                }
                return {
                    gameOver: false,
                    lives: this.lives,
                    message: `Wrong! ${this.lives} lives remaining`
                };
            }
        }
    }
    
    /**
     * Get coin multiplier for survival mode
     */
    getCoinMultiplier() {
        return this.active ? this.config.rules.coinsMultiplier : 1.0;
    }
    
    /**
     * Check if survival mode is active
     */
    isActive() {
        return this.active;
    }
    
    /**
     * Get current stats
     */
    getStats() {
        return {
            active: this.active,
            lives: this.lives,
            questionsAnswered: this.questionsAnswered,
            highScore: this.highScore
        };
    }
    
    /**
     * Get high score
     */
    getHighScore() {
        return this.highScore;
    }
    
    /**
     * Show survival mode UI
     */
    showSurvivalUI() {
        const survivalDiv = document.createElement('div');
        survivalDiv.id = 'survival-mode-indicator';
        survivalDiv.className = 'survival-mode-indicator';
        survivalDiv.innerHTML = `
            <div class="survival-header">
                <span class="survival-icon">💀</span>
                <span class="survival-text">SURVIVAL MODE</span>
                <span class="survival-icon">💀</span>
            </div>
            <div class="survival-stats">
                <span class="survival-questions">Questions: <span id="survival-count">0</span></span>
                <span class="survival-record">Record: ${this.highScore}</span>
            </div>
        `;
        
        survivalDiv.style.cssText = `
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FF0000 0%, #8B0000 100%);
            border: 3px solid #FFD700;
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            text-align: center;
            z-index: 1000;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
            animation: pulse 2s infinite;
        `;
        
        return survivalDiv;
    }
    
    /**
     * Update survival UI
     */
    updateUI() {
        const countElement = document.getElementById('survival-count');
        if (countElement) {
            countElement.textContent = this.questionsAnswered;
        }
    }
    
    /**
     * Show game over screen
     */
    showGameOver(finalScore, newRecord) {
        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'survival-game-over';
        gameOverDiv.innerHTML = `
            <div class="survival-game-over-content">
                <h1>💀 GAME OVER 💀</h1>
                <h2>Survival Mode Ended</h2>
                <p class="final-score">Questions Answered: ${finalScore}</p>
                ${newRecord ? '<p class="new-record">🏆 NEW RECORD! 🏆</p>' : ''}
                <p class="high-score">Best: ${this.highScore}</p>
                <button id="survival-retry" class="survival-button">Try Again</button>
                <button id="survival-exit" class="survival-button">Exit</button>
            </div>
        `;
        
        gameOverDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.5s;
        `;
        
        document.body.appendChild(gameOverDiv);
        
        // Add event listeners
        document.getElementById('survival-retry')?.addEventListener('click', () => {
            gameOverDiv.remove();
            this.start();
            if (window.game) {
                window.game.restart();
            }
        });
        
        document.getElementById('survival-exit')?.addEventListener('click', () => {
            gameOverDiv.remove();
            this.end();
            if (window.game) {
                window.game.returnToMenu();
            }
        });
    }
    
    /**
     * Save high score
     */
    saveHighScore() {
        try {
            localStorage.setItem('dailyBibleQuiz_survivalHighScore', this.highScore.toString());
        } catch (e) {
            console.warn('Could not save survival high score:', e);
        }
    }
    
    /**
     * Load high score
     */
    loadHighScore() {
        try {
            const saved = localStorage.getItem('dailyBibleQuiz_survivalHighScore');
            return saved ? parseInt(saved, 10) : 0;
        } catch (e) {
            return 0;
        }
    }
}

// Add CSS
const style = document.createElement('style');
style.textContent = `
    .survival-mode-indicator {
        font-family: Arial, sans-serif;
    }
    
    .survival-header {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
    }
    
    .survival-icon {
        font-size: 28px;
        animation: shake 1s infinite;
    }
    
    .survival-stats {
        display: flex;
        justify-content: space-around;
        gap: 20px;
        font-size: 16px;
    }
    
    .survival-game-over-content {
        text-align: center;
        color: white;
        padding: 40px;
        animation: scaleIn 0.5s ease-out;
    }
    
    .survival-game-over-content h1 {
        font-size: 72px;
        margin: 0 0 20px 0;
        color: #FF0000;
        text-shadow: 0 0 20px #FF0000;
    }
    
    .survival-game-over-content h2 {
        font-size: 36px;
        margin: 0 0 30px 0;
    }
    
    .final-score {
        font-size: 32px;
        margin: 20px 0;
        color: #FFD700;
        font-weight: bold;
    }
    
    .new-record {
        font-size: 40px;
        margin: 20px 0;
        color: #FFD700;
        animation: pulse 1s infinite;
    }
    
    .high-score {
        font-size: 24px;
        margin: 20px 0;
        color: #4ECDC4;
    }
    
    .survival-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: 2px solid #FFD700;
        color: white;
        padding: 15px 40px;
        margin: 10px;
        border-radius: 10px;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .survival-button:hover {
        transform: scale(1.1);
        box-shadow: 0 5px 15px rgba(255, 215, 0, 0.5);
    }
    
    @keyframes shake {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-10deg); }
        75% { transform: rotate(10deg); }
    }
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SurvivalMode;
}
