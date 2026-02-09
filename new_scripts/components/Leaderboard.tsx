
import React from 'react';
import { ASSETS } from '../types';

interface LeaderboardProps {
  onBack: () => void;
  bestScore: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack, bestScore }) => {
  const players = [
    { rank: 1, name: '虚空主宰_Dark', score: 14290, title: '永恒之冠', avatar: ASSETS.AVATAR_1, type: 'gold' },
    { rank: 2, name: '时空漫游者', score: 12850, title: '辉耀勇士', avatar: 'https://picsum.photos/100/100?random=1', type: 'silver' },
    { rank: 3, name: 'Chrono_King', score: 11420, title: '精锐使者', avatar: 'https://picsum.photos/100/100?random=2', type: 'bronze' },
    { rank: 4, name: 'Enigma_Fan', score: 9905, title: '', avatar: 'https://picsum.photos/100/100?random=3' },
    { rank: 5, name: '时间停止', score: 8740, title: '', avatar: 'https://picsum.photos/100/100?random=4' },
    { rank: 6, name: 'VoidWalker99', score: 7210, title: '', avatar: 'https://picsum.photos/100/100?random=5' },
    { rank: 7, name: '暗影之牙', score: 6500, title: '', avatar: 'https://picsum.photos/100/100?random=6' },
  ];

  return (
    <div className="relative h-full w-full flex flex-col bg-background-dark overflow-hidden font-display text-white">
      <header className="flex items-center justify-between px-4 pt-12 pb-6 bg-background-dark/80 backdrop-blur-md sticky top-0 z-20 border-b border-primary/10">
        <button 
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-white hover:bg-primary/40 transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="text-xl font-bold tracking-wider text-white uppercase italic">排行榜</h1>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 pb-36 scroll-smooth">
        {players.map((p) => (
          <div 
            key={p.rank} 
            className={`flex items-center gap-4 bg-white/5 border p-4 rounded-xl backdrop-blur-sm relative overflow-hidden transition-all hover:bg-white/10 ${
              p.type === 'gold' ? 'border-void-gold/40' : p.type === 'silver' ? 'border-void-silver/30' : p.type === 'bronze' ? 'border-void-bronze/30' : 'border-white/5'
            }`}
          >
            {p.type === 'gold' && <div className="absolute inset-0 bg-gradient-to-r from-void-gold/10 to-transparent opacity-50"></div>}
            
            <div className="flex flex-col items-center justify-center w-10">
              <span className={`material-symbols-outlined text-2xl ${
                p.type === 'gold' ? 'text-void-gold' : p.type === 'silver' ? 'text-void-silver' : p.type === 'bronze' ? 'text-void-bronze' : 'text-slate-500'
              }`}>
                {p.rank <= 3 ? 'workspace_premium' : 'military_tech'}
              </span>
              <div className={`font-bold text-xl italic leading-none ${
                p.type === 'gold' ? 'text-void-gold' : p.type === 'silver' ? 'text-void-silver' : p.type === 'bronze' ? 'text-void-bronze' : 'text-slate-400'
              }`}>{p.rank}</div>
            </div>

            <div className="relative">
              <div 
                className={`w-12 h-12 rounded-full border-2 bg-cover bg-center shadow-md ${
                  p.type === 'gold' ? 'border-void-gold' : p.type === 'silver' ? 'border-void-silver' : p.type === 'bronze' ? 'border-void-bronze' : 'border-white/20'
                }`}
                style={{ backgroundImage: `url('${p.avatar}')` }}
              ></div>
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-bold text-white text-lg leading-tight truncate">{p.name}</span>
              {p.title && <span className={`text-[10px] font-bold uppercase tracking-widest ${
                p.type === 'gold' ? 'text-void-gold' : p.type === 'silver' ? 'text-void-silver' : 'text-void-bronze'
              }`}>{p.title}</span>}
            </div>

            <div className="text-right">
              <div className="text-void-teal font-bold text-xl leading-none">{p.score.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-1">最高得分</div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-30">
        <div className="bg-primary/90 shadow-[0_-4px_20px_rgba(73,15,189,0.4)] border border-primary/50 rounded-2xl p-4 flex items-center gap-4 text-white">
          <div className="flex flex-col items-center justify-center bg-white/20 rounded-xl px-3 py-1">
            <span className="text-[10px] uppercase font-bold text-white/70">我的排名</span>
            <span className="text-lg font-bold">1,234</span>
          </div>
          <div 
            className="w-12 h-12 rounded-full border-2 border-white/50 bg-cover bg-center" 
            style={{ backgroundImage: `url('${ASSETS.CHARACTER}')` }}
          ></div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-base truncate">我的虚空行者 (你)</div>
            <div className="text-[10px] text-primary bg-white/90 rounded-full w-fit px-2 mt-0.5 font-bold uppercase">青铜阶位</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase text-white/70 mb-0.5">最高得分</div>
            <div className="text-xl font-bold text-void-teal leading-none">{bestScore}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
