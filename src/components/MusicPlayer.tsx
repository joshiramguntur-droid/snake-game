import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Disc, ListMusic } from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: number;
  color: string;
  vibe: string;
}

const DUMMY_SONGS: Song[] = [
  { id: 1, title: "Midnight Pulse", artist: "Synth_Ghost", duration: 184, color: "neon-cyan", vibe: "High_Energy" },
  { id: 2, title: "Cyber Drift", artist: "Neon_Rider", duration: 212, color: "neon-pink", vibe: "Chill_Wave" },
  { id: 3, title: "Silicon Dreams", artist: "AI_Core", duration: 156, color: "neon-purple", vibe: "Dream_State" },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const currentTrack = DUMMY_SONGS[currentTrackIndex];
  const progressInterval = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentTrack.duration) {
            handleSkip();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleSkip = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_SONGS.length);
    setProgress(0);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_SONGS.length) % DUMMY_SONGS.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md tear-anim">
      <div className="bg-glitch-black border-2 border-glitch-white p-6 shadow-[8px_8px_0_var(--color-glitch-magenta)] relative overflow-hidden">
        
        {/* Visualizer Background */}
        <div className="absolute inset-0 opacity-20 flex items-end justify-around px-2 pb-1 pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              animate={isPlaying ? {
                height: [
                  Math.random() * 40 + '%',
                  Math.random() * 95 + '%',
                  Math.random() * 20 + '%'
                ]
              } : { height: '5%' }}
              transition={{ repeat: Infinity, duration: 0.1 + Math.random() * 0.2, ease: "steps(3)" }}
              className={`w-[2px] bg-glitch-cyan`}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center">
            {/* Album Art Representation */}
            <div className="relative mb-6 pt-2">
                <motion.div
                  animate={isPlaying ? { x: [-2, 2, -1, 0], y: [1, -1, 2, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 0.2, ease: "steps(2)" }}
                  className="w-32 h-32 border-4 border-glitch-white flex items-center justify-center relative bg-glitch-black shadow-[4px_4px_0_var(--color-glitch-cyan)]"
                >
                    <Disc size={64} className="text-glitch-magenta" />
                    <div className="absolute inset-2 border border-glitch-magenta opacity-30" />
                </motion.div>
                
                {/* Status Indicator */}
                <div className={`absolute top-0 right-0 w-4 h-4 shadow-[2px_2px_0_black] 
                    ${isPlaying ? 'bg-glitch-cyan animate-pulse' : 'bg-glitch-magenta'}`} />
            </div>

            {/* Title & Info */}
            <div className="text-center mb-6 w-full bg-glitch-white/10 p-2">
                <h3 className="font-display text-3xl uppercase tracking-tighter mb-1 text-glitch-magenta glitch-text">
                    {currentTrack.title}
                </h3>
                <div className="flex items-center justify-center gap-3">
                    <p className="text-xs font-mono text-glitch-cyan uppercase tracking-tighter font-bold">
                        {currentTrack.artist}
                    </p>
                    <span className="text-[10px] font-mono text-glitch-white bg-glitch-magenta px-2 py-0.5 uppercase font-bold">
                        {currentTrack.vibe}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full mb-6">
                <div className="flex justify-between text-[11px] font-mono text-glitch-cyan uppercase mb-1 font-bold">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(currentTrack.duration)}</span>
                </div>
                <div className="h-4 w-full bg-glitch-white/10 border-2 border-glitch-white overflow-hidden p-0.5">
                    <motion.div 
                        animate={{ width: `${(progress / currentTrack.duration) * 100}%` }}
                        className="h-full bg-glitch-cyan"
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between w-full max-w-[280px] gap-4">
                <button 
                  onClick={handlePrevious}
                  className="p-2 bg-glitch-white/10 border-2 border-glitch-white text-glitch-white hover:bg-glitch-magenta transition-none hover:translate-x-1 hover:translate-y-1"
                >
                    <SkipBack size={24} fill="currentColor" />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="flex-1 py-4 bg-glitch-cyan text-glitch-black border-2 border-glitch-white flex items-center justify-center transition-none hover:bg-glitch-magenta hover:text-glitch-white font-bold uppercase tracking-widest text-xl"
                >
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                </button>

                <button 
                  onClick={handleSkip}
                  className="p-2 bg-glitch-white/10 border-2 border-glitch-white text-glitch-white hover:bg-glitch-magenta transition-none hover:translate-x-1 hover:translate-y-1"
                >
                    <SkipForward size={24} fill="currentColor" />
                </button>
            </div>

            {/* Footer Actions */}
            <div className="mt-6 flex gap-4 text-[10px] uppercase font-mono tracking-tighter w-full">
                <button 
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className={`flex-1 py-2 border-2 border-glitch-white transition-none flex items-center justify-center gap-2 font-bold ${showPlaylist ? 'bg-glitch-magenta text-glitch-white' : 'bg-glitch-white/10 text-glitch-cyan'}`}
                >
                    <ListMusic size={14} /> QUEUE_LIST
                </button>
                <div className="py-2 px-4 border-2 border-glitch-white bg-glitch-white/10 text-glitch-cyan flex items-center gap-2 font-bold">
                    VOL: 0x4A
                </div>
            </div>
        </div>

        {/* Playlist Drawer */}
        <AnimatePresence>
            {showPlaylist && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    className="absolute inset-0 bg-glitch-black z-20 p-6 pt-12 flex flex-col border-l-4 border-glitch-magenta"
                >
                    <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-glitch-cyan">
                        <h4 className="font-display uppercase tracking-widest text-2xl text-glitch-cyan glitch-text flex items-center gap-2">
                           SOUND_BUFFER
                        </h4>
                        <button 
                          onClick={() => setShowPlaylist(false)}
                          className="text-[10px] font-mono border-2 border-glitch-white px-2 py-1 bg-glitch-magenta text-glitch-white font-bold"
                        >
                            X
                        </button>
                    </div>
                    <div className="space-y-2 overflow-y-auto">
                        {DUMMY_SONGS.map((song, index) => (
                            <button
                                key={song.id}
                                onClick={() => {
                                    setCurrentTrackIndex(index);
                                    setProgress(0);
                                    setIsPlaying(true);
                                    setShowPlaylist(false);
                                }}
                                className={`w-full flex items-center justify-between p-3 border-2 transition-none
                                    ${currentTrackIndex === index 
                                        ? 'bg-glitch-cyan text-glitch-black border-glitch-white' 
                                        : 'border-glitch-white/20 text-glitch-white hover:bg-glitch-white/10'}
                                `}
                            >
                                <div className="text-left font-bold">
                                    <p className="text-sm font-mono uppercase">{song.title}</p>
                                    <p className="text-[10px] font-mono text-glitch-magenta uppercase">{song.artist}</p>
                                </div>
                                <span className="text-[10px] font-mono">[{formatTime(song.duration)}]</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};
