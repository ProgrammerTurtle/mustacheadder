import { Eye, Crown, Shirt } from "lucide-react";
import monocleAccessory from "@/assets/accessories/monocle.svg";
import topHatAccessory from "@/assets/accessories/top-hat.svg";
import bowTieAccessory from "@/assets/accessories/bow-tie.svg";

export interface AccessoryStyle {
  id: string;
  name: string;
  icon: any;
  svgPath: string;
  type: 'accessory';
  category: 'face' | 'head' | 'neck';
}

const accessoryStyles: AccessoryStyle[] = [
  {
    id: "monocle",
    name: "Monocle",
    icon: Eye,
    svgPath: monocleAccessory,
    type: 'accessory',
    category: 'face',
  },
  {
    id: "top-hat",
    name: "Top Hat",
    icon: Crown,
    svgPath: topHatAccessory,
    type: 'accessory',
    category: 'head',
  },
  {
    id: "bow-tie",
    name: "Bow Tie",
    icon: Shirt,
    svgPath: bowTieAccessory,
    type: 'accessory',
    category: 'neck',
  },
];

interface AccessorySelectorProps {
  selectedAccessory: AccessoryStyle | null;
  onAccessorySelect: (accessory: AccessoryStyle) => void;
}

export default function AccessorySelector({ selectedAccessory, onAccessorySelect }: AccessorySelectorProps) {
  return (
    <div data-testid="accessory-selector">
      <h4 className="font-medium text-foreground mb-3">Vintage Accessories</h4>
      <div className="grid grid-cols-3 gap-3">
        {accessoryStyles.map((accessory) => {
          const IconComponent = accessory.icon;
          const isSelected = selectedAccessory?.id === accessory.id;
          
          return (
            <button
              key={accessory.id}
              onClick={() => onAccessorySelect(accessory)}
              className={`p-3 border rounded-lg text-center transition-colors ${
                isSelected
                  ? "border-primary bg-primary/5 hover:bg-primary/10"
                  : "border-border hover:border-primary hover:bg-primary/5"
              }`}
              data-testid={`button-accessory-${accessory.id}`}
            >
              <div className={`w-8 h-8 rounded mx-auto mb-2 flex items-center justify-center ${
                isSelected ? "bg-primary/20" : "bg-muted"
              }`}>
                <IconComponent className={`text-sm ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <p className={`text-xs font-medium ${
                isSelected ? "text-primary" : "text-muted-foreground"
              }`}>
                {accessory.name}
              </p>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Add distinguished accessories to complete the vintage look
      </p>
    </div>
  );
}