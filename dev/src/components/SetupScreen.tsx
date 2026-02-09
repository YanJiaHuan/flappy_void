import React from 'react';

const SetupScreen: React.FC = () => (
  <div className="h-full w-full flex items-center justify-center px-6">
    <div className="glass-panel rounded-3xl p-8 max-w-lg text-center space-y-4">
      <h1 className="text-3xl font-display text-white glow-text">Supabase 未连接</h1>
      <p className="text-white/70 text-sm leading-relaxed">
        请在 Vercel 或本地环境变量中配置 `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY`。
        完成后重启应用。
      </p>
      <div className="text-xs text-white/50 bg-white/5 rounded-2xl px-4 py-3">
        详见 /dev/README.md 的 Supabase 连接说明。
      </div>
    </div>
  </div>
);

export default SetupScreen;
