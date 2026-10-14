-- =====================================================================
-- ZUNO — Delivery Partner App Schema, RLS & Atomic Assignment RPC
-- Migration 00000000000009
-- =====================================================================

-- Add approval status, vehicle info, and timestamp to delivery_partners if not exists
alter table delivery_partners add column if not exists approval_status text not null default 'PENDING';
alter table delivery_partners add column if not exists vehicle_type text default 'Two Wheeler / Scooter';
alter table delivery_partners add column if not exists vehicle_number text default 'DL8S AB 1234';
alter table delivery_partners add column if not exists updated_at timestamptz default now();

-- Add payout amount and address snapshots to deliveries if not exists
alter table deliveries add column if not exists payout numeric(10,2) not null default 40.00;
alter table deliveries add column if not exists pickup_address text;
alter table deliveries add column if not exists dropoff_address text;

-- Enable RLS on delivery_partners if not already enabled
alter table delivery_partners enable row level security;

-- Delivery partners can select their own partner profile
drop policy if exists "delivery_partners_select_own" on delivery_partners;
create policy "delivery_partners_select_own" on delivery_partners
  for select using (user_id = auth.uid());

-- Delivery partners can update their own availability
drop policy if exists "delivery_partners_update_own" on delivery_partners;
create policy "delivery_partners_update_own" on delivery_partners
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Delivery partners can view unassigned delivery requests or deliveries assigned to them
drop policy if exists "deliveries_select_partner" on deliveries;
create policy "deliveries_select_partner" on deliveries
  for select using (
    status = 'UNASSIGNED'
    or exists (
      select 1 from delivery_partners
      where delivery_partners.id = deliveries.delivery_partner_id
      and delivery_partners.user_id = auth.uid()
    )
  );

-- Atomic server-side RPC for claiming delivery assignments securely
create or replace function claim_delivery_assignment(
  p_delivery_id uuid,
  p_partner_id uuid
) returns jsonb as $$
declare
  v_delivery deliveries%rowtype;
begin
  -- Lock delivery row for update to prevent race conditions
  select * into v_delivery from deliveries where id = p_delivery_id for update;

  if not found then
    return jsonb_build_object('success', false, 'message', 'Delivery request not found.');
  end if;

  if v_delivery.status != 'UNASSIGNED' and v_delivery.delivery_partner_id is not null then
    return jsonb_build_object('success', false, 'message', 'Delivery request has already been claimed by another partner.');
  end if;

  -- Assign delivery to partner
  update deliveries
  set delivery_partner_id = p_partner_id,
      status = 'ASSIGNED'
  where id = p_delivery_id;

  -- Update associated order status
  update orders
  set status = 'OUT_FOR_DELIVERY',
      updated_at = now()
  where id = v_delivery.order_id;

  -- Insert order status history entry
  insert into order_status_history (order_id, status, note)
  values (v_delivery.order_id, 'OUT_FOR_DELIVERY', 'Delivery accepted by delivery partner.');

  return jsonb_build_object('success', true, 'message', 'Delivery accepted successfully.');
end;
$$ language plpgsql security definer;
