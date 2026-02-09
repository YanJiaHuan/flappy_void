
import React from 'react';
import { ASSETS } from '../types';

interface GameOverProps {
  score: number;
  bestScore: number;
  onReplay: () => void;
  onHome: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, bestScore, onReplay, onHome }) => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-background-dark font-display text-white overflow-hidden p-6">
      {/* Background with blurry preview of game over world */}
      <div className="absolute inset-0 z-0">
        <div 
          className="relative h-full w-full bg-cover bg-center grayscale opacity-40 blur-sm" 
          style={{ backgroundImage: `url('${ASSETS.SETTLEMENT_BG}')` }}
        >
          <div className="absolute inset-0 bg-background-dark/60"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[340px] animate-in fade-in zoom-in duration-300">
        <div className="bg-void-stone/95 border border-primary/30 rounded-2xl shadow-[0_0_50px_rgba(91,19,236,0.3)] overflow-hidden stone-texture backdrop-blur-md">
          <div className="pt-8 pb-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(91,19,236,0.8)] uppercase italic">
              游戏结束
            </h1>
            <div className="mt-2 h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
          </div>

          <div className="px-6 py-4 flex flex-col gap-4">
            <div className="bg-[#2f2348] rounded-xl p-6 text-center border border-white/5 shadow-inner">
              <p className="text-void-accent text-xs font-bold uppercase tracking-widest mb-2">当前得分</p>
              <p className="text-6xl font-black text-white leading-none drop-shadow-md">{score}</p>
            </div>

            <div className="bg-[#2f2348]/50 rounded-xl p-5 flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-4">
                <div className="bg-primary/30 p-2.5 rounded-full">
                  <span className="material-symbols-outlined text-void-teal text-2xl">emoji_events</span>
                </div>
                <div>
                  <p className="text-void-accent text-xs font-bold uppercase tracking-widest mb-1 leading-none">最高得分</p>
                  <p className="text-3xl font-bold text-white leading-none">{bestScore}</p>
                </div>
              </div>
              <div className="bg-primary text-[10px] font-bold px-3 py-1.5 rounded-md text-white tracking-widest uppercase">
                排名 12
              </div>
            </div>
          </div>

          <div className="px-6 pb-10 pt-4 flex justify-center gap-10">
            <div className="flex flex-col items-center gap-3">
              <button 
                onClick={onReplay}
                className="w-16 h-16 bg-primary hover:bg-primary/80 text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/40 transition-transform active:scale-90"
              >
                <span className="material-symbols-outlined text-3xl">refresh</span>
              </button>
              <span className="text-void-accent text-xs font-bold uppercase tracking-widest opacity-80">重玩</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <button 
                onClick={onHome}
                className="w-16 h-16 bg-[#2f2348] hover:bg-[#3a2c5a] text-white rounded-full flex items-center justify-center border border-white/10 transition-transform active:scale-90"
              >
                <span className="material-symbols-outlined text-3xl">home</span>
              </button>
              <span className="text-void-accent text-xs font-bold uppercase tracking-widest opacity-80">首页</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center px-6">
          <p className="text-void-accent/60 text-[11px] italic leading-relaxed tracking-wide">
            “超脱于时光之外，身处于万念之先。”
          </p>
        </div>
      </div>

      <div className="fixed bottom-4 left-0 right-0 flex justify-center z-20 opacity-30">
        <div className="w-32 h-1 bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
};

export default GameOver;
