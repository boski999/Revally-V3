'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crop, Palette, Type, Sparkles, Download, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageEditorProps {
  imageUrl: string;
  onSave: (editedImage: string, metadata: ImageEditMetadata) => void;
  onCancel: () => void;
}

interface ImageEditMetadata {
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
  zoom: number;
  textOverlay?: {
    text: string;
    position: 'top' | 'center' | 'bottom';
    color: string;
    fontSize: number;
  };
}

export function ImageEditor({ imageUrl, onSave, onCancel }: ImageEditorProps) {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [textOverlay, setTextOverlay] = useState('');
  const [textPosition, setTextPosition] = useState<'top' | 'center' | 'bottom'>('center');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [fontSize, setFontSize] = useState(24);

  const getFilterStyle = () => {
    return {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
      transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
    };
  };

  const handleSave = () => {
    const metadata: ImageEditMetadata = {
      brightness,
      contrast,
      saturation,
      rotation,
      zoom,
      ...(textOverlay && {
        textOverlay: {
          text: textOverlay,
          position: textPosition,
          color: textColor,
          fontSize,
        }
      })
    };

    onSave(imageUrl, metadata);
  };

  const resetAll = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setRotation(0);
    setZoom(100);
    setTextOverlay('');
  };

  return (
    <Card className="border-2 border-purple-200/50 dark:border-purple-800/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Edit Image
          </CardTitle>
          <Button variant="outline" size="sm" onClick={resetAll}>
            Reset All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Preview */}
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt="Edit preview"
            className="w-full h-full object-contain transition-all duration-200"
            style={getFilterStyle()}
          />

          {textOverlay && (
            <div
              className={cn(
                "absolute left-0 right-0 text-center font-bold p-4 pointer-events-none",
                textPosition === 'top' && "top-0",
                textPosition === 'center' && "top-1/2 -translate-y-1/2",
                textPosition === 'bottom' && "bottom-0"
              )}
              style={{
                color: textColor,
                fontSize: `${fontSize}px`,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {textOverlay}
            </div>
          )}
        </div>

        {/* Editing Tools */}
        <Tabs defaultValue="adjust" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="adjust">
              <Palette className="w-4 h-4 mr-1" />
              Adjust
            </TabsTrigger>
            <TabsTrigger value="transform">
              <RotateCw className="w-4 h-4 mr-1" />
              Transform
            </TabsTrigger>
            <TabsTrigger value="text">
              <Type className="w-4 h-4 mr-1" />
              Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="adjust" className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Brightness</Label>
                  <span className="text-xs text-muted-foreground">{brightness}%</span>
                </div>
                <Slider
                  value={[brightness]}
                  onValueChange={(value) => setBrightness(value[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Contrast</Label>
                  <span className="text-xs text-muted-foreground">{contrast}%</span>
                </div>
                <Slider
                  value={[contrast]}
                  onValueChange={(value) => setContrast(value[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Saturation</Label>
                  <span className="text-xs text-muted-foreground">{saturation}%</span>
                </div>
                <Slider
                  value={[saturation]}
                  onValueChange={(value) => setSaturation(value[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transform" className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Rotation</Label>
                  <span className="text-xs text-muted-foreground">{rotation}°</span>
                </div>
                <div className="flex gap-2">
                  <Slider
                    value={[rotation]}
                    onValueChange={(value) => setRotation(value[0])}
                    min={0}
                    max={360}
                    step={15}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRotation((rotation + 90) % 360)}
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Zoom</Label>
                  <span className="text-xs text-muted-foreground">{zoom}%</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Slider
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    min={50}
                    max={200}
                    step={5}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.min(200, zoom + 10))}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Text Overlay</Label>
                <Input
                  placeholder="Enter text to overlay..."
                  value={textOverlay}
                  onChange={(e) => setTextOverlay(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Position</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['top', 'center', 'bottom'] as const).map((pos) => (
                    <Button
                      key={pos}
                      variant={textPosition === pos ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTextPosition(pos)}
                      className="capitalize"
                    >
                      {pos}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    min={12}
                    max={72}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
