'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, AlertTriangle, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlatformRequirements {
  name: string;
  icon: React.ReactNode;
  characterLimit: number;
  hashtagLimit: number;
  imageSpecs: {
    aspectRatio: string;
    minWidth: number;
    minHeight: number;
    maxSize: number;
  };
  bestPractices: string[];
}

interface PlatformOptimizerProps {
  content: string;
  hashtags: string[];
  images: { url: string; width?: number; height?: number }[];
  selectedPlatforms: string[];
}

const platformSpecs: Record<string, PlatformRequirements> = {
  Instagram: {
    name: 'Instagram',
    icon: <Instagram className="w-4 h-4" />,
    characterLimit: 2200,
    hashtagLimit: 30,
    imageSpecs: {
      aspectRatio: '1:1 or 4:5',
      minWidth: 1080,
      minHeight: 1080,
      maxSize: 8,
    },
    bestPractices: [
      'Use 3-5 hashtags for best engagement',
      'Post during 11am-1pm or 7-9pm',
      'Square (1:1) or portrait (4:5) images perform best',
      'First 125 characters show in feed',
    ],
  },
  Facebook: {
    name: 'Facebook',
    icon: <Facebook className="w-4 h-4" />,
    characterLimit: 63206,
    hashtagLimit: 2,
    imageSpecs: {
      aspectRatio: '1.91:1',
      minWidth: 1200,
      minHeight: 628,
      maxSize: 10,
    },
    bestPractices: [
      'Keep text under 400 characters',
      'Use 1-2 hashtags maximum',
      'Post during 1-3pm on weekdays',
      'Landscape images (1.91:1) recommended',
    ],
  },
  Twitter: {
    name: 'Twitter',
    icon: <Twitter className="w-4 h-4" />,
    characterLimit: 280,
    hashtagLimit: 2,
    imageSpecs: {
      aspectRatio: '16:9',
      minWidth: 1200,
      minHeight: 675,
      maxSize: 5,
    },
    bestPractices: [
      'Keep it concise and direct',
      'Use 1-2 hashtags for reach',
      'Post during 8-10am or 6-9pm',
      'Landscape images (16:9) work best',
    ],
  },
  LinkedIn: {
    name: 'LinkedIn',
    icon: <Linkedin className="w-4 h-4" />,
    characterLimit: 3000,
    hashtagLimit: 5,
    imageSpecs: {
      aspectRatio: '1.91:1',
      minWidth: 1200,
      minHeight: 628,
      maxSize: 10,
    },
    bestPractices: [
      'Professional tone is essential',
      'Use 3-5 relevant hashtags',
      'Post during business hours',
      'Include industry insights',
    ],
  },
};

export function PlatformOptimizer({
  content,
  hashtags,
  images,
  selectedPlatforms,
}: PlatformOptimizerProps) {
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  const analyzePlatform = (platformName: string) => {
    const specs = platformSpecs[platformName];
    if (!specs) return null;

    const issues: { type: 'error' | 'warning' | 'success'; message: string }[] = [];

    if (content.length > specs.characterLimit) {
      issues.push({
        type: 'error',
        message: `Text exceeds ${specs.characterLimit} character limit (${content.length} characters)`,
      });
    } else if (content.length > specs.characterLimit * 0.9) {
      issues.push({
        type: 'warning',
        message: `Close to character limit (${content.length}/${specs.characterLimit})`,
      });
    } else {
      issues.push({
        type: 'success',
        message: `Character count optimal (${content.length}/${specs.characterLimit})`,
      });
    }

    if (hashtags.length > specs.hashtagLimit) {
      issues.push({
        type: 'warning',
        message: `Using ${hashtags.length} hashtags (recommended: ${specs.hashtagLimit})`,
      });
    } else if (hashtags.length > 0) {
      issues.push({
        type: 'success',
        message: `Hashtag count optimal (${hashtags.length}/${specs.hashtagLimit})`,
      });
    }

    if (images.length > 0) {
      issues.push({
        type: 'success',
        message: `${images.length} image(s) ready for ${specs.imageSpecs.aspectRatio} format`,
      });
    } else {
      issues.push({
        type: 'warning',
        message: 'No images attached - posts with images get 2.3x more engagement',
      });
    }

    const errorCount = issues.filter(i => i.type === 'error').length;
    const warningCount = issues.filter(i => i.type === 'warning').length;
    const score = errorCount === 0 ? (warningCount === 0 ? 100 : 75) : 40;

    return { issues, score };
  };

  return (
    <Card className="border-2 border-orange-200/50 dark:border-orange-800/50">
      <CardHeader>
        <CardTitle>Platform Optimization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedPlatforms.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Select platforms to see optimization recommendations</p>
          </div>
        ) : (
          selectedPlatforms.map((platformName) => {
            const analysis = analyzePlatform(platformName);
            const specs = platformSpecs[platformName];
            if (!analysis || !specs) return null;

            const isExpanded = expandedPlatform === platformName;

            return (
              <Card key={platformName} className="border">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedPlatform(isExpanded ? null : platformName)}
                    >
                      <div className="flex items-center gap-3">
                        {specs.icon}
                        <span className="font-medium">{platformName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{analysis.score}%</span>
                        {analysis.score === 100 ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : analysis.score >= 75 ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>

                    <Progress
                      value={analysis.score}
                      className={cn(
                        "h-2",
                        analysis.score === 100 && "bg-green-200",
                        analysis.score >= 75 && analysis.score < 100 && "bg-yellow-200",
                        analysis.score < 75 && "bg-red-200"
                      )}
                    />

                    {isExpanded && (
                      <div className="space-y-3 pt-2 border-t">
                        <div className="space-y-2">
                          {analysis.issues.map((issue, index) => (
                            <div
                              key={index}
                              className={cn(
                                "flex items-start gap-2 text-sm p-2 rounded",
                                issue.type === 'error' && "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300",
                                issue.type === 'warning' && "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-300",
                                issue.type === 'success' && "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300"
                              )}
                            >
                              {issue.type === 'error' && <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                              {issue.type === 'warning' && <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                              {issue.type === 'success' && <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                              <span className="text-xs">{issue.message}</span>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2 pt-2 border-t">
                          <h4 className="text-sm font-semibold">Best Practices</h4>
                          <ul className="space-y-1">
                            {specs.bestPractices.map((practice, index) => (
                              <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span>{practice}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2 border-t">
                          <h4 className="text-sm font-semibold mb-2">Image Specifications</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <div className="text-muted-foreground">Aspect Ratio</div>
                              <div className="font-medium">{specs.imageSpecs.aspectRatio}</div>
                            </div>
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <div className="text-muted-foreground">Min Dimensions</div>
                              <div className="font-medium">
                                {specs.imageSpecs.minWidth}x{specs.imageSpecs.minHeight}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
