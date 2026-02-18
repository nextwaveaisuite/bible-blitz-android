/**
 * Audio Manager
 * Handles all sound effects and music
 */

class AudioManager {
    constructor(config) {
        this.config = config.audio;
        this.sounds = {};
        this.enabled = this.loadPreference() !== false;
        this.volume = {
            music: this.config.volume.music,
            effects: this.config.volume.effects
        };
        
        // Initialize sounds
        if (this.config.enabled) {
            this.initializeSounds();
        }
    }
    
    /**
     * Initialize all sound files
     */
    initializeSounds() {
        // Use Web Audio API for better control
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // For now, we'll use simple HTML5 Audio as fallback
        // In production, you would load actual audio files
        Object.entries(this.config.sounds).forEach(([key, soundConfig]) => {
            this.sounds[key] = {
                config: soundConfig,
                audio: null,  // Will be loaded when needed
                loaded: false
            };
        });
    }
    
    /**
     * Play a sound effect
     */
    play(soundName) {
        if (!this.enabled || !this.config.soundEffects) return;
        
        const sound = this.sounds[soundName];
        if (!sound) {
            console.warn(`Sound not found: ${soundName}`);
            return;
        }
        
        // Use beep as placeholder (in production, load actual audio files)
        this.playBeep(soundName);
    }
    
    /**
     * Play a beep sound (placeholder for actual audio)
     */
    playBeep(soundName) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Different frequencies for different sounds
        const frequencies = {
            correctAnswer: 800,
            wrongAnswer: 200,
            coinEarned: 1000,
            hintUsed: 600,
            levelUp: 1200,
            gameOver: 150,
            buttonClick: 400,
            timerTick: 300,
            timerWarning: 250
        };
        
        oscillator.frequency.value = frequencies[soundName] || 440;
        oscillator.type = 'sine';
        
        const volume = this.sounds[soundName]?.config.volume || 0.5;
        gainNode.gain.setValueAtTime(volume * this.volume.effects, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }
    
    /**
     * Toggle sound on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        this.savePreference();
        return this.enabled;
    }
    
    /**
     * Set volume
     */
    setVolume(type, value) {
        if (type === 'music' || type === 'effects') {
            this.volume[type] = Math.max(0, Math.min(1, value));
        }
    }
    
    /**
     * Get current state
     */
    isEnabled() {
        return this.enabled;
    }
    
    /**
     * Save preference to localStorage
     */
    savePreference() {
        try {
            localStorage.setItem('dailyBibleQuiz_audioEnabled', this.enabled.toString());
        } catch (e) {
            console.warn('Could not save audio preference:', e);
        }
    }
    
    /**
     * Load preference from localStorage
     */
    loadPreference() {
        try {
            const saved = localStorage.getItem('dailyBibleQuiz_audioEnabled');
            return saved === null ? true : saved === 'true';
        } catch (e) {
            return true;
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}
