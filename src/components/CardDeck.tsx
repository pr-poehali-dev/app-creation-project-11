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
  const startX = useRef(0);
  const startY = useRef(0);
  const isHorizontal = useRef<boolean | null>(null);

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      if (isAnimating) return;
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
      setIsAnimating(true);
      setDragX(direction * 400);

      setTimeout(() => {
        setDragX(0);
        setCurrentIndex((prev) => {
          if (direction > 0) {
            return prev === 0 ? cards.length - 1 : prev - 1;
          }
          return (prev + 1) % cards.length;
        });
        setIsAnimating(false);
      }, 250);
    } else {
      setDragX(0);
    }

    isHorizontal.current = null;
  }, [isDragging, dragX, cards.length]);

  const rotation = dragX * 0.05;
  const currentCard = cards[currentIndex];

  return (
    <div className="relative flex items-center justify-center w-full" style={{ height: 580 }}>
      {[2, 1].map((offset) => {
        const idx = (currentIndex + offset) % cards.length;
        const bgCard = cards[idx];
        const scale = 1 - offset * 0.04;
        const translateY = offset * 12;
        const rotateZ = offset * (offset === 2 ? 4 : -2);

        return (
          <div
            key={bgCard.id + "-bg-" + offset}
            className="absolute rounded-[28px] w-[350px]"
            style={{
              backgroundColor: bgCard.color,
              height: 540,
              transform: `scale(${scale}) translateY(${translateY}px) rotate(${rotateZ}deg)`,
              zIndex: 10 - offset,
              opacity: 1 - offset * 0.15,
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
              transition: "transform 250ms ease-out, opacity 250ms ease-out",
            }}
          />
        );
      })}

      <div
        className="relative z-20 touch-pan-y"
        style={{
          transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
          transition: isDragging ? "none" : "transform 250ms ease-out",
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
