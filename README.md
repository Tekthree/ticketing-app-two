# 🎫 Ticketing Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0--rc-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-green)](https://supabase.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-blueviolet)](https://stripe.com/)

A modern, full-featured event ticketing platform built with Next.js 15, Supabase, and Stripe.

## ✨ Features

- 🔐 Secure Authentication & Authorization
  - Email/Password authentication
  - Role-based access control
  - Protected routes
  - Secure session management

- 📅 Event Management
  - Create and manage events
  - Multiple ticket types
  - Capacity management
  - Event analytics

- 🎟️ Ticket System
  - Secure ticket purchasing
  - QR code generation
  - Ticket verification
  - Order management

- 💳 Payment Processing
  - Stripe integration
  - Secure checkout
  - Refund handling
  - Payment webhooks

- 📊 Analytics Dashboard
  - Sales tracking
  - Revenue metrics
  - Attendance tracking
  - Performance insights

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Auth & Database:** [Supabase](https://supabase.com/)
- **Styling:** 
  - [TailwindCSS](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/)
- **Forms:** 
  - [React Hook Form](https://react-hook-form.com/)
  - [Zod Validation](https://zod.dev/)
- **Payments:** [Stripe](https://stripe.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide Icons](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm
- Supabase account
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ticketing-platform.git
cd ticketing-platform
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Update `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up the database:
```bash
pnpm supabase db push
```

5. Start the development server:
```bash
pnpm dev
```

Visit `http://localhost:3000` to see your application.

## 📦 Project Structure

```
src/
├── app/                   # Next.js App Router pages
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── events/           # Event-related components
│   ├── shared/           # Shared/common components
│   └── ui/               # UI components (shadcn/ui)
├── config/               # Configuration files
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and libraries
│   ├── supabase/        # Supabase client and utils
│   └── stripe/          # Stripe configuration
└── types/                # TypeScript type definitions
```

## 🔒 Security Features

- Secure session management with Supabase Auth
- CSRF protection
- HTTP-only cookies
- Row Level Security (RLS) policies
- Input validation and sanitization
- Secure payment processing with Stripe

## 🧪 Development Tools

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking
- Tailwind CSS for styling
- shadcn/ui for UI components

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Supabase](https://supabase.com/) for backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Stripe](https://stripe.com/) for payment processing
- [Tailwind CSS](https://tailwindcss.com/) for styling