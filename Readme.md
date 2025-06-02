# 2D Grid World Game API

## Overview
This API powers a game where players navigate from a starting point to an endpoint on a 50x50 grid while managing health and moves.

**Tech Stack:**  
This project is implemented in **Node.js** using **TypeScript**. It uses Express for the API layer, Jest for testing, and ESLint for code quality.

## Features
- Create new games with randomly generated 50x50 grid
- Save and load game progress*
- Move up, down, left or right
- Each location on the grid - a Cell - has a specific effect that impacts health and moves
- Tracks current state - win/lose
- Player starts at a random spot on one side of the grid and must move to a randomly selected end point on the other side of the grid.
- The current state of the grid will show the current position and the type/effect of surrounding locations/cells

* Current implementation uses an in-memory persistence layer for saving and loading games.

## API Endpoints

### Create New Game
`POST /api/games`
- Returns: New game state

### Save Game
`POST /api/games/:id/save`
- Saves current game state

### Load Game
`GET /api/games/:id`
- Returns: Saved game state

### Make Move
`POST /api/games/:id/move`
- Body: `{ "move": "up|down|left|right" }`
- Returns: Updated game state

### View Player State
`GET /api/games/:id/player`
- Returns: Current player state

## Cell Type Effects
| Cell Type   | Health Effect | Move Effect |
|-----------|---------------|--------------|
| Blank     | 0             | -1           |
| Speeder   | -5            | 0            |
| Lava      | -50           | -10          |
| Mud       | -10           | -5           |


## Game Rules
- Start with 200 health and 450 moves
- Reach the goal/destination point to win
- Game ends if health reaches 0 or moves reaches 0
- Only surrounding cells are visible/known

## Setup

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd gameapi
   ```
2. Install dependencies: `npm install`
3. Start server: `npm run dev`
4. Run tests: `npm test`
5. Run tests with coverage: `npm run test:coverage`

## Sample REST calls
### Create New Game:
curl -X POST http://localhost:3000/api/games 

### Make a Move - valid moves are up, down, left, right:
curl -X POST http://localhost:3000/api/games/{GameId}/move \
  -H "Content-Type: application/json" \
  -d '{"direction":"right"}'

### Save Game:
curl -X POST http://localhost:3000/api/game/{GameId}

### Load Game:
curl -X GET http://localhost:3000/api/game/{GameId}

### Retrieve player stats:
curl -X GET http://localhost:3000/api/game/{GameId}/player
