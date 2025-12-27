-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text,
  first_name text,
  last_name text,
  role text default 'user', -- 'user' or 'admin'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );


-- 2. USER CREDITS TABLE
create table public.user_credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  balance integer default 0 not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_credits enable row level security;

create policy "Users can view own credits"
  on public.user_credits for select
  using ( auth.uid() = user_id );

-- Only server-side/admin functions should modify credits, so no update policy for public users directly if possible,
-- but for simplicity in client-side (if needed) or mostly via RPC.
-- Secure approach: No update policy for users. Updates only via RPC.


-- 3. CREDIT TRANSACTIONS TABLE
create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  transaction_type text not null, -- 'purchase', 'gift', 'signup_bonus'
  amount integer not null, -- positive or negative
  balance_after integer not null,
  description text,
  created_at timestamptz default now()
);

alter table public.credit_transactions enable row level security;

create policy "Users can view own transactions"
  on public.credit_transactions for select
  using ( auth.uid() = user_id );


-- 4. USER PURCHASES TABLE
create table public.user_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid not null, -- References urun_bilgileri(id). Assuming UUID.
  amount_spent integer not null,
  created_at timestamptz default now()
);

alter table public.user_purchases enable row level security;

create policy "Users can view own purchases"
  on public.user_purchases for select
  using ( auth.uid() = user_id );


-- 5. CREDIT GIFTS TABLE (For Admin Logs)
create table public.credit_gifts (
  id uuid primary key default gen_random_uuid(),
  to_user_id uuid references auth.users(id) on delete cascade not null,
  credits_amount integer not null,
  reason text,
  message text,
  gift_type text, -- 'manual'
  created_at timestamptz default now()
);

alter table public.credit_gifts enable row level security;

create policy "Admins can view all gifts"
  on public.credit_gifts for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );


-- 6. TRIGGERS

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Create Profile
  insert into public.profiles (id, email, first_name, last_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', 'user');

  -- Initialize Credits (Give 100 free credits on signup)
  insert into public.user_credits (user_id, balance)
  values (new.id, 100);

  -- Log Transaction
  insert into public.credit_transactions (user_id, transaction_type, amount, balance_after, description)
  values (new.id, 'signup_bonus', 100, 100, 'Hoşgeldin hediyesi');

  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 7. RPC FUNCTIONS (Business Logic)

-- Purchase Decision Function
create or replace function public.purchase_decision(decision_id uuid)
returns json
language plpgsql
security definer
as $$
declare
  current_balance integer;
  decision_cost integer := 10; -- Fixed cost for now, could be dynamic
  new_balance integer;
  purchased_exists boolean;
begin
  -- 1. Check if already purchased
  select exists (
    select 1 from public.user_purchases
    where user_id = auth.uid() and product_id = decision_id
  ) into purchased_exists;

  if purchased_exists then
    return json_build_object('success', false, 'error', 'Bu karar zaten satın alınmış.');
  end if;

  -- 2. Get current balance (row lock)
  select balance into current_balance
  from public.user_credits
  where user_id = auth.uid()
  for update;

  if current_balance < decision_cost then
    return json_build_object('success', false, 'error', 'Yetersiz bakiye.');
  end if;

  -- 3. Deduct credits
  new_balance := current_balance - decision_cost;

  update public.user_credits
  set balance = new_balance, updated_at = now()
  where user_id = auth.uid();

  -- 4. Record Transaction
  insert into public.credit_transactions (user_id, transaction_type, amount, balance_after, description)
  values (auth.uid(), 'purchase', -decision_cost, new_balance, 'Karar görüntüleme: ' || decision_id);

  -- 5. Record Purchase
  insert into public.user_purchases (user_id, product_id, amount_spent)
  values (auth.uid(), decision_id, decision_cost);

  return json_build_object('success', true, 'remaining_credits', new_balance);
end;
$$;


-- Admin Gift Function
create or replace function public.gift_credits_to_user(
  p_to_user_id uuid,
  p_credits_amount integer,
  p_reason text,
  p_message text,
  p_gift_type text,
  p_send_notification boolean,
  p_send_email boolean
)
returns void
language plpgsql
security definer
as $$
declare
  current_balance integer;
  new_balance integer;
  caller_role text;
begin
  -- Check admin permission
  select role into caller_role from public.profiles where id = auth.uid();
  if caller_role != 'admin' then
    raise exception 'Unauthorized';
  end if;

  -- Update Balance
  update public.user_credits
  set balance = balance + p_credits_amount, updated_at = now()
  where user_id = p_to_user_id
  returning balance into new_balance;

  -- Log Transaction
  insert into public.credit_transactions (user_id, transaction_type, amount, balance_after, description)
  values (p_to_user_id, 'gift', p_credits_amount, new_balance, p_reason);

  -- Log Gift Record
  insert into public.credit_gifts (to_user_id, credits_amount, reason, message, gift_type)
  values (p_to_user_id, p_credits_amount, p_reason, p_message, p_gift_type);

end;
$$;
