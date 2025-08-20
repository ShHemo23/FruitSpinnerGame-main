
# Fruit Spinner Game - Slot Machine

A modern, interactive slot machine game built with React, TypeScript, and Express. Features include reel animations, win effects, betting system, and dark mode.

## Features

- 🎰 Realistic slot machine with spinning reels
- ✨ Win animations with confetti effects
- 💰 Balance management and betting system
- 🌙 Dark/light mode toggle
- 📱 Responsive design for all devices
- 🎵 Sound effects and animations
- 📊 Game statistics and rules

## Local Development Setup

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/SHHemo23/FruitSpinnerGame.git
   cd FruitSpinnerGame
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5000`
   - The application will automatically reload when you make changes

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run check` - Run TypeScript type checking

### Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── db.ts             # Database configuration
├── shared/               # Shared types and schemas
└── package.json         # Dependencies and scripts
```

### Development Notes

- The app runs on port **5000** by default
- Frontend and backend are served from the same port
- Hot reload is enabled for both client and server code
- TypeScript is used throughout the project

### Troubleshooting

**Port already in use:**
```bash
# Kill processes using port 5000
npx kill-port 5000
```

**Dependencies issues:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build issues:**
```bash
# Clean build and restart
npm run build
npm start
```

## Game Rules

- **Minimum stake:** $1
- **Starting balance:** $1000 (can be added when depleted)
- **Winning combinations:** Match 3 identical symbols
- **Special symbols:** 💎 (highest payout), 🍒 (medium), 🍋🍊 (low)

## Technologies Used

- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, TypeScript
- **Build Tool:** Vite
- **UI Components:** Radix UI, shadcn/ui
- **Animations:** Framer Motion, Canvas Confetti

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
