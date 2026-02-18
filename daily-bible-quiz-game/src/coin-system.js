/**
 * Coin System Manager
 * Handles coin earning, spending, and rewards
 */

class CoinSystem {
    constructor(config) {
        this.config = config.coins;
        this.currentCoins = this.loadCoins() || config.coins.startingCoins;
        this.questionStartTime = null;
        this.hintUsed = false;
        this.currentCoinReward = 0;
        this.graceWindowActive = true;
        
        // Statistics
        this.stats = {
            totalCoinsEarned: 0,
            totalCoinsSpent: 0,
            hintsUsed: 0
        };
    }
    
    /**
     * Start tracking time for a new question
     */
    startQuestion() {
        this.questionStartTime = Date.now();
        this.hintUsed = false;
        this.graceWindowActive = true;
        this.currentCoinReward = 3; // Start with max reward
        
        // Start grace window timer
        setTimeout(() => {
            this.graceWindowActive = false;
        }, this.config.earning.graceWindow * 1000);
    }
    
    /**
     * Calculate coin reward based on answer time
     * @param {boolean} correct - Was the answer correct?
     * @returns {object} - Reward info {coins, message, tier}
     */
    calculateReward(correct) {
        if (!correct) {
            return { coins: 0, message: "Wrong answer - No coins", tier: null };
        }
        
        const timeElapsed = (Date.now() - this.questionStartTime) / 1000;
        let coinReward = 0;
        let message = "";
        let tier = null;
        
        // Find the appropriate tier
        for (const t of this.config.earning.tiers) {
            if (timeElapsed <= t.maxTime) {
                coinReward = t.coins;
                message = t.label;
                tier = t;
                break;
            }
        }
        
        // Apply hint penalty if hint was used
        if (this.hintUsed && this.config.earning.coinPenalty) {
            const penalty = this.config.earning.coinPenalty.reduction;
            coinReward = Math.max(0, coinReward - penalty);
            message += " (Hint used: -" + penalty + " coin)";
        }
        
        return { coins: coinReward, message, tier, timeElapsed };
    }
    
    /**
     * Award coins to player
     * @param {number} amount - Number of coins to award
     * @param {string} reason - Reason for award (for display)
     */
    earnCoins(amount, reason = "") {
        if (amount <= 0) return;
        
        this.currentCoins = Math.min(
            this.currentCoins + amount,
            this.config.maxCoins
        );
        
        this.stats.totalCoinsEarned += amount;
        this.saveCoins();
        
        // Trigger coin animation
        this.triggerCoinAnimation(amount, reason);
        
        // Play coin sound
        if (window.audioManager) {
            window.audioManager.play('coinEarned');
        }
    }
    
    /**
     * Spend coins (for hints, power-ups, etc.)
     * @param {number} amount - Number of coins to spend
     * @param {string} reason - Reason for spending
     * @returns {boolean} - Success or failure
     */
    spendCoins(amount, reason = "") {
        if (this.currentCoins < amount) {
            this.showInsufficientCoinsMessage();
            return false;
        }
        
        this.currentCoins -= amount;
        this.stats.totalCoinsSpent += amount;
        this.saveCoins();
        
        // Play spend sound
        if (window.audioManager) {
            window.audioManager.play('hintUsed');
        }
        
        return true;
    }
    
    /**
     * Use a hint (costs coins)
     * @param {string} hintType - Type of hint to use
     * @returns {boolean} - Success or failure
     */
    useHint(hintType) {
        const hint = this.config.hints?.types.find(h => h.id === hintType);
        if (!hint) return false;
        
        if (!this.spendCoins(hint.cost, `Hint: ${hint.name}`)) {
            return false;
        }
        
        this.hintUsed = true;
        this.stats.hintsUsed++;
        
        return true;
    }
    
    /**
     * Get current coin count
     */
    getCoins() {
        return this.currentCoins;
    }
    
    /**
     * Get current coin reward for this question
     */
    getCurrentReward() {
        if (this.graceWindowActive) {
            return 3; // Max reward during grace window
        }
        
        const timeElapsed = (Date.now() - this.questionStartTime) / 1000;
        
        for (const tier of this.config.earning.tiers) {
            if (timeElapsed <= tier.maxTime) {
                return tier.coins;
            }
        }
        
        return 0;
    }
    
    /**
     * Check if player can afford something
     */
    canAfford(amount) {
        return this.currentCoins >= amount;
    }
    
    /**
     * Save coins to localStorage
     */
    saveCoins() {
        try {
            localStorage.setItem('dailyBibleQuiz_coins', this.currentCoins.toString());
            localStorage.setItem('dailyBibleQuiz_coinStats', JSON.stringify(this.stats));
        } catch (e) {
            console.warn('Could not save coins to localStorage:', e);
        }
    }
    
    /**
     * Load coins from localStorage
     */
    loadCoins() {
        try {
            const saved = localStorage.getItem('dailyBibleQuiz_coins');
            const savedStats = localStorage.getItem('dailyBibleQuiz_coinStats');
            
            if (savedStats) {
                this.stats = JSON.parse(savedStats);
            }
            
            return saved ? parseInt(saved, 10) : null;
        } catch (e) {
            console.warn('Could not load coins from localStorage:', e);
            return null;
        }
    }
    
    /**
     * Trigger coin animation
     */
    triggerCoinAnimation(amount, reason) {
        if (!this.config.animation.enabled) return;
        
        // Create floating coin text
        const coinText = document.createElement('div');
        coinText.className = 'coin-earned-animation';
        coinText.textContent = `+${amount} 🪙`;
        coinText.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            font-weight: bold;
            color: #FFD700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            animation: coinFloat 1.5s ease-out forwards;
            z-index: 10000;
            pointer-events: none;
        `;
        
        document.body.appendChild(coinText);
        
        setTimeout(() => {
            coinText.remove();
        }, 1500);
    }
    
    /**
     * Show insufficient coins message
     */
    showInsufficientCoinsMessage() {
        const message = document.createElement('div');
        message.className = 'insufficient-coins-message';
        message.textContent = 'Not enough coins! 🪙';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            z-index: 10000;
            animation: shake 0.5s;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    }
    
    /**
     * Update coin display in UI
     */
    updateDisplay() {
        const coinDisplay = document.getElementById('coin-counter');
        if (coinDisplay) {
            coinDisplay.textContent = `🪙 ${this.currentCoins}`;
        }
        
        // Update coin reward indicator
        if (this.config.animation.showCountdown && this.questionStartTime) {
            const rewardDisplay = document.getElementById('coin-reward-indicator');
            if (rewardDisplay) {
                const currentReward = this.getCurrentReward();
                rewardDisplay.textContent = `+${currentReward} 🪙`;
                rewardDisplay.style.opacity = currentReward > 0 ? '1' : '0.3';
            }
        }
    }
    
    /**
     * Reset for new game
     */
    reset() {
        this.questionStartTime = null;
        this.hintUsed = false;
        this.currentCoinReward = 0;
        this.graceWindowActive = true;
    }
    
    /**
     * Get statistics
     */
    getStats() {
        return {
            ...this.stats,
            currentCoins: this.currentCoins
        };
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes coinFloat {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -150%) scale(1.5);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
        25% { transform: translate(-50%, -50%) rotate(-5deg); }
        75% { transform: translate(-50%, -50%) rotate(5deg); }
    }
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CoinSystem;
}
