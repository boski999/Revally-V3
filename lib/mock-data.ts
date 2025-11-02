import { Review, Analytics, Business, Settings, Store } from '@/types';

export const mockStores: Store[] = [
  {
    id: '1',
    name: 'Bella Vista Restaurant',
    type: 'Restaurant',
    address: '123 Rue de la Paix, 75001 Paris',
    isActive: true,
    totalReviews: 247,
    averageRating: 4.6,
    lastActivity: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Bella Vista Montmartre',
    type: 'Restaurant',
    address: '456 Rue des Martyrs, 75018 Paris',
    isActive: false,
    totalReviews: 189,
    averageRating: 4.4,
    lastActivity: '2024-01-14T15:20:00Z',
  },
  {
    id: '3',
    name: 'Bella Vista Traiteur',
    type: 'Traiteur',
    address: '789 Avenue des Champs-Élysées, 75008 Paris',
    isActive: false,
    totalReviews: 156,
    averageRating: 4.2,
    lastActivity: '2024-01-13T09:45:00Z',
  },
];

export const mockBusiness: Business = {
  id: '1',
  name: 'Bella Vista Restaurant',
  type: 'Restaurant',
  address: '123 Rue de la Paix, 75001 Paris',
  phone: '+33 1 42 60 12 34',
  website: 'https://bellavista-paris.fr',
  platforms: [
    { name: 'Google', connected: true, averageRating: 4.6, totalReviews: 247 },
    { name: 'Yelp', connected: true, averageRating: 4.4, totalReviews: 128 },
    { name: 'Facebook', connected: true, averageRating: 4.7, totalReviews: 89 },
    { name: 'TripAdvisor', connected: false, averageRating: 0, totalReviews: 0 },
  ],
};

export const mockReviews: Review[] = [
  {
    id: '1',
    businessId: '1',
    platform: 'Google',
    reviewer: { name: 'Sophie Martin' },
    rating: 5,
    title: 'Excellente soirée !',
    content: 'Excellente soirée au Bella Vista ! Le service était impeccable et les plats délicieux.',
    date: '2024-01-15T10:30:00Z',
    aiResponse: {
      content: 'Merci beaucoup Sophie pour ce merveilleux retour ! Nous sommes ravis que vous ayez passé une excellente soirée chez nous.',
      confidence: 0.95,
      sentiment: 'positive',
    },
    status: 'pending',
    isUrgent: false,
    tags: ['qualité cuisine', 'service', 'ambiance'],
  },
  {
    id: '2',
    businessId: '1',
    platform: 'Yelp',
    reviewer: { name: 'Thomas Bernard' },
    rating: 2,
    content: 'Déçu de ma visite hier soir. La nourriture était froide et le service très lent.',
    date: '2024-01-14T19:45:00Z',
    aiResponse: {
      content: 'Bonjour Thomas, nous sommes sincèrement désolés pour cette expérience décevante.',
      confidence: 0.88,
      sentiment: 'negative',
    },
    status: 'pending',
    isUrgent: true,
    tags: ['température', 'service lent', 'urgent'],
  },
  {
    id: '3',
    businessId: '1',
    platform: 'Facebook',
    reviewer: { name: 'Julie Leroy' },
    rating: 4,
    content: 'Très bon restaurant italien ! Les pizzas sont authentiques et la pâte est parfaite.',
    date: '2024-01-13T20:15:00Z',
    aiResponse: {
      content: 'Bonjour Julie, merci pour votre avis ! Nous sommes ravis que nos pizzas vous aient conquis.',
      confidence: 0.92,
      sentiment: 'positive',
    },
    status: 'published',
    isUrgent: false,
    tags: ['pizza', 'authenticité', 'qualité'],
  },
];

export const mockAnalytics: Analytics = {
  totalReviews: 247,
  averageRating: 4.6,
  pendingResponses: 12,
  autoApprovalRate: 78,
  responseTime: 2.4,
  platformBreakdown: [
    { platform: 'Google', count: 128, rating: 4.6 },
    { platform: 'Yelp', count: 67, rating: 4.4 },
    { platform: 'Facebook', count: 52, rating: 4.7 },
  ],
  ratingDistribution: [
    { rating: 5, count: 145 },
    { rating: 4, count: 67 },
    { rating: 3, count: 23 },
    { rating: 2, count: 8 },
    { rating: 1, count: 4 },
  ],
  monthlyTrend: [
    { month: 'Jul', reviews: 32, rating: 4.5 },
    { month: 'Aug', reviews: 28, rating: 4.4 },
    { month: 'Sep', reviews: 35, rating: 4.6 },
    { month: 'Oct', reviews: 41, rating: 4.7 },
    { month: 'Nov', reviews: 38, rating: 4.5 },
    { month: 'Dec', reviews: 42, rating: 4.8 },
    { month: 'Jan', reviews: 31, rating: 4.6 },
  ],
};

export const mockSettings: Settings = {
  business: mockBusiness,
  aiSettings: {
    responseStyle: 'professional',
    autoApproval: false,
    urgentThreshold: 3,
    customPrompts: [
      'Always mention our commitment to quality',
      'Invite customers to contact us directly for concerns',
    ],
    responseTemplates: [
      'Thank you for your feedback! We appreciate you taking the time to share your experience.',
      'We\'re sorry to hear about your experience. We\'d love to make this right - please contact us directly.',
      'Thank you for the wonderful review! We\'re thrilled you enjoyed your visit.',
    ],
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
};