import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Nights",
    artist: "SynthWave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "var(--color-neon-blue)"
  },
  {
    id: 2,
    title: "Cyber Rush",
    artist: "Digital Pulse",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "var(--color-neon-pink)"
  },
  {
    id: 3,
    title: "Retro Future",
    artist: "Glitch Master",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "var(--color-neon-green)"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(p || 0);
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="w-full max-w-md bg-black/60 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
      <audio ref={audioRef} />
      
      <div className="flex items-center gap-4 mb-6">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: `${currentTrack.color}20`, border: `1px solid ${currentTrack.color}40` }}
        >
          <Music className="w-8 h-8" style={{ color: currentTrack.color }} />
          {isPlaying && (
            <motion.div 
              animate={{ height: [4, 16, 8, 20, 4] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
              className="absolute bottom-2 left-4 w-1 bg-current"
              style={{ color: currentTrack.color }}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold truncate">{currentTrack.title}</h3>
          <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ 
            width: `${progress}%`, 
            backgroundColor: currentTrack.color,
            boxShadow: `0 0 10px ${currentTrack.color}`
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <button onClick={prevTrack} className="p-2 hover:text-neon-blue transition-colors">
          <SkipBack className="w-8 h-8" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-white text-black hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>

        <button onClick={nextTrack} className="p-2 hover:text-neon-blue transition-colors">
          <SkipForward className="w-8 h-8" />
        </button>

        <div className="flex items-center gap-3 text-gray-400">
          <Volume2 className="w-5 h-5" />
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-white/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
