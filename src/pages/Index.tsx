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
        style={{
          backgroundImage: "url('https://cdn.poehali.dev/projects/928c85d8-ba39-48f6-8cdd-213f541edee5/bucket/8c495ea8-7382-4fcb-abe8-34c7a2bb6db5.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <p
          className="text-lg font-medium text-center mb-12 animate-fade-in-up"
          style={{ color: "var(--text-secondary)" }}
        >
          Если тревожно — начните листать
        </p>

        <img
          src="https://storage.yandexcloud.net/sitevek/IMG_3898.gif"
          alt="Мишка"
          className="w-24 h-24 object-contain mb-16 animate-breathe"
        />

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