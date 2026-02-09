import React from 'react';
import mapImage from '../assets/map.jpg';
import heroImage from '../assets/sld.jpg';
import { Profile } from '../lib/data';

interface HomeScreenProps {
  profile: Profile;
  onStart: () => void;
  onLeaderboard: () => void;
  onLogout: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ profile, onStart, onLeaderboard, onLogout }) => {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0 backdrop-map bg-cover bg-center"
        style={{ backgroundImage: `url('${mapImage}')` }}
      ></div>
      <div className="relative z-10 h-full flex flex-col">
        <header className="flex items-center justify-between px-6 pt-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">欢迎回来</p>
            <h2 className="text-2xl font-display font-bold text-white">{profile.username}</h2>
          </div>
          <button className="btn-outline text-xs tracking-[0.3em]" onClick={onLogout}>
            退出
          </button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
          <div className="glass-panel rounded-3xl p-6 w-full max-w-sm text-center space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">最佳纪录</p>
            <div className="text-5xl font-display font-bold text-white glow-text">
              {profile.best_score}
            </div>
            <p className="text-sm text-white/50">记录会同步到全球排行榜</p>
          </div>

          <div className="relative w-48 h-48 rounded-full border border-white/10 overflow-hidden bg-white/5 animate-float-slow">
            <img src={heroImage} alt="Void avatar" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-dark/60"></div>
          </div>
        </div>

        <footer className="px-6 pb-12 space-y-4">
          <button className="btn-primary w-full" onClick={onStart}>
            开始跃迁
          </button>
          <button className="btn-outline w-full" onClick={onLeaderboard}>
            查看排行榜
          </button>
        </footer>
      </div>
    </div>
  );
};

export default HomeScreen;
