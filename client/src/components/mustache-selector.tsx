import { Crown, Star, Gem, Users } from "lucide-react";
import classicMustache from "@/assets/mustaches/classic.svg";
import handlebarMustache from "@/assets/mustaches/handlebar.svg";
import victorianMustache from "@/assets/mustaches/victorian.svg";
import walrusMustache from "@/assets/mustaches/walrus.svg";
import type { MustacheStyle } from "./photo-editor";

const mustacheStyles: MustacheStyle[] = [
  {
    id: "classic",
    name: "Classic",
    icon: Crown,
    svgPath: classicMustache,
  },
  {
    id: "handlebar",
    name: "Handlebar",
    icon: Star,
    svgPath: handlebarMustache,
  },
  {
    id: "victorian",
    name: "Victorian",
    icon: Gem,
    svgPath: victorianMustache,
  },
  {
    id: "walrus",
    name: "Walrus",
    icon: Users,
    svgPath: walrusMustache,
  },
];

interface MustacheSelectorProps {
  selectedMustache: MustacheStyle | null;
  onMustacheSelect: (mustache: MustacheStyle) => void;
}

export default function MustacheSelector({ selectedMustache, onMustacheSelect }: MustacheSelectorProps) {
  return (
    <div data-testid="mustache-selector">
      <h4 className="font-medium text-foreground mb-3">Mustache Style</h4>
      <div className="grid grid-cols-4 gap-3">
        {mustacheStyles.map((mustache) => {
          const IconComponent = mustache.icon;
          const isSelected = selectedMustache?.id === mustache.id;
          
          return (
            <button
              key={mustache.id}
              onClick={() => onMustacheSelect(mustache)}
              className={`p-3 border rounded-lg text-center transition-colors ${
                isSelected
                  ? "border-primary bg-primary/5 hover:bg-primary/10"
                  : "border-border hover:border-primary hover:bg-primary/5"
              }`}
              data-testid={`button-mustache-${mustache.id}`}
            >
              <div className={`w-8 h-8 rounded mx-auto mb-2 flex items-center justify-center ${
                isSelected ? "bg-primary/20" : "bg-muted"
              }`}>
                <IconComponent className={`text-sm ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <p className={`text-xs font-medium ${
                isSelected ? "text-primary" : "text-muted-foreground"
              }`}>
                {mustache.name}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
