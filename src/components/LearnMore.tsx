import Icon from "@/components/ui/icon";
import type { CardData } from "@/data/cards";

interface LearnMoreProps {
  card: CardData | null;
  onBack: () => void;
}

const sections = [
  { key: "body" as const, title: "Что происходит в теле", icon: "Activity" },
  { key: "safety" as const, title: "Почему это безопасно", icon: "Shield" },
  { key: "science" as const, title: "Научные факты", icon: "Microscope" },
  { key: "observations" as const, title: "Мои наблюдения", icon: "Eye" },
];

const LearnMore = ({ card, onBack }: LearnMoreProps) => {
  if (!card) return null;

  return (
    <div
      className="min-h-screen safe-area-top safe-area-bottom"
      style={{ backgroundColor: "hsl(var(--background))" }}
    >
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3 backdrop-blur-md bg-white/80 safe-area-top">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
          style={{ backgroundColor: card.color }}
        >
          <Icon name="ArrowLeft" size={20} style={{ color: card.colorDark }} />
        </button>
        <h1
          className="text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {card.title}
        </h1>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4 pb-12">
        <div
          className="rounded-[20px] p-5"
          style={{ backgroundColor: card.color }}
        >
          <p
            className="text-lg font-medium text-center leading-relaxed"
            style={{ color: "var(--text-primary)" }}
          >
            {card.mainThought}
          </p>
        </div>

        {sections.map((section) => (
          <div
            key={section.key}
            className="rounded-[20px] p-5 bg-white"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: card.color }}
              >
                <Icon
                  name={section.icon}
                  size={16}
                  style={{ color: card.colorDark }}
                />
              </div>
              <h3
                className="text-base font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {section.title}
              </h3>
            </div>
            <p
              className="text-[15px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {card.sections[section.key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnMore;
