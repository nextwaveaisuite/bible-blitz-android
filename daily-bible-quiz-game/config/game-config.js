// Bible Blitz - Enhanced Game Configuration v3.0.0
const GAME_CONFIG = {
    // Game Settings
    title: "Bible Blitz",
    subtitle: "Test Your Faith Daily",
    version: "3.0.0",
    
    // Canvas Settings
    canvas: {
        width: 1280,
        height: 765,
        backgroundColor: "#2c3e50"
    },
    
    // ===== NEW: DIFFICULTY LEVELS SYSTEM =====
    levels: {
        enabled: true,
        totalLevels: 12,
        currentLevel: 1,
        levelsConfig: [
            // Level 1-3: Beginner
            { level: 1, difficulty: "easy", timeLimit: 60, coinMultiplier: 1.0, name: "Beginner I" },
            { level: 2, difficulty: "easy", timeLimit: 55, coinMultiplier: 1.1, name: "Beginner II" },
            { level: 3, difficulty: "easy", timeLimit: 50, coinMultiplier: 1.2, name: "Beginner III" },
            
            // Level 4-6: Intermediate
            { level: 4, difficulty: "medium", timeLimit: 45, coinMultiplier: 1.3, name: "Intermediate I" },
            { level: 5, difficulty: "medium", timeLimit: 40, coinMultiplier: 1.4, name: "Intermediate II" },
            { level: 6, difficulty: "medium", timeLimit: 35, coinMultiplier: 1.5, name: "Intermediate III" },
            
            // Level 7-9: Advanced
            { level: 7, difficulty: "hard", timeLimit: 30, coinMultiplier: 1.6, name: "Advanced I" },
            { level: 8, difficulty: "hard", timeLimit: 27, coinMultiplier: 1.7, name: "Advanced II" },
            { level: 9, difficulty: "hard", timeLimit: 25, coinMultiplier: 1.8, name: "Advanced III" },
            
            // Level 10-12: Expert
            { level: 10, difficulty: "expert", timeLimit: 22, coinMultiplier: 2.0, name: "Expert I" },
            { level: 11, difficulty: "expert", timeLimit: 20, coinMultiplier: 2.2, name: "Expert II" },
            { level: 12, difficulty: "expert", timeLimit: 18, coinMultiplier: 2.5, name: "Master" }
        ],
        questionsPerLevel: 10,
        progressionRequirement: 7  // Need 7/10 correct to advance
    },
    
    // ===== NEW: COIN REWARD SYSTEM =====
    coins: {
        enabled: true,
        startingCoins: 5,  // Players start with 5 coins
        maxCoins: 999,
        
        // Coin earning rules
        earning: {
            graceWindow: 20,  // First 20 seconds - no decay
            
            // Time-based rewards (after grace window)
            tiers: [
                { maxTime: 20, coins: 3, label: "Lightning Fast! ⚡" },
                { maxTime: 35, coins: 2, label: "Quick! 🔥" },
                { maxTime: 50, coins: 1, label: "Good! ✓" },
                { maxTime: 999, coins: 0, label: "Too Slow..." }
            ],
            
            // Bonus coins
            streakBonus: 1,  // Extra coin for 3+ streak
            perfectGameBonus: 5  // Bonus for 10/10 correct
        },
        
        // Visual coin animation
        animation: {
            enabled: true,
            showCountdown: true,  // Show coin value counting down
            countdownStart: 20  // Start showing countdown after grace window
        }
    },
    
    // ===== NEW: HINTS SYSTEM =====
    hints: {
        enabled: true,
        types: [
            {
                id: "fifty_fifty",
                name: "50/50",
                description: "Remove 2 wrong answers",
                cost: 1,
                icon: "💡",
                effect: "remove_two_wrong"
            },
            {
                id: "scripture_clue",
                name: "Scripture Clue",
                description: "Show verse reference",
                cost: 2,
                icon: "📖",
                effect: "show_reference"
            },
            {
                id: "extra_time",
                name: "+10 Seconds",
                description: "Add 10 seconds to timer",
                cost: 1,
                icon: "⏰",
                effect: "add_time"
            }
        ],
        
        // Coin penalty for using hints
        coinPenalty: {
            enabled: true,
            reduction: 1,  // Reduce coin reward by 1 when hint used
            minimum: 0  // Never go below 0 coins
        }
    },
    
    // ===== NEW: SURVIVAL MODE =====
    survivalMode: {
        enabled: true,
        name: "Survival Mode",
        description: "One mistake and you're out!",
        icon: "💀",
        rules: {
            livesTotal: 1,
            wrongAnswerEndsGame: true,
            coinsMultiplier: 3.0,  // Triple coins in survival mode
            unlockLevel: 5  // Unlock after reaching level 5
        }
    },
    
    // ===== ENHANCED: DUAL SCORING SYSTEM =====
    scoring: {
        enabled: true,
        
        // Score Type 1: Correct Answers
        correctAnswer: 100,
        wrongAnswer: 0,
        streakBonus: 50,
        
        // Score Type 2: Time-Based Scoring
        timeScoring: {
            enabled: true,
            maxTimeBonus: 100,  // Maximum bonus points for speed
            formula: "linear",  // linear, exponential, or stepped
            
            // Time bonus tiers
            tiers: [
                { maxTime: 10, bonus: 100, label: "PERFECT!" },
                { maxTime: 20, bonus: 75, label: "EXCELLENT!" },
                { maxTime: 30, bonus: 50, label: "GREAT!" },
                { maxTime: 40, bonus: 25, label: "GOOD!" },
                { maxTime: 999, bonus: 0, label: "OK" }
            ]
        },
        
        // Final score calculation
        finalScore: {
            correctWeight: 0.6,  // 60% from correct answers
            timeWeight: 0.4  // 40% from time performance
        }
    },
    
    // ===== NEW: SOUND EFFECTS =====
    audio: {
        enabled: true,
        music: true,
        soundEffects: true,
        
        sounds: {
            // Game sounds
            correctAnswer: { file: "correct.mp3", volume: 0.7 },
            wrongAnswer: { file: "wrong.mp3", volume: 0.7 },
            coinEarned: { file: "coin.mp3", volume: 0.8 },
            hintUsed: { file: "hint.mp3", volume: 0.6 },
            levelUp: { file: "levelup.mp3", volume: 0.9 },
            gameOver: { file: "gameover.mp3", volume: 0.7 },
            
            // UI sounds
            buttonClick: { file: "click.mp3", volume: 0.5 },
            timerTick: { file: "tick.mp3", volume: 0.4 },
            timerWarning: { file: "warning.mp3", volume: 0.6 }
        },
        
        volume: {
            music: 0.5,
            effects: 0.7
        }
    },
    
    // ===== ENHANCED: DAILY STREAK REWARDS =====
    dailyChallenge: {
        enabled: true,
        resetTime: "00:00",
        
        streaks: {
            enabled: true,
            rewards: [
                { days: 1, coins: 5, bonus: "none", message: "Day 1! Keep going!" },
                { days: 3, coins: 10, bonus: "hint", message: "3 Day Streak! +1 Hint" },
                { days: 7, coins: 25, bonus: "power", message: "Week Streak! +Power Up" },
                { days: 14, coins: 50, bonus: "hint_pack", message: "2 Weeks! +3 Hints" },
                { days: 30, coins: 100, bonus: "premium_unlock", message: "MONTH STREAK! 🏆" },
                { days: 60, coins: 200, bonus: "master_badge", message: "60 Days! Master Badge!" },
                { days: 100, coins: 500, bonus: "legend", message: "LEGEND STATUS! 👑" }
            ],
            
            // Streak protection
            freezeAvailable: true,
            freezeCost: 10,  // Coins to freeze streak for 1 day
            maxFreezes: 3
        }
    },
    
    // Game Mechanics
    gameplay: {
        totalRevealBalls: 10,
        totalPlayers: 1,
        timePerQuestion: 30,  // Default, overridden by level
        questionsPerGame: 10,
        difficultyLevels: ["easy", "medium", "hard", "expert"],
        
        // Game modes
        modes: [
            {
                id: "classic",
                name: "Classic Mode",
                description: "Standard quiz gameplay",
                icon: "🎮",
                enabled: true
            },
            {
                id: "timed",
                name: "Timed Challenge",
                description: "Race against the clock",
                icon: "⏱️",
                enabled: true
            },
            {
                id: "survival",
                name: "Survival Mode",
                description: "One mistake = Game Over",
                icon: "💀",
                enabled: true,
                unlockLevel: 5
            },
            {
                id: "daily",
                name: "Daily Challenge",
                description: "Special daily questions",
                icon: "📅",
                enabled: true
            }
        ]
    },
    
    // Power System (kept for compatibility)
    power: {
        enabled: true,
        totalBadges: 3,
        powers: [
            {
                id: "double",
                name: "Double Points",
                value: 2,
                icon: "⭐",
                cost: 0,
                description: "Double your points for this question"
            },
            {
                id: "skip",
                name: "Skip Question",
                value: 1,
                icon: "⏭️",
                cost: 0,
                description: "Skip this question without penalty"
            },
            {
                id: "hint",
                name: "50/50 Hint",
                value: 1,
                icon: "💡",
                cost: 1,  // Now costs 1 coin
                description: "Remove two wrong answers"
            }
        ]
    },
    
    // Text Customization
    text: {
        playButton: "PLAY NOW",
        settingsButton: "SETTINGS",
        howToPlayButton: "HOW TO PLAY",
        exitButton: "EXIT",
        shareButton: "SHARE SCORE",
        muteButton: "MUTE",
        fullscreenButton: "FULLSCREEN",
        correctFeedback: "Correct! ✓",
        wrongFeedback: "Wrong! ✗",
        gameOver: "Game Over!",
        finalScore: "Final Score:",
        playAgain: "Play Again",
        dailyChallenge: "Daily Challenge",
        
        // New text
        coins: "Coins:",
        level: "Level:",
        hints: "Hints",
        survivalMode: "Survival",
        streak: "Streak:",
        timeBonus: "Time Bonus:",
        accuracy: "Accuracy:"
    },
    
    // Share Settings
    share: {
        enabled: true,
        hashtag: "#DailyBibleQuiz",
        text: "I scored {score} points and reached Level {level} in Bible Blitz! Can you beat my score?",
        url: window.location.href,
        platforms: ["facebook", "twitter", "whatsapp", "telegram", "reddit", "linkedin"]
    },
    
    // Visual Settings
    visual: {
        theme: "purple",
        ballColors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F"],
        animations: true,
        particles: true,
        
        // New visual elements
        coinAnimation: true,
        timerAnimation: true,
        levelProgressBar: true
    },
    
    // Exit URL
    exitUrl: "https://www.example.com",
    
    // Ads Configuration
    ads: {
        enabled: true,
        banner: true,
        interstitial: true,
        interstitialFrequency: 3,
        bannerId: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
        interstitialId: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX"
    },
    
    // Premium Content
    premium: {
        enabled: true,
        packs: [
            {
                id: "old_testament",
                name: "Old Testament Pack",
                price: "$2.99",
                questions: 50,
                icon: "📜"
            },
            {
                id: "new_testament",
                name: "New Testament Pack",
                price: "$2.99",
                questions: 50,
                icon: "✝️"
            },
            {
                id: "jesus_life",
                name: "Life of Jesus Pack",
                price: "$3.99",
                questions: 75,
                icon: "🙏"
            }
        ],
        adFreePrice: "$4.99"
    },
    
    // Viral Mechanics
    viral: {
        shareToUnlock: true,
        shareReward: "coins",  // Now rewards coins
        shareCoins: 10,
        shareMessage: "Share to earn 10 bonus coins!"
    },
    
    // Donation Button
    donation: {
        enabled: true,
        text: "❤️ Support Ministry",
        url: "https://www.example.com/donate",
        message: "Help us spread God's Word!"
    },
    
    // ===== NEW: STATISTICS TRACKING =====
    stats: {
        enabled: true,
        track: [
            "totalGamesPlayed",
            "totalQuestionsAnswered",
            "totalCorrectAnswers",
            "totalCoinsEarned",
            "highestLevel",
            "longestStreak",
            "fastestAnswer",
            "perfectGames"
        ]
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_CONFIG;
}
