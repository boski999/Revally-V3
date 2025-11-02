'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Bot, 
  Bell, 
  Globe, 
  Save,
  Plus,
  X,
  Check
} from 'lucide-react';
import { mockSettings } from '@/lib/mock-data';
import { toast } from 'sonner';
import { SettingsSkeleton } from '@/components/skeletons/settings-skeleton';
import { useLanguage } from '@/contexts/language-context';

export default function SettingsPage() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState(mockSettings);
  const [newPrompt, setNewPrompt] = useState('');
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading settings data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    // Simulate saving settings
    toast.success('Settings saved successfully');
  };

  const handleAddPrompt = () => {
    if (newPrompt.trim()) {
      setSettings(prev => ({
        ...prev,
        aiSettings: {
          ...prev.aiSettings,
          customPrompts: [...prev.aiSettings.customPrompts, newPrompt.trim()]
        }
      }));
      setNewPrompt('');
      setIsAddingPrompt(false);
      toast.success('Custom prompt added');
    }
  };

  const handleRemovePrompt = (index: number) => {
    setSettings(prev => ({
      ...prev,
      aiSettings: {
        ...prev.aiSettings,
        customPrompts: prev.aiSettings.customPrompts.filter((_, i) => i !== index)
      }
    }));
    toast.success('Custom prompt removed');
  };

  const platforms = [
    { name: 'Google', connected: true, status: 'Connected' },
    { name: 'Yelp', connected: true, status: 'Connected' },
    { name: 'Facebook', connected: true, status: 'Connected' },
    { name: 'TripAdvisor', connected: false, status: 'Not Connected' },
  ];

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
          <p className="text-muted-foreground">
            {t('settings.description')}
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          {t('common.save')} {t('common.changes')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              {t('settings.businessInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">{t('settings.businessName')}</Label>
              <Input
                id="businessName"
                value={settings.business.name}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  business: { ...prev.business, name: e.target.value }
                }))}
                className="min-h-[44px] sm:min-h-auto"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessType">{t('settings.businessType')}</Label>
              <Select
                value={settings.business.type}
                onValueChange={(value) => setSettings(prev => ({
                  ...prev,
                  business: { ...prev.business, type: value }
                }))}
              >
                <SelectTrigger className="min-h-[44px] sm:min-h-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Restaurant">{t('settings.restaurant')}</SelectItem>
                  <SelectItem value="Retail">{t('settings.retailStore')}</SelectItem>
                  <SelectItem value="Service">{t('settings.serviceBusiness')}</SelectItem>
                  <SelectItem value="Healthcare">{t('settings.healthcare')}</SelectItem>
                  <SelectItem value="Hospitality">{t('settings.hospitality')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">{t('settings.address')}</Label>
              <Textarea
                id="address"
                value={settings.business.address}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  business: { ...prev.business, address: e.target.value }
                }))}
                rows={2}
                className="min-h-[44px] resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t('settings.phone')}</Label>
                <Input
                  id="phone"
                  value={settings.business.phone}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    business: { ...prev.business, phone: e.target.value }
                  }))}
                  className="min-h-[44px] sm:min-h-auto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">{t('settings.website')}</Label>
                <Input
                  id="website"
                  value={settings.business.website}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    business: { ...prev.business, website: e.target.value }
                  }))}
                  className="min-h-[44px] sm:min-h-auto"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Connections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t('settings.platformConnections')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {platforms.map((platform) => (
              <div key={platform.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-3 h-3 rounded-full ${
                    platform.connected ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className="font-medium truncate">{platform.name}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <Badge variant={platform.connected ? 'default' : 'secondary'}>
                    {platform.status}
                  </Badge>
                  <Button 
                    size="sm"
                    variant={platform.connected ? 'outline' : 'default'}
                    className="min-h-[36px] px-4"
                  >
                    {platform.connected ? t('common.disconnect') : t('common.connect')}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              {t('settings.aiSettings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('settings.responseStyle')}</Label>
              <Select
                value={settings.aiSettings.responseStyle}
                onValueChange={(value: 'professional' | 'friendly' | 'casual') => 
                  setSettings(prev => ({
                    ...prev,
                    aiSettings: { ...prev.aiSettings, responseStyle: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">{t('settings.professional')}</SelectItem>
                  <SelectItem value="friendly">{t('settings.friendly')}</SelectItem>
                  <SelectItem value="casual">{t('settings.casual')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('settings.autoApproval')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.autoApprovalDesc')}
                </p>
              </div>
              <Switch
                checked={settings.aiSettings.autoApproval}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({
                    ...prev,
                    aiSettings: { ...prev.aiSettings, autoApproval: checked }
                  }))
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label>{t('settings.urgentThreshold')}</Label>
              <Select
                value={settings.aiSettings.urgentThreshold.toString()}
                onValueChange={(value) => 
                  setSettings(prev => ({
                    ...prev,
                    aiSettings: { ...prev.aiSettings, urgentThreshold: parseInt(value) }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t('settings.oneStarBelow')}</SelectItem>
                  <SelectItem value="2">{t('settings.twoStarsBelow')}</SelectItem>
                  <SelectItem value="3">{t('settings.threeStarsBelow')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>{t('settings.customPrompts')}</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAddingPrompt(true)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {t('settings.addPrompt')}
                </Button>
              </div>
              
              {isAddingPrompt && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter custom prompt..."
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddPrompt()}
                  />
                  <Button size="sm" onClick={handleAddPrompt}>
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setIsAddingPrompt(false);
                    setNewPrompt('');
                  }}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
              
              <div className="space-y-2">
                {settings.aiSettings.customPrompts.map((prompt, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{prompt}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemovePrompt(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Response Templates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pre-written response templates that can be quickly inserted when editing AI responses.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Response Templates</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAddingPrompt(true)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Template
                </Button>
              </div>
              
              {isAddingPrompt && (
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Enter response template..."
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                  <div className="flex flex-col gap-1">
                    <Button size="sm" onClick={() => {
                      if (newPrompt.trim()) {
                        setSettings(prev => ({
                          ...prev,
                          aiSettings: {
                            ...prev.aiSettings,
                            responseTemplates: [...prev.aiSettings.responseTemplates, newPrompt.trim()]
                          }
                        }));
                        setNewPrompt('');
                        setIsAddingPrompt(false);
                        toast.success('Response template added');
                      }
                    }}>
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => {
                      setIsAddingPrompt(false);
                      setNewPrompt('');
                    }}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                {settings.aiSettings.responseTemplates.map((template, index) => (
                  <div key={index} className="flex items-start justify-between p-3 bg-muted rounded border">
                    <span className="text-sm flex-1 leading-relaxed">{template}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSettings(prev => ({
                          ...prev,
                          aiSettings: {
                            ...prev.aiSettings,
                            responseTemplates: prev.aiSettings.responseTemplates.filter((_, i) => i !== index)
                          }
                        }));
                        toast.success('Response template removed');
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('settings.emailNotifications')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.emailNotificationsDesc')}
                </p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, email: checked }
                  }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('settings.pushNotifications')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.pushNotificationsDesc')}
                </p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, push: checked }
                  }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('settings.smsNotifications')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.smsNotificationsDesc')}
                </p>
              </div>
              <Switch
                checked={settings.notifications.sms}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, sms: checked }
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}