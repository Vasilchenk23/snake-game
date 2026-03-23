import { useState, useEffect, useCallback, useRef } from "react";
import {
  GRID_SIZE,
  DIRECTIONS,
  SNAKE1_INITIAL,
  SNAKE2_INITIAL,
  ITEM_TYPES,
} from "./constants";

const getRandomPosition = (exclude = []) => {
  let pos;
  while (!pos || exclude.some((p) => p.x === pos.x && p.y === pos.y)) {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }
  return pos;
};

export const useSnakeGame = () => {
  const [snake1, setSnake1] = useState(SNAKE1_INITIAL);
  const [snake2, setSnake2] = useState(SNAKE2_INITIAL);
  const [food, setFood] = useState(getRandomPosition());
  const [mines, setMines] = useState([]);
  const [barriers, setBarriers] = useState([]);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(150);

  const directionRef1 = useRef(SNAKE1_INITIAL.direction);
  const directionRef2 = useRef(SNAKE2_INITIAL.direction);

  useEffect(() => {
    const initialBarriers = [];
    for (let i = 0; i < 5; i++) {
      initialBarriers.push(getRandomPosition());
    }
    setBarriers(initialBarriers);
  }, []);

  const resetGame = () => {
    setSnake1(SNAKE1_INITIAL);
    setSnake2(SNAKE2_INITIAL);
    directionRef1.current = SNAKE1_INITIAL.direction;
    directionRef2.current = SNAKE2_INITIAL.direction;
    setFood(getRandomPosition());
    setMines([]);
    setScore1(0);
    setScore2(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback((snake, direction) => {
    const newHead = {
      x: snake.body[0].x + direction.x,
      y: snake.body[0].y + direction.y,
    };
    const newBody = [newHead, ...snake.body.slice(0, -1)];
    return { ...snake, body: newBody };
  }, []);

  const checkCollision = (head, otherSnakeBody, ownSnakeBody, barriers) => {
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }
    if (
      ownSnakeBody.some(
        (segment) => segment.x === head.x && segment.y === head.y
      )
    ) {
      return true;
    }
    if (
      otherSnakeBody.some(
        (segment) => segment.x === head.x && segment.y === head.y
      )
    ) {
      return true;
    }
    if (barriers.some((b) => b.x === head.x && b.y === head.y)) {
      return true;
    }
    return false;
  };

  const updateGame = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake1((prev1) => {
      const newHead1 = {
        x: prev1.body[0].x + directionRef1.current.x,
        y: prev1.body[0].y + directionRef1.current.y,
      };

      if (
        checkCollision(newHead1, snake2.body, prev1.body.slice(1), barriers)
      ) {
        setIsGameOver(true);
        return prev1;
      }

      let newBody1 = [newHead1, ...prev1.body];

      if (newHead1.x === food.x && newHead1.y === food.y) {
        setScore1((s) => s + 10);
        setFood(
          getRandomPosition([
            ...newBody1,
            ...snake2.body,
            ...barriers,
            ...mines,
          ])
        );
      } else {
        newBody1.pop();
      }

      const mineIndex = mines.findIndex(
        (m) => m.x === newHead1.x && m.y === newHead1.y
      );
      if (mineIndex !== -1) {
        setScore1((s) => Math.max(0, s - 20));
        setMines((prev) => prev.filter((_, i) => i !== mineIndex));
        if (newBody1.length > 2) newBody1.pop();
      }

      return { ...prev1, body: newBody1 };
    });

    setSnake2((prev2) => {
      const newHead2 = {
        x: prev2.body[0].x + directionRef2.current.x,
        y: prev2.body[0].y + directionRef2.current.y,
      };

      if (
        checkCollision(newHead2, snake1.body, prev2.body.slice(1), barriers)
      ) {
        setIsGameOver(true);
        return prev2;
      }

      let newBody2 = [newHead2, ...prev2.body];

      if (newHead2.x === food.x && newHead2.y === food.y) {
        setScore2((s) => s + 10);
        setFood(
          getRandomPosition([
            ...newBody2,
            ...snake1.body,
            ...barriers,
            ...mines,
          ])
        );
      } else {
        newBody2.pop();
      }

      const mineIndex = mines.findIndex(
        (m) => m.x === newHead2.x && m.y === newHead2.y
      );
      if (mineIndex !== -1) {
        setScore2((s) => Math.max(0, s - 20));
        setMines((prev) => prev.filter((_, i) => i !== mineIndex));
        if (newBody2.length > 2) newBody2.pop();
      }

      return { ...prev2, body: newBody2 };
    });

    if (Math.random() < 0.05 && mines.length < 5) {
      setMines((prev) => [
        ...prev,
        getRandomPosition([
          ...snake1.body,
          ...snake2.body,
          ...barriers,
          food,
          ...prev,
        ]),
      ]);
    }

    const isSnakeNearFood = (snake) => {
      const head = snake.body[0];
      const dist = Math.abs(head.x - food.x) + Math.abs(head.y - food.y);
      return dist < 3;
    };

    if (isSnakeNearFood(snake1) || isSnakeNearFood(snake2)) {
      if (Math.random() < 0.3) {
        const possibleMoves = [
          { x: food.x + 1, y: food.y },
          { x: food.x - 1, y: food.y },
          { x: food.x, y: food.y + 1 },
          { x: food.x, y: food.y - 1 },
        ].filter(
          (p) =>
            p.x >= 0 &&
            p.x < GRID_SIZE &&
            p.y >= 0 &&
            p.y < GRID_SIZE &&
            ![...snake1.body, ...snake2.body, ...barriers, ...mines].some(
              (s) => s.x === p.x && s.y === p.y
            )
        );
        if (possibleMoves.length > 0) {
          setFood(
            possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
          );
        }
      }
    }
  }, [isGameOver, isPaused, snake1, snake2, food, mines, barriers]);

  useEffect(() => {
    const interval = setInterval(updateGame, speed);
    return () => clearInterval(interval);
  }, [updateGame, speed]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case "KeyW":
          if (directionRef1.current !== DIRECTIONS.DOWN)
            directionRef1.current = DIRECTIONS.UP;
          break;
        case "KeyS":
          if (directionRef1.current !== DIRECTIONS.UP)
            directionRef1.current = DIRECTIONS.DOWN;
          break;
        case "KeyA":
          if (directionRef1.current !== DIRECTIONS.RIGHT)
            directionRef1.current = DIRECTIONS.LEFT;
          break;
        case "KeyD":
          if (directionRef1.current !== DIRECTIONS.LEFT)
            directionRef1.current = DIRECTIONS.RIGHT;
          break;

        case "ArrowUp":
          if (directionRef2.current !== DIRECTIONS.DOWN)
            directionRef2.current = DIRECTIONS.UP;
          break;
        case "ArrowDown":
          if (directionRef2.current !== DIRECTIONS.UP)
            directionRef2.current = DIRECTIONS.DOWN;
          break;
        case "ArrowLeft":
          if (directionRef2.current !== DIRECTIONS.RIGHT)
            directionRef2.current = DIRECTIONS.LEFT;
          break;
        case "ArrowRight":
          if (directionRef2.current !== DIRECTIONS.LEFT)
            directionRef2.current = DIRECTIONS.RIGHT;
          break;

        case "KeyP":
          setIsPaused((prev) => !prev);
          break;
        case "Space":
          if (isGameOver) resetGame();
          else setIsPaused((prev) => !prev);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGameOver]);

  return {
    snake1,
    snake2,
    food,
    mines,
    barriers,
    score1,
    score2,
    isGameOver,
    isPaused,
    setIsPaused,
    resetGame,
  };
};
