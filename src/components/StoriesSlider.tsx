import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Story {
  id: string;
  name: string;
  avatar: string;
  media: string;
  type: "image" | "video";
}

const stories: Story[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    media: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=1400&fit=crop",
    type: "image",
  },
  {
    id: "2",
    name: "Marcus Rivera",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    media: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=1400&fit=crop",
    type: "image",
  },
  {
    id: "3",
    name: "Aisha Patel",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    media: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=1400&fit=crop",
    type: "image",
  },
  {
    id: "4",
    name: "Youssef B.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    media: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=1400&fit=crop",
    type: "image",
  },
  {
    id: "5",
    name: "Lina Moretti",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    media: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&h=1400&fit=crop",
    type: "image",
  },
  {
    id: "6",
    name: "Khalid M.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    media: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&h=1400&fit=crop",
    type: "image",
  },
];

const STORY_DURATION = 5000;

export default function StoriesSlider() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    setProgress(0);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setActiveIndex((prev) => {
          if (prev === null) return null;
          return prev < stories.length - 1 ? prev + 1 : null;
        });
      }
    }, 30);
  }, [clearTimer]);

  useEffect(() => {
    if (activeIndex !== null) {
      startTimer();
      document.body.style.overflow = "hidden";
    } else {
      clearTimer();
      setProgress(0);
      document.body.style.overflow = "";
    }
    return () => {
      clearTimer();
      document.body.style.overflow = "";
    };
  }, [activeIndex, startTimer, clearTimer]);

  const goNext = () => {
    if (activeIndex !== null && activeIndex < stories.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(null);
    }
  };

  const goPrev = () => {
    if (activeIndex !== null && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <>
      {/* Avatar row */}
      <section className="py-4 bg-background border-b border-border">
        <div
          ref={scrollRef}
          className="container flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`[data-stories-scroll]::-webkit-scrollbar{display:none}`}</style>
          <div data-stories-scroll="" className="contents" />
          {stories.map((story, i) => (
            <button
              key={story.id}
              onClick={() => setActiveIndex(i)}
              className="flex flex-col items-center gap-1 shrink-0 group"
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
      </section>

      {/* Full-screen modal */}
      {activeIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in duration-200">
          {/* Progress bars */}
          <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
            {stories.map((_, i) => (
              <div key={i} className="flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-[width] duration-100 ease-linear"
                  style={{
                    width:
                      i < activeIndex
                        ? "100%"
                        : i === activeIndex
                        ? `${progress}%`
                        : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pt-2">
            <div className="flex items-center gap-2">
              <img
                src={stories[activeIndex].avatar}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-white text-sm font-medium">
                {stories[activeIndex].name}
              </span>
            </div>
            <button
              onClick={() => setActiveIndex(null)}
              className="text-white hover:text-white/80 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Media */}
          <img
            src={stories[activeIndex].media}
            alt={stories[activeIndex].name}
            className="max-h-full max-w-full object-contain select-none"
          />

          {/* Navigation zones */}
          <button
            onClick={goPrev}
            className={cn(
              "absolute left-0 top-0 bottom-0 w-1/3 z-10",
              activeIndex === 0 && "cursor-default"
            )}
            aria-label="Previous story"
          />
          <button
            onClick={goNext}
            className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
            aria-label="Next story"
          />
        </div>
      )}
    </>
  );
}
