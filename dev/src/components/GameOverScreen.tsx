import React from 'react';
import mapImage from '../assets/map.jpg';

interface GameOverScreenProps {
  score: number;
  bestScore: number;
  rank: number | null;
  onReplay: () => void;
  onHome: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, bestScore, rank, onReplay, onHome }) => {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0 backdrop-map bg-cover bg-center"
        style={{ backgroundImage: `url('${mapImage}')` }}
      ></div>
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="stone-panel rounded-3xl p-8 w-full max-w-md text-center space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">游戏结束</p>
            <h2 className="text-4xl font-display font-bold text-white glow-text">{score}</h2>
          </div>

          <div className="flex items-center justify-between bg-white/5 rounded-2xl px-5 py-4">
            <div className="text-left">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">最高纪录</p>
              <p className="text-2xl font-bold text-white">{bestScore}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">全球排名</p>
              <p className="text-2xl font-bold text-void-teal">{rank ?? '--'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="btn-primary w-full" onClick={onReplay}>
              再次挑战
            </button>
            <button className="btn-outline w-full" onClick={onHome}>
              回到基地
            </button>
          </div>

          <p className="text-xs text-white/50">提示：按 F 可切换全屏，空格跳跃。</p>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
