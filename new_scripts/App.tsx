
import React, { useState, useEffect } from 'react';
import { GameState } from './types';
import Home from './components/Home';
import Auth from './components/Auth';
import Leaderboard from './components/Leaderboard';
import Game from './components/Game';
import GameOver from './components/GameOver';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('void_user_logged_in') === 'true';
  });
  const [gameState, setGameState] = useState<GameState>(GameState.HOME);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('void_best_score');
    return saved ? parseInt(saved, 10) : 842;
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('void_user_logged_in', 'true');
    setGameState(GameState.HOME);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('void_user_logged_in');
    setGameState(GameState.AUTH);
  };

  const handleGameOver = (score: number) => {
    setCurrentScore(score);
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('void_best_score', score.toString());
    }
    setGameState(GameState.GAME_OVER);
  };

  const renderScreen = () => {
    // Force authentication first
    if (!isLoggedIn) {
      return <Auth onLogin={handleLogin} />;
    }

    switch (gameState) {
      case GameState.HOME:
        return (
          <Home 
            onStart={() => setGameState(GameState.PLAYING)} 
            onLeaderboard={() => setGameState(GameState.LEADERBOARD)} 
            onLogout={handleLogout}
            bestScore={bestScore} 
          />
        );
      case GameState.AUTH:
        // This case is handled by the isLoggedIn check above, but kept for state consistency
        return <Auth onLogin={handleLogin} />;
      case GameState.LEADERBOARD:
        return <Leaderboard onBack={() => setGameState(GameState.HOME)} bestScore={bestScore} />;
      case GameState.PLAYING:
        return <Game onGameOver={handleGameOver} onPause={() => setGameState(GameState.HOME)} />;
      case GameState.GAME_OVER:
        return (
          <GameOver 
            score={currentScore} 
            bestScore={bestScore} 
            onReplay={() => setGameState(GameState.PLAYING)} 
            onHome={() => setGameState(GameState.HOME)} 
          />
        );
      default:
        return <Home onStart={() => setGameState(GameState.PLAYING)} onLeaderboard={() => setGameState(GameState.LEADERBOARD)} onLogout={handleLogout} bestScore={bestScore} />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background-dark font-display relative">
      {renderScreen()}
    </div>
  );
};

export default App;
