# Wordle Clone

A React-based clone of the popular word-guessing game Wordle, built with TypeScript and styled-components.

## Features

- 🎮 Classic Wordle gameplay
- 📊 Statistics tracking (wins, losses, streaks)
- 🎨 Visual keyboard feedback
- 🔄 Play again functionality
- 📱 Responsive design
- 🌈 Animated tiles and messages

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd woordle
```

2. Install dependencies:
```bash
npm install
```

## Running the Game

Start the development server:
```bash
npm run dev
```

The game will be available at `http://localhost:5173` (or another port if 5173 is in use).

## How to Play

1. Type or click letters to make your guess
2. Press Enter to submit your guess
3. After each guess, the tiles will change color:
   - 🟩 Green: Letter is correct and in the right position
   - 🟨 Yellow: Letter is in the word but in the wrong position
   - ⬜ Gray: Letter is not in the word

4. You have 6 attempts to guess the word
5. All words must be valid 5-letter English words

## Game Features

- **Statistics**: Track your performance with detailed stats including:
  - Games played
  - Win/Loss ratio
  - Current streak
  - Best streak
  - Guess distribution

- **Visual Feedback**: 
  - Color-coded keyboard shows used letters
  - Error messages for invalid words
  - Success animations for wins

- **Responsive Design**: 
  - Works on both desktop and mobile devices
  - Keyboard support for desktop users
  - Touch support for mobile users

## Development

Built with:
- React
- TypeScript
- Vite
- styled-components

## License

MIT License - feel free to use this code for your own projects!
