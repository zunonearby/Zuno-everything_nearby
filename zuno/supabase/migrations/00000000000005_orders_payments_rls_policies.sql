-- =====================================================================
-- ZUNO — Orders & Payments RLS Policies for Customer App
-- Migration 00000000000005
-- =====================================================================

-- Orders Policies
drop policy if exists "orders_select_own" on orders;
create policy "orders_select_own" on orders
  for select using (auth.uid() = customer_id);

drop policy if exists "orders_insert_own" on orders;
create policy "orders_insert_own" on orders
  for insert with check (auth.uid() = customer_id);

-- Order Items Policies
drop policy if exists "order_items_select_own" on order_items;
create policy "order_items_select_own" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.customer_id = auth.uid()
    )
  );

drop policy if exists "order_items_insert_own" on order_items;
create policy "order_items_insert_own" on order_items
  for insert with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.customer_id = auth.uid()
    )
  );

-- Payments Policies
drop policy if exists "payments_select_own" on payments;
create policy "payments_select_own" on payments
  for select using (
    exists (
      select 1 from orders
      where orders.id = payments.order_id
      and orders.customer_id = auth.uid()
    )
  );

drop policy if exists "payments_insert_own" on payments;
create policy "payments_insert_own" on payments
  for insert with check (
    exists (
      select 1 from orders
      where orders.id = payments.order_id
      and orders.customer_id = auth.uid()
    )
  );

-- Deliveries Policies
drop policy if exists "deliveries_select_own" on deliveries;
create policy "deliveries_select_own" on deliveries
  for select using (
    exists (
      select 1 from orders
      where orders.id = deliveries.order_id
      and orders.customer_id = auth.uid()
    )
  );

-- Order Status History Policies
drop policy if exists "order_status_history_select_own" on order_status_history;
create policy "order_status_history_select_own" on order_status_history
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_status_history.order_id
      and orders.customer_id = auth.uid()
    )
  );
