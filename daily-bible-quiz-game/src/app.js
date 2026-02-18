// Main Application Entry Point
(function() {
    'use strict';
    
    let stage;
    let game;
    let ui;
    let canvas;
    let dailyChallenge;
    let monetization;
    let viral;
    
    // Expose for debugging
    window.stage = null;
    window.game = null;
    window.ui = null;
    window.dailyChallenge = null;
    window.monetization = null;
    window.viral = null;
    
    function init() {
        // Get canvas element
        canvas = document.getElementById('gameCanvas');
        
        // Set up canvas with device pixel ratio for crisp rendering
        setupCanvas();
        
        // Create CreateJS stage
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);
        createjs.Touch.enable(stage);
        
        // Set background color
        canvas.style.backgroundColor = GAME_CONFIG.canvas.backgroundColor;
        
        // Initialize daily challenge system
        dailyChallenge = new DailyChallenge(GAME_CONFIG.dailyChallenge);
        
        // Initialize monetization system
        monetization = new Monetization(GAME_CONFIG);
        monetization.showBannerAd();
        
        // Initialize viral mechanics
        viral = new ViralMechanics(GAME_CONFIG);
        
        // Initialize UI
        ui = new GameUI(stage, GAME_CONFIG);
        ui.init();
        
        // Initialize game
        game = new BibleChallengeGame(stage, GAME_CONFIG);
        game.init(ui, dailyChallenge, monetization, viral);
        
        // Expose globally
        window.stage = stage;
        window.game = game;
        window.ui = ui;
        window.dailyChallenge = dailyChallenge;
        window.monetization = monetization;
        window.viral = viral;
        
        // Start ticker
        createjs.Ticker.framerate = 60;
        createjs.Ticker.addEventListener('tick', tick);
        
        // Handle window resize
        window.addEventListener('resize', handleResize);
        handleResize();
        
        // Show daily challenge status
        const challengeStatus = dailyChallenge.getSummary();
        console.log('Bible Blitz initialized successfully!');
        console.log('Daily Challenge Status:', challengeStatus);
    }
    
    function setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const width = GAME_CONFIG.canvas.width;
        const height = GAME_CONFIG.canvas.height;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
    }
    
    function handleResize() {
        const width = GAME_CONFIG.canvas.width;
        const height = GAME_CONFIG.canvas.height;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Calculate scale to fit window while maintaining aspect ratio
        const scaleX = windowWidth / width;
        const scaleY = windowHeight / height;
        const scale = Math.min(scaleX, scaleY);
        
        // Apply scale
        canvas.style.width = (width * scale) + 'px';
        canvas.style.height = (height * scale) + 'px';
        
        // Center canvas
        const container = document.getElementById('gameContainer');
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
    }
    
    function tick(event) {
        stage.update(event);
    }
    
    // Start game function (called after loading)
    window.startGame = function() {
        init();
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize loader
            window.assetLoader.init().load();
        });
    } else {
        window.assetLoader.init().load();
    }
})();
