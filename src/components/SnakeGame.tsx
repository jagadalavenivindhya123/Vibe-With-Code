import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: { x: number, y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setIsGameOver(false);
    setScore(0);
    setIsPaused(true);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + directionRef.current.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + directionRef.current.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        // Increase speed slightly
        setSpeed((s) => Math.max(s - 2, 50));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (directionRef.current.y === 0) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (directionRef.current.x === 0) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (directionRef.current.x === 0) directionRef.current = { x: 1, y: 0 };
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake, speed]);

  return (
    <div className="flex flex-col items-center gap-6 p-10 bg-black/60 backdrop-blur-md rounded-sm border-4 border-neon-blue neon-border-blue">
      <div className="flex justify-between w-full items-center px-2">
        <h2 className="text-3xl font-black neon-text-blue uppercase tracking-tighter italic">Snake</h2>
        <div className="text-xl font-mono text-neon-green flex gap-2">
          <span>SCORE:</span>
          <span className="neon-text-green">{score.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div 
        className="relative bg-black/90 border-2 border-neon-blue/40 rounded-sm overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Snake segments */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{
              x: segment.x * 20,
              y: segment.y * 20,
            }}
            className="absolute w-5 h-5 rounded-sm"
            style={{
              backgroundColor: i === 0 ? 'var(--color-neon-blue)' : 'rgba(0, 255, 255, 0.6)',
              boxShadow: i === 0 ? '0 0 10px var(--color-neon-blue)' : 'none',
              zIndex: i === 0 ? 10 : 5
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute w-5 h-5 rounded-full bg-neon-pink shadow-[0_0_15px_var(--color-neon-pink)]"
          style={{
            left: food.x * 20,
            top: food.y * 20,
          }}
        />

        {/* Game Over Overlay */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 backdrop-blur-sm"
            >
              <h3 className="text-4xl font-black neon-text-pink mb-4 uppercase italic">Game Over</h3>
              <button 
                onClick={resetGame}
                className="px-6 py-2 bg-neon-blue text-black font-bold rounded-full hover:scale-105 transition-transform neon-border-blue"
              >
                RETRY
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && !isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-40"
            >
              <button 
                onClick={() => setIsPaused(false)}
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center border border-neon-blue group-hover:bg-neon-blue/40 transition-all">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-neon-blue border-b-[10px] border-b-transparent ml-1" />
                </div>
                <span className="text-xs neon-text-blue font-bold tracking-widest">PRESS SPACE TO START</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-xs text-gray-500 font-mono flex gap-4">
        <span>ARROWS TO MOVE</span>
        <span>SPACE TO PAUSE</span>
      </div>
    </div>
  );
}
