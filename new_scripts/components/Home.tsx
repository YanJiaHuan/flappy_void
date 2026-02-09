
import React from 'react';
import { ASSETS } from '../types';

interface HomeProps {
  onStart: () => void;
  onLeaderboard: () => void;
  onLogout: () => void;
  bestScore: number;
}

const Home: React.FC<HomeProps> = ({ onStart, onLeaderboard, onLogout, bestScore }) => {
  return (
    <div className="relative flex h-full w-full flex-col bg-background-dark overflow-hidden select-none">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-40 bg-center bg-cover animate-pulse-slow" style={{ backgroundImage: `url('${ASSETS.NEBULA}')` }}></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-void-teal rounded-full blur-sm opacity-50"></div>
        <div className="absolute top-3/4 left-2/3 w-3 h-3 bg-primary rounded-full blur-md opacity-40"></div>
        <div className="absolute top-1/2 left-10 w-1 h-1 bg-white rounded-full opacity-60"></div>
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"></div>
      </div>

      <header className="relative z-10 flex flex-col items-center px-6 pt-12">
        <div className="flex items-center justify-between w-full mb-8">
          <div className="flex flex-col">
            <span className="text-[12px] uppercase tracking-[0.1em] text-void-teal/80 font-bold">最佳纪录</span>
            <span className="text-2xl font-bold tracking-tight text-white">{bestScore}</span>
          </div>
          <button 
            onClick={onLogout}
            className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
        <div className="text-center mt-4">
          <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter glowing-text text-white leading-none">
            FLAPPY<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-primary">VOID</span>
          </h1>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-4">
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-48 h-48 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: `url('${ASSETS.SKULL}')` }}></div>
          </div>
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-[40px] scale-75 border border-primary/20"></div>
          <div className="absolute inset-0 border-[2px] border-void-teal/10 rounded-full scale-110"></div>
        </div>
      </main>

      <footer className="relative z-10 flex flex-col items-center gap-4 px-8 pb-16 w-full max-w-md mx-auto">
        <button 
          onClick={onStart}
          className="stone-texture group relative w-full h-16 rounded-xl flex items-center justify-center overflow-hidden active:scale-95 transition-transform duration-75"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center gap-3">
            <span className="material-symbols-outlined text-void-teal text-3xl">play_arrow</span>
            <span className="text-xl font-bold tracking-[0.2em] text-white italic uppercase">开始游戏</span>
          </div>
          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-void-teal opacity-50"></div>
        </button>

        <button 
          onClick={onLeaderboard}
          className="w-full h-14 rounded-lg bg-[#2f2348]/40 border border-white/10 flex items-center justify-center backdrop-blur-sm active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-white/70">leaderboard</span>
            <span className="text-base font-semibold tracking-wider text-white/90">排行榜</span>
          </div>
        </button>
      </footer>
      
      <div className="h-8 w-full flex justify-center items-end pb-4 relative z-10">
        <div className="w-32 h-1 bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
};

export default Home;
