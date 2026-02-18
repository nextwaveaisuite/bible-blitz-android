# Bible Challenge: Daily Faith Game

A Christian quiz game built with HTML5 and CreateJS, featuring Bible questions, scoring system, and social sharing capabilities.

## 🎮 Features

### Core Gameplay
- **10 Reveal Balls** - Tap to reveal Bible questions
- **Multiple Choice Questions** - 4 answer options per question
- **Mixed Difficulty** - Easy, Medium, and Hard questions
- **Scoring System** - Earn points for correct answers
- **Streak Bonuses** - Get bonus points for consecutive correct answers
- **Question Categories** - Old Testament, New Testament, Jesus' Life, Creation, and more

### User Interface
- **HD Graphics** - 1280×765 resolution
- **Responsive Design** - Auto-resize to fit any screen
- **Landscape Mode** - Optimized for landscape orientation
- **Touch & Mouse Controls** - Works on all devices
- **Loading Screen** - Smooth loading experience
- **Main Menu** - Clean and intuitive navigation

### Controls
- **Fullscreen Button** - Enter/exit fullscreen mode
- **Mute Button** - Toggle sound on/off
- **Exit Button** - Return to main menu or exit game
- **Share Score** - Share your results on social media

### Social Sharing
Share your score on:
- Facebook
- Twitter/X
- WhatsApp
- Telegram
- Reddit
- LinkedIn

## 📋 Game Configuration

All game settings can be customized in `config/game-config.js`:

### Gameplay Settings
- `totalRevealBalls` - Number of balls (default: 10)
- `totalPlayers` - Number of players (default: 1)
- `questionsPerGame` - Questions per session (default: 10)
- `timePerQuestion` - Time limit per question (default: 30 seconds)

### Scoring Settings
- `correctAnswer` - Points for correct answer (default: 100)
- `streakBonus` - Bonus for consecutive answers (default: 50)
- `timeBonus` - Enable time-based bonus (default: true)

### Power-Ups (Optional)
- Double Points
- Skip Question
- 50/50 Hint

## 📱 Browser Compatibility

Works on all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile, Samsung Internet)

## 🎨 Customization

### Text Customization
Edit `config/game-config.js` to change:
- Game title and subtitle
- Button labels
- Feedback messages
- Share text and hashtags

### Visual Customization
Modify `config/game-config.js` to adjust:
- Ball colors
- Theme colors
- Background color
- Animations and effects

### Questions Database
Add or edit questions in `config/questions.js`:
- Easy questions (15 included)
- Medium questions (10 included)
- Hard questions (10 included)

## 🚀 How to Run

### Local Development
1. Navigate to the game directory
2. Start a local web server:
   ```bash
   python3 -m http.server 8080
   ```
3. Open browser to `http://localhost:8080`

### Production Deployment
1. Upload all files to your web server
2. Ensure HTTPS is enabled for best performance
3. Configure your domain in `game-config.js`

## 📦 File Structure

```
bible-challenge/
├── index.html              # Main HTML file
├── config/
│   ├── game-config.js      # Game configuration
│   └── questions.js        # Questions database
├── src/
│   ├── app.js              # Main application entry
│   ├── game.js             # Game logic
│   ├── ui.js               # UI management
│   ├── loader.js           # Asset loader
│   ├── orientation.js      # Orientation detection
│   ├── browser-check.js    # Browser compatibility
│   └── styles.css          # CSS styles
├── assets/
│   ├── images/             # Image assets (placeholder)
│   └── sounds/             # Sound effects (placeholder)
└── README.md               # This file
```

## 🎯 Game Flow

1. **Loading Screen** - Assets load with progress bar
2. **Main Menu** - Title screen with Play and How to Play buttons
3. **Gameplay** - Answer Bible questions and earn points
4. **Game Over** - View final score and share results
5. **Play Again** - Restart with new random questions

## 🔧 Technical Details

### Technologies Used
- **HTML5 Canvas** - For rendering graphics
- **CreateJS** - Game framework
- **JavaScript ES6** - Game logic
- **CSS3** - Styling and animations

### Performance
- 60 FPS rendering
- Device pixel ratio support for crisp graphics
- Efficient memory management
- Optimized for mobile devices

## 📝 License

This game is built for educational and ministry purposes. Feel free to customize and deploy for your church, ministry, or personal use.

## 🙏 Credits

- **Bible Questions** - Sourced from various Bible study resources
- **CreateJS** - https://createjs.com
- **Design** - Custom Christian-themed interface

## 📞 Support

For questions, issues, or feature requests, please refer to the documentation or contact your developer.

---

**Version:** 1.0.0  
**Last Updated:** January 26, 2026  
**Built with:** ❤️ and faith
