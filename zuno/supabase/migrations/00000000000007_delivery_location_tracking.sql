-- =====================================================================
-- ZUNO — Delivery Location Tracking Schema & RLS Policies
-- Migration 00000000000007
-- =====================================================================

-- Add latitude & longitude columns to deliveries if not present
alter table deliveries add column if not exists current_latitude numeric(10,8);
alter table deliveries add column if not exists current_longitude numeric(11,8);
alter table deliveries add column if not exists location_updated_at timestamptz;

-- Create delivery_locations history table for audit / tracking
create table if not exists delivery_locations (
  id uuid primary key default gen_random_uuid(),
  delivery_id uuid not null references deliveries(id) on delete cascade,
  delivery_partner_id uuid references delivery_partners(id) on delete cascade,
  latitude numeric(10,8) not null,
  longitude numeric(11,8) not null,
  recorded_at timestamptz default now()
);

-- Index for fast retrieval of latest location
create index if not exists idx_delivery_locations_delivery_id on delivery_locations(delivery_id, recorded_at desc);

-- Enable RLS
alter table delivery_locations enable row level security;

-- Customer can view location for their active order delivery
drop policy if exists "delivery_locations_select_customer" on delivery_locations;
create policy "delivery_locations_select_customer" on delivery_locations
  for select using (
    exists (
      select 1 from deliveries
      join orders on orders.id = deliveries.order_id
      where deliveries.id = delivery_locations.delivery_id
      and orders.customer_id = auth.uid()
    )
  );

-- Delivery partner can insert location for their assigned delivery
drop policy if exists "delivery_locations_insert_partner" on delivery_locations;
create policy "delivery_locations_insert_partner" on delivery_locations
  for insert with check (
    exists (
      select 1 from deliveries
      join delivery_partners on delivery_partners.id = deliveries.delivery_partner_id
      where deliveries.id = delivery_locations.delivery_id
      and delivery_partners.user_id = auth.uid()
    )
  );

-- Enable Realtime for deliveries and delivery_locations
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'deliveries'
  ) then
    alter publication supabase_realtime add table deliveries;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'delivery_locations'
  ) then
    alter publication supabase_realtime add table delivery_locations;
  end if;
end $$;
