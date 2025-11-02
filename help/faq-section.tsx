'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  HelpCircle,
  Lightbulb,
  Zap,
  Shield,
  CreditCard,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  icon: React.ReactNode;
}

const faqItems: FAQItem[] = [
  {
    id: 'what-is-revally',
    question: 'What is Revally and how does it work?',
    answer: 'Revally is an AI-powered reputation management platform that automatically monitors your reviews across multiple platforms (Google, Yelp, Facebook, TripAdvisor) and generates personalized responses. Our AI analyzes each review\'s sentiment and context to create appropriate responses that match your brand voice.',
    category: 'General',
    tags: ['basics', 'ai', 'platforms'],
    icon: <Lightbulb className="w-4 h-4" />
  },
  {
    id: 'ai-accuracy',
    question: 'How accurate are the AI-generated responses?',
    answer: 'Our AI achieves an average accuracy rate of 94% based on user approval rates. The system learns from your feedback and improves over time. You can always review, edit, or reject any AI-generated response before it\'s published.',
    category: 'AI Features',
    tags: ['ai', 'accuracy', 'approval'],
    icon: <Zap className="w-4 h-4" />
  },
  {
    id: 'platform-support',
    question: 'Which review platforms do you support?',
    answer: 'We currently support Google My Business, Yelp, Facebook, and TripAdvisor. We\'re continuously adding support for more platforms based on user demand. Each platform integration allows real-time monitoring and response publishing.',
    category: 'Platforms',
    tags: ['platforms', 'integration', 'support'],
    icon: <Settings className="w-4 h-4" />
  },
  {
    id: 'data-security',
    question: 'How secure is my business data?',
    answer: 'We take data security very seriously. All data is encrypted in transit and at rest using industry-standard encryption. We\'re SOC 2 compliant and never share your data with third parties. Your review responses are only visible to your team.',
    category: 'Security',
    tags: ['security', 'privacy', 'encryption'],
    icon: <Shield className="w-4 h-4" />
  },
  {
    id: 'pricing-plans',
    question: 'What are your pricing plans?',
    answer: 'We offer flexible pricing plans starting from $29/month for small businesses. Plans include different limits on review volume, AI responses, and advanced features. Enterprise plans are available for larger organizations with custom requirements.',
    category: 'Pricing',
    tags: ['pricing', 'plans', 'billing'],
    icon: <CreditCard className="w-4 h-4" />
  },
  {
    id: 'response-time',
    question: 'How quickly does the AI generate responses?',
    answer: 'AI responses are typically generated within 30 seconds of a new review being detected. The system monitors your connected platforms every 15 minutes for new reviews. Urgent reviews (low ratings) are prioritized for faster processing.',
    category: 'AI Features',
    tags: ['speed', 'monitoring', 'urgent'],
    icon: <Zap className="w-4 h-4" />
  },
  {
    id: 'multi-location',
    question: 'Can I manage multiple business locations?',
    answer: 'Yes! Our platform supports multi-location management. You can switch between different locations, each with their own review streams, analytics, and AI settings. This is perfect for franchises or businesses with multiple branches.',
    category: 'Features',
    tags: ['multi-location', 'management', 'branches'],
    icon: <Settings className="w-4 h-4" />
  },
  {
    id: 'customization',
    question: 'Can I customize the AI response style?',
    answer: 'Absolutely! You can set your preferred response style (professional, friendly, or casual), add custom prompts, and train the AI with your brand voice. The system learns from your edits and approvals to better match your communication style.',
    category: 'Customization',
    tags: ['customization', 'brand-voice', 'prompts'],
    icon: <Settings className="w-4 h-4" />
  }
];

const categories = ['All', 'General', 'AI Features', 'Platforms', 'Security', 'Pricing', 'Features', 'Customization'];

export function FAQSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'General': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'AI Features': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Platforms': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'Security': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'Pricing': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Features': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'Customization': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-green-200/50 dark:border-green-800/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg">
              <HelpCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Find quick answers to common questions about Revally
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedCategory === category && "bg-blue-500 text-white"
                  )}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No FAQs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or category filter.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredFAQs.map((item) => {
            const isExpanded = expandedItems.includes(item.id);
            return (
              <Card key={item.id} className="border-2 border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all">
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => toggleExpanded(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-gradient-to-br from-gray-500/10 to-gray-600/10 rounded-lg">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{item.question}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="pl-11">
                      <p className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}