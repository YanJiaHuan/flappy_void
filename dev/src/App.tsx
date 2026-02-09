import React, { useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import {
  fetchProfile,
  fetchUserRank,
  Profile,
  recordScore,
  upsertProfile
} from './lib/data';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import SetupScreen from './components/SetupScreen';

const hasSupabaseConfig = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

type ViewMode = 'auth' | 'home' | 'leaderboard' | 'play' | 'gameover' | 'loading' | 'setup';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [view, setView] = useState<ViewMode>('loading');
  const [lastScore, setLastScore] = useState(0);
  const [rank, setRank] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const bestScore = useMemo(() => profile?.best_score ?? 0, [profile]);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setView('setup');
      return;
    }

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      if (data.session?.user) {
        await hydrateProfile(data.session.user.id, data.session.user.user_metadata?.username);
        setView('home');
      } else {
        setView('auth');
      }
    };

    init().catch(() => setView('auth'));

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession?.user) {
        setProfile(null);
        setView('auth');
        return;
      }
      await hydrateProfile(nextSession.user.id, nextSession.user.user_metadata?.username);
      setView('home');
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const hydrateProfile = async (userId: string, fallbackName?: string) => {
    try {
      const existing = await fetchProfile(userId);
      if (existing) {
        setProfile(existing);
        return;
      }
      const username = fallbackName || `Void-${userId.slice(0, 6)}`;
      const nextProfile: Profile = {
        id: userId,
        username,
        best_score: 0,
        avatar_url: null
      };
      await upsertProfile(nextProfile);
      setProfile(nextProfile);
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载用户资料失败。';
      setStatus(message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleGameOver = async (score: number) => {
    setLastScore(score);
    setView('gameover');

    if (!session?.user || !profile) return;

    try {
      const nextBest = await recordScore(session.user.id, score);
      setProfile({ ...profile, best_score: nextBest });
      const userRank = await fetchUserRank(session.user.id);
      setRank(userRank);
    } catch (err) {
      const message = err instanceof Error ? err.message : '同步成绩失败。';
      setStatus(message);
    }
  };

  if (view === 'setup') {
    return <SetupScreen />;
  }

  if (view === 'loading') {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="glass-panel rounded-2xl px-6 py-4">正在进入虚空...</div>
      </div>
    );
  }

  if (!session || !profile) {
    return (
      <div className="h-full w-full">
        <AuthScreen />
        {status && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 rounded-full text-xs">
            {status}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {view === 'home' && (
        <HomeScreen
          profile={profile}
          onStart={() => {
            setRank(null);
            setView('play');
          }}
          onLeaderboard={() => setView('leaderboard')}
          onLogout={handleLogout}
        />
      )}
      {view === 'leaderboard' && (
        <LeaderboardScreen profile={profile} onBack={() => setView('home')} />
      )}
      {view === 'play' && (
        <GameScreen
          onGameOver={handleGameOver}
          onExit={() => setView('home')}
        />
      )}
      {view === 'gameover' && (
        <GameOverScreen
          score={lastScore}
          bestScore={bestScore}
          rank={rank}
          onReplay={() => setView('play')}
          onHome={() => setView('home')}
        />
      )}

      {status && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 rounded-full text-xs">
          {status}
        </div>
      )}
    </div>
  );
};

export default App;
