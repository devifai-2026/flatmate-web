import { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Pause } from 'lucide-react';

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function generateBars(id, count = 28) {
  const seed = hashCode(id || 'default');
  return Array.from({ length: count }, (_, i) => {
    const s = hashCode(`${seed}_${i}`);
    return 3 + (s % 14);
  });
}

function formatDuration(sec) {
  if (!sec || !isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VoiceMessage({ src, msgId, isMe, time, children }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const rafRef = useRef(null);

  const bars = useMemo(() => generateBars(msgId), [msgId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      cancelAnimationFrame(rafRef.current);
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const tick = () => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;
    const p = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    setProgress(p);
    setCurrentTime(audio.currentTime);
    rafRef.current = requestAnimationFrame(tick);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setPlaying(true);
      rafRef.current = requestAnimationFrame(tick);
    } else {
      audio.pause();
      setPlaying(false);
      cancelAnimationFrame(rafRef.current);
    }
  };

  const seekTo = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audio.currentTime = pct * audio.duration;
    setProgress(pct * 100);
    setCurrentTime(audio.currentTime);
  };

  const filledBars = Math.floor((progress / 100) * bars.length);

  return (
    <div className={`rounded-2xl min-w-[240px] max-w-[280px] ${isMe ? 'bg-primary rounded-br-sm' : 'bg-white border border-dark/5 rounded-bl-sm shadow-sm'} px-3 py-2.5`}>
      <div className="flex items-center gap-2.5">
        {/* Play/Pause */}
        <button onClick={togglePlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${isMe ? 'bg-white/20 hover:bg-white/30' : 'bg-primary/10 hover:bg-primary/15'}`}>
          {playing ? (
            <Pause size={16} className={isMe ? 'text-white' : 'text-primary'} fill="currentColor" />
          ) : (
            <Play size={16} className={`${isMe ? 'text-white' : 'text-primary'} ml-0.5`} fill="currentColor" />
          )}
        </button>

        {/* Waveform + time */}
        <div className="flex-1 min-w-0">
          <div className="flex items-end gap-[2px] h-6 cursor-pointer" onClick={seekTo}>
            {bars.map((h, i) => (
              <div
                key={i}
                className={`w-[3px] rounded-full transition-colors duration-100 ${
                  i < filledBars
                    ? (isMe ? 'bg-white' : 'bg-primary')
                    : (isMe ? 'bg-white/30' : 'bg-primary/20')
                }`}
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className={`text-[9px] font-medium ${isMe ? 'text-white/60' : 'text-muted'}`}>
              {playing ? formatDuration(currentTime) : formatDuration(duration)}
            </span>
            <div className={`flex items-center gap-1 ${isMe ? 'text-white/50' : 'text-muted/50'}`}>
              <span className="text-[9px]">{time}</span>
              {children}
            </div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}
