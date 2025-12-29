/**
 * ui.js
 * Handles UI updates, screen transitions, and animations
 */

/**
 * Shows a specific screen and hides others
 * @param {string} screenId - ID of the screen to show
 */
function showScreen(screenId) {
    // Get all screens
    const screens = document.querySelectorAll('.screen');
    
    // Hide all screens
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the target screen with a slight delay for smooth transition
    setTimeout(() => {
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }, 100);
}

/**
 * Shows a notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Define notification colors
    const notificationColors = {
        error: '#e74c3c',
        success: '#27ae60',
        info: '#667eea'
    };
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '10px',
        backgroundColor: notificationColors[type] || notificationColors.info,
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease-out',
        maxWidth: '300px'
    });
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Adds CSS animation keyframes if not already added
 */
function addAnimationStyles() {
    if (!document.getElementById('ui-animations')) {
        const style = document.createElement('style');
        style.id = 'ui-animations';
        style.textContent = `
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
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
            
            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Updates button state
 * @param {string} buttonId - ID of the button
 * @param {boolean} enabled - Whether button should be enabled
 */
function updateButtonState(buttonId, enabled) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = !enabled;
    }
}

/**
 * Shows a loading indicator on a button
 * @param {string} buttonId - ID of the button
 * @param {boolean} loading - Whether to show loading state
 */
function setButtonLoading(buttonId, loading) {
    const button = document.getElementById(buttonId);
    if (button) {
        if (loading) {
            button.dataset.originalText = button.textContent;
            button.textContent = 'Loading...';
            button.disabled = true;
        } else {
            button.textContent = button.dataset.originalText || button.textContent;
            button.disabled = false;
        }
    }
}

/**
 * Animates score change
 * @param {HTMLElement} element - Element to animate
 * @param {number} from - Starting value
 * @param {number} to - Ending value
 * @param {number} duration - Animation duration in ms
 */
function animateNumber(element, from, to, duration = 1000) {
    const startTime = performance.now();
    const range = to - from;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutCubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = Math.round(from + range * easeProgress);
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

/**
 * Highlights an element temporarily
 * @param {string} elementId - ID of element to highlight
 * @param {number} duration - Highlight duration in ms
 */
function highlightElement(elementId, duration = 1000) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.animation = `pulse ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }
}

/**
 * Shows a tooltip
 * @param {string} elementId - ID of element to attach tooltip to
 * @param {string} message - Tooltip message
 * @param {number} duration - How long to show tooltip in ms
 */
function showTooltip(elementId, message, duration = 2000) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = message;
    
    // Style tooltip
    Object.assign(tooltip.style, {
        position: 'absolute',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '5px',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        zIndex: '10001',
        pointerEvents: 'none',
        animation: 'fadeIn 0.2s ease-out'
    });
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.top = `${rect.bottom + 10}px`;
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(tooltip);
    
    // Remove after duration
    setTimeout(() => {
        tooltip.style.animation = 'fadeOut 0.2s ease-out';
        setTimeout(() => {
            if (tooltip.parentNode) {
                document.body.removeChild(tooltip);
            }
        }, 200);
    }, duration);
}

/**
 * Creates a confetti effect for high scores
 */
function celebrateHighScore() {
    const colors = ['#667eea', '#764ba2', '#e74c3c', '#27ae60', '#f39c12'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        
        Object.assign(confetti.style, {
            position: 'fixed',
            width: '10px',
            height: '10px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: Math.random() * window.innerWidth + 'px',
            top: '-10px',
            opacity: '1',
            transform: `rotate(${Math.random() * 360}deg)`,
            pointerEvents: 'none',
            zIndex: '10002'
        });
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        const duration = 2000 + Math.random() * 1000;
        const endY = window.innerHeight + 10;
        const endX = parseFloat(confetti.style.left) + (Math.random() - 0.5) * 200;
        
        const animation = confetti.animate([
            { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
            { transform: `translate(${endX - parseFloat(confetti.style.left)}px, ${endY}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = () => {
            if (confetti.parentNode) {
                document.body.removeChild(confetti);
            }
        };
    }
}

/**
 * Formats time in a readable format
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Formatted time string
 */
function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
}

/**
 * Smoothly scrolls to an element
 * @param {string} elementId - ID of element to scroll to
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Initialize animation styles when script loads
addAnimationStyles();
