/**
 * Hint System
 * Manages hint usage, costs, and effects
 */

class HintSystem {
    constructor(config, coinSystem) {
        this.config = config.hints;
        this.coinSystem = coinSystem;
        this.currentQuestion = null;
        this.hintsUsedThisQuestion = [];
        this.wrongAnswersRemoved = [];
        
        // Statistics
        this.stats = {
            totalHintsUsed: 0,
            hintsByType: {},
            questionsWithHints: 0
        };
        
        this.loadStats();
    }
    
    /**
     * Set current question data
     */
    setQuestion(question) {
        this.currentQuestion = question;
        this.hintsUsedThisQuestion = [];
        this.wrongAnswersRemoved = [];
    }
    
    /**
     * Use a hint
     * @param {string} hintId - ID of hint to use
     * @returns {object} - Result {success, effect, message}
     */
    useHint(hintId) {
        const hint = this.config.types.find(h => h.id === hintId);
        
        if (!hint) {
            return { success: false, message: "Hint not found" };
        }
        
        // Check if already used this hint
        if (this.hintsUsedThisQuestion.includes(hintId)) {
            return { success: false, message: "Hint already used!" };
        }
        
        // Check if player can afford it
        if (!this.coinSystem.canAfford(hint.cost)) {
            return { success: false, message: `Need ${hint.cost} coins!` };
        }
        
        // Spend coins
        if (!this.coinSystem.spendCoins(hint.cost, `Hint: ${hint.name}`)) {
            return { success: false, message: "Could not spend coins" };
        }
        
        // Mark hint as used
        this.hintsUsedThisQuestion.push(hintId);
        this.coinSystem.hintUsed = true;
        
        // Update statistics
        this.stats.totalHintsUsed++;
        this.stats.hintsByType[hintId] = (this.stats.hintsByType[hintId] || 0) + 1;
        if (this.hintsUsedThisQuestion.length === 1) {
            this.stats.questionsWithHints++;
        }
        this.saveStats();
        
        // Apply hint effect
        const effect = this.applyHintEffect(hint);
        
        return {
            success: true,
            effect: effect,
            message: `${hint.name} used! -${hint.cost} coins`,
            hint: hint
        };
    }
    
    /**
     * Apply the effect of a hint
     */
    applyHintEffect(hint) {
        switch (hint.effect) {
            case 'remove_two_wrong':
                return this.removeTwoWrongAnswers();
            
            case 'show_reference':
                return this.showScriptureReference();
            
            case 'add_time':
                return this.addExtraTime();
            
            default:
                return null;
        }
    }
    
    /**
     * Remove two wrong answers (50/50 hint)
     */
    removeTwoWrongAnswers() {
        if (!this.currentQuestion) return null;
        
        const answers = this.currentQuestion.answers;
        const correctIndex = this.currentQuestion.correctIndex;
        
        // Get indices of wrong answers
        const wrongIndices = answers
            .map((_, index) => index)
            .filter(index => index !== correctIndex && !this.wrongAnswersRemoved.includes(index));
        
        if (wrongIndices.length < 2) {
            return { type: 'remove_two_wrong', removed: [] };
        }
        
        // Randomly select 2 wrong answers to remove
        const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
        const toRemove = shuffled.slice(0, 2);
        
        this.wrongAnswersRemoved.push(...toRemove);
        
        // Hide these answers in the UI
        toRemove.forEach(index => {
            const answerButton = document.querySelector(`[data-answer-index="${index}"]`);
            if (answerButton) {
                answerButton.style.opacity = '0.3';
                answerButton.style.pointerEvents = 'none';
                answerButton.style.textDecoration = 'line-through';
            }
        });
        
        return {
            type: 'remove_two_wrong',
            removed: toRemove,
            message: "Two wrong answers removed!"
        };
    }
    
    /**
     * Show scripture reference clue
     */
    showScriptureReference() {
        if (!this.currentQuestion || !this.currentQuestion.reference) {
            return {
                type: 'show_reference',
                reference: null,
                message: "No reference available"
            };
        }
        
        const reference = this.currentQuestion.reference;
        
        // Display reference in UI
        const refDisplay = document.getElementById('scripture-reference-hint');
        if (refDisplay) {
            refDisplay.textContent = `📖 ${reference}`;
            refDisplay.style.display = 'block';
            refDisplay.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255, 215, 0, 0.9);
                color: #000;
                padding: 10px 20px;
                border-radius: 5px;
                font-size: 18px;
                font-weight: bold;
                z-index: 1000;
                animation: slideInRight 0.5s;
            `;
        }
        
        return {
            type: 'show_reference',
            reference: reference,
            message: `Scripture: ${reference}`
        };
    }
    
    /**
     * Add extra time to timer
     */
    addExtraTime() {
        const extraSeconds = 10;
        
        // Add time to game timer
        if (window.gameTimer) {
            window.gameTimer.addTime(extraSeconds);
        }
        
        // Show visual feedback
        const timeDisplay = document.getElementById('timer-display');
        if (timeDisplay) {
            timeDisplay.style.animation = 'pulse 0.5s';
            timeDisplay.style.color = '#4ECDC4';
            
            setTimeout(() => {
                timeDisplay.style.animation = '';
                timeDisplay.style.color = '';
            }, 500);
        }
        
        return {
            type: 'add_time',
            seconds: extraSeconds,
            message: `+${extraSeconds} seconds added!`
        };
    }
    
    /**
     * Check if a specific hint has been used this question
     */
    isHintUsed(hintId) {
        return this.hintsUsedThisQuestion.includes(hintId);
    }
    
    /**
     * Check if any hint has been used this question
     */
    hasUsedAnyHint() {
        return this.hintsUsedThisQuestion.length > 0;
    }
    
    /**
     * Get available hints
     */
    getAvailableHints() {
        return this.config.types.filter(hint => {
            return !this.isHintUsed(hint.id) && this.coinSystem.canAfford(hint.cost);
        });
    }
    
    /**
     * Reset for new question
     */
    reset() {
        this.currentQuestion = null;
        this.hintsUsedThisQuestion = [];
        this.wrongAnswersRemoved = [];
        
        // Clear UI elements
        const refDisplay = document.getElementById('scripture-reference-hint');
        if (refDisplay) {
            refDisplay.style.display = 'none';
        }
    }
    
    /**
     * Create hint buttons UI
     */
    createHintButtons(container) {
        const hintsDiv = document.createElement('div');
        hintsDiv.id = 'hints-container';
        hintsDiv.className = 'hints-container';
        hintsDiv.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 15px;
            z-index: 100;
        `;
        
        this.config.types.forEach(hint => {
            const button = document.createElement('button');
            button.className = 'hint-button';
            button.id = `hint-${hint.id}`;
            button.innerHTML = `
                <span class="hint-icon">${hint.icon}</span>
                <span class="hint-name">${hint.name}</span>
                <span class="hint-cost">🪙 ${hint.cost}</span>
            `;
            button.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: 2px solid #FFD700;
                color: white;
                padding: 12px 20px;
                border-radius: 10px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
                transition: all 0.3s;
                min-width: 120px;
            `;
            
            button.addEventListener('click', () => {
                const result = this.useHint(hint.id);
                if (result.success) {
                    button.disabled = true;
                    button.style.opacity = '0.5';
                    button.style.cursor = 'not-allowed';
                    this.showHintMessage(result.message);
                } else {
                    this.showHintMessage(result.message, 'error');
                }
            });
            
            button.addEventListener('mouseenter', () => {
                if (!button.disabled) {
                    button.style.transform = 'scale(1.1)';
                    button.style.boxShadow = '0 5px 15px rgba(255, 215, 0, 0.5)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
                button.style.boxShadow = 'none';
            });
            
            hintsDiv.appendChild(button);
        });
        
        container.appendChild(hintsDiv);
    }
    
    /**
     * Show hint message
     */
    showHintMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'hint-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'success' ? 'rgba(76, 175, 80, 0.95)' : 'rgba(244, 67, 54, 0.95)'};
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            z-index: 10000;
            animation: fadeInOut 2s;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 2000);
    }
    
    /**
     * Update hint buttons state
     */
    updateHintButtons() {
        this.config.types.forEach(hint => {
            const button = document.getElementById(`hint-${hint.id}`);
            if (button) {
                const canAfford = this.coinSystem.canAfford(hint.cost);
                const isUsed = this.isHintUsed(hint.id);
                
                if (isUsed) {
                    button.disabled = true;
                    button.style.opacity = '0.5';
                    button.style.cursor = 'not-allowed';
                } else if (!canAfford) {
                    button.style.opacity = '0.7';
                    button.style.filter = 'grayscale(50%)';
                } else {
                    button.disabled = false;
                    button.style.opacity = '1';
                    button.style.filter = 'none';
                    button.style.cursor = 'pointer';
                }
            }
        });
    }
    
    /**
     * Save statistics
     */
    saveStats() {
        try {
            localStorage.setItem('dailyBibleQuiz_hintStats', JSON.stringify(this.stats));
        } catch (e) {
            console.warn('Could not save hint stats:', e);
        }
    }
    
    /**
     * Load statistics
     */
    loadStats() {
        try {
            const saved = localStorage.getItem('dailyBibleQuiz_hintStats');
            if (saved) {
                this.stats = { ...this.stats, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('Could not load hint stats:', e);
        }
    }
    
    /**
     * Get statistics
     */
    getStats() {
        return this.stats;
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; }
        10%, 90% { opacity: 1; }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    .hint-button .hint-icon {
        font-size: 24px;
    }
    
    .hint-button .hint-name {
        font-size: 14px;
    }
    
    .hint-button .hint-cost {
        font-size: 12px;
        color: #FFD700;
    }
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HintSystem;
}
