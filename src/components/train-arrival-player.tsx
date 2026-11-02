import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { type CityName } from "@/contexts/city-filter-context";

const TRAIN_ARRIVAL_AUDIO_BY_CITY: Partial<Record<CityName, string>> = {
  Garut: "/audio/nempo-train-arrival-garut.mp3",
  Bandung: "/audio/nempo-train-arrival-bandung.mp3",
  Tasikmalaya: "/audio/nempo-train-arrival-tasikmalaya.mp3",
  Bogor: "/audio/nempo-train-arrival-bogor.mp3",
};

export function TrainArrivalPlayer({ city }: { city: CityName }) {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayAttemptedRef = useRef(false);
  const isInViewRef = useRef(false);
  const [isInView, setIsInView] = useState(false);
  const [observationReady, setObservationReady] = useState(false);
  const [needsUserGesture, setNeedsUserGesture] = useState(false);
  const selectedAudio = TRAIN_ARRIVAL_AUDIO_BY_CITY[city] ?? TRAIN_ARRIVAL_AUDIO_BY_CITY.Garut!;

  useEffect(() => {
    let frameId = 0;
    let cancelled = false;

    // Navigating back to Beranda can briefly preserve the previous page's
    // scroll position. Wait for ScrollToTop in App.tsx to finish before
    // deciding whether the Jelajah section is visible.
    const waitForScrollReset = () => {
      if (cancelled) return;
      if (window.scrollY <= 1) {
        setObservationReady(true);
        return;
      }
      frameId = window.requestAnimationFrame(waitForScrollReset);
    };

    frameId = window.requestAnimationFrame(waitForScrollReset);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!observationReady) return;

    const player = playerRef.current;
    if (!player) return;

    const updateVisibility = (visible: boolean) => {
      isInViewRef.current = visible;
      setIsInView(current => current === visible ? current : visible);
    };

    const observer = new IntersectionObserver(
      ([entry]) => updateVisibility(entry.isIntersecting && entry.intersectionRatio >= 0.35),
      { threshold: [0, 0.35, 0.7] },
    );

    const stopWhenSectionLeavesViewport = () => {
      const rect = player.getBoundingClientRect();
      const completelyOutside = rect.bottom <= 0 || rect.top >= window.innerHeight;
      if (completelyOutside && isInViewRef.current) {
        updateVisibility(false);
      }
    };

    observer.observe(player);
    window.addEventListener("scroll", stopWhenSectionLeavesViewport, { passive: true });
    window.addEventListener("resize", stopWhenSectionLeavesViewport);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", stopWhenSectionLeavesViewport);
      window.removeEventListener("resize", stopWhenSectionLeavesViewport);
    };
  }, [observationReady]);

  useEffect(() => {
    const audio = new Audio(selectedAudio);
    audio.preload = "auto";
    audioRef.current = audio;
    autoPlayAttemptedRef.current = false;

    const handleAudioError = () => setNeedsUserGesture(true);
    audio.addEventListener("error", handleAudioError);

    return () => {
      audio.pause();
      audio.removeEventListener("error", handleAudioError);
      audioRef.current = null;
    };
  }, [selectedAudio]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isInView) {
      audio.pause();
      audio.currentTime = 0;
      autoPlayAttemptedRef.current = false;
      setNeedsUserGesture(false);
      return;
    }

    if (autoPlayAttemptedRef.current) return;

    autoPlayAttemptedRef.current = true;
    audio.play().catch(() => {
      setNeedsUserGesture(true);
    });
  }, [isInView, selectedAudio]);

  return (
    <div ref={playerRef} className="relative mt-3 min-h-0">
      {needsUserGesture && isInView && (
        <button
          type="button"
          onClick={() => {
            const audio = audioRef.current;
            if (!audio) return;

            audio.play()
              .then(() => setNeedsUserGesture(false))
              .catch(() => setNeedsUserGesture(true));
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#b8def4] bg-white/85 px-3 py-1.5 text-[10px] font-bold text-[#0172b1] shadow-sm backdrop-blur-sm transition hover:bg-white active:scale-95"
        >
          <Volume2 className="h-3.5 w-3.5" />
          Nyalakan suara kereta
        </button>
      )}
    </div>
  );
}