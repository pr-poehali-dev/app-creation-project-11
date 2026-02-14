import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import Icon from "@/components/ui/icon";
import type { CardData } from "@/data/cards";

interface ExplanationSheetProps {
  card: CardData | null;
  open: boolean;
  onClose: () => void;
}

const ExplanationSheet = ({ card, open, onClose }: ExplanationSheetProps) => {
  if (!card) return null;

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent
        className="max-h-[80vh] rounded-t-[28px] border-0"
        style={{ backgroundColor: card.color }}
      >
        <DrawerHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
            >
              <Icon
                name={card.icon}
                size={20}
                strokeWidth={1.5}
                style={{ color: card.colorDark }}
              />
            </div>
            <DrawerTitle
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {card.title}
            </DrawerTitle>
          </div>
          <DrawerDescription className="sr-only">
            Объяснение карточки {card.title}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 pb-8 overflow-y-auto">
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--text-primary)" }}
          >
            {card.explanation}
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ExplanationSheet;
