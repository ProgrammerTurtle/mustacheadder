import { useState, useEffect } from "react";
import PhotoEditor from "@/components/photo-editor";
import { Card } from "@/components/ui/card";
import { Crown, Star, Gem, Users } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Crown className="text-primary-foreground text-xl" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-2xl text-foreground">Stache Stash</h1>
                <p className="text-sm text-muted-foreground">Distinguished Photo Editing</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="vintage-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-3xl text-foreground mb-2">
                  Add a distinguished mustache to any photo!
                </h2>
                <p className="text-muted-foreground text-lg">
                  Upload a photo and let our face detection add the perfect old-timey mustache
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="text-primary text-3xl" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Photo Editor */}
        <PhotoEditor />
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Crown className="text-primary-foreground text-sm" />
              </div>
              <div>
                <p className="font-serif font-semibold text-foreground">Stache Stash</p>
                <p className="text-xs text-muted-foreground">Distinguished photo editing since 2024</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
