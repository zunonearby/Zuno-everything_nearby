-- =====================================================================
-- ZUNO — Cross-App Unified Order Lifecycle RLS & Realtime Policies
-- Migration 00000000000006
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Shopkeeper RLS Policies (apps/shop)
-- ---------------------------------------------------------------------

-- Shopkeepers can select orders for their shops
drop policy if exists "orders_select_shopkeeper" on orders;
create policy "orders_select_shopkeeper" on orders
  for select using (
    exists (
      select 1 from shops
      where shops.id = orders.shop_id
      and (
        shops.owner_id = auth.uid()
        or exists (
          select 1 from shop_members
          where shop_members.shop_id = shops.id
          and shop_members.user_id = auth.uid()
        )
      )
    )
  );

-- Shopkeepers can update status of orders belonging to their shops
drop policy if exists "orders_update_shopkeeper" on orders;
create policy "orders_update_shopkeeper" on orders
  for update using (
    exists (
      select 1 from shops
      where shops.id = orders.shop_id
      and (
        shops.owner_id = auth.uid()
        or exists (
          select 1 from shop_members
          where shop_members.shop_id = shops.id
          and shop_members.user_id = auth.uid()
        )
      )
    )
  );

-- ---------------------------------------------------------------------
-- 2. Delivery Partner RLS Policies (apps/delivery)
-- ---------------------------------------------------------------------

-- Delivery partners can select assigned orders
drop policy if exists "orders_select_delivery_partner" on orders;
create policy "orders_select_delivery_partner" on orders
  for select using (
    exists (
      select 1 from deliveries
      where deliveries.order_id = orders.id
      and exists (
        select 1 from delivery_partners
        where delivery_partners.id = deliveries.delivery_partner_id
        and delivery_partners.user_id = auth.uid()
      )
    )
  );

-- Delivery partners can update their assigned delivery status
drop policy if exists "deliveries_update_partner" on deliveries;
create policy "deliveries_update_partner" on deliveries
  for update using (
    exists (
      select 1 from delivery_partners
      where delivery_partners.id = deliveries.delivery_partner_id
      and delivery_partners.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------
-- 3. Realtime Enablement for Orders & Status History
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table orders;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'order_status_history'
  ) then
    alter publication supabase_realtime add table order_status_history;
  end if;
end $$;
