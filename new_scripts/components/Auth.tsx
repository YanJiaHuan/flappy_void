
import React, { useState } from 'react';
import { ASSETS } from '../types';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 800);
  };

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden bg-background-dark font-display text-white">
      {/* Background with Cosmic Aura */}
      <div className="absolute inset-0 z-0 opacity-40 animate-pulse-slow bg-cover bg-center" style={{ backgroundImage: `url('${ASSETS.COSMIC_BG}')` }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-background-dark/80 via-background-dark/40 to-background-dark z-0"></div>

      <div className="relative z-10 flex items-center p-4 justify-center sticky top-0">
        <h2 className="text-white text-xl font-bold italic tracking-tight uppercase">Flappy Void</h2>
      </div>

      <div className="relative z-10 px-4 py-4">
        <div className="w-full relative bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-2xl min-h-[180px] shadow-2xl shadow-primary/30" style={{ backgroundImage: `url('${ASSETS.COSMIC_BG}')` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-90"></div>
          <div className="relative p-6">
            <div className="inline-flex items-center px-2 py-1 rounded bg-primary/30 border border-primary/50 mb-2">
              <span className="text-[10px] font-bold tracking-widest text-void-teal uppercase">faceless void</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight italic uppercase">虚空先行者</h1>
            <p className="text-sm text-slate-300">加入虚空，开启您的进化之旅</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 pt-4">
        <div className="flex border-b border-[#443267] justify-between">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 flex-1 transition-all ${isLogin ? 'border-b-primary text-white' : 'border-b-transparent text-[#a492c9] opacity-70 hover:opacity-100'}`}
          >
            <p className="text-sm font-bold leading-normal tracking-wider uppercase">登录</p>
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 flex-1 transition-all ${!isLogin ? 'border-b-primary text-white' : 'border-b-transparent text-[#a492c9] opacity-70 hover:opacity-100'}`}
          >
            <p className="text-sm font-bold leading-normal tracking-wider uppercase">注册</p>
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-4 px-4 py-8 flex-1 overflow-y-auto">
        {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 px-1 uppercase tracking-widest">用户名</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#a492c9] group-focus-within:text-primary transition-colors">person</span>
              <input 
                className="form-input flex w-full rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#443267] bg-[#221933] focus:border-primary h-14 placeholder:text-[#a492c9]/40 pl-12 pr-4 text-base font-normal transition-all" 
                placeholder="设置您的游戏昵称" 
                type="text" 
              />
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 px-1 uppercase tracking-widest">邮箱</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#a492c9] group-focus-within:text-primary transition-colors">mail</span>
            <input 
              className="form-input flex w-full rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#443267] bg-[#221933] focus:border-primary h-14 placeholder:text-[#a492c9]/40 pl-12 pr-4 text-base font-normal transition-all" 
              placeholder="请输入邮箱地址" 
              type="email" 
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 px-1 uppercase tracking-widest">密码</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#a492c9] group-focus-within:text-primary transition-colors">lock</span>
            <input 
              className="form-input flex w-full rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#443267] bg-[#221933] focus:border-primary h-14 placeholder:text-[#a492c9]/40 pl-12 pr-12 text-base font-normal transition-all" 
              placeholder="不少于8位字符" 
              type="password" 
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#a492c9] cursor-pointer hover:text-white transition-colors">visibility</span>
          </div>
        </div>

        {!isLogin && (
          <div className="flex items-center gap-3 py-2 px-1">
            <input className="w-5 h-5 rounded border-[#443267] bg-[#221933] text-primary focus:ring-primary" type="checkbox" />
            <p className="text-[11px] text-slate-400">我已阅读并同意 <a className="text-primary hover:underline" href="#">服务条款</a> 和 <a className="text-primary hover:underline" href="#">隐私政策</a></p>
          </div>
        )}

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] uppercase tracking-[0.2em] disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            isLogin ? '立即登录' : '立即注册'
          )}
        </button>

        <div className="flex flex-col items-center gap-6 mt-12 pb-12">
          <p 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#a492c9] text-sm font-medium hover:text-white transition-colors cursor-pointer"
          >
            {isLogin ? '没有账号？ ' : '已有账号？ '}
            <span className="text-primary font-bold uppercase tracking-tight">{isLogin ? '去注册' : '去登录'}</span>
          </p>
        </div>
      </div>

      <div className="mt-auto pb-8 pt-4 flex flex-col items-center opacity-30 pointer-events-none">
        <div className="w-12 h-1 bg-primary rounded-full mb-2"></div>
        <p className="text-[9px] text-slate-500 uppercase tracking-[0.4em] font-bold">Temporal Void Studio</p>
      </div>
    </div>
  );
};

export default Auth;
