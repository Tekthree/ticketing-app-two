# Ticketing Platform

A modern event ticketing platform built with Next.js, Supabase, and Stripe.

## Features

- 🎫 Event Management
- 🎟️ Ticket Sales
- 💳 Secure Payments
- 📊 Analytics Dashboard
- 🔐 Authentication & Authorization
- 📱 Responsive Design

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Styling**: TailwindCSS, shadcn/ui
- **State Management**: React Hooks
- **Forms**: React Hook Form, Zod

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Supabase Account
- Stripe Account (for payments)

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
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

Update .env.local with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:

```bash
pnpm dev
```

5. Visit http://localhost:3000

### Database Setup

The application uses Supabase as its database. The schema includes:

- Users & Profiles
- Events
- Ticket Types
- Orders

Tables are automatically created through Supabase migrations.

## Usage

### Authentication

- Sign up at `/register`
- Log in at `/login`
- User roles: admin, organizer, user

### Event Management

- Create events at `/events/new`
- Manage events at `/events`
- View event details at `/events/[id]`

### Ticket System

- Create ticket types for events
- Purchase tickets
- View tickets at `/tickets`
- Verify tickets at `/tickets/verify`

## Project Structure

See [FILES.md](./FILES.md) for detailed file structure.

## Development Roadmap

See [ROADMAP.md](./ROADMAP.md) for development plans.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
