/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Cpu, Terminal, Activity, Zap } from 'lucide-react';

export default function App() {
  return (
    <main className="min-h-screen relative flex flex-col items-center overflow-hidden bg-glitch-black scanline-jarring">
      <div className="absolute inset-0 static-noise pointer-events-none" />
      
      {/* HUD Accents - Cryptic / Glitch */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none z-10">
        <div className="flex flex-col gap-1">
           <div className="flex items-center gap-2 text-glitch-cyan">
              <Terminal size={16} />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase bg-glitch-cyan text-glitch-black px-1">STREAME_OS::V0.9.4</span>
           </div>
           <div className="h-2 w-64 bg-glitch-magenta/30 overflow-hidden">
              <motion.div 
                animate={{ x: ["-100%", "100%"] }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="h-full w-10 bg-glitch-magenta shadow-[0_0_10px_var(--color-glitch-magenta)]" 
              />
           </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-glitch-magenta">
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase bg-glitch-magenta text-glitch-black px-1">ADDR:0x00FF4D</span>
              <Cpu size={16} />
           </div>
           <p className="text-[9px] font-bold opacity-70">UPLINK_STABLE: 94%</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-end pointer-events-none z-10">
        <div className="flex flex-col gap-1">
           <div className="flex items-center gap-2 text-glitch-white">
              <Activity size={16} />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase">PULSE:NOMINAL</span>
           </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-glitch-yellow">
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-glitch-cyan">BITRATE:124.8KBPS</span>
              <Zap size={16} />
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-center gap-8 p-4 lg:p-12 max-w-7xl mx-auto flex-grow overflow-y-auto">
        
        {/* Game Container */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.1, ease: "steps(4)" }}
          className="flex-shrink-0"
        >
          <div className="relative">
             <div className="absolute -inset-1 bg-glitch-cyan/20 blur-sm animate-pulse" />
             <SnakeGame />
          </div>
        </motion.section>

        {/* Music Player Container */}
        <motion.section 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.1, ease: "steps(3)" }}
          className="lg:mt-8"
        >
          <div className="relative">
             <div className="absolute -inset-1 bg-glitch-magenta/20 blur-sm animate-pulse" />
             <MusicPlayer />
          </div>
        </motion.section>
      </div>

      {/* Footer Decoration */}
      <div className="pb-4 text-glitch-white/40 flex gap-8 text-[9px] font-bold uppercase tracking-[0.4em] pointer-events-none z-10">
        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.5, ease: "steps(2)" }}>[ SYSTEM_ID: ERROR ]</motion.span>
        <span>[ NODE: BRUTALIST_INFRA ]</span>
      </div>
    </main>
  );
}


