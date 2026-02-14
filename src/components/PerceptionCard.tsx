import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { CardData } from "@/data/cards";

interface PerceptionCardProps {
  card: CardData;
  confirmations: number;
  onConfirm: () => void;
  onShowExplanation: () => void;
  onLearnMore: () => void;
}

const PerceptionCard = ({
  card,
  confirmations,
  onConfirm,
  onShowExplanation,
  onLearnMore,
}: PerceptionCardProps) => {
  const [isExhaling, setIsExhaling] = useState(false);

  const handleConfirm = () => {
    setIsExhaling(true);
    onConfirm();
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    setTimeout(() => setIsExhaling(false), 400);
  };

  return (
    <div
      className={`card-texture w-[350px] rounded-[28px] p-6 flex flex-col items-center gap-4 transition-transform duration-300 ${isExhaling ? "animate-card-exhale" : ""}`}
      style={{
        backgroundColor: card.color,
        boxShadow:
          "0 2px 4px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.08), 0 20px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)",
        minHeight: 540,
      }}
    >
      <h2
        className="text-[22px] font-semibold text-center leading-tight"
        style={{ color: "var(--text-primary)" }}
      >
        {card.title}
      </h2>

      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
      >
        <Icon
          name={card.icon}
          size={32}
          strokeWidth={1.5}
          style={{ color: card.colorDark }}
        />
      </div>

      <p
        className="text-[20px] font-medium text-center leading-relaxed px-2"
        style={{ color: "var(--text-primary)" }}
      >
        {card.mainThought}
      </p>

      <div className="w-full h-px bg-white/40 my-1" />

      <button
        onClick={onShowExplanation}
        className="w-full h-[52px] rounded-2xl flex items-center justify-center gap-2 text-base font-medium transition-all duration-200 active:scale-[0.97]"
        style={{
          backgroundColor: "rgba(255,255,255,0.5)",
          color: card.colorDark,
        }}
      >
        Показать объяснение
        <Icon name="ChevronRight" size={18} />
      </button>

      <div
        className="flex items-center gap-2 w-full px-2"
        style={{ color: "var(--text-secondary)" }}
      >
        <Icon name="CheckCircle2" size={20} style={{ color: card.colorDark }} />
        <span className="text-sm">
          Вы уже {confirmations} раз убедились, что это безопасно.
        </span>
      </div>

      <button
        onClick={handleConfirm}
        className="w-full h-11 rounded-2xl border flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 active:scale-[0.97]"
        style={{
          borderColor: card.colorDark,
          color: card.colorDark,
          backgroundColor: "transparent",
        }}
      >
        <Icon name="Check" size={16} />
        Это подтвердилось
      </button>

      <button
        onClick={onLearnMore}
        className="w-full h-11 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 active:scale-[0.97]"
        style={{
          backgroundColor: "rgba(255,255,255,0.5)",
          color: card.colorDark,
        }}
      >
        <Icon name="Search" size={16} />
        Изучить глубже
        <Icon name="ChevronRight" size={16} />
      </button>
    </div>
  );
};

export default PerceptionCard;