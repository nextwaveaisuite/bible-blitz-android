// Asset Loader with CreateJS PreloadJS
class AssetLoader {
    constructor() {
        this.queue = new createjs.LoadQueue(true);
        this.loadingProgress = document.getElementById('loadingProgress');
        this.loadingText = document.getElementById('loadingText');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.assets = [];
        this.loaded = false;
    }
    
    init() {
        // Set up event listeners
        this.queue.on('progress', this.handleProgress.bind(this));
        this.queue.on('complete', this.handleComplete.bind(this));
        this.queue.on('error', this.handleError.bind(this));
        
        // Define assets to load (placeholder for now)
        this.assets = [
            // Images would go here
            // { id: 'background', src: 'assets/images/background.png' },
            // { id: 'ball', src: 'assets/images/ball.png' },
            
            // Sounds would go here
            // { id: 'click', src: 'assets/sounds/click.mp3' },
            // { id: 'correct', src: 'assets/sounds/correct.mp3' },
        ];
        
        return this;
    }
    
    load() {
        if (this.assets.length > 0) {
            this.queue.loadManifest(this.assets);
        } else {
            // If no assets, simulate loading
            this.simulateLoading();
        }
    }
    
    simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 0.1;
            this.updateProgress(progress);
            
            if (progress >= 1) {
                clearInterval(interval);
                this.handleComplete();
            }
        }, 50);
    }
    
    handleProgress(event) {
        this.updateProgress(event.progress);
    }
    
    updateProgress(progress) {
        const percent = Math.round(progress * 100);
        this.loadingProgress.style.width = percent + '%';
        this.loadingText.textContent = `Loading... ${percent}%`;
    }
    
    handleComplete() {
        this.loaded = true;
        this.loadingText.textContent = 'Loading Complete!';
        
        // Fade out loading screen
        setTimeout(() => {
            this.loadingScreen.style.opacity = '0';
            this.loadingScreen.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                
                // Trigger game start
                if (window.startGame) {
                    window.startGame();
                }
            }, 500);
        }, 500);
    }
    
    handleError(event) {
        console.error('Error loading asset:', event.data);
    }
    
    getAsset(id) {
        return this.queue.getResult(id);
    }
}

// Create global loader instance
window.assetLoader = new AssetLoader();
