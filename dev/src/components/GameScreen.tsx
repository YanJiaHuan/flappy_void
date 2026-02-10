import React, { useEffect, useMemo, useRef, useState } from 'react';
import mapImage from '../assets/map.jpg';
import heroImage from '../assets/sld.jpg';
import { FlappyEngine, GameMode } from '../game/engine';

const GAME_WIDTH = 420;
const GAME_HEIGHT = 640;

interface GameScreenProps {
  onGameOver: (score: number) => void;
  onExit: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver, onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(new FlappyEngine({ width: GAME_WIDTH, height: GAME_HEIGHT }));
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const gameOverRef = useRef(false);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState<GameMode>('ready');
  const scoreRef = useRef(0);
  const modeRef = useRef<GameMode>('ready');
  const [readyMessage, setReadyMessage] = useState('点击/空格开始');

  const assets = useMemo(() => {
    const bg = new Image();
    bg.src = mapImage;
    const hero = new Image();
    hero.src = heroImage;
    return { bg, hero };
  }, []);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = GAME_WIDTH * dpr;
    canvas.height = GAME_HEIGHT * dpr;
    canvas.style.width = `${GAME_WIDTH}px`;
    canvas.style.height = `${GAME_HEIGHT}px`;

    const scale = Math.min(
      container.clientWidth / GAME_WIDTH,
      container.clientHeight / GAME_HEIGHT
    );

    canvas.style.transform = `scale(${scale})`;
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (assets.bg.complete) {
      const scale = Math.max(GAME_WIDTH / assets.bg.width, GAME_HEIGHT / assets.bg.height);
      const width = assets.bg.width * scale;
      const height = assets.bg.height * scale;
      ctx.drawImage(assets.bg, (GAME_WIDTH - width) / 2, (GAME_HEIGHT - height) / 2, width, height);
      const overlay = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
      overlay.addColorStop(0, 'rgba(8, 6, 18, 0.45)');
      overlay.addColorStop(1, 'rgba(8, 6, 18, 0.9)');
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    } else {
      ctx.fillStyle = '#0b0714';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    const engine = engineRef.current;
    const { gap, width, ground } = engine.getObstacleConfig();

    ctx.fillStyle = 'rgba(16, 12, 26, 0.85)';
    ctx.fillRect(0, GAME_HEIGHT - ground, GAME_WIDTH, ground);

    for (const obs of engine.obstacles) {
      const gradient = ctx.createLinearGradient(obs.x, 0, obs.x + width, 0);
      gradient.addColorStop(0, 'rgba(81, 38, 146, 0.85)');
      gradient.addColorStop(1, 'rgba(20, 12, 36, 0.9)');
      ctx.fillStyle = gradient;
      ctx.fillRect(obs.x, 0, width, obs.gapY);
      ctx.fillRect(obs.x, obs.gapY + gap, width, GAME_HEIGHT - ground - (obs.gapY + gap));

      ctx.strokeStyle = 'rgba(44, 247, 212, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x + 6, 6, width - 12, obs.gapY - 12);
      ctx.strokeRect(obs.x + 6, obs.gapY + gap + 6, width - 12, GAME_HEIGHT - ground - (obs.gapY + gap) - 12);
    }

    const player = engine.player;
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(Math.min(player.vy / 600, 0.6));
    ctx.shadowColor = 'rgba(111, 44, 255, 0.6)';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(0, 0, player.r + 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(111, 44, 255, 0.2)';
    ctx.fill();

    if (assets.hero.complete) {
      ctx.drawImage(assets.hero, -player.r, -player.r, player.r * 2, player.r * 2);
    } else {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(0, 0, player.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 25; i++) {
      const x = (i * 73 + 120) % GAME_WIDTH;
      const y = (i * 97 + 40) % (GAME_HEIGHT - ground);
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  };

  const endGame = () => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;
    const engine = engineRef.current;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    onGameOver(engine.score);
  };

  const tick = (time: number) => {
    const last = lastTimeRef.current || time;
    const dt = Math.min(0.033, (time - last) / 1000);
    lastTimeRef.current = time;

    const engine = engineRef.current;
    engine.step(dt);

    if (engine.score !== scoreRef.current) {
      scoreRef.current = engine.score;
      setScore(engine.score);
    }

    if (engine.mode !== modeRef.current) {
      modeRef.current = engine.mode;
      setMode(engine.mode);
    }

    render();

    if (engine.mode === 'over') {
      endGame();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    resizeCanvas();
    const onResize = () => resizeCanvas();
    window.addEventListener('resize', onResize);
    document.addEventListener('fullscreenchange', onResize);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('fullscreenchange', onResize);
    };
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'ArrowUp') {
        event.preventDefault();
        engineRef.current.jump();
        return;
      }
      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        const container = containerRef.current;
        if (!container) return;
        if (!document.fullscreenElement) {
          container.requestFullscreen().catch(() => null);
        } else {
          document.exitFullscreen().catch(() => null);
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    const handlePointer = () => engine.jump();
    const handleContext = (event: MouseEvent) => event.preventDefault();

    const canvas = canvasRef.current;
    canvas?.addEventListener('pointerdown', handlePointer);
    canvas?.addEventListener('contextmenu', handleContext);

    return () => {
      canvas?.removeEventListener('pointerdown', handlePointer);
      canvas?.removeEventListener('contextmenu', handleContext);
    };
  }, []);

  const handleContainerPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('button')) return;
    engineRef.current.jump();
  };

  useEffect(() => {
    window.advanceTime = (ms: number) => {
      const engine = engineRef.current;
      const steps = Math.max(1, Math.round(ms / (1000 / 60)));
      for (let i = 0; i < steps; i++) {
        engine.step(1 / 60);
        if (engine.mode === 'over') {
          break;
        }
      }
      render();
      if (engine.mode === 'over') {
        endGame();
      }
    };

    window.render_game_to_text = () => {
      const snapshot = engineRef.current.getSnapshot();
      return JSON.stringify({
        mode: snapshot.mode,
        score: snapshot.score,
        player: snapshot.player,
        obstacles: snapshot.obstacles.map((obs) => ({
          x: obs.x,
          gapY: obs.gapY,
          passed: obs.passed
        })),
        obstacleGap: engineRef.current.getObstacleConfig().gap,
        obstacleWidth: engineRef.current.getObstacleConfig().width,
        coordinateSystem: 'origin top-left; x right; y down; units px; game area 420x640'
      });
    };

    return () => {
      delete window.advanceTime;
      delete window.render_game_to_text;
    };
  }, []);

  useEffect(() => {
    const readyTexts = ['点击/空格开始', '点按屏幕跳跃', 'Press Space to Leap'];
    let index = 0;
    const id = window.setInterval(() => {
      index = (index + 1) % readyTexts.length;
      setReadyMessage(readyTexts[index]);
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full flex items-center justify-center bg-background-dark overflow-hidden"
      onPointerDown={handleContainerPointer}
    >
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <button
          className="btn-outline text-xs tracking-[0.3em] uppercase"
          onClick={onExit}
        >
          返回
        </button>
        <div className="text-4xl font-display font-black tracking-[0.2em] text-white glow-text">
          {score}
        </div>
        <div className="text-[10px] uppercase text-white/40 tracking-[0.3em]">Void Run</div>
      </div>

      <canvas ref={canvasRef} className="game-canvas relative z-10 rounded-3xl glow-border" />

      {mode === 'ready' && (
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-28 z-30">
          <div className="glass-panel px-6 py-4 rounded-full text-sm uppercase tracking-[0.3em] text-white/70">
            {readyMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
