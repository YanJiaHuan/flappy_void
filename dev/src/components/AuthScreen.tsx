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

  const isValidEmail = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || trimmed.length > 100) return false;
    if (/\s/.test(trimmed)) return false;
    const basic = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return basic.test(trimmed);
  };

  const isValidUsername = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 2 || trimmed.length > 18) return false;
    return /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(trimmed);
  };

  const withTimeout = async <T,>(promise: Promise<T>, label: string, ms = 8000) => {
    let timer: number | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = window.setTimeout(() => reject(new Error(`${label}超时，请检查网络或服务是否可访问。`)), ms);
    });
    try {
      return await Promise.race([promise, timeout]);
    } finally {
      if (timer) window.clearTimeout(timer);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (!isValidEmail(email)) {
        setMessage('邮箱格式不正确，请输入有效邮箱。');
        return;
      }

      if (mode === 'login') {
        const { error } = await withTimeout(
          supabase.auth.signInWithPassword({ email: email.trim(), password }),
          '登录'
        );
        if (error) throw error;
      } else {
        if (!isValidUsername(username)) {
          setMessage('昵称需为 2-18 位中文/字母/数字/下划线。');
          return;
        }
        const { data: existingUser } = await withTimeout(
          supabase
            .from('profiles')
            .select('id')
            .eq('username', username.trim())
            .maybeSingle(),
          '检查昵称'
        );
        if (existingUser) {
          setMessage('该昵称已被使用，请更换。');
          return;
        }
        const { data, error } = await withTimeout(
          supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: { username: username.trim() }
            }
          }),
          '注册'
        );
        if (error) throw error;
        if (data.user && data.session) {
          await upsertProfile({
            id: data.user.id,
            username: username.trim(),
            best_score: 0,
            avatar_url: null
          });
          setMessage('注册成功，正在进入游戏...');
        } else {
          const { error: signInError } = await withTimeout(
            supabase.auth.signInWithPassword({
              email: email.trim(),
              password
            }),
            '登录'
          );
          if (signInError) {
            setMode('login');
            setMessage('注册成功，请直接登录。若提示需要验证邮箱，请在 Supabase 关闭邮件确认。');
          }
        }
      }
    } catch (err) {
      const raw = err instanceof Error ? err.message : '认证失败，请重试。';
      if (raw.toLowerCase().includes('duplicate') || raw.toLowerCase().includes('already registered')) {
        setMessage('该邮箱或昵称已被使用。');
      } else if (raw.toLowerCase().includes('confirm') || raw.toLowerCase().includes('verified')) {
        setMessage('该账号需要邮箱验证。请在 Supabase 关闭邮件确认后再试。');
      } else {
        setMessage(raw);
      }
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
                  minLength={2}
                  maxLength={18}
                  pattern="[a-zA-Z0-9_\\u4e00-\\u9fa5]+"
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
                maxLength={100}
                pattern="[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}"
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
