import { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import FileUpload from "./file-upload";
import MustacheSelector from "./mustache-selector";
import { loadFaceDetection, detectFaces } from "@/lib/face-detection";
import { downloadImage } from "@/lib/image-processing";
import { Download, RotateCcw } from "lucide-react";

export interface MustacheStyle {
  id: string;
  name: string;
  icon: any;
  svgPath: string;
}

export default function PhotoEditor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedMustache, setSelectedMustache] = useState<MustacheStyle | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [faces, setFaces] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const initializeFaceDetection = async () => {
      try {
        await loadFaceDetection();
        setIsModelLoaded(true);
        toast({
          title: "Face detection ready",
          description: "Upload a photo to get started!",
        });
      } catch (error) {
        console.error("Failed to load face detection models:", error);
        toast({
          title: "Face detection unavailable",
          description: "You can still manually position mustaches",
          variant: "destructive",
        });
      }
    };

    initializeFaceDetection();
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      setOriginalImage(imageUrl);
      setProcessedImage(null);
      setFaces([]);

      if (isModelLoaded) {
        setIsProcessing(true);
        try {
          const detectedFaces = await detectFaces(imageUrl);
          setFaces(detectedFaces);
          toast({
            title: `Found ${detectedFaces.length} face(s)`,
            description: "Select a mustache style to apply",
          });
        } catch (error) {
          console.error("Face detection failed:", error);
          toast({
            title: "Face detection failed",
            description: "You can still add mustaches manually",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      }
    };
    reader.readAsDataURL(file);
  }, [isModelLoaded]);

  const applyMustache = useCallback(async () => {
    if (!originalImage || !selectedMustache || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Load and apply mustache SVG
      const mustacheImg = new Image();
      mustacheImg.onload = () => {
        if (faces.length > 0) {
          // Apply mustache to detected faces
          faces.forEach((face) => {
            const landmarks = face.landmarks;
            if (landmarks && landmarks.getMouth) {
              const mouth = landmarks.getMouth();
              const mouthCenter = mouth.reduce((acc: any, point: any) => ({
                x: acc.x + point.x,
                y: acc.y + point.y
              }), { x: 0, y: 0 });
              mouthCenter.x /= mouth.length;
              mouthCenter.y /= mouth.length;

              const mustacheWidth = face.detection.box.width * 0.6;
              const mustacheHeight = mustacheWidth * 0.4;
              const mustacheX = mouthCenter.x - mustacheWidth / 2;
              const mustacheY = mouthCenter.y - mustacheHeight * 0.8;

              ctx.drawImage(mustacheImg, mustacheX, mustacheY, mustacheWidth, mustacheHeight);
            }
          });
        } else {
          // Default positioning for manual application
          const mustacheWidth = img.width * 0.15;
          const mustacheHeight = mustacheWidth * 0.4;
          const mustacheX = img.width / 2 - mustacheWidth / 2;
          const mustacheY = img.height * 0.55;

          ctx.drawImage(mustacheImg, mustacheX, mustacheY, mustacheWidth, mustacheHeight);
        }

        setProcessedImage(canvas.toDataURL());
        toast({
          title: "Mustache applied!",
          description: "Your distinguished photo is ready for download",
        });
      };
      mustacheImg.src = selectedMustache.svgPath;
    };
    img.src = originalImage;
  }, [originalImage, selectedMustache, faces]);

  useEffect(() => {
    if (originalImage && selectedMustache) {
      applyMustache();
    }
  }, [originalImage, selectedMustache, applyMustache]);

  const handleDownload = () => {
    if (processedImage) {
      downloadImage(processedImage, 'distinguished-photo.png');
      toast({
        title: "Download complete!",
        description: "Your distinguished photo has been saved",
      });
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setSelectedMustache(null);
    setFaces([]);
  };

  return (
    <Card className="vintage-card p-6" data-testid="photo-editor">
      <h3 className="font-serif font-semibold text-xl text-foreground mb-4">
        Distinguished Photo Editor
      </h3>

      {!originalImage ? (
        <FileUpload onUpload={handleImageUpload} />
      ) : (
        <div className="space-y-6">
          {/* Image Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Original</h4>
              <div className="aspect-square bg-muted rounded-lg border border-border overflow-hidden">
                <img
                  ref={originalImageRef}
                  src={originalImage}
                  alt="Original"
                  className="w-full h-full object-cover"
                  data-testid="original-image"
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-3">With Distinguished Mustache</h4>
              <div className="aspect-square bg-muted rounded-lg border border-border overflow-hidden relative">
                {processedImage ? (
                  <img
                    src={processedImage}
                    alt="With mustache"
                    className="w-full h-full object-cover"
                    data-testid="processed-image"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {isProcessing ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Detecting faces...</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Select a mustache style</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Mustache Selection */}
          <MustacheSelector
            selectedMustache={selectedMustache}
            onMustacheSelect={setSelectedMustache}
          />

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              data-testid="button-reset"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
            <Button
              className="gold-gradient text-primary-foreground hover:shadow-lg"
              onClick={handleDownload}
              disabled={!processedImage}
              data-testid="button-download"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Distinguished Photo
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
