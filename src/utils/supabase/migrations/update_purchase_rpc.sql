-- Migration to update purchase_decision to use dynamic pricing
-- 1. Add price_in_credits column to urun_bilgileri (if not exists) uses a soft check
-- but since I cannot run DDL conditionally easily without plpgsql, I will assume it might need to vary.
-- Actually, the best way is to update the RPC to look for a column. If I can't guarantee the column exists, I should stick to default.
-- However, I can create the column if it doesn't exist.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'urun_bilgileri' AND column_name = 'price_in_credits') THEN
        ALTER TABLE public.urun_bilgileri ADD COLUMN price_in_credits integer DEFAULT 10;
    END IF;
END $$;

-- 2. Update the RPC function
create or replace function public.purchase_decision(decision_id uuid)
returns json
language plpgsql
security definer
as $$
declare
  current_balance integer;
  decision_cost integer; -- Dynamic cost
  new_balance integer;
  purchased_exists boolean;
  product_price integer;
begin
  -- 1. Check if already purchased
  select exists (
    select 1 from public.user_purchases
    where user_id = auth.uid() and product_id = decision_id
  ) into purchased_exists;

  if purchased_exists then
    return json_build_object('success', false, 'error', 'Bu karar zaten satın alınmış.');
  end if;

  -- 2. Determine Cost
  select price_in_credits into product_price from public.urun_bilgileri where id = decision_id;

  -- Default to 10 if null, or use the value from DB
  decision_cost := coalesce(product_price, 10);

  -- 3. Get current balance (row lock)
  select balance into current_balance
  from public.user_credits
  where user_id = auth.uid()
  for update;

  if current_balance < decision_cost then
    return json_build_object('success', false, 'error', 'Yetersiz bakiye.');
  end if;

  -- 4. Deduct credits
  new_balance := current_balance - decision_cost;

  update public.user_credits
  set balance = new_balance, updated_at = now()
  where user_id = auth.uid();

  -- 5. Record Transaction
  insert into public.credit_transactions (user_id, transaction_type, amount, balance_after, description)
  values (auth.uid(), 'purchase', -decision_cost, new_balance, 'Karar görüntüleme: ' || decision_id);

  -- 6. Record Purchase
  insert into public.user_purchases (user_id, product_id, amount_spent)
  values (auth.uid(), decision_id, decision_cost);

  return json_build_object('success', true, 'remaining_credits', new_balance);
end;
$$;
