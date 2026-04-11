import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Story {
  id: string;
  name: string;
  avatar: string;
  media: string;
}

const stories: Story[] = [
  { id: "1", name: "Sarah", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", media: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=1400&fit=crop" },
  { id: "2", name: "Marcus", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", media: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=1400&fit=crop" },
  { id: "3", name: "Aisha", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", media: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=1400&fit=crop" },
  { id: "4", name: "Youssef", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", media: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=1400&fit=crop" },
  { id: "5", name: "Lina", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", media: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&h=1400&fit=crop" },
  { id: "6", name: "Khalid", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", media: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&h=1400&fit=crop" },
  { id: "7", name: "Nadia", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", media: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&h=1400&fit=crop" },
  { id: "8", name: "Omar", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", media: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=1400&fit=crop" },
  { id: "9", name: "Fatima", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face", media: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=1400&fit=crop" },
  { id: "10", name: "Rachid", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face", media: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=1400&fit=crop" },
  { id: "11", name: "Zineb", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face", media: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=1400&fit=crop" },
  { id: "12", name: "Amine", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face", media: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=1400&fit=crop" },
];

const STORY_DURATION = 5000;

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const closeStory = useCallback(() => setActiveIndex(null), []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    setProgress(0);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const pct = Math.min(((Date.now() - startTimeRef.current) / STORY_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setActiveIndex((prev) => (prev !== null && prev < stories.length - 1 ? prev + 1 : null));
      }
    }, 30);
  }, [clearTimer]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    setTranslateY(Math.max(0, delta));
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    if (translateY > 120) {
      closeStory();
    }
    setTranslateY(0);
  }, [translateY, closeStory]);

  useEffect(() => {
    if (activeIndex !== null) { startTimer(); document.body.style.overflow = "hidden"; }
    else { clearTimer(); setProgress(0); document.body.style.overflow = ""; }
    return () => { clearTimer(); document.body.style.overflow = ""; };
  }, [activeIndex, startTimer, clearTimer]);

  return (
    <>
      <section className="py-6 bg-background border-b border-border">
        <div className="container">
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {stories.map((story, i) => (
              <button
                key={story.id}
                onClick={() => setActiveIndex(i)}
                className="flex flex-col items-center gap-1.5 shrink-0 group"
              >
                <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-full h-full rounded-full object-cover border-2 border-background"
                    loading="lazy"
                  />
                </div>
                <span className="text-xs text-muted-foreground truncate max-w-[72px] group-hover:text-foreground transition-colors">
                  {story.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center animate-in fade-in duration-200" onClick={closeStory}>
          <div
            className="relative w-full max-w-md h-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: `translateY(${translateY}px)`,
              opacity: Math.max(1 - translateY / 300, 0.3),
              transition: isDragging.current ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
            }}
          >
            <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-20">
              {stories.map((_, i) => (
                <div key={i} className="flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: i < activeIndex ? "100%" : i === activeIndex ? `${progress}%` : "0%" }} />
                </div>
              ))}
            </div>
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pt-2">
              <div className="flex items-center gap-2">
                <img src={stories[activeIndex].avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                <span className="text-white text-sm font-medium">{stories[activeIndex].name}</span>
              </div>
              <button onClick={closeStory} className="text-white hover:text-white/80 p-1"><X className="w-6 h-6" /></button>
            </div>
            <img src={stories[activeIndex].media} alt={stories[activeIndex].name} className="max-h-full max-w-full object-contain select-none rounded-lg" />
            <button onClick={() => activeIndex > 0 && setActiveIndex(activeIndex - 1)} className={cn("absolute left-0 top-0 bottom-0 w-1/3 z-10", activeIndex === 0 && "cursor-default")} aria-label="Previous" />
            <button onClick={() => activeIndex < stories.length - 1 ? setActiveIndex(activeIndex + 1) : closeStory()} className="absolute right-0 top-0 bottom-0 w-1/3 z-10" aria-label="Next" />
          </div>
        </div>
      )}
    </>
  );
}
