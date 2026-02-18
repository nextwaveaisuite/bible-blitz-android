/**
 * Level Progression System
 * Manages player levels, difficulty scaling, and progression
 */

class LevelSystem {
    constructor(config) {
        this.config = config.levels;
        this.currentLevel = this.loadLevel() || 1;
        this.currentLevelData = this.getLevelData(this.currentLevel);
        this.questionsCorrectThisLevel = 0;
        this.totalQuestionsThisLevel = 0;
        
        // Statistics
        this.stats = {
            highestLevel: this.currentLevel,
            totalLevelsCompleted: 0,
            totalGamesPlayed: 0
        };
        
        this.loadStats();
    }
    
    /**
     * Get configuration for a specific level
     */
    getLevelData(level) {
        const levelData = this.config.levelsConfig.find(l => l.level === level);
        return levelData || this.config.levelsConfig[0];
    }
    
    /**
     * Get current level number
     */
    getCurrentLevel() {
        return this.currentLevel;
    }
    
    /**
     * Get current level data
     */
    getCurrentLevelData() {
        return this.currentLevelData;
    }
    
    /**
     * Get time limit for current level
     */
    getTimeLimit() {
        return this.currentLevelData.timeLimit;
    }
    
    /**
     * Get difficulty for current level
     */
    getDifficulty() {
        return this.currentLevelData.difficulty;
    }
    
    /**
     * Get coin multiplier for current level
     */
    getCoinMultiplier() {
        return this.currentLevelData.coinMultiplier;
    }
    
    /**
     * Record a question answer
     */
    recordAnswer(correct) {
        this.totalQuestionsThisLevel++;
        if (correct) {
            this.questionsCorrectThisLevel++;
        }
    }
    
    /**
     * Check if player can advance to next level
     */
    canAdvance() {
        if (this.totalQuestionsThisLevel < this.config.questionsPerLevel) {
            return false;
        }
        
        const accuracy = this.questionsCorrectThisLevel / this.totalQuestionsThisLevel;
        const required = this.config.progressionRequirement / this.config.questionsPerLevel;
        
        return accuracy >= required;
    }
    
    /**
     * Get current progress percentage
     */
    getProgress() {
        if (this.totalQuestionsThisLevel === 0) return 0;
        return (this.questionsCorrectThisLevel / this.config.questionsPerLevel) * 100;
    }
    
    /**
     * Get questions needed to advance
     */
    getQuestionsNeeded() {
        const needed = this.config.progressionRequirement - this.questionsCorrectThisLevel;
        return Math.max(0, needed);
    }
    
    /**
     * Advance to next level
     */
    levelUp() {
        if (!this.canAdvance()) {
            return false;
        }
        
        if (this.currentLevel >= this.config.totalLevels) {
            // Already at max level
            this.resetLevelProgress();
            return false;
        }
        
        this.currentLevel++;
        this.currentLevelData = this.getLevelData(this.currentLevel);
        this.resetLevelProgress();
        
        // Update stats
        this.stats.totalLevelsCompleted++;
        if (this.currentLevel > this.stats.highestLevel) {
            this.stats.highestLevel = this.currentLevel;
        }
        
        this.saveLevel();
        this.saveStats();
        
        // Show level up animation
        this.showLevelUpAnimation();
        
        // Play level up sound
        if (window.audioManager) {
            window.audioManager.play('levelUp');
        }
        
        return true;
    }
    
    /**
     * Reset progress for current level
     */
    resetLevelProgress() {
        this.questionsCorrectThisLevel = 0;
        this.totalQuestionsThisLevel = 0;
    }
    
    /**
     * Start a new game
     */
    startGame() {
        this.stats.totalGamesPlayed++;
        this.saveStats();
    }
    
    /**
     * End current game and check for level up
     */
    endGame() {
        if (this.canAdvance()) {
            return this.levelUp();
        }
        return false;
    }
    
    /**
     * Get level name
     */
    getLevelName() {
        return this.currentLevelData.name;
    }
    
    /**
     * Check if at max level
     */
    isMaxLevel() {
        return this.currentLevel >= this.config.totalLevels;
    }
    
    /**
     * Get progress summary
     */
    getProgressSummary() {
        return {
            level: this.currentLevel,
            levelName: this.getLevelName(),
            difficulty: this.getDifficulty(),
            questionsCorrect: this.questionsCorrectThisLevel,
            questionsTotal: this.totalQuestionsThisLevel,
            questionsNeeded: this.getQuestionsNeeded(),
            progressPercent: this.getProgress(),
            canAdvance: this.canAdvance(),
            isMaxLevel: this.isMaxLevel(),
            timeLimit: this.getTimeLimit(),
            coinMultiplier: this.getCoinMultiplier()
        };
    }
    
    /**
     * Show level up animation
     */
    showLevelUpAnimation() {
        const levelUpDiv = document.createElement('div');
        levelUpDiv.className = 'level-up-animation';
        levelUpDiv.innerHTML = `
            <div class="level-up-content">
                <h1>🎉 LEVEL UP! 🎉</h1>
                <h2>Level ${this.currentLevel}</h2>
                <p>${this.getLevelName()}</p>
                <p class="level-up-difficulty">Difficulty: ${this.getDifficulty().toUpperCase()}</p>
                <p class="level-up-time">Time Limit: ${this.getTimeLimit()}s</p>
                <p class="level-up-multiplier">Coin Multiplier: ${this.getCoinMultiplier()}x</p>
            </div>
        `;
        
        levelUpDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.5s;
        `;
        
        document.body.appendChild(levelUpDiv);
        
        setTimeout(() => {
            levelUpDiv.style.animation = 'fadeOut 0.5s';
            setTimeout(() => {
                levelUpDiv.remove();
            }, 500);
        }, 3000);
    }
    
    /**
     * Update level display in UI
     */
    updateDisplay() {
        const levelDisplay = document.getElementById('level-display');
        if (levelDisplay) {
            levelDisplay.textContent = `Level ${this.currentLevel}: ${this.getLevelName()}`;
        }
        
        const progressBar = document.getElementById('level-progress-bar');
        if (progressBar) {
            const progress = this.getProgress();
            progressBar.style.width = `${progress}%`;
        }
        
        const progressText = document.getElementById('level-progress-text');
        if (progressText) {
            progressText.textContent = `${this.questionsCorrectThisLevel}/${this.config.progressionRequirement} to next level`;
        }
    }
    
    /**
     * Save level to localStorage
     */
    saveLevel() {
        try {
            localStorage.setItem('dailyBibleQuiz_level', this.currentLevel.toString());
            localStorage.setItem('dailyBibleQuiz_levelProgress', JSON.stringify({
                correct: this.questionsCorrectThisLevel,
                total: this.totalQuestionsThisLevel
            }));
        } catch (e) {
            console.warn('Could not save level to localStorage:', e);
        }
    }
    
    /**
     * Load level from localStorage
     */
    loadLevel() {
        try {
            const saved = localStorage.getItem('dailyBibleQuiz_level');
            const progress = localStorage.getItem('dailyBibleQuiz_levelProgress');
            
            if (progress) {
                const p = JSON.parse(progress);
                this.questionsCorrectThisLevel = p.correct || 0;
                this.totalQuestionsThisLevel = p.total || 0;
            }
            
            return saved ? parseInt(saved, 10) : null;
        } catch (e) {
            console.warn('Could not load level from localStorage:', e);
            return null;
        }
    }
    
    /**
     * Save statistics
     */
    saveStats() {
        try {
            localStorage.setItem('dailyBibleQuiz_levelStats', JSON.stringify(this.stats));
        } catch (e) {
            console.warn('Could not save stats to localStorage:', e);
        }
    }
    
    /**
     * Load statistics
     */
    loadStats() {
        try {
            const saved = localStorage.getItem('dailyBibleQuiz_levelStats');
            if (saved) {
                this.stats = { ...this.stats, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('Could not load stats from localStorage:', e);
        }
    }
    
    /**
     * Get statistics
     */
    getStats() {
        return {
            ...this.stats,
            currentLevel: this.currentLevel,
            currentLevelName: this.getLevelName()
        };
    }
    
    /**
     * Reset all progress (for testing or player request)
     */
    resetAll() {
        this.currentLevel = 1;
        this.currentLevelData = this.getLevelData(1);
        this.resetLevelProgress();
        this.stats = {
            highestLevel: 1,
            totalLevelsCompleted: 0,
            totalGamesPlayed: 0
        };
        this.saveLevel();
        this.saveStats();
    }
}

// Add CSS for level up animation
const style = document.createElement('style');
style.textContent = `
    .level-up-content {
        text-align: center;
        color: white;
        animation: scaleIn 0.5s ease-out;
    }
    
    .level-up-content h1 {
        font-size: 64px;
        margin: 0 0 20px 0;
        text-shadow: 0 0 20px #FFD700;
    }
    
    .level-up-content h2 {
        font-size: 48px;
        margin: 0 0 10px 0;
        color: #FFD700;
    }
    
    .level-up-content p {
        font-size: 24px;
        margin: 10px 0;
    }
    
    .level-up-difficulty {
        color: #FF6B6B;
        font-weight: bold;
    }
    
    .level-up-time {
        color: #4ECDC4;
    }
    
    .level-up-multiplier {
        color: #FFD700;
        font-weight: bold;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes scaleIn {
        from {
            transform: scale(0.5);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LevelSystem;
}
