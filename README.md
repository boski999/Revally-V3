# Revally - Frontend Demo

A modern, responsive frontend demo for an AI-powered reputation management platform.

## Features

- **Dashboard**: Overview of review metrics and performance
- **Reviews Management**: View and manage customer reviews with AI responses
- **Analytics**: Detailed insights and performance metrics
- **Business Profile**: Manage business information and settings
- **Social Media Manager**: Create and schedule social media content
- **Video Generator**: AI-powered video content creation
- **Multi-language Support**: English and French translations
- **Dark/Light Theme**: Complete theme switching support
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## Tech Stack

- **Next.js 13** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI component library
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Next Themes** - Theme management

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Dashboard page
│   ├── reviews/           # Reviews management
│   ├── analytics/         # Analytics page
│   ├── business/          # Business profile
│   ├── social/            # Social media manager
│   ├── video/             # Video generator
│   ├── help/              # Help and support
│   └── settings/          # Settings page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── dashboard/        # Dashboard-specific components
│   ├── layout/           # Layout components
│   └── skeletons/        # Loading skeletons
├── hooks/                # Custom React hooks
├── contexts/             # React contexts
├── lib/                  # Utilities and mock data
└── types/                # TypeScript type definitions
```

## Demo Data

This frontend demo uses mock data to simulate a real application. All data is stored in `lib/mock-data.ts` and includes:

- Sample reviews from multiple platforms
- Business analytics and metrics
- User settings and preferences
- Social media content and analytics

## Customization

The application is fully customizable:

- **Themes**: Modify colors in `app/globals.css`
- **Components**: All components use Tailwind CSS classes
- **Data**: Replace mock data with real API calls
- **Languages**: Add translations in `contexts/language-context.tsx`

## Mobile Responsiveness

The application is fully responsive with:
- Mobile-first design approach
- Touch-friendly interface elements
- Responsive navigation and layouts
- Optimized for all screen sizes

## License

This is a demo project for frontend development purposes.