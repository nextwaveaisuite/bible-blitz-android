// UI and HUD Management
class GameUI {
    constructor(stage, config) {
        this.stage = stage;
        this.config = config;
        this.container = new createjs.Container();
        this.stage.addChild(this.container);
        
        this.scoreText = null;
        this.questionText = null;
        this.buttons = {};
    }
    
    init() {
        this.createHUD();
        this.createButtons();
        return this;
    }
    
    createHUD() {
        const width = this.config.canvas.width;
        const height = this.config.canvas.height;
        
        // Title
        const title = new createjs.Text(
            this.config.title,
            'bold 48px Arial',
            '#ffffff'
        );
        title.x = width / 2;
        title.y = 30;
        title.textAlign = 'center';
        title.shadow = new createjs.Shadow('#000000', 2, 2, 5);
        this.container.addChild(title);
        
        // Score display
        this.scoreText = new createjs.Text(
            'Score: 0',
            'bold 32px Arial',
            '#FFD700'
        );
        this.scoreText.x = width - 200;
        this.scoreText.y = 30;
        this.scoreText.textAlign = 'right';
        this.scoreText.shadow = new createjs.Shadow('#000000', 2, 2, 3);
        this.container.addChild(this.scoreText);
        
        // Question counter
        this.questionCounter = new createjs.Text(
            'Question: 1/10',
            'bold 24px Arial',
            '#ffffff'
        );
        this.questionCounter.x = 50;
        this.questionCounter.y = 30;
        this.questionCounter.shadow = new createjs.Shadow('#000000', 1, 1, 3);
        this.container.addChild(this.questionCounter);
    }
    
    createButtons() {
        const width = this.config.canvas.width;
        const height = this.config.canvas.height;
        const buttonY = height - 60;
        
        // Fullscreen button
        this.buttons.fullscreen = this.createButton(
            '⛶',
            50,
            buttonY,
            this.toggleFullscreen.bind(this)
        );
        
        // Mute button
        this.buttons.mute = this.createButton(
            '🔊',
            130,
            buttonY,
            this.toggleMute.bind(this)
        );
        
        // Exit button
        this.buttons.exit = this.createButton(
            '✕',
            width - 50,
            buttonY,
            this.exitGame.bind(this)
        );
    }
    
    createButton(label, x, y, callback) {
        const button = new createjs.Container();
        
        // Button background
        const bg = new createjs.Shape();
        bg.graphics.beginFill('#4CAF50').drawRoundRect(-30, -20, 60, 40, 5);
        button.addChild(bg);
        
        // Button text
        const text = new createjs.Text(label, 'bold 24px Arial', '#ffffff');
        text.textAlign = 'center';
        text.textBaseline = 'middle';
        button.addChild(text);
        
        button.x = x;
        button.y = y;
        button.cursor = 'pointer';
        
        // Hover effect
        button.on('mouseover', function() {
            bg.graphics.clear().beginFill('#66BB6A').drawRoundRect(-30, -20, 60, 40, 5);
        });
        
        button.on('mouseout', function() {
            bg.graphics.clear().beginFill('#4CAF50').drawRoundRect(-30, -20, 60, 40, 5);
        });
        
        // Click handler
        button.on('click', callback);
        
        this.container.addChild(button);
        return button;
    }
    
    updateScore(score) {
        this.scoreText.text = 'Score: ' + score;
    }
    
    updateQuestionCounter(current, total) {
        this.questionCounter.text = `Question: ${current}/${total}`;
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    toggleMute() {
        const isMuted = !this.config.audio.enabled;
        this.config.audio.enabled = !isMuted;
        
        // Update button text
        const text = this.buttons.mute.children[1];
        text.text = isMuted ? '🔊' : '🔇';
        
        // Mute/unmute sounds
        if (createjs.Sound) {
            createjs.Sound.muted = isMuted;
        }
    }
    
    exitGame() {
        if (confirm('Are you sure you want to exit?')) {
            window.location.href = this.config.exitUrl;
        }
    }
    
    showShareDialog(score) {
        const shareText = this.config.share.text.replace('{score}', score);
        const encodedText = encodeURIComponent(shareText + ' ' + this.config.share.hashtag);
        const encodedUrl = encodeURIComponent(this.config.share.url);
        
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
            whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
            telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
            reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        };
        
        // Create share dialog (simplified version)
        const shareDialog = `
            <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:30px;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,0.3);z-index:10000;">
                <h2 style="margin:0 0 20px 0;color:#333;">Share Your Score!</h2>
                <p style="margin:0 0 20px 0;color:#666;">Score: ${score} points</p>
                <div style="display:flex;gap:10px;flex-wrap:wrap;">
                    <a href="${shareUrls.facebook}" target="_blank" style="padding:10px 20px;background:#3b5998;color:white;text-decoration:none;border-radius:5px;">Facebook</a>
                    <a href="${shareUrls.twitter}" target="_blank" style="padding:10px 20px;background:#1da1f2;color:white;text-decoration:none;border-radius:5px;">Twitter</a>
                    <a href="${shareUrls.whatsapp}" target="_blank" style="padding:10px 20px;background:#25d366;color:white;text-decoration:none;border-radius:5px;">WhatsApp</a>
                    <a href="${shareUrls.telegram}" target="_blank" style="padding:10px 20px;background:#0088cc;color:white;text-decoration:none;border-radius:5px;">Telegram</a>
                    <a href="${shareUrls.reddit}" target="_blank" style="padding:10px 20px;background:#ff4500;color:white;text-decoration:none;border-radius:5px;">Reddit</a>
                    <a href="${shareUrls.linkedin}" target="_blank" style="padding:10px 20px;background:#0077b5;color:white;text-decoration:none;border-radius:5px;">LinkedIn</a>
                </div>
                <button onclick="this.parentElement.remove()" style="margin-top:20px;padding:10px 20px;background:#999;color:white;border:none;border-radius:5px;cursor:pointer;">Close</button>
            </div>
            <div onclick="this.nextElementSibling.remove();this.remove()" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;"></div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', shareDialog);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameUI;
}
