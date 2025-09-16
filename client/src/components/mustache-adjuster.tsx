import { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RotateCw, Move, Maximize2 } from "lucide-react";

export interface MustachePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  faceIndex: number;
}

interface MustacheAdjusterProps {
  imageUrl: string;
  mustachePositions: MustachePosition[];
  onPositionsChange: (positions: MustachePosition[]) => void;
  isManualMode: boolean;
  onManualModeChange: (manual: boolean) => void;
  selectedMustache: any;
  originalImageDimensions?: { width: number; height: number };
}

export default function MustacheAdjuster({ 
  imageUrl, 
  mustachePositions, 
  onPositionsChange,
  isManualMode,
  onManualModeChange,
  selectedMustache,
  originalImageDimensions
}: MustacheAdjusterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isResizing, setIsResizing] = useState<number | null>(null);
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({ width: 400, height: 400 });

  const handleMouseDown = useCallback((e: React.MouseEvent, index: number, mode: 'drag' | 'resize') => {
    e.preventDefault();
    if (mode === 'drag') {
      setDragIndex(index);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (mode === 'resize') {
      setIsResizing(index);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStart || !originalImageDimensions) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    // Scale deltas from container pixels to original image pixels
    const scaleX = originalImageDimensions.width / containerDimensions.width;
    const scaleY = originalImageDimensions.height / containerDimensions.height;
    const scaledDeltaX = deltaX * scaleX;
    const scaledDeltaY = deltaY * scaleY;

    if (dragIndex !== null) {
      // Handle dragging
      const newPositions = [...mustachePositions];
      newPositions[dragIndex] = {
        ...newPositions[dragIndex],
        x: Math.max(0, Math.min(originalImageDimensions.width - newPositions[dragIndex].width, newPositions[dragIndex].x + scaledDeltaX)),
        y: Math.max(0, Math.min(originalImageDimensions.height - newPositions[dragIndex].height, newPositions[dragIndex].y + scaledDeltaY)),
      };
      onPositionsChange(newPositions);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (isResizing !== null) {
      // Handle resizing
      const newPositions = [...mustachePositions];
      const sizeChange = scaledDeltaX * 0.5; // More reasonable scaling for resize
      newPositions[isResizing] = {
        ...newPositions[isResizing],
        width: Math.max(20, Math.min(originalImageDimensions.width * 0.8, newPositions[isResizing].width + sizeChange)),
        height: Math.max(10, Math.min(originalImageDimensions.height * 0.4, newPositions[isResizing].height + sizeChange * 0.4)),
      };
      onPositionsChange(newPositions);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [dragIndex, isResizing, dragStart, mustachePositions, onPositionsChange, originalImageDimensions, containerDimensions]);

  const handleMouseUp = useCallback(() => {
    setDragIndex(null);
    setIsResizing(null);
    setDragStart(null);
  }, []);

  // Track container dimensions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      setContainerDimensions({ width: rect.width, height: rect.height });
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [imageUrl]);

  useEffect(() => {
    if (dragIndex !== null || isResizing !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragIndex, isResizing, handleMouseMove, handleMouseUp]);

  const rotateMustache = (index: number, delta: number) => {
    const newPositions = [...mustachePositions];
    newPositions[index] = {
      ...newPositions[index],
      rotation: (newPositions[index].rotation + delta) % 360,
    };
    onPositionsChange(newPositions);
  };

  if (!isManualMode || !selectedMustache) {
    return (
      <Card className="vintage-card p-4" data-testid="mustache-adjuster">
        <div className="flex items-center space-x-3">
          <Switch 
            id="manual-mode"
            checked={isManualMode}
            onCheckedChange={onManualModeChange}
            data-testid="switch-manual-mode"
          />
          <Label htmlFor="manual-mode" className="text-sm font-medium">
            Manual Adjustment Mode
          </Label>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Enable to manually position and resize mustaches
        </p>
      </Card>
    );
  }

  return (
    <Card className="vintage-card p-4" data-testid="mustache-adjuster">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Switch 
              id="manual-mode"
              checked={isManualMode}
              onCheckedChange={onManualModeChange}
              data-testid="switch-manual-mode"
            />
            <Label htmlFor="manual-mode" className="text-sm font-medium">
              Manual Adjustment Mode
            </Label>
          </div>
        </div>

        {mustachePositions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Adjust Mustaches</h4>
            {mustachePositions.map((position, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-muted/30 rounded">
                <span className="text-xs text-muted-foreground min-w-[60px]">
                  Face {index + 1}
                </span>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rotateMustache(index, -15)}
                    className="h-7 w-7 p-0"
                    data-testid={`button-rotate-left-${index}`}
                  >
                    <RotateCw className="h-3 w-3 scale-x-[-1]" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rotateMustache(index, 15)}
                    className="h-7 w-7 p-0"
                    data-testid={`button-rotate-right-${index}`}
                  >
                    <RotateCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Drag mustaches to move • Drag corners to resize • Use buttons to rotate
            </p>
          </div>
        )}

        {/* Interactive overlay for manual positioning */}
        <div 
          ref={containerRef}
          className="relative border rounded-lg overflow-hidden bg-muted/10"
          style={{ 
            aspectRatio: originalImageDimensions 
              ? `${originalImageDimensions.width} / ${originalImageDimensions.height}` 
              : "1"
          }}
        >
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt="Adjustment preview" 
              className="w-full h-full object-cover"
              draggable={false}
            />
          )}
          
          {/* Draggable mustache overlays */}
          {mustachePositions.map((position, index) => {
            const leftPercent = originalImageDimensions 
              ? (position.x / originalImageDimensions.width) * 100 
              : 0;
            const topPercent = originalImageDimensions 
              ? (position.y / originalImageDimensions.height) * 100 
              : 0;
            const widthPercent = originalImageDimensions 
              ? (position.width / originalImageDimensions.width) * 100 
              : 0;
            const heightPercent = originalImageDimensions 
              ? (position.height / originalImageDimensions.height) * 100 
              : 0;

            return (
              <div
                key={index}
                className="absolute border-2 border-primary/60 bg-primary/10 cursor-move"
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  width: `${widthPercent}%`,
                  height: `${heightPercent}%`,
                  transform: `rotate(${position.rotation}deg)`,
                }}
                onMouseDown={(e) => handleMouseDown(e, index, 'drag')}
                data-testid={`mustache-overlay-${index}`}
              >
              {/* Mustache preview */}
              {selectedMustache && (
                <img
                  src={selectedMustache.svgPath}
                  alt="Mustache"
                  className="w-full h-full object-contain opacity-80"
                  draggable={false}
                />
              )}
              
              {/* Resize handle */}
              <div
                className="absolute bottom-0 right-0 w-3 h-3 bg-primary border border-primary-foreground cursor-se-resize"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, index, 'resize');
                }}
                data-testid={`resize-handle-${index}`}
              >
                <Maximize2 className="h-2 w-2 text-primary-foreground" />
              </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}