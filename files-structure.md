# Project File Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication Routes
│   │   ├── login/          # Login Page
│   │   ├── register/       # Registration Page
│   │   └── layout.tsx      # Auth Layout
│   ├── (dashboard)/        # Protected Dashboard Routes
│   │   ├── dashboard/      # Main Dashboard
│   │   ├── events/         # Event Management
│   │   ├── tickets/        # Ticket Management
│   │   ├── analytics/      # Analytics Dashboard
│   │   └── layout.tsx      # Dashboard Layout
│   ├── api/                # API Routes
│   │   ├── auth/          # Auth API Endpoints
│   │   ├── tickets/       # Ticket API Endpoints
│   │   └── webhooks/      # Webhook Handlers
│   ├── layout.tsx          # Root Layout
│   └── page.tsx            # Home Page
├── components/             # React Components
│   ├── auth/              # Authentication Components
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── ui/               # UI Components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── dashboard/        # Dashboard Components
│   │   ├── analytics-card.tsx
│   │   └── stats-card.tsx
│   ├── events/          # Event Components
│   │   ├── event-form.tsx
│   │   └── event-list.tsx
│   ├── tickets/         # Ticket Components
│   │   ├── ticket-form.tsx
│   │   └── qr-code.tsx
│   └── shared/          # Shared Components
│       ├── header.tsx
│       └── sidebar.tsx
├── hooks/               # Custom React Hooks
│   ├── use-auth.ts
│   ├── use-events.ts
│   └── use-analytics.ts
├── lib/                # Library Code
│   ├── supabase/      # Supabase Configuration
│   │   ├── client.ts
│   │   ├── admin.ts
│   │   └── types.ts
│   ├── stripe/        # Stripe Configuration
│   │   └── client.ts
│   └── utils/         # Utility Functions
│       └── helpers.ts
└── types/             # TypeScript Types
    └── index.ts

Key Files:

1. Authentication:
- src/app/(auth)/layout.tsx      # Auth layout wrapper
- src/app/(auth)/login/page.tsx  # Login page
- src/components/auth/*          # Auth components

2. Dashboard:
- src/app/(dashboard)/layout.tsx # Dashboard layout
- src/components/shared/*        # Shared dashboard components
- src/components/dashboard/*     # Dashboard specific components

3. Events:
- src/app/(dashboard)/events/*   # Event pages
- src/components/events/*        # Event components
- src/hooks/use-events.ts        # Event management hook

4. Tickets:
- src/app/(dashboard)/tickets/*  # Ticket pages
- src/components/tickets/*       # Ticket components
- src/hooks/use-tickets.ts       # Ticket management hook

5. API:
- src/app/api/*                  # API routes
- src/lib/supabase/*            # Supabase configuration
- src/lib/stripe/*              # Stripe integration

6. UI Components:
- src/components/ui/*           # Reusable UI components

7. Configuration:
- .env.local                    # Environment variables
- tailwind.config.ts           # Tailwind configuration
- next.config.js               # Next.js configuration
```

### Component Categories

1. **Auth Components**

   - Login Form
   - Registration Form
   - Password Reset
   - Profile Management

2. **Event Components**

   - Event Creation Form
   - Event List/Grid
   - Event Details
   - Ticket Type Management

3. **Ticket Components**

   - Ticket Purchase Form
   - Ticket List
   - QR Code Generator
   - Ticket Verification

4. **Dashboard Components**

   - Analytics Cards
   - Statistics Displays
   - Charts and Graphs
   - Data Tables

5. **UI Components**

   - Buttons
   - Forms
   - Cards
   - Modals
   - Tables
   - Navigation

6. **Shared Components**
   - Header
   - Sidebar
   - Footer
   - Loading States
   - Error Boundaries
