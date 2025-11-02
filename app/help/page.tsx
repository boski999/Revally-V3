'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircleHelp as HelpCircle, Play, MessageCircle, BookOpen, Lightbulb, Search, ChevronDown, ChevronRight, Send, CircleCheck as CheckCircle2, Clock, CircleAlert as AlertCircle, Video, FileText, Headphones } from 'lucide-react';
import { GuidedTour } from '@/components/help/guided-tour';
import { FAQSection } from '@/components/help/faq-section';
import { SupportChat } from '@/components/help/support-chat';
import { VideoTutorials } from '@/components/help/video-tutorials';
import { UserGuide } from '@/components/help/user-guide';
import { useLanguage } from '@/contexts/language-context';
import { HelpSkeleton } from '@/components/skeletons/help-skeleton';

export default function HelpPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('guide');
  const [showTour, setShowTour] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <HelpSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('help.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('help.description')}
          </p>
        </div>
        <Button 
          onClick={() => setShowTour(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25"
        >
          <Play className="w-4 h-4 mr-2" />
          {t('help.startTour')}
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setActiveTab('guide')}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-sm sm:text-base">{t('help.userGuide')}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{t('help.stepByStep')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200/50 dark:border-green-800/50 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setActiveTab('videos')}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg">
                <Video className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium text-sm sm:text-base">{t('help.videoTutorials')}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{t('help.visualLearning')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setActiveTab('support')}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
                <Headphones className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h3 className="font-medium text-sm sm:text-base">{t('help.getSupport')}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{t('help.chatTeam')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 sm:inline hidden" />
            <span className="text-xs sm:text-sm">{t('help.userGuide')}</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="w-4 h-4 sm:inline hidden" />
            <span className="text-xs sm:text-sm">{t('help.videos')}</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 sm:inline hidden" />
            <span className="text-xs sm:text-sm">{t('help.faq')}</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 sm:inline hidden" />
            <span className="text-xs sm:text-sm">{t('help.support')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guide" className="space-y-6">
          <UserGuide />
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <VideoTutorials />
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <FAQSection />
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <SupportChat />
        </TabsContent>
      </Tabs>

      {/* Guided Tour Component */}
      {showTour && (
        <GuidedTour onClose={() => setShowTour(false)} />
      )}
    </div>
  );
}