import { useState, useEffect } from "react";
import CardDeck from "@/components/CardDeck";
import ExplanationSheet from "@/components/ExplanationSheet";
import LearnMore from "@/components/LearnMore";
import { cardsData, type CardData } from "@/data/cards";

const STORAGE_KEY = "perception-cards-confirmations";

const loadConfirmations = (): Record<string, number> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const Index = () => {
  const [started, setStarted] = useState(false);
  const [confirmations, setConfirmations] = useState<Record<string, number>>(loadConfirmations);
  const [explanationCard, setExplanationCard] = useState<CardData | null>(null);
  const [learnCard, setLearnCard] = useState<CardData | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(confirmations));
  }, [confirmations]);

  const handleConfirm = (cardId: string) => {
    setConfirmations((prev) => ({
      ...prev,
      [cardId]: (prev[cardId] || 0) + 1,
    }));
  };

  if (learnCard) {
    return <LearnMore card={learnCard} onBack={() => setLearnCard(null)} />;
  }

  if (!started) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 safe-area-top safe-area-bottom"
        style={{ backgroundColor: "hsl(var(--background))" }}
      >
        <p
          className="text-lg font-medium text-center mb-12 animate-fade-in-up"
          style={{ color: "var(--text-secondary)" }}
        >
          Если тревожно — начните листать
        </p>

        <div className="relative animate-breathe mb-16">
          {[...cardsData].reverse().map((card, i) => {
            const offset = cardsData.length - 1 - i;
            const scale = 1 - offset * 0.04;
            const translateY = offset * 10;
            const rotate = offset * (offset % 2 === 0 ? 3 : -3);

            return (
              <div
                key={card.id}
                className="rounded-[28px] flex flex-col items-center justify-end overflow-hidden"
                style={{
                  backgroundColor: "#f0d6f6",
                  width: 320,
                  height: 440,
                  position: offset === 0 ? "relative" : "absolute",
                  top: 0,
                  left: 0,
                  transform: `scale(${scale}) translateY(${translateY}px) rotate(${rotate}deg)`,
                  zIndex: cardsData.length - offset,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                }}
              >
                {offset === 0 && (
                  <img
                    src="https://storage.yandexcloud.net/sitevek/IMG_3898.gif"
                    alt="Мишка"
                    className="w-20 h-20 object-contain mb-6"
                  />
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setStarted(true)}
          className="h-[52px] px-10 rounded-2xl text-base font-medium transition-all duration-200 active:scale-[0.97]"
          style={{
            backgroundColor: "var(--card-teal)",
            color: "var(--card-teal-dark)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          Мне тревожно
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center safe-area-top safe-area-bottom"
      style={{ backgroundColor: "hsl(var(--background))" }}
    >
      <p
        className="text-sm font-medium mb-4 animate-fade-in-up"
        style={{ color: "var(--text-secondary)" }}
      >
        Свайпайте, чтобы листать
      </p>

      <CardDeck
        cards={cardsData}
        confirmations={confirmations}
        onConfirm={handleConfirm}
        onShowExplanation={setExplanationCard}
        onLearnMore={setLearnCard}
      />

      <ExplanationSheet
        card={explanationCard}
        open={!!explanationCard}
        onClose={() => setExplanationCard(null)}
      />
    </div>
  );
};

export default Index;