-- =====================================================================
-- ZUNO — Cart RLS Policies for Customer App
-- Migration 00000000000004
-- =====================================================================

-- Carts Policies
drop policy if exists "carts_select_own" on carts;
create policy "carts_select_own" on carts
  for select using (auth.uid() = customer_id);

drop policy if exists "carts_insert_own" on carts;
create policy "carts_insert_own" on carts
  for insert with check (auth.uid() = customer_id);

drop policy if exists "carts_update_own" on carts;
create policy "carts_update_own" on carts
  for update using (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);

drop policy if exists "carts_delete_own" on carts;
create policy "carts_delete_own" on carts
  for delete using (auth.uid() = customer_id);

-- Cart Items Policies
drop policy if exists "cart_items_select_own" on cart_items;
create policy "cart_items_select_own" on cart_items
  for select using (
    exists (
      select 1 from carts
      where carts.id = cart_items.cart_id
      and carts.customer_id = auth.uid()
    )
  );

drop policy if exists "cart_items_insert_own" on cart_items;
create policy "cart_items_insert_own" on cart_items
  for insert with check (
    exists (
      select 1 from carts
      where carts.id = cart_items.cart_id
      and carts.customer_id = auth.uid()
    )
  );

drop policy if exists "cart_items_update_own" on cart_items;
create policy "cart_items_update_own" on cart_items
  for update using (
    exists (
      select 1 from carts
      where carts.id = cart_items.cart_id
      and carts.customer_id = auth.uid()
    )
  );

drop policy if exists "cart_items_delete_own" on cart_items;
create policy "cart_items_delete_own" on cart_items
  for delete using (
    exists (
      select 1 from carts
      where carts.id = cart_items.cart_id
      and carts.customer_id = auth.uid()
    )
  );
