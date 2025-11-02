'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2, MapPin, Phone, Globe, Clock, Camera, Plus, X, Save, Star, Users, Utensils, Car, Wifi, CreditCard, Accessibility, CircleParking as ParkingCircle, Baby, Dog, Volume2, Cigarette, Shield, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Upload, Trash2, Edit3, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { BusinessSkeleton } from '@/components/skeletons/business-skeleton';
import { useLanguage } from '@/contexts/language-context';

interface BusinessHours {
  [key: string]: {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    isAllDay: boolean;
  };
}

interface BusinessImage {
  id: string;
  url: string;
  type: 'logo' | 'cover' | 'interior' | 'exterior' | 'food' | 'team' | 'product';
  alt: string;
  isPrimary?: boolean;
}

interface BusinessAttribute {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  category: 'amenities' | 'accessibility' | 'payments' | 'atmosphere' | 'services';
}

const defaultHours: BusinessHours = {
  monday: { isOpen: true, openTime: '09:00', closeTime: '18:00', isAllDay: false },
  tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00', isAllDay: false },
  wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00', isAllDay: false },
  thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00', isAllDay: false },
  friday: { isOpen: true, openTime: '09:00', closeTime: '18:00', isAllDay: false },
  saturday: { isOpen: true, openTime: '10:00', closeTime: '16:00', isAllDay: false },
  sunday: { isOpen: false, openTime: '10:00', closeTime: '16:00', isAllDay: false },
};

const businessAttributes: BusinessAttribute[] = [
  // Amenities
  { id: 'wifi', name: 'Free Wi-Fi', icon: <Wifi className="w-4 h-4" />, enabled: false, category: 'amenities' },
  { id: 'parking', name: 'Parking Available', icon: <ParkingCircle className="w-4 h-4" />, enabled: false, category: 'amenities' },
  { id: 'outdoor_seating', name: 'Outdoor Seating', icon: <Utensils className="w-4 h-4" />, enabled: false, category: 'amenities' },
  { id: 'delivery', name: 'Delivery', icon: <Car className="w-4 h-4" />, enabled: false, category: 'services' },
  { id: 'takeout', name: 'Takeout', icon: <Utensils className="w-4 h-4" />, enabled: false, category: 'services' },
  
  // Accessibility
  { id: 'wheelchair_accessible', name: 'Wheelchair Accessible', icon: <Accessibility className="w-4 h-4" />, enabled: false, category: 'accessibility' },
  { id: 'accessible_parking', name: 'Accessible Parking', icon: <ParkingCircle className="w-4 h-4" />, enabled: false, category: 'accessibility' },
  
  // Payments
  { id: 'credit_cards', name: 'Credit Cards', icon: <CreditCard className="w-4 h-4" />, enabled: false, category: 'payments' },
  { id: 'contactless_payment', name: 'Contactless Payment', icon: <CreditCard className="w-4 h-4" />, enabled: false, category: 'payments' },
  
  // Atmosphere
  { id: 'family_friendly', name: 'Family Friendly', icon: <Baby className="w-4 h-4" />, enabled: false, category: 'atmosphere' },
  { id: 'pet_friendly', name: 'Pet Friendly', icon: <Dog className="w-4 h-4" />, enabled: false, category: 'atmosphere' },
  { id: 'quiet', name: 'Quiet Atmosphere', icon: <Volume2 className="w-4 h-4" />, enabled: false, category: 'atmosphere' },
  { id: 'no_smoking', name: 'No Smoking', icon: <Cigarette className="w-4 h-4" />, enabled: false, category: 'atmosphere' },
];

export default function BusinessPage() {
  const { t } = useLanguage();
  const [gmbConnected, setGmbConnected] = useState(false);
  
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Bella Vista Restaurant',
    description: 'Authentic Italian cuisine in the heart of Paris. Experience traditional flavors with a modern twist in our cozy, family-friendly atmosphere.',
    category: 'Restaurant',
    subcategory: 'Italian Restaurant',
    phone: '+33 1 42 60 12 34',
    website: 'https://bellavista-paris.fr',
    email: 'contact@bellavista-paris.fr',
    address: '123 Rue de la Paix, 75001 Paris, France',
    postalCode: '75001',
    city: 'Paris',
    country: 'France',
    priceRange: '$$',
    yearEstablished: '2018',
  });

  const [businessHours, setBusinessHours] = useState<BusinessHours>(defaultHours);
  const [specialHours, setSpecialHours] = useState<Array<{
    id: string;
    date: string;
    description: string;
    isClosed: boolean;
    openTime?: string;
    closeTime?: string;
  }>>([]);

  const [images, setImages] = useState<BusinessImage[]>([
    {
      id: '1',
      url: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
      type: 'cover',
      alt: 'Restaurant exterior view',
      isPrimary: true
    },
    {
      id: '2',
      url: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
      type: 'interior',
      alt: 'Cozy dining room interior'
    },
    {
      id: '3',
      url: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
      type: 'food',
      alt: 'Signature pasta dish'
    }
  ]);

  const [attributes, setAttributes] = useState<BusinessAttribute[]>(businessAttributes);
  const [services, setServices] = useState<string[]>(['Dine-in', 'Takeout', 'Delivery']);
  const [newService, setNewService] = useState('');

  // Additional state for new features
  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    tiktok: ''
  });

  const [businessFeatures, setBusinessFeatures] = useState({
    hasMenu: false,
    menuUrl: '',
    hasOnlineOrdering: false,
    orderingUrl: '',
    hasReservations: false,
    reservationUrl: '',
    hasGiftCards: false,
    giftCardUrl: ''
  });

  const [covidInfo, setCovidInfo] = useState({
    healthSafety: {
      maskRequired: false,
      staffWearsMasks: false,
      temperatureCheck: false,
      sanitizingBetweenCustomers: false,
      contactlessPayment: false
    },
    serviceOptions: {
      delivery: false,
      takeout: false,
      dineIn: false,
      curbsidePickup: false,
      noContactDelivery: false
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading business data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    // Validate required fields
    const requiredFields = ['name', 'description', 'category', 'phone', 'address'];
    const missingFields = requiredFields.filter(field => !businessInfo[field as keyof typeof businessInfo]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Simulate saving
    toast.success('Business information saved successfully!', {
      description: 'Your Google Business profile has been updated.'
    });
  };

  const handleImageUpload = (type: BusinessImage['type']) => {
    // Simulate image upload
    const newImage: BusinessImage = {
      id: Date.now().toString(),
      url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      type,
      alt: `New ${type} image`,
    };
    setImages(prev => [...prev, newImage]);
    toast.success('Image uploaded successfully!');
  };

  const handleImageDelete = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
    toast.success('Image deleted successfully!');
  };

  const handleAttributeToggle = (attributeId: string) => {
    setAttributes(prev => prev.map(attr => 
      attr.id === attributeId ? { ...attr, enabled: !attr.enabled } : attr
    ));
  };

  const addService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices(prev => [...prev, newService.trim()]);
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    setServices(prev => prev.filter(s => s !== service));
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 0;

    // Basic info (40% weight)
    const basicFields = ['name', 'description', 'category', 'phone', 'address', 'website'];
    basicFields.forEach(field => {
      total += 1;
      if (businessInfo[field as keyof typeof businessInfo]) completed += 1;
    });

    // Hours (20% weight)
    total += 1;
    const hasHours = Object.values(businessHours).some(day => day.isOpen);
    if (hasHours) completed += 1;

    // Images (20% weight)
    total += 1;
    if (images.length >= 3) completed += 1;

    // Attributes (10% weight)
    total += 1;
    const enabledAttributes = attributes.filter(attr => attr.enabled);
    if (enabledAttributes.length >= 3) completed += 1;

    // Services (10% weight)
    total += 1;
    if (services.length >= 2) completed += 1;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = getCompletionPercentage();


  if (isLoading) {
    return <BusinessSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('business.title')}
          </h1>
          <p className="text-muted-foreground">
            {gmbConnected 
              ? `✅ ${t('business.gmbConnected')}` 
              : t('business.description')
            }
          </p>
        </div>
        <div className="flex gap-2">
          {gmbConnected && (
            <Button 
              variant="outline"
              onClick={() => window.open('https://business.google.com', '_blank')}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {t('business.openGMB')}
            </Button>
          )}
          <Button onClick={handleSave} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25">
            <Save className="w-4 h-4 mr-2" />
            {t('business.saveChanges')}
          </Button>
        </div>
      </div>

      {/* GMB Connection Status */}
      {gmbConnected && (
        <Card className="border-2 border-green-200/50 dark:border-green-800/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">
                  {t('business.gmbSuccess')}
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  {t('business.gmbSuccessDesc')}
                </p>
              </div>
              <div className="text-right">
                <Badge className="bg-green-500 text-white">
                  <div className="w-2 h-2 bg-green-200 rounded-full mr-2 animate-pulse"></div>
                  {t('business.liveSync')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Status */}
      <Card className={cn(
        "border-2",
        completionPercentage >= 80 ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20" :
        completionPercentage >= 60 ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20" :
        "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                completionPercentage >= 80 ? "bg-green-100 dark:bg-green-900/30" :
                completionPercentage >= 60 ? "bg-yellow-100 dark:bg-yellow-900/30" :
                "bg-red-100 dark:bg-red-900/30"
              )}>
                {completionPercentage >= 80 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{t('business.profileCompletion')}</h3>
                <p className="text-sm text-muted-foreground">
                  {completionPercentage >= 80 ? t('business.excellentProfile') :
                   completionPercentage >= 60 ? t('business.goodProgress') :
                   t('business.completeProfile')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{completionPercentage}%</div>
              <div className="text-sm text-muted-foreground">{t('business.complete')}</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className={cn(
                "h-3 rounded-full transition-all duration-300",
                completionPercentage >= 80 ? "bg-gradient-to-r from-green-500 to-green-600" :
                completionPercentage >= 60 ? "bg-gradient-to-r from-yellow-500 to-yellow-600" :
                "bg-gradient-to-r from-red-500 to-red-600"
              )}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {t('business.basicInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">{t('business.businessName')} *</Label>
                <Input
                  id="businessName"
                  value={businessInfo.name}
                  onChange={(e) => setBusinessInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your business name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{t('business.primaryCategory')} *</Label>
                <Select
                  value={businessInfo.category}
                  onValueChange={(value) => setBusinessInfo(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Restaurant">{t('business.restaurant')}</SelectItem>
                    <SelectItem value="Retail Store">{t('business.retailStore')}</SelectItem>
                    <SelectItem value="Service Business">{t('business.serviceBusiness')}</SelectItem>
                    <SelectItem value="Healthcare">{t('business.healthcare')}</SelectItem>
                    <SelectItem value="Beauty & Spa">{t('business.beautySpa')}</SelectItem>
                    <SelectItem value="Automotive">{t('business.automotive')}</SelectItem>
                    <SelectItem value="Professional Services">{t('business.professionalServices')}</SelectItem>
                    <SelectItem value="Entertainment">{t('business.entertainment')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">{t('business.subcategory')}</Label>
              <Input
                id="subcategory"
                value={businessInfo.subcategory}
                onChange={(e) => setBusinessInfo(prev => ({ ...prev, subcategory: e.target.value }))}
                placeholder="e.g., Italian Restaurant, Hair Salon, Auto Repair"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('business.businessDescription')} *</Label>
              <Textarea
                id="description"
                value={businessInfo.description}
                onChange={(e) => setBusinessInfo(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your business, services, and what makes you unique..."
                rows={4}
                className="resize-none"
              />
              <div className="text-xs text-muted-foreground">
                {businessInfo.description.length}/500 characters
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearEstablished">Year Established</Label>
                <Input
                  id="yearEstablished"
                  type="number"
                  value={businessInfo.yearEstablished}
                  onChange={(e) => setBusinessInfo(prev => ({ ...prev, yearEstablished: e.target.value }))}
                  placeholder="2020"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceRange">Price Range</Label>
                <Select
                  value={businessInfo.priceRange}
                  onValueChange={(value) => setBusinessInfo(prev => ({ ...prev, priceRange: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$">$ - Inexpensive</SelectItem>
                    <SelectItem value="$$">$$ - Moderate</SelectItem>
                    <SelectItem value="$$$">$$$ - Expensive</SelectItem>
                    <SelectItem value="$$$$">$$$$ - Very Expensive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              {t('business.contactInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t('business.phoneNumber')} *</Label>
              <Input
                id="phone"
                type="tel"
                value={businessInfo.phone}
                onChange={(e) => setBusinessInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('business.emailAddress')}</Label>
              <Input
                id="email"
                type="email"
                value={businessInfo.email}
                onChange={(e) => setBusinessInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="contact@yourbusiness.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">{t('business.websiteUrl')}</Label>
              <Input
                id="website"
                type="url"
                value={businessInfo.website}
                onChange={(e) => setBusinessInfo(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourbusiness.com"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Textarea
                id="address"
                value={businessInfo.address}
                onChange={(e) => setBusinessInfo(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Main Street, Suite 100"
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={businessInfo.city}
                  onChange={(e) => setBusinessInfo(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="New York"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={businessInfo.postalCode}
                  onChange={(e) => setBusinessInfo(prev => ({ ...prev, postalCode: e.target.value }))}
                  placeholder="10001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={businessInfo.country}
                  onChange={(e) => setBusinessInfo(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="United States"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t('business.businessHours')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(businessHours).map(([day, hours]) => (
              <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="w-20 text-sm font-medium capitalize">
                  {day}
                </div>
                <Switch
                  checked={hours.isOpen}
                  onCheckedChange={(checked) => 
                    setBusinessHours(prev => ({
                      ...prev,
                      [day]: { ...prev[day], isOpen: checked }
                    }))
                  }
                />
                {hours.isOpen && (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="time"
                      value={hours.openTime}
                      onChange={(e) => 
                        setBusinessHours(prev => ({
                          ...prev,
                          [day]: { ...prev[day], openTime: e.target.value }
                        }))
                      }
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={hours.closeTime}
                      onChange={(e) => 
                        setBusinessHours(prev => ({
                          ...prev,
                          [day]: { ...prev[day], closeTime: e.target.value }
                        }))
                      }
                      className="w-24"
                    />
                    <Switch
                      checked={hours.isAllDay}
                      onCheckedChange={(checked) => 
                        setBusinessHours(prev => ({
                          ...prev,
                          [day]: { ...prev[day], isAllDay: checked }
                        }))
                      }
                    />
                    <span className="text-xs text-muted-foreground">24h</span>
                  </div>
                )}
                {!hours.isOpen && (
                  <div className="flex-1 text-sm text-muted-foreground">
                    Closed
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t('business.servicesOffered')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <Badge key={service} variant="secondary" className="flex items-center gap-1">
                  {service}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => removeService(service)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a service..."
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addService()}
              />
              <Button onClick={addService} disabled={!newService.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Business Images
            <Badge variant="outline" className="ml-2">
              {images.length} images
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {['logo', 'cover', 'interior', 'exterior', 'food', 'team', 'product'].map((type) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => handleImageUpload(type as BusinessImage['type'])}
                className="h-20 flex flex-col gap-1 text-xs"
              >
                <Upload className="w-4 h-4" />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    {image.type}
                  </Badge>
                  {image.isPrimary && (
                    <Badge className="ml-1 bg-blue-500 text-white text-xs">
                      Primary
                    </Badge>
                  )}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleImageDelete(image.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <Input
                    placeholder="Image description..."
                    value={image.alt}
                    onChange={(e) => {
                      setImages(prev => prev.map(img => 
                        img.id === image.id ? { ...img, alt: e.target.value } : img
                      ));
                    }}
                    className="text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Attributes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Business Attributes
            <Badge variant="outline" className="ml-2">
              {attributes.filter(attr => attr.enabled).length} selected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {['amenities', 'services', 'accessibility', 'payments', 'atmosphere'].map((category) => (
            <div key={category}>
              <h4 className="font-medium mb-3 capitalize">{category}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {attributes
                  .filter(attr => attr.category === category)
                  .map((attribute) => (
                    <div
                      key={attribute.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                        attribute.enabled
                          ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      )}
                      onClick={() => handleAttributeToggle(attribute.id)}
                    >
                      <div className={cn(
                        "p-2 rounded-lg",
                        attribute.enabled
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                      )}>
                        {attribute.icon}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium">{attribute.name}</span>
                      </div>
                      <Switch
                        checked={attribute.enabled}
                        onCheckedChange={() => handleAttributeToggle(attribute.id)}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SEO Tips */}
      <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-400">
            <Shield className="w-5 h-5" />
            SEO Optimization Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-blue-800 dark:text-blue-400">Essential for Google Ranking:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Complete business name and category
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Accurate address and phone number
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Regular business hours
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  High-quality photos (minimum 3)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Detailed business description
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-blue-800 dark:text-blue-400">Boost Your Visibility:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Add social media profiles
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Set up business features (menu, ordering)
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Configure health & safety measures
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Add relevant business attributes
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Upload high-quality photos regularly
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}