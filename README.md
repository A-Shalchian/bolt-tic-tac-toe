# Infinite Tic-Tac-Toe

![Infinite Tic-Tac-Toe](public/favicon.ico) Yes I created this...

A modern twist on the classic Tic-Tac-Toe game featuring a unique repeating board mechanic. Play against adaptive AI opponents or challenge your friends in real-time multiplayer matches.

## Features

- **Infinite Board**: Unique repeating board mechanic that gives the game its name.
- **Multiple Game Modes**:
  - Single Player: Challenge the AI with adjustable difficulty levels.
  - Multiplayer: Play against friends on the same device.
- **Time Control Options**:
  - Timed matches with customizable time limits
  - Untimed casual play
- **Customizable Settings**:
  - Adjustable board size
  - Configurable win conditions
  - Different difficulty levels for AI opponent
- **Responsive Design**: Works on both desktop and mobile devices.
- **Modern UI**: Clean, intuitive interface with smooth animations.

## Technologies Used

- React.js with Next.js framework
- TypeScript for type safety
- Zustand for state management
- Tailwind CSS for styling

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/A-Shalchian/infinitic-tac-toe.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to play

## How to Play

1. **Choose Game Mode**: Select Single Player or Multiplayer mode from the main menu
2. **Configure Settings**: Choose time controls, board size, and other options
3. **Make Your Move**: Click on any square to place your symbol
4. **Win Condition**: Connect the required number of symbols (horizontally, vertically, or diagonally) to win
5. **Infinite Mechanic**: When you place 3 symbols, the first symbol that you placed disappears, and it goes on from there.

## TO-DO List

- [ ] Add online multiplayer support
- [ ] Implement user accounts and persistent statistics
- [x] Fix game settings state management
- [x] Add close button to game-over popup
- [x] Fix React hook dependency warnings
- [x] Update favicon and page title
- [ ] Add sound effects and background music
- [ ] Create tutorial mode for new players
- [ ] Implement different themes/skins
- [ ] Add mobile touch optimization
- [ ] Create AI difficulty levels beyond current options
- [ ] Add replay feature to review games

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
