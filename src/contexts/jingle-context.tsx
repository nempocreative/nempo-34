import React, { createContext, useContext, useRef, useState, useEffect } from "react";

export const JINGLE_TRACK = { title: "Cerita Bareng Nempo", artist: "Nempo Organizer", src: "/audio/jingle-nempo.mp3" };

type JingleContextType = {
  isPlaying: boolean;
  progress: number;
  duration: number;
  hasStarted: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  dismiss: () => void;
};

const JingleContext = createContext<JingleContextType | null>(null);

export function JingleProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const audio = new Audio(JINGLE_TRACK.src);
    audio.preload = "metadata";
    audioRef.current = audio;

    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onTimeUpdate = () => setProgress(audio.currentTime || 0);
    const onEnded = () => { setIsPlaying(false); setProgress(0); };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
  }, []);

  const play = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch(() => {});
    setIsPlaying(true);
    setHasStarted(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const toggle = () => {
    if (isPlaying) pause();
    else play();
  };

  const seek = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setProgress(time);
  };

  const dismiss = () => {
    pause();
    seek(0);
    setHasStarted(false);
  };

  return (
    <JingleContext.Provider value={{ isPlaying, progress, duration, hasStarted, play, pause, toggle, seek, dismiss }}>
      {children}
    </JingleContext.Provider>
  );
}

export function useJingle() {
  const ctx = useContext(JingleContext);
  if (!ctx) throw new Error("useJingle must be used within a JingleProvider");
  return ctx;
}
