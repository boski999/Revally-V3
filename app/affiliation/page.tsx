'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, DollarSign, TrendingUp, Gift, Copy, ExternalLink, CircleCheck as CheckCircle2, Star, Target, Zap, Crown, Award, Share2, Download, Calendar, ChartBar as BarChart3, Handshake, Rocket, Globe, Mail, MessageSquare, FileText, CreditCard, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';
import { AffiliationSkeleton } from '@/components/skeletons/affiliation-skeleton';

interface AffiliateStats {
  totalEarnings: number;
  monthlyEarnings: number;
  totalReferrals: number;
  activeReferrals: number;
  conversionRate: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

interface Commission {
  id: string;
  referralName: string;
  plan: string;
  amount: number;
  status: 'pending' | 'paid' | 'processing';
  date: string;
}

const mockAffiliateStats: AffiliateStats = {
  totalEarnings: 2450,
  monthlyEarnings: 680,
  totalReferrals: 23,
  activeReferrals: 18,
  conversionRate: 78,
  tier: 'Gold'
};

const mockCommissions: Commission[] = [
  {
    id: '1',
    referralName: 'Restaurant Le Petit Bistro',
    plan: 'Professional',
    amount: 89,
    status: 'paid',
    date: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    referralName: 'Café Central',
    plan: 'Business',
    amount: 149,
    status: 'processing',
    date: '2024-01-14T15:20:00Z'
  },
  {
    id: '3',
    referralName: 'Hotel Bella Vista',
    plan: 'Enterprise',
    amount: 299,
    status: 'pending',
    date: '2024-01-13T09:45:00Z'
  }
];

export default function AffiliationPage() {
  const { t } = useLanguage();
  const [affiliateCode] = useState('REVALLY-JD2024');
  const [affiliateLink] = useState(`https://revally.fr/signup?ref=${affiliateCode}`);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AffiliationSkeleton />;
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      case 'Silver': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
      case 'Gold': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Platinum': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Bronze': return <Award className="w-4 h-4" />;
      case 'Silver': return <Star className="w-4 h-4" />;
      case 'Gold': return <Crown className="w-4 h-4" />;
      case 'Platinum': return <Rocket className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'processing': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'pending': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Affiliate Program
          </h1>
          <p className="text-muted-foreground">
            Earn money by referring businesses to Revally
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn('flex items-center gap-1', getTierColor(mockAffiliateStats.tier))}>
            {getTierIcon(mockAffiliateStats.tier)}
            {mockAffiliateStats.tier} Partner
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-green-200/50 dark:border-green-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">${mockAffiliateStats.totalEarnings}</div>
                <div className="text-xs text-muted-foreground">Total Earnings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">${mockAffiliateStats.monthlyEarnings}</div>
                <div className="text-xs text-muted-foreground">This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200/50 dark:border-purple-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{mockAffiliateStats.totalReferrals}</div>
                <div className="text-xs text-muted-foreground">Total Referrals</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200/50 dark:border-orange-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-lg">
                <Target className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{mockAffiliateStats.conversionRate}%</div>
                <div className="text-xs text-muted-foreground">Conversion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="program" className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            <span className="hidden sm:inline">Program</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Tools</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2 border-blue-200/50 dark:border-blue-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Referrals</span>
                    <span className="font-medium">{mockAffiliateStats.activeReferrals}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="font-medium text-green-600">{mockAffiliateStats.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Commission</span>
                    <span className="font-medium">${(mockAffiliateStats.totalEarnings / mockAffiliateStats.totalReferrals).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Partner Tier</span>
                    <Badge className={getTierColor(mockAffiliateStats.tier)}>
                      {getTierIcon(mockAffiliateStats.tier)}
                      {mockAffiliateStats.tier}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200/50 dark:border-green-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Earnings Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <span className="text-sm font-medium">Total Lifetime Earnings</span>
                    <span className="text-lg font-bold text-green-600">${mockAffiliateStats.totalEarnings}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <span className="text-sm font-medium">This Month</span>
                    <span className="text-lg font-bold text-blue-600">${mockAffiliateStats.monthlyEarnings}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <span className="text-sm font-medium">Pending Payout</span>
                    <span className="text-lg font-bold text-purple-600">$537</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Commissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Commissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockCommissions.map((commission) => (
                  <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                        <Handshake className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{commission.referralName}</h4>
                        <p className="text-xs text-muted-foreground">{commission.plan} Plan</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">${commission.amount}</div>
                      <Badge className={getStatusColor(commission.status)}>
                        {commission.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="program" className="space-y-6">
          {/* Program Overview */}
          <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-400">
                <Gift className="w-6 h-6" />
                Revally Affiliate Program
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-purple-700 dark:text-purple-300 leading-relaxed">
                Join our affiliate program and earn generous commissions by referring businesses to Revally. 
                Help restaurants, hotels, and service businesses improve their online reputation while building 
                a sustainable income stream.
              </p>

              {/* Commission Structure */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-2 border-blue-200/50 dark:border-blue-800/50">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <DollarSign className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="font-semibold mb-2">Starter Plan</h3>
                    <div className="text-2xl font-bold text-blue-600 mb-1">30%</div>
                    <p className="text-xs text-muted-foreground">Commission on $29/month</p>
                    <div className="text-sm font-medium text-green-600 mt-2">≈ $8.70/month per referral</div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-200/50 dark:border-green-800/50">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Crown className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="font-semibold mb-2">Professional Plan</h3>
                    <div className="text-2xl font-bold text-green-600 mb-1">35%</div>
                    <p className="text-xs text-muted-foreground">Commission on $89/month</p>
                    <div className="text-sm font-medium text-green-600 mt-2">≈ $31.15/month per referral</div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200/50 dark:border-purple-800/50">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Rocket className="w-6 h-6 text-purple-500" />
                    </div>
                    <h3 className="font-semibold mb-2">Enterprise Plan</h3>
                    <div className="text-2xl font-bold text-purple-600 mb-1">40%</div>
                    <p className="text-xs text-muted-foreground">Commission on $299/month</p>
                    <div className="text-sm font-medium text-green-600 mt-2">≈ $119.60/month per referral</div>
                  </CardContent>
                </Card>
              </div>

              {/* Partner Tiers */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Partner Tiers & Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border-2 border-amber-200/50 dark:border-amber-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span className="font-medium">Bronze</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• 0-5 active referrals</p>
                      <p>• Standard commission rates</p>
                      <p>• Monthly payouts</p>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Silver</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• 6-15 active referrals</p>
                      <p>• +5% commission bonus</p>
                      <p>• Bi-weekly payouts</p>
                      <p>• Priority support</p>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-yellow-200/50 dark:border-yellow-800/50 rounded-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">Gold</span>
                      <Badge className="bg-yellow-500 text-white text-xs">Current</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• 16-30 active referrals</p>
                      <p>• +10% commission bonus</p>
                      <p>• Weekly payouts</p>
                      <p>• Dedicated account manager</p>
                      <p>• Marketing materials</p>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-purple-200/50 dark:border-purple-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Rocket className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">Platinum</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• 31+ active referrals</p>
                      <p>• +15% commission bonus</p>
                      <p>• Real-time payouts</p>
                      <p>• Co-marketing opportunities</p>
                      <p>• Custom landing pages</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Program Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Why Join Our Affiliate Program?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-500" />
                  </div>
                  <h4 className="font-semibold">High Commissions</h4>
                  <p className="text-sm text-muted-foreground">
                    Earn up to 40% recurring commission on every successful referral. 
                    Higher tiers unlock bonus percentages.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-500" />
                  </div>
                  <h4 className="font-semibold">Recurring Revenue</h4>
                  <p className="text-sm text-muted-foreground">
                    Earn monthly recurring commissions as long as your referrals 
                    remain active subscribers.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
                    <Target className="w-6 h-6 text-purple-500" />
                  </div>
                  <h4 className="font-semibold">Easy to Promote</h4>
                  <p className="text-sm text-muted-foreground">
                    Revally solves a real problem for businesses. High conversion 
                    rates make it easy to earn commissions.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-lg">
                    <Globe className="w-6 h-6 text-orange-500" />
                  </div>
                  <h4 className="font-semibold">Global Market</h4>
                  <p className="text-sm text-muted-foreground">
                    Target businesses worldwide. Every restaurant, hotel, and 
                    service business needs reputation management.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-pink-500" />
                  </div>
                  <h4 className="font-semibold">Marketing Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Get access to marketing materials, landing pages, and 
                    dedicated support to maximize your success.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-indigo-500" />
                  </div>
                  <h4 className="font-semibold">Real-Time Tracking</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor your referrals, commissions, and performance with 
                    detailed analytics and reporting.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          {/* Referral Tools */}
          <Card className="border-2 border-blue-200/50 dark:border-blue-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Your Referral Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Affiliate Link */}
              <div className="space-y-3">
                <h3 className="font-semibold">Your Unique Affiliate Link</h3>
                <div className="flex gap-2">
                  <Input 
                    value={affiliateLink} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button 
                    onClick={() => copyToClipboard(affiliateLink, 'Affiliate link')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this link with potential customers. You'll earn commission on every successful signup.
                </p>
              </div>

              {/* Affiliate Code */}
              <div className="space-y-3">
                <h3 className="font-semibold">Your Affiliate Code</h3>
                <div className="flex gap-2">
                  <Input 
                    value={affiliateCode} 
                    readOnly 
                    className="font-mono text-sm font-bold"
                  />
                  <Button 
                    onClick={() => copyToClipboard(affiliateCode, 'Affiliate code')}
                    variant="outline"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Customers can enter this code during signup to be attributed to you.
                </p>
              </div>

              {/* Marketing Materials */}
              <div className="space-y-4">
                <h3 className="font-semibold">Marketing Materials</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-sm">Email Templates</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Ready-to-use email templates for outreach
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-sm">Landing Pages</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Custom landing pages with your affiliate code
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Pages
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Share2 className="w-4 h-4 text-purple-500" />
                        <span className="font-medium text-sm">Social Media Kit</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Images, videos, and copy for social promotion
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Target Audience & Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Perfect Customers for Revally:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Restaurants & Food Services
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Hotels & Hospitality
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Retail Stores & E-commerce
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Healthcare & Wellness
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Professional Services
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Beauty & Personal Care
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Promotion Tips:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-500" />
                      Focus on businesses with many reviews
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-500" />
                      Highlight time-saving benefits
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-500" />
                      Emphasize AI-powered responses
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-500" />
                      Show ROI through better reviews
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-500" />
                      Offer free trial demonstrations
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-500" />
                      Target multi-location businesses
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          {/* Payment Information */}
          <Card className="border-2 border-green-200/50 dark:border-green-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Payment Schedule</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <span className="text-sm">Bronze Tier</span>
                      <span className="font-medium">Monthly (30th)</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                      <span className="text-sm">Silver Tier</span>
                      <span className="font-medium">Bi-weekly (15th & 30th)</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <span className="text-sm">Gold Tier</span>
                      <span className="font-medium">Weekly (Fridays)</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <span className="text-sm">Platinum Tier</span>
                      <span className="font-medium">Real-time (24-48h)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Payment Methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <span className="font-medium text-sm">Bank Transfer</span>
                        <p className="text-xs text-muted-foreground">Direct deposit to your bank account</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <span className="font-medium text-sm">PayPal</span>
                        <p className="text-xs text-muted-foreground">Fast and secure PayPal payments</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-purple-500" />
                      </div>
                      <div>
                        <span className="font-medium text-sm">Stripe</span>
                        <p className="text-xs text-muted-foreground">Instant payments via Stripe Connect</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-400">
                      Minimum Payout: $50
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Commissions are paid out once your balance reaches $50. No fees on payouts.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commission History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Commission History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockCommissions.map((commission) => (
                  <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg">
                        <DollarSign className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{commission.referralName}</h4>
                        <p className="text-xs text-muted-foreground">
                          {commission.plan} Plan • {new Date(commission.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">${commission.amount}</div>
                      <Badge className={getStatusColor(commission.status)}>
                        {commission.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Payout Method</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <input type="radio" name="payout" defaultChecked className="text-blue-500" />
                      <div>
                        <span className="font-medium text-sm">PayPal</span>
                        <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <input type="radio" name="payout" />
                      <div>
                        <span className="font-medium text-sm">Bank Transfer</span>
                        <p className="text-xs text-muted-foreground">Not configured</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Tax Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                      <span className="text-sm">Tax Form</span>
                      <Badge variant="outline">W-9 Submitted</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                      <span className="text-sm">Tax ID</span>
                      <span className="font-mono text-sm">***-**-1234</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="w-3 h-3 mr-1" />
                      Update Tax Information
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payout History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Payout History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">January 2024 Payout</h4>
                      <p className="text-xs text-muted-foreground">Paid via PayPal • Jan 30, 2024</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">$1,247</div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      Paid
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-lg">
                      <Clock className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">February 2024 Payout</h4>
                      <p className="text-xs text-muted-foreground">Processing • Expected Feb 29, 2024</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-600">$537</div>
                    <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                      Processing
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="border-2 border-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg mx-auto flex items-center justify-center">
              <Handshake className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-purple-800 dark:text-purple-400">
              Ready to Start Earning?
            </h3>
            <p className="text-purple-700 dark:text-purple-300 max-w-md mx-auto">
              Share your affiliate link and start earning recurring commissions from every business you refer to Revally.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => copyToClipboard(affiliateLink, 'Affiliate link')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Affiliate Link
              </Button>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}