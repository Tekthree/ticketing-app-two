-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table public.profiles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    full_name text,
    role text check (role in ('admin', 'organizer', 'user')) default 'user',
    created_at timestamp with time zone default timezone('utc'::text, now()),
    constraint unique_user_id unique (user_id)
);

-- Events table
create table public.events (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    venue text not null,
    date timestamp with time zone not null,
    organizer_id uuid references auth.users not null,
    status text check (status in ('draft', 'published', 'cancelled')) default 'draft',
    capacity integer check (capacity > 0),
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Ticket Types table
create table public.ticket_types (
    id uuid primary key default uuid_generate_v4(),
    event_id uuid references public.events on delete cascade not null,
    name text not null,
    price numeric(10,2) not null check (price >= 0),
    quantity integer not null check (quantity >= 0),
    quantity_sold integer default 0 check (quantity_sold >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()),
    constraint valid_quantity check (quantity_sold <= quantity)
);

-- Orders table
create table public.orders (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    ticket_type_id uuid references public.ticket_types not null,
    quantity integer not null check (quantity > 0),
    total_amount numeric(10,2) not null check (total_amount >= 0),
    payment_status text check (payment_status in ('pending', 'completed', 'failed')) default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.ticket_types enable row level security;
alter table public.orders enable row level security;

-- RLS Policies

-- Profiles policies
create policy "Public profiles are viewable by everyone."
    on profiles for select
    using (true);

create policy "Users can insert their own profile."
    on profiles for insert
    with check (auth.uid() = user_id);

create policy "Users can update own profile."
    on profiles for update using (
        auth.uid() = user_id
    );

-- Events policies
create policy "Published events are viewable by everyone."
    on events for select
    using (status = 'published' or auth.uid() = organizer_id);

create policy "Organizers can create events."
    on events for insert
    with check (
        auth.uid() = organizer_id and 
        exists (
            select 1 from profiles
            where user_id = auth.uid()
            and role in ('admin', 'organizer')
        )
    );

create policy "Organizers can update own events."
    on events for update
    using (auth.uid() = organizer_id);

create policy "Organizers can delete own events."
    on events for delete
    using (auth.uid() = organizer_id);

-- Ticket Types policies
create policy "Ticket types are viewable by everyone."
    on ticket_types for select
    using (
        exists (
            select 1 from events
            where events.id = ticket_types.event_id
            and status = 'published'
        )
        or 
        exists (
            select 1 from events
            where events.id = ticket_types.event_id
            and organizer_id = auth.uid()
        )
    );

create policy "Organizers can manage ticket types."
    on ticket_types for insert
    with check (
        exists (
            select 1 from events
            where events.id = ticket_types.event_id
            and organizer_id = auth.uid()
        )
    );

create policy "Organizers can update ticket types."
    on ticket_types for update
    using (
        exists (
            select 1 from events
            where events.id = ticket_types.event_id
            and organizer_id = auth.uid()
        )
    );

-- Orders policies
create policy "Users can view own orders."
    on orders for select
    using (auth.uid() = user_id);

create policy "Organizers can view event orders."
    on orders for select
    using (
        exists (
            select 1 from ticket_types
            join events on events.id = ticket_types.event_id
            where ticket_types.id = orders.ticket_type_id
            and events.organizer_id = auth.uid()
        )
    );

create policy "Users can create orders."
    on orders for insert
    with check (auth.uid() = user_id);

-- Create indexes for better performance
create index idx_profiles_user_id on profiles(user_id);
create index idx_events_organizer_id on events(organizer_id);
create index idx_events_status on events(status);
create index idx_ticket_types_event_id on ticket_types(event_id);
create index idx_orders_user_id on orders(user_id);
create index idx_orders_ticket_type_id on orders(ticket_type_id);