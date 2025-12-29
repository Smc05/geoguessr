# GeoGuessr Clone

A fully functional GeoGuessr game clone built with HTML5, CSS3, and vanilla JavaScript. Explore random locations around the world using Google Street View and test your geography knowledge!

## Features

### Core Gameplay
- **5 rounds per game** - Each game consists of 5 different random locations
- **Random location selection** - 65+ curated interesting places from around the world
- **Distance calculation** - Calculate the distance between your guess and actual location
- **Scoring system** - Earn points based on accuracy (closer = more points)
- **Interactive compass** - Shows your current viewing direction in Street View

### User Interface
- **Main Menu** - Start game or view instructions
- **Game Screen** - Immersive Street View with interactive map
- **Round Results** - See your distance, points earned, and both locations on a map
- **Final Score Screen** - Complete breakdown of all rounds and total score
- **Responsive Design** - Works on desktop, tablet, and mobile devices

### Maps Integration
- Google Street View panorama with full navigation
- Interactive world map for placing guesses
- Visual markers and connecting lines showing guess vs actual location
- Distance calculation using Google Maps Geometry library

## Setup Instructions

### Prerequisites
- A Google Maps API key with the following APIs enabled:
  - Maps JavaScript API
  - Street View Static API (included with Maps JavaScript API)
  - Geometry Library

### Getting a Google Maps API Key

1. **Go to Google Cloud Console**
   - Visit https://console.cloud.google.com/

2. **Create a new project** (or select an existing one)
   - Click "Select a project" → "New Project"
   - Give it a name (e.g., "GeoGuessr Clone")
   - Click "Create"

3. **Enable required APIs**
   - Go to "APIs & Services" → "Library"
   - Search for and enable "Maps JavaScript API"
   - The Geometry library is included automatically

4. **Create credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key

5. **Secure your API key** (Recommended)
   - Click on your API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `yourdomain.com/*` or `localhost:*` for local testing)
   - Under "API restrictions", select "Restrict key"
   - Select "Maps JavaScript API"
   - Click "Save"

### Installation

1. **Clone this repository**
   ```bash
   git clone https://github.com/Smc05/geoguessr.git
   cd geoguessr
   ```

2. **Add your API key**
   - Open `js/map.js`
   - Find the line: `const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY_HERE';`
   - Replace `YOUR_API_KEY_HERE` with your actual Google Maps API key
   ```javascript
   const GOOGLE_MAPS_API_KEY = 'AIzaSyAbc123...'; // Your actual key
   ```

3. **Run the application**
   - Simply open `index.html` in a web browser, or
   - Use a local web server (recommended):
   
   **Option A: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```
   
   **Option B: Using Node.js**
   ```bash
   npx http-server -p 8000
   # Then visit http://localhost:8000
   ```
   
   **Option C: Using VS Code**
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

4. **Start playing!**
   - Click "Start New Game" to begin
   - Explore the Street View and make your guess on the map
   - Complete 5 rounds and see your final score

## How to Play

1. **Explore**: You'll be dropped in a random location with Google Street View
2. **Look Around**: Use your mouse or touch to pan around and look for clues
3. **Check the Compass**: The compass at the top shows which direction you're facing
4. **Open the Map**: Click "📍 Open Map" to reveal the world map
5. **Place Your Guess**: Click anywhere on the map to place your guess pin
6. **Submit**: Click "Make Guess" to see how close you were
7. **See Results**: View your distance, points earned, and see both locations on the map
8. **Continue**: Play through all 5 rounds to get your final score

## Scoring System

- **< 1 km**: 5,000 points (Perfect!)
- **< 10 km**: 4,000+ points (Very close)
- **< 100 km**: 3,000+ points (Close)
- **< 1,000 km**: 1,000+ points (Medium distance)
- **< 5,000 km**: 100+ points (Far)
- **≥ 5,000 km**: 0 points (Very far)

## Project Structure

```
geoguessr/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # All styles and responsive design
├── js/
│   ├── game.js            # Game state and logic
│   ├── map.js             # Google Maps and Street View integration
│   ├── locations.js       # Location pool and random selection
│   └── ui.js              # UI updates and transitions
├── assets/
│   └── images/            # Icons and images (if needed)
└── README.md              # This file
```

## Browser Compatibility

- Chrome/Edge (recommended): Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with responsive design

## Troubleshooting

### "Google Maps API Key Required" warning appears
- Make sure you've added your API key to `js/map.js`
- Ensure the key is correct and not restricted

### Street View doesn't load
- Check that Maps JavaScript API is enabled in your Google Cloud Console
- Verify your API key has no restrictions blocking the request
- Check browser console for specific error messages

### Map doesn't show
- Ensure you're running the app through a web server (not just opening the HTML file directly in some browsers due to CORS)
- Check browser console for errors

### On mobile, controls are hard to use
- Try landscape orientation for better experience
- Pinch to zoom on the map
- Use two fingers to pan in Street View

## Credits

Built as a demonstration project inspired by GeoGuessr.

## License

This project is provided as-is for educational purposes. Google Maps API usage is subject to Google's terms of service and pricing.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## Future Enhancements

Possible features to add:
- Timer mode (challenge mode)
- Difficulty levels
- Multiplayer support
- Score history and leaderboards
- Additional location packs
- Hints system
- Sound effects and music