// Daily Challenge System
class DailyChallenge {
    constructor(config) {
        this.config = config;
        this.storageKey = 'dailyBibleQuiz_challenge';
        this.init();
    }
    
    init() {
        this.checkReset();
    }
    
    // Check if daily challenge needs to be reset
    checkReset() {
        const today = this.getTodayString();
        const saved = this.loadChallenge();
        
        if (!saved || saved.date !== today) {
            this.resetChallenge(today);
        }
    }
    
    // Get today's date as string (YYYY-MM-DD)
    getTodayString() {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }
    
    // Reset daily challenge
    resetChallenge(date) {
        const challenge = {
            date: date,
            completed: false,
            score: 0,
            attempts: 0,
            streak: this.getStreak()
        };
        
        this.saveChallenge(challenge);
        return challenge;
    }
    
    // Load challenge from localStorage
    loadChallenge() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading challenge:', e);
            return null;
        }
    }
    
    // Save challenge to localStorage
    saveChallenge(challenge) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(challenge));
        } catch (e) {
            console.error('Error saving challenge:', e);
        }
    }
    
    // Get current challenge status
    getStatus() {
        return this.loadChallenge();
    }
    
    // Check if today's challenge is completed
    isCompleted() {
        const challenge = this.loadChallenge();
        return challenge && challenge.completed;
    }
    
    // Complete today's challenge
    complete(score) {
        const challenge = this.loadChallenge();
        if (challenge) {
            challenge.completed = true;
            challenge.score = Math.max(challenge.score, score);
            challenge.attempts++;
            this.saveChallenge(challenge);
            this.updateStreak(true);
        }
    }
    
    // Get current streak
    getStreak() {
        try {
            const streakData = localStorage.getItem('dailyBibleQuiz_streak');
            if (streakData) {
                const data = JSON.parse(streakData);
                const yesterday = this.getYesterdayString();
                const today = this.getTodayString();
                
                // Check if streak is still valid
                if (data.lastDate === yesterday || data.lastDate === today) {
                    return data.count;
                }
            }
        } catch (e) {
            console.error('Error getting streak:', e);
        }
        return 0;
    }
    
    // Update streak
    updateStreak(completed) {
        try {
            const today = this.getTodayString();
            const yesterday = this.getYesterdayString();
            const streakData = localStorage.getItem('dailyBibleQuiz_streak');
            
            let streak = { count: 0, lastDate: null };
            
            if (streakData) {
                streak = JSON.parse(streakData);
            }
            
            if (completed) {
                if (streak.lastDate === yesterday) {
                    // Continue streak
                    streak.count++;
                } else if (streak.lastDate !== today) {
                    // Start new streak
                    streak.count = 1;
                }
                streak.lastDate = today;
            } else {
                // Streak broken
                if (streak.lastDate !== yesterday && streak.lastDate !== today) {
                    streak.count = 0;
                    streak.lastDate = null;
                }
            }
            
            localStorage.setItem('dailyBibleQuiz_streak', JSON.stringify(streak));
            return streak.count;
        } catch (e) {
            console.error('Error updating streak:', e);
            return 0;
        }
    }
    
    // Get yesterday's date string
    getYesterdayString() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    }
    
    // Get time until next reset
    getTimeUntilReset() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const diff = tomorrow - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return { hours, minutes, total: diff };
    }
    
    // Format time until reset
    formatTimeUntilReset() {
        const time = this.getTimeUntilReset();
        return `${time.hours}h ${time.minutes}m`;
    }
    
    // Get challenge summary for display
    getSummary() {
        const challenge = this.loadChallenge();
        const streak = this.getStreak();
        const timeUntilReset = this.formatTimeUntilReset();
        
        return {
            date: challenge ? challenge.date : this.getTodayString(),
            completed: challenge ? challenge.completed : false,
            score: challenge ? challenge.score : 0,
            attempts: challenge ? challenge.attempts : 0,
            streak: streak,
            timeUntilReset: timeUntilReset
        };
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DailyChallenge;
}
