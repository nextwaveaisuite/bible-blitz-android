// Browser Compatibility Check
(function() {
    'use strict';
    
    function checkBrowserSupport() {
        const browserNotSupported = document.getElementById('browserNotSupported');
        
        // Check for required features
        const hasCanvas = !!document.createElement('canvas').getContext;
        const hasLocalStorage = typeof(Storage) !== 'undefined';
        const hasCreateJS = typeof createjs !== 'undefined';
        
        // Check for modern browser features
        const isModernBrowser = (
            hasCanvas &&
            hasLocalStorage &&
            'addEventListener' in window &&
            'querySelector' in document
        );
        
        // Check for very old browsers
        const isOldIE = /MSIE [6-9]/.test(navigator.userAgent);
        
        if (!isModernBrowser || isOldIE) {
            browserNotSupported.style.display = 'flex';
            return false;
        }
        
        return true;
    }
    
    // Run check on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkBrowserSupport);
    } else {
        checkBrowserSupport();
    }
    
    // Export check function
    window.checkBrowserSupport = checkBrowserSupport;
})();
