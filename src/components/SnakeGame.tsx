import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

type Point = { x: number; y: number };

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const directionRef = useRef<Point>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
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
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

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

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, isGameOver, isPaused, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (directionRef.current.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (directionRef.current.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (directionRef.current.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const animate = (time: number) => {
      if (lastUpdateRef.current === 0) lastUpdateRef.current = time;
      
      const deltaTime = time - lastUpdateRef.current;
      const speed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 5);

      if (deltaTime >= speed) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      
      gameLoopRef.current = requestAnimationFrame(animate);
    };

    gameLoopRef.current = requestAnimationFrame(animate);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake, score]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full max-w-2xl px-4 tear-anim">
      {/* Game Header */}
      <div className="flex justify-between w-full items-end pb-1 border-b-2 border-glitch-magenta">
        <div>
          <h2 className="font-display text-5xl uppercase tracking-tighter glitch-text text-glitch-cyan">CORE_SNAKE.EXE</h2>
          <p className="text-[10px] font-mono text-glitch-magenta uppercase tracking-[0.3em] mt-1">ERROR: SEGMENTATION_FAULT_PENDING</p>
        </div>
        <div className="text-right">
          <div className="text-glitch-magenta font-mono text-3xl font-bold">
            [{score.toString().padStart(4, '0')}]
          </div>
          <p className="text-[10px] font-mono text-glitch-cyan uppercase">MAX_BIT: {highScore.toString().padStart(4, '0')}</p>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative aspect-square w-full max-w-sm overflow-hidden glitch-border bg-glitch-black">
        <div className="absolute inset-0 scanline-jarring" />
        <div className="absolute inset-0 static-noise" />
        
        <div 
          className="grid w-full h-full relative z-1" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` 
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`
                  relative border-[0.5px] border-glitch-white/10
                  ${isHead ? 'bg-glitch-cyan scale-110 z-10' : isSnake ? 'bg-glitch-cyan/60' : ''}
                `}
              >
                {isFood && (
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 0.2, ease: "steps(4)" }}
                    className="w-full h-full bg-glitch-magenta" 
                  />
                )}
                {isHead && (
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1/2 h-1/2 bg-glitch-black" />
                   </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-glitch-magenta/90 mix-blend-difference flex flex-col items-center justify-center p-8 text-center z-20"
            >
              {isGameOver ? (
                <>
                  <h3 className="font-display text-7xl text-glitch-black uppercase mb-2 glitch-text">FATAL_ERR</h3>
                  <p className="text-glitch-black font-mono text-sm font-bold mb-8">MEMORY LEAK AT ADDR_0x{score.toString(16).toUpperCase()}</p>
                  <button 
                    onClick={resetGame}
                    className="px-8 py-3 bg-glitch-black text-glitch-white uppercase font-mono tracking-widest border-2 border-glitch-white hover:bg-glitch-white hover:text-glitch-black transition-none active:translate-x-1 active:translate-y-1"
                  >
                    RE_REBOOT()
                  </button>
                </>
              ) : (
                <>
                  <h3 className="font-display text-7xl text-glitch-cyan uppercase mb-6 tracking-tighter glitch-text bg-glitch-black px-4">HALT</h3>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="px-10 py-4 bg-glitch-black text-glitch-cyan uppercase font-mono tracking-widest border-2 border-glitch-cyan hover:bg-glitch-cyan hover:text-glitch-black transition-none font-bold"
                  >
                    RESUME_EXECUTION
                  </button>
                  <p className="mt-8 text-[10px] text-glitch-black uppercase font-mono tracking-[0.3em] font-bold">INTERRUPT_VECTOR: [SPACE]</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Legend */}
      <div className="flex gap-4 text-[10px] font-mono text-glitch-cyan/60 uppercase tracking-widest">
        <div className="flex items-center gap-1">
          <span className="bg-glitch-white text-glitch-black px-1 font-bold">DRV</span>
          <span>ARWS</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="bg-glitch-white text-glitch-black px-1 font-bold">CMD</span>
          <span>SPCE</span>
        </div>
      </div>
    </div>
  );
};
