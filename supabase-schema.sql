-- LokalProfil – kjør dette i Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- Businesses
create table if not exists businesses (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text,
  phone text,
  google_review_link text,
  onboarding_done boolean default false,
  created_at timestamptz default now()
);

-- Customers
create table if not exists customers (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  phone text not null,
  appointment_time timestamptz not null,
  reminded_24h boolean default false,
  reminded_2h boolean default false,
  review_requested boolean default false,
  no_show boolean default false,
  cancel_token text unique default encode(gen_random_bytes(16), 'hex'),
  cancelled boolean default false,
  cancelled_at timestamptz,
  created_at timestamptz default now()
);

-- Feedback
create table if not exists feedback (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customers(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  rating int check (rating >= 1 and rating <= 5),
  message text,
  created_at timestamptz default now()
);

-- Messages (SMS inbox/outbox)
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade,
  customer_id uuid references customers(id) on delete cascade,
  direction text check (direction in ('in','out')) not null,
  body text not null,
  created_at timestamptz default now()
);

-- RLS
alter table businesses enable row level security;
alter table customers enable row level security;
alter table feedback enable row level security;
alter table messages enable row level security;

drop policy if exists "businesses_own" on businesses;
drop policy if exists "customers_own" on customers;
drop policy if exists "feedback_own" on feedback;
drop policy if exists "messages_own" on messages;

create policy "businesses_own" on businesses for all using (id = auth.uid());
create policy "customers_own" on customers for all using (business_id = auth.uid());
create policy "feedback_own" on feedback for all using (business_id = auth.uid());
create policy "messages_own" on messages for all using (business_id = auth.uid());

-- Public cancel policy (no auth needed for cancellation page)
create policy "customers_cancel_public" on customers for update
  using (true) with check (true);

-- Realtime
alter publication supabase_realtime add table messages;

-- Indexes
create index if not exists customers_business_id_idx on customers(business_id);
create index if not exists customers_appointment_time_idx on customers(appointment_time);
create index if not exists customers_cancel_token_idx on customers(cancel_token);
create index if not exists feedback_business_id_idx on feedback(business_id);
create index if not exists messages_customer_id_idx on messages(customer_id);

-- SMS Templates (run this if you already have the schema)
alter table businesses
  add column if not exists sms_reminder_24h text,
  add column if not exists sms_reminder_2h text,
  add column if not exists sms_after_appointment text;

-- SMS usage tracking
alter table businesses
  add column if not exists sms_count_month int default 0,
  add column if not exists sms_period_start date default current_date;

-- Support chat logs
create table if not exists support_chats (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete set null,
  user_email text,
  question text not null,
  answer text not null,
  confident boolean default true,
  created_at timestamptz default now()
);
alter table support_chats enable row level security;
create policy "support_admin_only" on support_chats for all using (true);
create index if not exists support_chats_business_id_idx on support_chats(business_id);
