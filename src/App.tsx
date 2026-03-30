/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center justify-center relative overflow-hidden p-4">
      <div className="scanlines" />
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/10 blur-[120px] rounded-full" />
      
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12 text-center relative z-10"
      >
        <div className="glitch-container">
          <h1 className="text-7xl font-black italic tracking-tighter neon-text-blue uppercase glitch-text" data-text="NEON BEATS">
            Neon <span className="text-neon-pink neon-text-pink">Beats</span>
          </h1>
        </div>
        <p className="text-xs font-mono tracking-[0.5em] text-gray-500 mt-4 uppercase">Snake Game & Synthwave Player</p>
      </motion.header>

      <main className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-6xl relative z-10">
        {/* Left Side: Stats/Info */}
        <div className="hidden lg:flex flex-col gap-6 w-64">
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">How to Play</h3>
            <ul className="text-sm space-y-3 font-mono">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-blue shadow-[0_0_5px_var(--color-neon-blue)]" />
                <span>ARROWS TO MOVE</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-pink shadow-[0_0_5px_var(--color-neon-pink)]" />
                <span>EAT PINK FOOD</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_5px_var(--color-neon-green)]" />
                <span>DON'T HIT WALLS</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Vibe</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-xs font-mono text-neon-green">SYSTEMS ONLINE</span>
            </div>
          </div>
        </div>

        {/* Center: Snake Game */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <SnakeGame />
        </motion.div>

        {/* Right Side: Music Player */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full lg:w-auto"
        >
          <MusicPlayer />
        </motion.div>
      </main>

      <footer className="mt-12 text-gray-600 text-[10px] font-mono uppercase tracking-widest relative z-10">
        &copy; 2026 NEON BEATS LABS // POWERED BY AI STUDIO
      </footer>
    </div>
  );
}
