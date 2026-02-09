
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ASSETS, Obstacle } from '../types';

interface GameProps {
  onGameOver: (score: number) => void;
  onPause: () => void;
}

const GRAVITY = 0.5;
const JUMP_FORCE = -8;
const OBSTACLE_SPEED = 4;
const OBSTACLE_GAP = 220;
const OBSTACLE_WIDTH = 100;
const OBSTACLE_SPAWN_RATE = 1500; // ms

const Game: React.FC<GameProps> = ({ onGameOver, onPause }) => {
  const [score, setScore] = useState(0);
  const [playerY, setPlayerY] = useState(300);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [isReady, setIsReady] = useState(false);
  
  const velocityRef = useRef(0);
  // Fix: Added initial value 0 to satisfy the expected 1 argument for useRef
  const requestRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isGameOverRef = useRef(false);

  const jump = useCallback(() => {
    if (!isReady) {
      setIsReady(true);
      lastSpawnRef.current = performance.now();
      return;
    }
    velocityRef.current = JUMP_FORCE;
  }, [isReady]);

  const update = useCallback((time: number) => {
    if (isGameOverRef.current) return;
    if (!isReady) {
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    // Player Movement
    velocityRef.current += GRAVITY;
    setPlayerY(prev => {
      const next = prev + velocityRef.current;
      if (next < 0 || next > window.innerHeight) {
        handleEnd();
        return prev;
      }
      return next;
    });

    // Obstacle Management
    if (time - lastSpawnRef.current > OBSTACLE_SPAWN_RATE) {
      const gapTop = Math.random() * (window.innerHeight - OBSTACLE_GAP - 200) + 100;
      setObstacles(prev => [...prev, {
        id: Date.now(),
        x: window.innerWidth + 100,
        gapTop,
        width: OBSTACLE_WIDTH,
        passed: false
      }]);
      lastSpawnRef.current = time;
    }

    setObstacles(prev => {
      const nextObstacles = prev
        .map(obs => ({ ...obs, x: obs.x - OBSTACLE_SPEED }))
        .filter(obs => obs.x + obs.width > -100);

      // Collision Detection
      const playerRect = {
        left: 64, // based on the UI position
        right: 160,
        top: playerY + 10,
        bottom: playerY + 86
      };

      for (const obs of nextObstacles) {
        if (
          playerRect.right > obs.x &&
          playerRect.left < obs.x + obs.width
        ) {
          // Fix: Property 'obsTopHeight' does not exist on type 'Obstacle', using 'gapTop' instead
          if (
            playerRect.top < obs.gapTop || 
            playerRect.bottom > obs.gapTop + OBSTACLE_GAP
          ) {
            handleEnd();
          }
        }
        
        // Passing Logic
        if (!obs.passed && obs.x + obs.width < playerRect.left) {
          obs.passed = true;
          setScore(s => s + 1);
        }
      }

      return nextObstacles;
    });

    requestRef.current = requestAnimationFrame(update);
  }, [isReady, playerY]);

  const handleEnd = () => {
    if (isGameOverRef.current) return;
    isGameOverRef.current = true;
    cancelAnimationFrame(requestRef.current!);
    onGameOver(score);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [update]);

  // Handle collisions specifically in a separate effect or combined? 
  // Let's check collisions inside the movement map for efficiency.
  useEffect(() => {
    const playerBounds = { left: 80, right: 140, top: playerY + 20, bottom: playerY + 76 };
    for (const obs of obstacles) {
      if (playerBounds.right > obs.x && playerBounds.left < obs.x + obs.width) {
        if (playerBounds.top < obs.gapTop || playerBounds.bottom > obs.gapTop + OBSTACLE_GAP) {
          handleEnd();
        }
      }
    }
  }, [playerY, obstacles]);

  return (
    <div 
      ref={containerRef}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden nebula-bg select-none"
      onClick={jump}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-20 left-[10%] w-1 h-1 bg-white rounded-full opacity-50 shadow-[0_0_8px_white]"></div>
        <div className="absolute top-60 right-[20%] w-2 h-2 bg-primary/40 rounded-full blur-sm"></div>
        <div className="absolute bottom-40 left-[15%] w-1.5 h-1.5 bg-white rounded-full opacity-30 shadow-[0_0_10px_white]"></div>
        <div className="absolute top-1/2 right-[5%] w-40 h-40 bg-primary/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header UI */}
      <div className="absolute top-0 w-full z-30 px-6 pt-12 flex justify-between items-center">
        <button 
          onClick={(e) => { e.stopPropagation(); onPause(); }}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">pause</span>
        </button>
        <div className="flex-1 flex justify-center">
          <div className="text-white text-7xl font-extrabold tracking-tighter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            {score}
          </div>
        </div>
        <div className="w-12 h-12"></div>
      </div>

      {/* Obstacles (Chrono Pillars) */}
      {obstacles.map(obs => (
        <React.Fragment key={obs.id}>
          {/* Top Pillar */}
          <div 
            className="absolute z-10 chrono-pillar rounded-b-xl border-x border-primary/40 flex items-end justify-center pb-4"
            style={{ 
              left: obs.x, 
              top: 0, 
              width: obs.width, 
              height: obs.gapTop 
            }}
          >
            <div className="w-full h-1 bg-white/30 blur-[2px]"></div>
          </div>
          {/* Bottom Pillar */}
          <div 
            className="absolute z-10 chrono-pillar rounded-t-xl border-x border-primary/40 flex items-start justify-center pt-4"
            style={{ 
              left: obs.x, 
              top: obs.gapTop + OBSTACLE_GAP, 
              width: obs.width, 
              height: window.innerHeight - (obs.gapTop + OBSTACLE_GAP) 
            }}
          >
            <div className="w-full h-1 bg-white/30 blur-[2px]"></div>
          </div>
        </React.Fragment>
      ))}

      {/* Player Character */}
      <div 
        className="absolute left-16 z-20 flex items-center transition-transform duration-75"
        style={{ 
          top: playerY, 
          transform: `rotate(${velocityRef.current * 3}deg)` 
        }}
      >
        <div className="void-trail w-32 h-16 blur-md rounded-full -ml-16 opacity-70"></div>
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
          <img 
            alt="Void Character" 
            className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(91,19,236,0.8)]" 
            src={ASSETS.CHARACTER} 
          />
          <div className="absolute top-8 right-6 w-3 h-1 bg-white blur-[1px] rounded-full z-20 opacity-80"></div>
        </div>
      </div>

      {/* Start Guide */}
      {!isReady && (
        <div className="absolute inset-0 z-40 bg-black/20 flex flex-col items-center justify-end pb-32 pointer-events-none">
          <div className="text-white/40 flex flex-col items-center gap-4 animate-bounce">
            <span className="material-symbols-outlined text-5xl">touch_app</span>
            <span className="text-sm font-bold tracking-[0.3em] uppercase">点击开始时间跳跃</span>
          </div>
        </div>
      )}

      {/* Ground Effect */}
      <div className="absolute bottom-0 w-full h-4 bg-gradient-to-t from-primary/40 to-transparent z-20"></div>
      
      {/* Device Notch Simulation */}
      <div className="fixed top-0 w-full h-8 bg-transparent pointer-events-none z-50 flex justify-center items-center">
        <div className="w-28 h-7 bg-black rounded-full mt-2"></div>
      </div>
    </div>
  );
};

export default Game;
