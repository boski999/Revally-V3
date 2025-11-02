export interface Business {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  website: string;
  platforms: ReviewPlatform[];
}

export interface ReviewPlatform {
  name: 'Google' | 'Yelp' | 'Facebook' | 'TripAdvisor';
  connected: boolean;
  averageRating: number;
  totalReviews: number;
}

export interface Review {
  id: string;
  businessId: string;
  platform: 'Google' | 'Yelp' | 'Facebook' | 'TripAdvisor';
  reviewer: {
    name: string;
    avatar?: string;
  };
  rating: number;
  title?: string;
  content: string;
  date: string;
  aiResponse: {
    content: string;
    confidence: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  };
  status: 'pending' | 'approved' | 'published' | 'rejected';
  isUrgent: boolean;
  tags: string[];
}

export interface Analytics {
  totalReviews: number;
  averageRating: number;
  pendingResponses: number;
  autoApprovalRate: number;
  responseTime: number;
  platformBreakdown: Array<{
    platform: string;
    count: number;
    rating: number;
  }>;
  ratingDistribution: Array<{
    rating: number;
    count: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    reviews: number;
    rating: number;
  }>;
}

export interface Settings {
  business: Business;
  aiSettings: {
    responseStyle: 'professional' | 'friendly' | 'casual';
    autoApproval: boolean;
    urgentThreshold: number;
    customPrompts: string[];
    responseTemplates: string[];
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface Store {
  id: string;
  name: string;
  type: string;
  address: string;
  isActive: boolean;
  totalReviews: number;
  averageRating: number;
  lastActivity: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';

export interface Reservation {
  id: string;
  store_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  special_requests?: string;
  status: ReservationStatus;
  table_number?: string;
  created_at: string;
  updated_at: string;
  is_recurring: boolean;
  recurring_pattern?: string;
}

export interface TimeSlot {
  id: string;
  store_id: string;
  day_of_week: number;
  time: string;
  capacity: number;
  is_active: boolean;
  created_at: string;
}

export interface BookingSettings {
  id: string;
  store_id: string;
  advance_booking_days: number;
  max_party_size: number;
  min_party_size: number;
  default_duration_minutes: number;
  allow_same_day_booking: boolean;
  require_phone: boolean;
  require_email: boolean;
  auto_confirm: boolean;
  cancellation_deadline_hours: number;
  created_at: string;
  updated_at: string;
}

export interface ReservationStats {
  total: number;
  today: number;
  upcoming: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  averagePartySize: number;
  occupancyRate: number;
}