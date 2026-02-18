// Orientation Detection and Landscape-Only Gate
(function() {
    'use strict';
    
    const rotateMessage = document.getElementById('rotateMessage');
    
    function checkOrientation() {
        const isPortrait = window.innerHeight > window.innerWidth;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Only show rotate message on mobile devices in portrait mode
        if (isMobile && isPortrait) {
            rotateMessage.classList.add('show');
            return false;
        } else {
            rotateMessage.classList.remove('show');
            return true;
        }
    }
    
    // Check orientation on load
    window.addEventListener('load', checkOrientation);
    
    // Check orientation on resize
    window.addEventListener('resize', checkOrientation);
    
    // Check orientation on orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(checkOrientation, 100);
    });
    
    // Lock to landscape on mobile devices (if supported)
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(function(error) {
            console.log('Orientation lock not supported:', error);
        });
    }
    
    // Export check function
    window.checkOrientation = checkOrientation;
})();
