// Viral Mechanics System (Share-to-Unlock)
class ViralMechanics {
    constructor(config) {
        this.config = config;
        this.shareCount = 0;
        this.unlockedRewards = [];
        this.init();
    }
    
    init() {
        this.loadShareData();
    }
    
    // Load share data from localStorage
    loadShareData() {
        try {
            const data = localStorage.getItem('dailyBibleQuiz_shares');
            if (data) {
                const parsed = JSON.parse(data);
                this.shareCount = parsed.count || 0;
                this.unlockedRewards = parsed.rewards || [];
            }
        } catch (e) {
            console.error('Error loading share data:', e);
        }
    }
    
    // Save share data to localStorage
    saveShareData() {
        try {
            const data = {
                count: this.shareCount,
                rewards: this.unlockedRewards,
                lastShare: new Date().toISOString()
            };
            localStorage.setItem('dailyBibleQuiz_shares', JSON.stringify(data));
        } catch (e) {
            console.error('Error saving share data:', e);
        }
    }
    
    // Show share-to-unlock dialog
    showShareToUnlockDialog(callback) {
        if (!this.config.viral.shareToUnlock) {
            if (callback) callback(false);
            return;
        }
        
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            z-index: 10001;
            max-width: 400px;
            text-align: center;
            color: white;
        `;
        
        dialog.innerHTML = `
            <div style="font-size:64px;margin-bottom:20px;">🎁</div>
            <h2 style="margin:0 0 15px 0;font-size:28px;">Unlock Bonus Power!</h2>
            <p style="margin:0 0 25px 0;font-size:16px;opacity:0.9;line-height:1.5;">
                ${this.config.viral.shareMessage}
            </p>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <button id="shareToUnlockBtn" 
                        style="padding:15px 30px;background:white;color:#667eea;border:none;border-radius:8px;cursor:pointer;font-weight:bold;font-size:16px;">
                    📤 Share Now
                </button>
                <button id="skipShareBtn" 
                        style="padding:15px 30px;background:rgba(255,255,255,0.2);color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;">
                    Maybe Later
                </button>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
        
        // Share button handler
        document.getElementById('shareToUnlockBtn').onclick = () => {
            this.showShareOptions(() => {
                this.recordShare();
                this.showRewardUnlocked();
                document.body.removeChild(dialog);
                document.body.removeChild(overlay);
                if (callback) callback(true);
            });
        };
        
        // Skip button handler
        document.getElementById('skipShareBtn').onclick = () => {
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
            if (callback) callback(false);
        };
    }
    
    // Show share options
    showShareOptions(callback) {
        const shareDialog = document.createElement('div');
        shareDialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 10002;
            max-width: 400px;
        `;
        
        const shareText = this.config.share.text.replace('{score}', 'amazing');
        const shareUrl = encodeURIComponent(this.config.share.url);
        const shareTextEncoded = encodeURIComponent(shareText);
        
        shareDialog.innerHTML = `
            <h3 style="margin:0 0 20px 0;color:#333;font-size:24px;">Share Your Score</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" 
                   style="padding:15px;background:#1877f2;color:white;text-decoration:none;border-radius:8px;text-align:center;font-weight:bold;">
                    Facebook
                </a>
                <a href="https://twitter.com/intent/tweet?text=${shareTextEncoded}&url=${shareUrl}" target="_blank"
                   style="padding:15px;background:#1da1f2;color:white;text-decoration:none;border-radius:8px;text-align:center;font-weight:bold;">
                    Twitter
                </a>
                <a href="https://wa.me/?text=${shareTextEncoded}%20${shareUrl}" target="_blank"
                   style="padding:15px;background:#25d366;color:white;text-decoration:none;border-radius:8px;text-align:center;font-weight:bold;">
                    WhatsApp
                </a>
                <a href="https://t.me/share/url?url=${shareUrl}&text=${shareTextEncoded}" target="_blank"
                   style="padding:15px;background:#0088cc;color:white;text-decoration:none;border-radius:8px;text-align:center;font-weight:bold;">
                    Telegram
                </a>
            </div>
            <button onclick="this.parentElement.nextElementSibling.remove();this.parentElement.remove()" 
                    style="margin-top:20px;padding:15px;background:#999;color:white;border:none;border-radius:8px;cursor:pointer;width:100%;">
                I've Shared
            </button>
        `;
        
        const overlay2 = document.createElement('div');
        overlay2.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10001;
        `;
        
        document.body.appendChild(overlay2);
        document.body.appendChild(shareDialog);
        
        // When user clicks "I've Shared"
        shareDialog.querySelector('button').onclick = () => {
            document.body.removeChild(shareDialog);
            document.body.removeChild(overlay2);
            if (callback) callback();
        };
    }
    
    // Show reward unlocked animation
    showRewardUnlocked() {
        const reward = document.createElement('div');
        reward.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(255,215,0,0.5);
            z-index: 10003;
            text-align: center;
            color: white;
            animation: rewardPop 0.5s ease-out forwards;
        `;
        
        // Add animation keyframes
        if (!document.getElementById('rewardAnimation')) {
            const style = document.createElement('style');
            style.id = 'rewardAnimation';
            style.textContent = `
                @keyframes rewardPop {
                    0% { transform: translate(-50%, -50%) scale(0); }
                    50% { transform: translate(-50%, -50%) scale(1.1); }
                    100% { transform: translate(-50%, -50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        reward.innerHTML = `
            <div style="font-size:80px;margin-bottom:20px;">⭐</div>
            <h2 style="margin:0 0 10px 0;font-size:32px;">Reward Unlocked!</h2>
            <p style="margin:0;font-size:18px;opacity:0.9;">
                You've earned a bonus power-up!
            </p>
        `;
        
        document.body.appendChild(reward);
        
        setTimeout(() => {
            reward.style.transition = 'opacity 0.3s';
            reward.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(reward);
            }, 300);
        }, 2000);
    }
    
    // Record a share
    recordShare() {
        this.shareCount++;
        
        // Award reward based on config
        if (this.config.viral.shareReward === 'power') {
            this.unlockedRewards.push({
                type: 'power',
                timestamp: new Date().toISOString()
            });
        }
        
        this.saveShareData();
    }
    
    // Check if user has unlocked rewards
    hasUnlockedRewards() {
        return this.unlockedRewards.length > 0;
    }
    
    // Get share statistics
    getStats() {
        return {
            shareCount: this.shareCount,
            unlockedRewards: this.unlockedRewards.length,
            lastShare: this.getLastShareDate()
        };
    }
    
    // Get last share date
    getLastShareDate() {
        try {
            const data = localStorage.getItem('dailyBibleQuiz_shares');
            if (data) {
                const parsed = JSON.parse(data);
                return parsed.lastShare || null;
            }
        } catch (e) {
            console.error('Error getting last share date:', e);
        }
        return null;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ViralMechanics;
}
