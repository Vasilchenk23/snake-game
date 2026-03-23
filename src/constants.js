export const GRID_SIZE = 25;
export const INITIAL_SPEED = 150;
export const MIN_SPEED = 50;
export const SPEED_INCREMENT = 2;

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export const SNAKE1_INITIAL = {
  body: [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ],
  direction: DIRECTIONS.RIGHT,
  color: "#4ade80",
  name: "Snake 1 (WASD)",
};

export const SNAKE2_INITIAL = {
  body: [
    { x: 19, y: 19 },
    { x: 20, y: 19 },
    { x: 21, y: 19 },
  ],
  direction: DIRECTIONS.LEFT,
  color: "#60a5fa",
  name: "Snake 2 (Arrows)",
};

export const ITEM_TYPES = {
  FOOD: "FOOD",
  MINE: "MINE",
  BARRIER: "BARRIER",
};

export const COLORS = {
  FOOD: "#f87171",
  MINE: "#fbbf24",
  BARRIER: "#94a3b8",
  BOARD: "#1e293b",
  GRID: "#334155",
};
