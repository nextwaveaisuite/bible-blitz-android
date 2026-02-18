// Enhanced UI with Daily Challenge and Monetization Features
class EnhancedUI {
    constructor(stage, config, dailyChallenge, monetization) {
        this.stage = stage;
        this.config = config;
        this.dailyChallenge = dailyChallenge;
        this.monetization = monetization;
    }
    
    // Show enhanced main menu with daily challenge info
    showMainMenu(onPlay, onHowToPlay) {
        const overlay = document.createElement('div');
        overlay.id = 'mainMenuOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            color: white;
        `;
        
        const challengeStatus = this.dailyChallenge.getSummary();
        const streakEmoji = challengeStatus.streak > 0 ? '🔥' : '📅';
        
        overlay.innerHTML = `
            <div style="text-align:center;max-width:600px;padding:40px;">
                <h1 style="font-size:64px;margin:0 0 10px 0;text-shadow:0 4px 10px rgba(0,0,0,0.3);">
                    ${this.config.title}
                </h1>
                <p style="font-size:24px;margin:0 0 40px 0;opacity:0.9;">
                    ${this.config.subtitle}
                </p>
                
                <!-- Daily Challenge Card -->
                <div style="background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);padding:30px;border-radius:20px;margin-bottom:30px;box-shadow:0 8px 20px rgba(0,0,0,0.2);">
                    <div style="font-size:48px;margin-bottom:15px;">${streakEmoji}</div>
                    <h3 style="margin:0 0 10px 0;font-size:24px;">Daily Challenge</h3>
                    ${challengeStatus.completed ? 
                        `<p style="margin:0;font-size:18px;">✅ Completed! Score: ${challengeStatus.score}</p>
                         <p style="margin:10px 0 0 0;font-size:14px;opacity:0.8;">Next challenge in ${challengeStatus.timeUntilReset}</p>` :
                        `<p style="margin:0;font-size:18px;">🎯 Ready to play!</p>`
                    }
                    ${challengeStatus.streak > 0 ? 
                        `<p style="margin:10px 0 0 0;font-size:16px;"><strong>${challengeStatus.streak} Day Streak!</strong></p>` : 
                        ''
                    }
                </div>
                
                <!-- Play Button -->
                <button id="playButton" style="
                    padding:20px 60px;
                    font-size:28px;
                    font-weight:bold;
                    background:white;
                    color:#667eea;
                    border:none;
                    border-radius:50px;
                    cursor:pointer;
                    box-shadow:0 8px 20px rgba(0,0,0,0.3);
                    transition:transform 0.2s, box-shadow 0.2s;
                    margin-bottom:20px;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    ${this.config.text.playButton}
                </button>
                
                <!-- Secondary Buttons -->
                <div style="display:flex;gap:15px;justify-content:center;flex-wrap:wrap;">
                    <button id="howToPlayButton" style="
                        padding:12px 30px;
                        font-size:16px;
                        background:rgba(255,255,255,0.2);
                        color:white;
                        border:2px solid white;
                        border-radius:25px;
                        cursor:pointer;
                        transition:background 0.2s;
                    " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                        ${this.config.text.howToPlayButton}
                    </button>
                    
                    ${this.config.premium.enabled ? `
                    <button id="premiumButton" style="
                        padding:12px 30px;
                        font-size:16px;
                        background:linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                        color:white;
                        border:none;
                        border-radius:25px;
                        cursor:pointer;
                        font-weight:bold;
                        transition:transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        ⭐ Premium
                    </button>
                    ` : ''}
                    
                    ${this.config.donation.enabled ? `
                    <button id="donateButton" style="
                        padding:12px 30px;
                        font-size:16px;
                        background:rgba(255,255,255,0.2);
                        color:white;
                        border:2px solid white;
                        border-radius:25px;
                        cursor:pointer;
                        transition:background 0.2s;
                    " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                        ${this.config.donation.text}
                    </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Button handlers
        document.getElementById('playButton').onclick = () => {
            document.body.removeChild(overlay);
            if (onPlay) onPlay();
        };
        
        document.getElementById('howToPlayButton').onclick = () => {
            this.showHowToPlay();
        };
        
        if (this.config.premium.enabled) {
            document.getElementById('premiumButton').onclick = () => {
                this.monetization.showPremiumDialog();
            };
        }
        
        if (this.config.donation.enabled) {
            document.getElementById('donateButton').onclick = () => {
                this.monetization.showDonationDialog();
            };
        }
    }
    
    // Show how to play instructions
    showHowToPlay() {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 10001;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        dialog.innerHTML = `
            <h2 style="margin:0 0 20px 0;color:#333;font-size:32px;">📖 How to Play</h2>
            <div style="text-align:left;color:#666;font-size:16px;line-height:1.8;">
                <p><strong>🎯 Goal:</strong> Answer Bible questions correctly to score points!</p>
                
                <p><strong>🎮 Gameplay:</strong></p>
                <ul style="margin:10px 0;">
                    <li>Tap a reveal ball to see a question</li>
                    <li>Choose the correct answer from 4 options</li>
                    <li>Earn 100 points for each correct answer</li>
                    <li>Get streak bonuses for consecutive correct answers</li>
                </ul>
                
                <p><strong>📅 Daily Challenge:</strong></p>
                <ul style="margin:10px 0;">
                    <li>Complete the challenge once per day</li>
                    <li>Build your streak by playing daily</li>
                    <li>Resets at midnight</li>
                </ul>
                
                <p><strong>⭐ Power-Ups:</strong></p>
                <ul style="margin:10px 0;">
                    <li>Share your score to unlock bonus power-ups</li>
                    <li>Use power-ups to help with difficult questions</li>
                </ul>
                
                <p><strong>🏆 Tips:</strong></p>
                <ul style="margin:10px 0;">
                    <li>Read questions carefully</li>
                    <li>Check the verse reference for hints</li>
                    <li>Play daily to maintain your streak</li>
                </ul>
            </div>
            
            <button onclick="this.parentElement.nextElementSibling.remove();this.parentElement.remove()" 
                    style="margin-top:20px;padding:15px 40px;background:#667eea;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold;font-size:16px;width:100%;">
                Got It!
            </button>
        `;
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
        `;
        overlay.onclick = () => {
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
        };
        
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }
    
    // Show enhanced game over screen
    showGameOver(score, correctAnswers, totalQuestions, onPlayAgain, viral) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            color: white;
        `;
        
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : 'D';
        const emoji = percentage >= 90 ? '🏆' : percentage >= 70 ? '⭐' : percentage >= 50 ? '👍' : '💪';
        
        // Update daily challenge
        this.dailyChallenge.complete(score);
        
        overlay.innerHTML = `
            <div style="text-align:center;max-width:500px;padding:40px;">
                <div style="font-size:80px;margin-bottom:20px;">${emoji}</div>
                <h1 style="font-size:48px;margin:0 0 10px 0;">Game Over!</h1>
                
                <div style="background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);padding:30px;border-radius:20px;margin:30px 0;box-shadow:0 8px 20px rgba(0,0,0,0.2);">
                    <div style="font-size:64px;font-weight:bold;margin-bottom:10px;">${score}</div>
                    <div style="font-size:20px;opacity:0.9;">Final Score</div>
                    <div style="margin-top:20px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.3);">
                        <div style="font-size:18px;">Correct: ${correctAnswers}/${totalQuestions} (${percentage}%)</div>
                        <div style="font-size:32px;font-weight:bold;margin-top:10px;">Grade: ${grade}</div>
                    </div>
                </div>
                
                <div style="display:flex;flex-direction:column;gap:15px;width:100%;">
                    <button id="playAgainButton" style="
                        padding:20px 40px;
                        font-size:24px;
                        font-weight:bold;
                        background:white;
                        color:#667eea;
                        border:none;
                        border-radius:50px;
                        cursor:pointer;
                        box-shadow:0 8px 20px rgba(0,0,0,0.3);
                        transition:transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        Play Again
                    </button>
                    
                    <button id="shareScoreButton" style="
                        padding:15px 30px;
                        font-size:18px;
                        background:rgba(255,255,255,0.2);
                        color:white;
                        border:2px solid white;
                        border-radius:25px;
                        cursor:pointer;
                        transition:background 0.2s;
                    " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                        📤 Share Score (Unlock Reward!)
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Button handlers
        document.getElementById('playAgainButton').onclick = () => {
            // Show interstitial ad before playing again
            this.monetization.showInterstitialAd(() => {
                document.body.removeChild(overlay);
                if (onPlayAgain) onPlayAgain();
            });
        };
        
        document.getElementById('shareScoreButton').onclick = () => {
            viral.showShareToUnlockDialog((unlocked) => {
                if (unlocked) {
                    // User shared and unlocked reward
                    console.log('Reward unlocked!');
                }
            });
        };
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedUI;
}
