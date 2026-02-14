import { useState, useRef, useCallback } from "react";
import PerceptionCard from "./PerceptionCard";
import type { CardData } from "@/data/cards";

interface CardDeckProps {
  cards: CardData[];
  confirmations: Record<string, number>;
  onConfirm: (cardId: string) => void;
  onShowExplanation: (card: CardData) => void;
  onLearnMore: (card: CardData) => void;
}

const SWIPE_THRESHOLD = 80;

let audioCtx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;

const getAudioCtx = (): AudioContext | null => {
  if (!audioCtx) {
    const AC = window.AudioContext || (window as never)["webkitAudioContext"];
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  if (!noiseBuffer && audioCtx) {
    const size = audioCtx.sampleRate * 0.12;
    noiseBuffer = audioCtx.createBuffer(1, size, audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < size; i++) {
      const t = i / size;
      data[i] = (Math.random() * 2 - 1) * (1 - t * t);
    }
  }
  return audioCtx;
};

const playSwipeSound = () => {
  try {
    const ctx = getAudioCtx();
    if (!ctx || !noiseBuffer) return;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    gain.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2800;
    filter.Q.value = 0.6;
    filter.connect(gain);

    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    src.connect(filter);
    src.start();
    src.stop(ctx.currentTime + 0.12);
  } catch (_) {
    // sound not supported
  }
};

const CardDeck = ({
  cards,
  confirmations,
  onConfirm,
  onShowExplanation,
  onLearnMore,
}: CardDeckProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const isHorizontal = useRef<boolean | null>(null);

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      if (isAnimating) return;
      getAudioCtx();
      setIsDragging(true);
      startX.current = clientX;
      startY.current = clientY;
      isHorizontal.current = null;
    },
    [isAnimating]
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || isAnimating) return;

      const diffX = clientX - startX.current;
      const diffY = clientY - startY.current;

      if (isHorizontal.current === null) {
        if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
          isHorizontal.current = Math.abs(diffX) > Math.abs(diffY);
        }
        return;
      }

      if (isHorizontal.current) {
        setDragX(diffX * 0.8);
      }
    },
    [isDragging, isAnimating]
  );

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragX) > SWIPE_THRESHOLD) {
      const direction = dragX > 0 ? 1 : -1;
      playSwipeSound();
      setIsAnimating(true);
      setDragX(direction * 500);

      setTimeout(() => {
        setNoTransition(true);
        setDragX(0);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
        setIsAnimating(false);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setNoTransition(false);
          });
        });
      }, 280);
    } else {
      setDragX(0);
    }

    isHorizontal.current = null;
  }, [isDragging, dragX, cards.length]);

  const rotation = dragX * 0.04;
  const currentCard = cards[currentIndex];
  const nextIdx = (currentIndex + 1) % cards.length;
  const thirdIdx = (currentIndex + 2) % cards.length;
  const nextCard = cards[nextIdx];
  const thirdCard = cards[thirdIdx];

  const swipeProgress = Math.min(Math.abs(dragX) / 300, 1);

  const smoothTransition = isDragging || noTransition
    ? "none"
    : "transform 280ms ease-out, opacity 280ms ease-out, box-shadow 280ms ease-out";

  return (
    <div className="relative flex items-center justify-center w-full" style={{ height: 600 }}>
      <div
        key={"slot-2-" + thirdCard.id}
        className="absolute pointer-events-none"
        style={{
          transform: `translateX(${8 - swipeProgress * 4}px) translateY(${16 - swipeProgress * 8}px) rotate(${3 - swipeProgress * 1}deg)`,
          zIndex: 8,
          opacity: 0.75 + swipeProgress * 0.13,
          transition: smoothTransition,
        }}
      >
        <PerceptionCard
          card={thirdCard}
          confirmations={confirmations[thirdCard.id] || 0}
          onConfirm={() => {}}
          onShowExplanation={() => {}}
          onLearnMore={() => {}}
        />
      </div>

      <div
        key={"slot-1-" + nextCard.id}
        className="absolute pointer-events-none"
        style={{
          transform: `translateX(${4 - swipeProgress * 4}px) translateY(${8 - swipeProgress * 8}px) rotate(${-1.5 + swipeProgress * 1.5}deg)`,
          zIndex: 9,
          opacity: 0.88 + swipeProgress * 0.12,
          transition: smoothTransition,
        }}
      >
        <PerceptionCard
          card={nextCard}
          confirmations={confirmations[nextCard.id] || 0}
          onConfirm={() => {}}
          onShowExplanation={() => {}}
          onLearnMore={() => {}}
        />
      </div>

      <div
        className="relative z-20 touch-pan-y"
        style={{
          transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
          transition: isDragging || noTransition ? "none" : "transform 280ms ease-out",
          cursor: "grab",
        }}
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={() => {
          if (isDragging) handleEnd();
        }}
      >
        <PerceptionCard
          card={currentCard}
          confirmations={confirmations[currentCard.id] || 0}
          onConfirm={() => onConfirm(currentCard.id)}
          onShowExplanation={() => onShowExplanation(currentCard)}
          onLearnMore={() => onLearnMore(currentCard)}
        />
      </div>

      <div className="absolute bottom-0 flex gap-2 z-30">
        {cards.map((c, i) => (
          <div
            key={c.id}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === currentIndex ? cards[currentIndex].colorDark : "#D1D5DB",
              transform: i === currentIndex ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CardDeck;