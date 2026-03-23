import React from 'react';
import { useSnakeGame } from './useSnakeGame';
import { GRID_SIZE, COLORS } from './constants';
import './App.css';

function App() {
  const {
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
  } = useSnakeGame();

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        let type = 'empty';
        if (snake1.body.some(s => s.x === x && s.y === y)) type = 'snake1';
        else if (snake2.body.some(s => s.x === x && s.y === y)) type = 'snake2';
        else if (food.x === x && food.y === y) type = 'food';
        else if (mines.some(m => m.x === x && m.y === y)) type = 'mine';
        else if (barriers.some(b => b.x === x && b.y === y)) type = 'barrier';

        cells.push(
          <div
            key={`${x}-${y}`}
            className={`cell ${type}`}
            style={{
              '--cell-size': `calc(min(80vh, 80vw) / ${GRID_SIZE})`,
            }}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <h1 className="title">Neon Snake Battle</h1>
        <div className="scoreboard">
          <div className="score p1">
            <span className="name">{snake1.name}</span>
            <span className="value">{score1}</span>
          </div>
          <div className="score p2">
            <span className="name">{snake2.name}</span>
            <span className="value">{score2}</span>
          </div>
        </div>
      </header>

      <main className="game-main">
        <div className="board-wrapper">
          <div 
            className="board" 
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            }}
          >
            {renderGrid()}
          </div>

          {(isPaused || isGameOver) && (
            <div className="overlay">
              {isGameOver ? (
                <div className="modal game-over">
                  <h2>Game Over!</h2>
                  <p>
                    {score1 > score2 ? 'Snake 1 Wins!' : score2 > score1 ? 'Snake 2 Wins!' : 'It\'s a Draw!'}
                  </p>
                  <button onClick={resetGame}>Play Again</button>
                </div>
              ) : (
                <div className="modal paused">
                  <h2>Paused</h2>
                  <button onClick={() => setIsPaused(false)}>Resume</button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="game-footer">
        <div className="controls-hint">
          <p><span>WASD</span> for Green</p>
          <p><span>ARROWS</span> for Blue</p>
          <p><span>SPACE</span> to Pause/Resume</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
