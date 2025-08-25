# GEMINI.md: Bar Tycoon React Project

## Project Overview

This is a "Bar Tycoon" simulation game built with React and Vite. The core gameplay revolves around managing a bar, from buying ingredients and mixing drinks to serving customers and earning money.

The application state is managed primarily within the `useGameLogic` custom hook, which handles all game actions and state transitions. The UI is composed of several React components that display game information (like money, inventory, and customer orders) and provide controls for the player.

**Key Technologies:**

*   **Frontend:** React
*   **Build Tool:** Vite
*   **Language:** JavaScript
*   **Styling:** CSS (`App.css`)

**Architecture:**

*   **`src/main.jsx`**: The application entry point.
*   **`src/App.jsx`**: The main React component that assembles the UI.
*   **`src/hooks/useGameLogic.js`**: The core of the game's logic, containing all functions for player actions and game state management.
*   **`src/game/`**: Contains the game's data definitions:
    *   `state.js`: Defines the initial state of the game (e.g., starting money, inventory).
    *   `constants.js`: Defines game constants like recipes, drink prices, and ingredient costs.
*   **`src/components/`**: Contains the individual UI components for the game, such as the HUD, the main scene, and panels.

## Building and Running

### Development

To run the development server:

```bash
npm run dev
```

### Production Build

To build the application for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### Linting

To run the linter and check for code quality issues:

```bash
npm run lint
```

## Development Conventions

*   **State Management:** The primary application state is centralized in the `useGameLogic` hook (`src/hooks/useGameLogic.js`). This hook returns the current state and a set of handlers to modify it.
*   **Component Structure:** Components are kept in the `src/components/` directory. They receive the game state and handlers as props from the main `App.jsx` component.
*   **Game Data:** Core game data like recipes and prices are stored in `src/game/constants.js`. The initial game state is defined in `src/game/state.js`.
*   **Styling:** Global styles are defined in `src/App.css`.
*   **File Naming:** Components use PascalCase (`Hud.jsx`), while other JavaScript files use camelCase (`useGameLogic.js`).
