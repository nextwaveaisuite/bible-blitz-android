/**
 * Streak System
 * Manages daily streaks and rewards
 */

class StreakSystem {
    constructor(config, coinSystem) {
        this.config = config.dailyChallenge.streaks;
        this.coinSystem = coinSystem;
        this.currentStreak = 0;
        this.longestStreak = 0;
        this.lastPlayDate = null;
        this.freezesUsed = 0;
        this.freezeActive = false;
        
        this.loadStreak();
        this.checkStreak();
    }
    
    /**
     * Check and update streak status
     */
    checkStreak() {
        const today = this.getToday();
        const yesterday = this.getYesterday();
        
        if (!this.lastPlayDate) {
            // First time playing
            this.currentStreak = 0;
            return;
        }
        
        if (this.lastPlayDate === today) {
            // Already played today
            return;
        }
        
        if (this.lastPlayDate === yesterday) {
            // Played yesterday, continue streak
            return;
        }
        
        // Check if freeze is active
        if (this.freezeActive) {
            this.freezeActive = false;
            this.saveStreak();
            return;
        }
        
        // Streak broken
        this.currentStreak = 0;
        this.saveStreak();
    }
    
    /**
     * Record today's play
     */
    recordPlay() {
        const today = this.getToday();
        
        if (this.lastPlayDate === today) {
            // Already recorded today
            return false;
        }
        
        // Increment streak
        this.currentStreak++;
        
        // Update longest streak
        if (this.currentStreak > this.longestStreak) {
            this.longestStreak = this.currentStreak;
        }
        
        this.lastPlayDate = today;
        this.saveStreak();
        
        // Check for rewards
        const reward = this.checkReward();
        if (reward) {
            this.giveReward(reward);
        }
        
        return true;
    }
    
    /**
     * Check if player earned a reward
     */
    checkReward() {
        if (!this.config.enabled) return null;
        
        // Find matching reward
        const reward = this.config.rewards.find(r => r.days === this.currentStreak);
        return reward || null;
    }
    
    /**
     * Give reward to player
     */
    giveReward(reward) {
        // Award coins
        if (reward.coins > 0) {
            this.coinSystem.earnCoins(reward.coins, `${reward.days} Day Streak!`);
        }
        
        // Show reward message
        this.showRewardMessage(reward);
        
        // Play celebration sound
        if (window.audioManager) {
            window.audioManager.play('levelUp');
        }
    }
    
    /**
     * Show reward message
     */
    showRewardMessage(reward) {
        const rewardDiv = document.createElement('div');
        rewardDiv.className = 'streak-reward-message';
        rewardDiv.innerHTML = `
            <div class="streak-reward-content">
                <h1>🔥 STREAK REWARD! 🔥</h1>
                <h2>${reward.days} Day Streak!</h2>
                <p class="reward-message">${reward.message}</p>
                <p class="reward-coins">+${reward.coins} Coins 🪙</p>
                ${reward.bonus !== 'none' ? `<p class="reward-bonus">Bonus: ${reward.bonus}</p>` : ''}
            </div>
        `;
        
        rewardDiv.style.cssText = `
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
        
        document.body.appendChild(rewardDiv);
        
        setTimeout(() => {
            rewardDiv.style.animation = 'fadeOut 0.5s';
            setTimeout(() => {
                rewardDiv.remove();
            }, 500);
        }, 4000);
    }
    
    /**
     * Use a streak freeze
     */
    useFreeze() {
        if (!this.config.freezeAvailable) {
            return { success: false, message: "Freeze not available" };
        }
        
        if (this.freezesUsed >= this.config.maxFreezes) {
            return { success: false, message: "No freezes left!" };
        }
        
        if (!this.coinSystem.canAfford(this.config.freezeCost)) {
            return { success: false, message: `Need ${this.config.freezeCost} coins!` };
        }
        
        if (!this.coinSystem.spendCoins(this.config.freezeCost, "Streak Freeze")) {
            return { success: false, message: "Could not spend coins" };
        }
        
        this.freezeActive = true;
        this.freezesUsed++;
        this.saveStreak();
        
        return {
            success: true,
            message: "Streak frozen for 1 day!",
            freezesLeft: this.config.maxFreezes - this.freezesUsed
        };
    }
    
    /**
     * Get current streak
     */
    getCurrentStreak() {
        return this.currentStreak;
    }
    
    /**
     * Get longest streak
     */
    getLongestStreak() {
        return this.longestStreak;
    }
    
    /**
     * Get freezes remaining
     */
    getFreezesRemaining() {
        return this.config.maxFreezes - this.freezesUsed;
    }
    
    /**
     * Check if played today
     */
    hasPlayedToday() {
        return this.lastPlayDate === this.getToday();
    }
    
    /**
     * Get today's date string
     */
    getToday() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }
    
    /**
     * Get yesterday's date string
     */
    getYesterday() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    }
    
    /**
     * Update streak display
     */
    updateDisplay() {
        const streakDisplay = document.getElementById('streak-display');
        if (streakDisplay) {
            streakDisplay.textContent = `🔥 ${this.currentStreak} Day Streak`;
        }
        
        const longestDisplay = document.getElementById('longest-streak-display');
        if (longestDisplay) {
            longestDisplay.textContent = `Best: ${this.longestStreak} days`;
        }
    }
    
    /**
     * Save streak to localStorage
     */
    saveStreak() {
        try {
            const data = {
                currentStreak: this.currentStreak,
                longestStreak: this.longestStreak,
                lastPlayDate: this.lastPlayDate,
                freezesUsed: this.freezesUsed,
                freezeActive: this.freezeActive
            };
            localStorage.setItem('dailyBibleQuiz_streak', JSON.stringify(data));
        } catch (e) {
            console.warn('Could not save streak:', e);
        }
    }
    
    /**
     * Load streak from localStorage
     */
    loadStreak() {
        try {
            const saved = localStorage.getItem('dailyBibleQuiz_streak');
            if (saved) {
                const data = JSON.parse(saved);
                this.currentStreak = data.currentStreak || 0;
                this.longestStreak = data.longestStreak || 0;
                this.lastPlayDate = data.lastPlayDate || null;
                this.freezesUsed = data.freezesUsed || 0;
                this.freezeActive = data.freezeActive || false;
            }
        } catch (e) {
            console.warn('Could not load streak:', e);
        }
    }
    
    /**
     * Get streak info
     */
    getStreakInfo() {
        return {
            current: this.currentStreak,
            longest: this.longestStreak,
            playedToday: this.hasPlayedToday(),
            freezesRemaining: this.getFreezesRemaining(),
            freezeActive: this.freezeActive,
            nextReward: this.getNextReward()
        };
    }
    
    /**
     * Get next reward milestone
     */
    getNextReward() {
        if (!this.config.enabled) return null;
        
        const nextReward = this.config.rewards.find(r => r.days > this.currentStreak);
        return nextReward || null;
    }
}

// Add CSS
const style = document.createElement('style');
style.textContent = `
    .streak-reward-content {
        text-align: center;
        color: white;
        animation: scaleIn 0.5s ease-out;
    }
    
    .streak-reward-content h1 {
        font-size: 64px;
        margin: 0 0 20px 0;
        text-shadow: 0 0 20px #FF6B6B;
        animation: pulse 2s infinite;
    }
    
    .streak-reward-content h2 {
        font-size: 48px;
        margin: 0 0 20px 0;
        color: #FFD700;
    }
    
    .reward-message {
        font-size: 28px;
        margin: 20px 0;
    }
    
    .reward-coins {
        font-size: 36px;
        color: #FFD700;
        font-weight: bold;
        margin: 20px 0;
    }
    
    .reward-bonus {
        font-size: 24px;
        color: #4ECDC4;
        margin: 10px 0;
    }
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StreakSystem;
}
