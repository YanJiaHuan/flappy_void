import React, { useState } from 'react';
import mapImage from '../assets/map.jpg';
import heroImage from '../assets/zm.jpg';
import { supabase } from '../lib/supabase';
import { upsertProfile } from '../lib/data';

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username }
          }
        });
        if (error) throw error;
        if (data.user && data.session) {
          await upsertProfile({
            id: data.user.id,
            username,
            best_score: 0,
            avatar_url: null
          });
        } else {
          setMessage('注册成功，请前往邮箱完成验证后登录。');
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '认证失败，请重试。';
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0 backdrop-map bg-cover bg-center"
        style={{ backgroundImage: `url('${mapImage}')` }}
      ></div>
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6">
        <div className="glass-panel max-w-md w-full rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Temporal Void</p>
              <h1 className="text-3xl font-display font-bold text-white glow-text">Flappy Void</h1>
            </div>
            <div className="h-14 w-14 rounded-2xl overflow-hidden border border-white/20">
              <img src={heroImage} alt="Void hero" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="flex rounded-full bg-white/5 p-1 text-xs uppercase tracking-[0.3em]">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 rounded-full py-2 transition-all ${
                mode === 'login' ? 'bg-primary/80 text-white' : 'text-white/50'
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-full py-2 transition-all ${
                mode === 'signup' ? 'bg-primary/80 text-white' : 'text-white/50'
              }`}
            >
              注册
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-white/50">昵称</label>
                <input
                  className="input-field mt-2"
                  placeholder="虚空行者"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-white/50">邮箱</label>
              <input
                className="input-field mt-2"
                type="email"
                placeholder="void@astral.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-white/50">密码</label>
              <input
                className="input-field mt-2"
                type="password"
                placeholder="至少 8 位"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </div>

            {message && (
              <div className="text-sm text-void-teal/80 bg-white/5 rounded-xl px-4 py-3">
                {message}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? '连接虚空...' : mode === 'login' ? '进入虚空' : '立刻注册'}
            </button>
          </form>

          <p className="text-xs text-white/50 leading-relaxed">
            登录即表示您同意虚空协议与隐私条款。支持邮箱密码登录与排行榜同步。
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
