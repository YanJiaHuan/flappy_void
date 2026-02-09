import React, { useEffect, useState } from 'react';
import mapImage from '../assets/map.jpg';
import heroImage from '../assets/sld.jpg';
import altImage from '../assets/zm.jpg';
import { fetchLeaderboard, fetchUserRank, LeaderboardEntry, Profile } from '../lib/data';

interface LeaderboardScreenProps {
  profile: Profile;
  onBack: () => void;
}

const medalColor = (rank: number) => {
  if (rank === 1) return 'text-void-gold';
  if (rank === 2) return 'text-void-silver';
  if (rank === 3) return 'text-void-bronze';
  return 'text-white/40';
};

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ profile, onBack }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [rank, setRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [list, userRank] = await Promise.all([
          fetchLeaderboard(30),
          fetchUserRank(profile.id)
        ]);
        if (!mounted) return;
        setEntries(list);
        setRank(userRank);
      } catch (err) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : '加载排行榜失败。';
        setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [profile.id]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0 backdrop-map bg-cover bg-center"
        style={{ backgroundImage: `url('${mapImage}')` }}
      ></div>
      <div className="relative z-10 h-full flex flex-col">
        <header className="flex items-center justify-between px-6 pt-10">
          <button className="btn-outline text-xs tracking-[0.3em]" onClick={onBack}>
            返回
          </button>
          <h2 className="text-lg font-display tracking-[0.3em] uppercase">排行榜</h2>
          <div className="w-12"></div>
        </header>

        <div className="px-6 mt-6">
          <div className="stone-panel rounded-2xl p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full overflow-hidden border border-white/20">
              <img src={heroImage} alt="player" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">我的排名</p>
              <p className="text-2xl font-bold text-white">{rank ?? '--'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">最高分</p>
              <p className="text-2xl font-bold text-void-teal">{profile.best_score}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-10 mt-6 leaderboard-scroll">
          {loading && <p className="text-white/60">加载中...</p>}
          {error && <p className="text-void-teal/80">{error}</p>}
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.user_id}
                className="glass-panel rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="flex flex-col items-center w-10">
                  <span className={`material-symbols-outlined ${medalColor(entry.rank)}`}>
                    workspace_premium
                  </span>
                  <span className={`text-sm font-bold ${medalColor(entry.rank)}`}>{entry.rank}</span>
                </div>
                <div className="h-12 w-12 rounded-full overflow-hidden border border-white/20">
                  <img
                    src={entry.avatar_url || (entry.rank % 2 === 0 ? heroImage : altImage)}
                    alt={entry.username}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-white truncate">{entry.username}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">最高得分</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-void-teal">{entry.best_score}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
