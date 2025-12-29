/**
 * game.js
 * Main game logic and state management
 */

// Game state
const gameState = {
    currentRound: 0,
    totalRounds: 5,
    score: 0,
    roundScores: [],
    locations: [],
    currentLocation: null,
    isPlaying: false,
    roundResults: []
};

/**
 * Initializes the game
 */
async function initGame() {
    // Set up event listeners first (these work without API key)
    setupEventListeners();
    
    try {
        // Try to load Google Maps API
        await loadGoogleMapsAPI();
        
        // Initialize guess map
        initializeGuessMap();
        
    } catch (error) {
        console.error('Failed to initialize game:', error);
        showAPIKeyWarning();
    }
}

/**
 * Shows API key warning
 */
function showAPIKeyWarning() {
    const warning = document.getElementById('api-key-warning');
    if (warning) {
        warning.style.display = 'flex';
    }
}

/**
 * Sets up event listeners for buttons
 */
function setupEventListeners() {
    // Main menu buttons
    document.getElementById('start-game-btn')?.addEventListener('click', startNewGame);
    document.getElementById('instructions-btn')?.addEventListener('click', showInstructions);
    document.getElementById('back-to-menu-btn')?.addEventListener('click', showMainMenu);
    
    // Game screen buttons
    document.getElementById('toggle-map-btn')?.addEventListener('click', toggleMap);
    document.getElementById('make-guess-btn')?.addEventListener('click', makeGuess);
    
    // Result screen buttons
    document.getElementById('next-round-btn')?.addEventListener('click', nextRound);
    
    // Final screen buttons
    document.getElementById('play-again-btn')?.addEventListener('click', startNewGame);
    document.getElementById('main-menu-btn')?.addEventListener('click', showMainMenu);
    
    // API key warning
    document.getElementById('dismiss-warning-btn')?.addEventListener('click', () => {
        document.getElementById('api-key-warning').style.display = 'none';
    });
}

/**
 * Starts a new game
 */
async function startNewGame() {
    // Reset game state
    gameState.currentRound = 0;
    gameState.score = 0;
    gameState.roundScores = [];
    gameState.roundResults = [];
    gameState.locations = getRandomLocations(gameState.totalRounds);
    gameState.isPlaying = true;
    
    // Show game screen
    showScreen('game-screen');
    
    // Start first round
    await startRound();
}

/**
 * Starts a round
 */
async function startRound() {
    gameState.currentRound++;
    
    // Update UI
    updateRoundCounter();
    updateScoreDisplay();
    
    // Reset map
    clearGuessMarker();
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        mapContainer.classList.add('collapsed');
    }
    
    // Get current location
    gameState.currentLocation = gameState.locations[gameState.currentRound - 1];
    
    // Show loading overlay
    showLoadingOverlay(true);
    
    try {
        // Initialize Street View for this location
        await initializeStreetView(gameState.currentLocation);
        
        // Hide loading overlay
        showLoadingOverlay(false);
    } catch (error) {
        console.error('Failed to load Street View:', error);
        showLoadingOverlay(false);
        showNotification('Failed to load location. Please try again.', 'error');
        setTimeout(() => showMainMenu(), 2000);
    }
}

/**
 * Toggles the map visibility
 */
function toggleMap() {
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        mapContainer.classList.toggle('collapsed');
    }
}

/**
 * Handles guess submission
 */
function makeGuess() {
    const guessPosition = getGuessPosition();
    
    if (!guessPosition) {
        showNotification('Please place a marker on the map first!', 'info');
        return;
    }
    
    // Calculate distance
    const distance = calculateDistance(
        gameState.currentLocation.lat,
        gameState.currentLocation.lng,
        guessPosition.lat,
        guessPosition.lng
    );
    
    // Calculate score
    const roundScore = calculateScore(distance);
    gameState.score += roundScore;
    gameState.roundScores.push(roundScore);
    
    // Store round result
    gameState.roundResults.push({
        round: gameState.currentRound,
        distance: distance,
        score: roundScore,
        actualLocation: gameState.currentLocation,
        guessLocation: guessPosition
    });
    
    // Show result screen
    showRoundResult(distance, roundScore);
}

/**
 * Shows the round result
 */
function showRoundResult(distance, score) {
    // Update result stats
    document.getElementById('result-distance').textContent = formatDistance(distance);
    document.getElementById('result-points').textContent = score.toLocaleString();
    document.getElementById('result-total-score').textContent = gameState.score.toLocaleString();
    
    // Initialize result map
    const actualLoc = { 
        lat: gameState.currentLocation.lat, 
        lng: gameState.currentLocation.lng 
    };
    const guessLoc = getGuessPosition();
    
    initializeResultMap(actualLoc, guessLoc);
    
    // Update button text
    const nextButton = document.getElementById('next-round-btn');
    if (gameState.currentRound >= gameState.totalRounds) {
        nextButton.textContent = 'See Final Score';
    } else {
        nextButton.textContent = 'Next Round';
    }
    
    // Show result screen
    showScreen('result-screen');
}

/**
 * Proceeds to next round or final screen
 */
async function nextRound() {
    if (gameState.currentRound >= gameState.totalRounds) {
        showFinalScreen();
    } else {
        showScreen('game-screen');
        await startRound();
    }
}

/**
 * Shows the final score screen
 */
function showFinalScreen() {
    // Update final score
    document.getElementById('final-score-value').textContent = gameState.score.toLocaleString();
    
    // Build rounds breakdown
    const roundsList = document.getElementById('rounds-list');
    roundsList.innerHTML = '';
    
    gameState.roundResults.forEach((result, index) => {
        const roundItem = document.createElement('div');
        roundItem.className = 'round-item';
        
        roundItem.innerHTML = `
            <div class="round-number">Round ${result.round}</div>
            <div class="round-stats">
                <span class="round-stat">${formatDistance(result.distance)}</span>
                <span class="round-points">${result.score.toLocaleString()} pts</span>
            </div>
        `;
        
        roundsList.appendChild(roundItem);
    });
    
    // Show final screen
    showScreen('final-screen');
    gameState.isPlaying = false;
}

/**
 * Shows instructions screen
 */
function showInstructions() {
    showScreen('instructions-screen');
}

/**
 * Shows main menu
 */
function showMainMenu() {
    showScreen('main-menu');
    gameState.isPlaying = false;
}

/**
 * Updates the round counter display
 */
function updateRoundCounter() {
    const roundCounter = document.getElementById('round-counter');
    if (roundCounter) {
        roundCounter.textContent = `Round ${gameState.currentRound}/${gameState.totalRounds}`;
    }
}

/**
 * Updates the score display
 */
function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
        scoreDisplay.textContent = `Score: ${gameState.score.toLocaleString()}`;
    }
}

/**
 * Shows/hides loading overlay
 */
function showLoadingOverlay(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }
}

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', initGame);
