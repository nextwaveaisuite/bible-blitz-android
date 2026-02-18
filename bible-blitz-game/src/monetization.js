// Monetization System (Ads, Premium Content, Donations)
class Monetization {
    constructor(config) {
        this.config = config;
        this.gamesPlayed = 0;
        this.adShownCount = 0;
        this.isPremium = false;
        this.init();
    }
    
    init() {
        this.checkPremiumStatus();
        this.loadAdCount();
    }
    
    // Check if user has purchased premium (ad-free)
    checkPremiumStatus() {
        try {
            const premium = localStorage.getItem('dailyBibleQuiz_premium');
            this.isPremium = premium === 'true';
        } catch (e) {
            console.error('Error checking premium status:', e);
        }
    }
    
    // Load ad count from storage
    loadAdCount() {
        try {
            const count = localStorage.getItem('dailyBibleQuiz_adCount');
            this.adShownCount = count ? parseInt(count) : 0;
        } catch (e) {
            console.error('Error loading ad count:', e);
        }
    }
    
    // Save ad count to storage
    saveAdCount() {
        try {
            localStorage.setItem('dailyBibleQuiz_adCount', this.adShownCount.toString());
        } catch (e) {
            console.error('Error saving ad count:', e);
        }
    }
    
    // Show banner ad placeholder
    showBannerAd() {
        if (this.isPremium || !this.config.ads.enabled || !this.config.ads.banner) {
            return;
        }
        
        // Create banner ad placeholder
        const existingBanner = document.getElementById('bannerAd');
        if (existingBanner) {
            existingBanner.style.display = 'block';
            return;
        }
        
        const banner = document.createElement('div');
        banner.id = 'bannerAd';
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
        `;
        banner.innerHTML = `
            <div style="text-align:center;">
                <div style="font-weight:bold;">📱 Ad Space Available</div>
                <div style="font-size:11px;opacity:0.8;">Replace with AdMob Banner ID: ${this.config.ads.bannerId}</div>
            </div>
        `;
        document.body.appendChild(banner);
        
        console.log('Banner ad placeholder shown');
    }
    
    // Hide banner ad
    hideBannerAd() {
        const banner = document.getElementById('bannerAd');
        if (banner) {
            banner.style.display = 'none';
        }
    }
    
    // Show interstitial ad placeholder
    showInterstitialAd(callback) {
        if (this.isPremium || !this.config.ads.enabled || !this.config.ads.interstitial) {
            if (callback) callback();
            return;
        }
        
        this.gamesPlayed++;
        
        // Check if we should show interstitial
        if (this.gamesPlayed % this.config.ads.interstitialFrequency !== 0) {
            if (callback) callback();
            return;
        }
        
        // Create interstitial ad placeholder
        const interstitial = document.createElement('div');
        interstitial.id = 'interstitialAd';
        interstitial.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            z-index: 10000;
        `;
        
        interstitial.innerHTML = `
            <div style="text-align:center;max-width:400px;padding:40px;">
                <h2 style="margin:0 0 20px 0;font-size:32px;">📺 Interstitial Ad</h2>
                <p style="margin:0 0 30px 0;font-size:18px;opacity:0.8;">
                    Replace with AdMob Interstitial ID:<br>
                    <code style="background:rgba(255,255,255,0.1);padding:5px 10px;border-radius:5px;display:inline-block;margin-top:10px;">
                        ${this.config.ads.interstitialId}
                    </code>
                </p>
                <div id="adTimer" style="font-size:48px;margin:20px 0;">5</div>
                <button id="skipAd" disabled style="padding:15px 40px;font-size:18px;background:#666;color:white;border:none;border-radius:5px;cursor:not-allowed;">
                    Skip Ad
                </button>
            </div>
        `;
        
        document.body.appendChild(interstitial);
        
        // Countdown timer
        let countdown = 5;
        const timerEl = document.getElementById('adTimer');
        const skipBtn = document.getElementById('skipAd');
        
        const timer = setInterval(() => {
            countdown--;
            timerEl.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(timer);
                skipBtn.disabled = false;
                skipBtn.style.background = '#4CAF50';
                skipBtn.style.cursor = 'pointer';
                skipBtn.textContent = 'Continue';
            }
        }, 1000);
        
        skipBtn.onclick = () => {
            if (countdown <= 0) {
                document.body.removeChild(interstitial);
                this.adShownCount++;
                this.saveAdCount();
                if (callback) callback();
            }
        };
        
        console.log('Interstitial ad placeholder shown');
    }
    
    // Show donation dialog
    showDonationDialog() {
        if (!this.config.donation.enabled) return;
        
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 10001;
            max-width: 400px;
            text-align: center;
        `;
        
        dialog.innerHTML = `
            <h2 style="margin:0 0 15px 0;color:#333;font-size:28px;">${this.config.donation.text}</h2>
            <p style="margin:0 0 25px 0;color:#666;font-size:16px;line-height:1.5;">
                ${this.config.donation.message}
            </p>
            <div style="display:flex;gap:10px;justify-content:center;">
                <a href="${this.config.donation.url}" target="_blank" 
                   style="padding:15px 30px;background:#4CAF50;color:white;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;">
                    Donate Now
                </a>
                <button onclick="this.parentElement.parentElement.nextElementSibling.remove();this.parentElement.parentElement.remove()" 
                        style="padding:15px 30px;background:#999;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold;font-size:16px;">
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
    
    // Show premium content dialog
    showPremiumDialog() {
        if (!this.config.premium.enabled) return;
        
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 10001;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        let packsHTML = this.config.premium.packs.map(pack => `
            <div style="padding:20px;margin:10px 0;background:#f5f5f5;border-radius:10px;text-align:left;">
                <div style="font-size:32px;margin-bottom:10px;">${pack.icon}</div>
                <div style="font-weight:bold;font-size:18px;color:#333;margin-bottom:5px;">${pack.name}</div>
                <div style="color:#666;margin-bottom:10px;">${pack.questions} Questions</div>
                <div style="font-weight:bold;font-size:20px;color:#4CAF50;">${pack.price}</div>
            </div>
        `).join('');
        
        dialog.innerHTML = `
            <h2 style="margin:0 0 20px 0;color:#333;font-size:28px;">🎁 Premium Content</h2>
            <p style="margin:0 0 20px 0;color:#666;font-size:16px;">
                Unlock more Bible questions and remove ads!
            </p>
            
            <div style="padding:20px;margin:10px 0;background:#FFD700;border-radius:10px;text-align:left;">
                <div style="font-weight:bold;font-size:18px;color:#333;margin-bottom:5px;">⭐ Ad-Free Experience</div>
                <div style="color:#666;margin-bottom:10px;">Remove all advertisements</div>
                <div style="font-weight:bold;font-size:20px;color:#333;">${this.config.premium.adFreePrice}</div>
            </div>
            
            ${packsHTML}
            
            <div style="margin-top:20px;padding:15px;background:#e3f2fd;border-radius:10px;">
                <p style="margin:0;color:#1976d2;font-size:14px;">
                    💡 Note: This is a placeholder. Integrate with Google Play Billing or Huawei IAP for actual purchases.
                </p>
            </div>
            
            <button onclick="this.parentElement.nextElementSibling.remove();this.parentElement.remove()" 
                    style="margin-top:20px;padding:15px 40px;background:#999;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold;font-size:16px;width:100%;">
                Close
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
    
    // Get monetization stats
    getStats() {
        return {
            gamesPlayed: this.gamesPlayed,
            adsShown: this.adShownCount,
            isPremium: this.isPremium
        };
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Monetization;
}
