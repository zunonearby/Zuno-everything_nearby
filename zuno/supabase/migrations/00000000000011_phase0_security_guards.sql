-- =====================================================================
-- ZUNO — Migration 00000000000011_phase0_security_guards.sql
-- Production security hardening, RLS tenant isolation, and lifecycle integrity.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Schema Prerequisites (Ensure approval_status & metadata exist)
-- ---------------------------------------------------------------------
alter table public.shops add column if not exists approval_status text not null default 'PENDING';
alter table public.shops add column if not exists phone text;
alter table public.shops add column if not exists address_line text;
alter table public.shops add column if not exists locality text;
alter table public.shops add column if not exists pincode text default '231217';
alter table public.shops add column if not exists updated_at timestamptz default now();

alter table public.delivery_partners add column if not exists approval_status text not null default 'PENDING';
alter table public.delivery_partners add column if not exists vehicle_type text default 'Two Wheeler / Scooter';
alter table public.delivery_partners add column if not exists vehicle_number text default 'UP64 AB 1234';
alter table public.delivery_partners add column if not exists is_available boolean not null default false;
alter table public.delivery_partners add column if not exists updated_at timestamptz default now();

alter table public.deliveries add column if not exists payout numeric(10,2) not null default 40.00;
alter table public.deliveries add column if not exists pickup_address text;
alter table public.deliveries add column if not exists dropoff_address text;
alter table public.deliveries add column if not exists updated_at timestamptz default now();

alter table public.notifications add column if not exists type text not null default 'ORDER_UPDATE';
alter table public.notifications add column if not exists metadata jsonb default '{}'::jsonb;

-- ---------------------------------------------------------------------
-- 1. Security Helper Function
-- ---------------------------------------------------------------------
create or replace function public.is_admin_or_super(p_user_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = p_user_id
    and role in ('ADMIN', 'SUPER_ADMIN')
  );
$$ language sql stable security definer set search_path = public, pg_temp;

revoke all on function public.is_admin_or_super(uuid) from public;
grant execute on function public.is_admin_or_super(uuid) to authenticated;

-- Fix recursive admin policies from Migration 010 (use security definer is_admin_or_super)
drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin" on public.profiles
  for select using (public.is_admin_or_super(auth.uid()));

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin" on public.profiles
  for update using (public.is_admin_or_super(auth.uid()));

drop policy if exists "shops_select_admin" on public.shops;
create policy "shops_select_admin" on public.shops
  for select using (
    is_approved = true
    or owner_id = auth.uid()
    or public.is_admin_or_super(auth.uid())
  );

-- ---------------------------------------------------------------------
-- 2. Delivery Unique Index (Idempotency Guard)
-- ---------------------------------------------------------------------
create unique index if not exists idx_deliveries_order_id_unique on public.deliveries (order_id);


-- ---------------------------------------------------------------------
-- 3. Profile Role Protection (Handles NULLs, 3-Valued Logic & Provisioning)
-- ---------------------------------------------------------------------
create or replace function public.check_profile_role_protection()
returns trigger as $$
declare
  v_caller_role user_role;
begin
  -- 1. Bypass if role is not changing (ordinary profile updates)
  if (OLD.role is not distinct from NEW.role) then
    return NEW;
  end if;

  -- 2. Allow trusted server provisioning (service_role, postgres, migrations)
  if auth.uid() is null then
    if current_user in ('postgres', 'service_role') or session_user in ('postgres', 'service_role') then
      return NEW;
    else
      raise exception 'Unauthenticated role modification denied.';
    end if;
  end if;

  select role into v_caller_role from public.profiles where id = auth.uid();
  
  if v_caller_role is null then
    raise exception 'Caller profile not found; role modification denied.';
  end if;

  -- 3. Only SUPER_ADMIN can assign administrative roles
  if NEW.role in ('ADMIN', 'SUPER_ADMIN') and v_caller_role <> 'SUPER_ADMIN' then
    raise exception 'Only SUPER_ADMIN can assign administrative roles.';
  end if;

  -- 4. Regular users cannot alter their role except through authorized self-onboarding
  if v_caller_role not in ('ADMIN', 'SUPER_ADMIN') then
    if auth.uid() = NEW.id and OLD.role = 'CUSTOMER' and NEW.role in ('SHOPKEEPER', 'DELIVERY') then
      null; -- Authorized self-onboarding transition
    else
      raise exception 'Unauthorized role modification.';
    end if;
  end if;

  -- 5. Transactional audit log
  insert into public.activity_logs (actor_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    'ROLE_CHANGE',
    'profiles',
    NEW.id,
    jsonb_build_object('old_role', OLD.role, 'new_role', NEW.role)
  );

  return NEW;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

revoke all on function public.check_profile_role_protection() from public;

drop trigger if exists trigger_profile_role_protection on public.profiles;
create trigger trigger_profile_role_protection
  before update on public.profiles
  for each row execute function public.check_profile_role_protection();

-- ---------------------------------------------------------------------
-- 4. Shop Approval & Ownership Protection
-- ---------------------------------------------------------------------
create or replace function public.check_shops_approval_protection()
returns trigger as $$
begin
  if (OLD.is_approved is distinct from NEW.is_approved or OLD.approval_status is distinct from NEW.approval_status) then
    if not public.is_admin_or_super(auth.uid()) then
      raise exception 'Only platform administrators can modify shop approval status.';
    end if;
  end if;

  if (OLD.owner_id is distinct from NEW.owner_id) then
    if not public.is_admin_or_super(auth.uid()) then
      raise exception 'Shop ownership cannot be transferred without administrator approval.';
    end if;
  end if;

  return NEW;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

revoke all on function public.check_shops_approval_protection() from public;

drop trigger if exists trigger_shops_approval_protection on public.shops;
create trigger trigger_shops_approval_protection
  before update on public.shops
  for each row execute function public.check_shops_approval_protection();

drop policy if exists "shops_update_admin" on public.shops;
create policy "shops_update_admin" on public.shops
  for update using (public.is_admin_or_super(auth.uid()));

drop policy if exists "shops_update_owner" on public.shops;
create policy "shops_update_owner" on public.shops
  for update using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "shops_insert_owner" on public.shops;
create policy "shops_insert_owner" on public.shops
  for insert with check (
    owner_id = auth.uid()
    and is_approved = false
    and approval_status = 'PENDING'
  );

-- ---------------------------------------------------------------------
-- 4.1 Shopkeeper Self-Registration RPC (Atomic & Safe)
-- ---------------------------------------------------------------------
create or replace function public.register_shop_application(
  p_owner_name text,
  p_phone text,
  p_shop_name text,
  p_description text default 'Fresh local grocery & daily essentials',
  p_address_line text default 'Main Market',
  p_locality text default 'Renukoot',
  p_pincode text default '231217'
) returns jsonb as $$
declare
  v_user_id uuid;
  v_shop_id uuid;
  v_phone text := p_phone;
  v_clean_phone text;
begin
  v_clean_phone := regexp_replace(v_phone, '\D', '', 'g');

  -- 1. Check if auth user already exists by phone or synthetic email
  select id into v_user_id from auth.users
  where phone = v_phone or email = 'shop_' || v_clean_phone || '@zuno.in'
  limit 1;

  -- 2. If not found, safely provision in auth.users
  if v_user_id is null then
    v_user_id := gen_random_uuid();
    insert into auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      phone,
      encrypted_password,
      email_confirmed_at,
      phone_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) values (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'shop_' || v_clean_phone || '@zuno.in',
      v_phone,
      '',
      now(),
      now(),
      '{"provider":"phone","providers":["phone"]}'::jsonb,
      jsonb_build_object('full_name', p_owner_name, 'phone', v_phone, 'role', 'SHOPKEEPER'),
      now(),
      now()
    );
  end if;

  -- 3. Ensure profile exists
  insert into public.profiles (id, role, full_name, phone, updated_at)
  values (v_user_id, 'SHOPKEEPER', p_owner_name, v_phone, now())
  on conflict (id) do update set
    full_name = excluded.full_name,
    phone = excluded.phone,
    role = 'SHOPKEEPER',
    updated_at = now();

  -- 4. Insert shop application in PENDING state
  insert into public.shops (
    owner_id,
    name,
    description,
    phone,
    address_line,
    locality,
    pincode,
    is_approved,
    approval_status,
    is_active,
    lat,
    lng
  ) values (
    v_user_id,
    p_shop_name,
    p_description,
    v_phone,
    p_address_line,
    p_locality,
    p_pincode,
    false,
    'PENDING',
    true,
    24.2185,
    83.0326
  ) returning id into v_shop_id;

  return jsonb_build_object(
    'success', true,
    'shop_id', v_shop_id,
    'user_id', v_user_id,
    'shop_name', p_shop_name,
    'approval_status', 'PENDING',
    'message', 'Shop registration submitted successfully.'
  );
end;
$$ language plpgsql security definer set search_path = public, auth, pg_temp;

revoke all on function public.register_shop_application(text, text, text, text, text, text, text) from public;
grant execute on function public.register_shop_application(text, text, text, text, text, text, text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 4.2 Super Admin Shop Approval RPC (Atomic & Security Definer)
-- ---------------------------------------------------------------------
create or replace function public.approve_or_reject_shop(
  p_shop_id uuid,
  p_status text
) returns jsonb as $$
declare
  v_shop record;
  v_is_approved boolean := (p_status = 'APPROVED');
begin
  select * into v_shop from public.shops where id = p_shop_id;
  if not found then
    return jsonb_build_object('success', false, 'error', 'Shop record not found.');
  end if;

  update public.shops
  set is_approved = v_is_approved,
      approval_status = p_status,
      updated_at = now()
  where id = p_shop_id;

  -- Safe audit log in activity_logs
  begin
    insert into public.activity_logs (
      actor_id,
      action,
      entity_type,
      entity_id,
      metadata
    ) values (
      coalesce(auth.uid(), v_shop.owner_id),
      'SHOP_APPROVAL_MODIFICATION',
      'shops',
      p_shop_id,
      jsonb_build_object('shop_name', v_shop.name, 'previous_status', v_shop.approval_status, 'new_status', p_status, 'is_approved', v_is_approved)
    );
  exception when others then
    null;
  end;

  return jsonb_build_object(
    'success', true,
    'message', 'Shop "' || v_shop.name || '" status successfully updated to ' || p_status,
    'shop_id', p_shop_id,
    'approval_status', p_status,
    'is_approved', v_is_approved
  );
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

revoke all on function public.approve_or_reject_shop(uuid, text) from public;
grant execute on function public.approve_or_reject_shop(uuid, text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 5. Staff Catalog Field Restrictions (shop_products Trigger)
-- ---------------------------------------------------------------------
create or replace function public.check_shop_products_staff_permissions()
returns trigger as $$
declare
  v_is_primary_owner boolean;
  v_member_role text;
begin
  if public.is_admin_or_super(auth.uid()) then
    return NEW;
  end if;

  if (OLD.shop_id is distinct from NEW.shop_id or OLD.product_id is distinct from NEW.product_id) then
    raise exception 'shop_id and product_id cannot be reassigned.';
  end if;

  select (owner_id = auth.uid()) into v_is_primary_owner from public.shops where id = OLD.shop_id;
  if (v_is_primary_owner is true) then
    return NEW;
  end if;

  select role into v_member_role from public.shop_members
  where shop_id = OLD.shop_id and user_id = auth.uid();

  if (v_member_role = 'OWNER') then
    return NEW;
  elsif (v_member_role = 'STAFF') then
    if (OLD.price is distinct from NEW.price) then
      raise exception 'Staff members are not authorized to modify product prices.';
    end if;
    return NEW;
  else
    raise exception 'Unauthorized catalog modification.';
  end if;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

revoke all on function public.check_shop_products_staff_permissions() from public;

drop trigger if exists trigger_check_shop_products_staff on public.shop_products;
create trigger trigger_check_shop_products_staff
  before update on public.shop_products
  for each row execute function public.check_shop_products_staff_permissions();

-- ---------------------------------------------------------------------
-- 6. Inventory Staff Field Restrictions (inventory Trigger)
-- ---------------------------------------------------------------------
create or replace function public.check_inventory_staff_permissions()
returns trigger as $$
begin
  if (OLD.shop_product_id is distinct from NEW.shop_product_id) then
    raise exception 'shop_product_id on inventory is immutable.';
  end if;
  NEW.updated_at := now();
  return NEW;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

revoke all on function public.check_inventory_staff_permissions() from public;

drop trigger if exists trigger_check_inventory_staff on public.inventory;
create trigger trigger_check_inventory_staff
  before update on public.inventory
  for each row execute function public.check_inventory_staff_permissions();

-- ---------------------------------------------------------------------
-- 7. Order Items Snapshot Immutability
-- ---------------------------------------------------------------------
create or replace function public.forbid_order_items_mutation()
returns trigger as $$
begin
  raise exception 'Order items are historical snapshots and strictly immutable.';
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

revoke all on function public.forbid_order_items_mutation() from public;

drop trigger if exists trigger_forbid_order_items_mutation on public.order_items;
create trigger trigger_forbid_order_items_mutation
  before update or delete on public.order_items
  for each row execute function public.forbid_order_items_mutation();

-- ---------------------------------------------------------------------
-- 8. Order State Machine & Financial Integrity Trigger
-- ---------------------------------------------------------------------
create or replace function public.enforce_order_integrity_and_delivery()
returns trigger as $$
declare
  v_caller_id uuid := auth.uid();
  v_is_admin boolean := false;
  v_is_merchant boolean := false;
  v_is_assigned_driver boolean := false;
  v_delivery_id uuid;
  v_pickup_address text;
  v_dropoff_address text;
  v_pickup_lat double precision;
  v_pickup_lng double precision;
  v_dropoff_lat double precision;
  v_dropoff_lng double precision;
begin
  -- 1. Financial and identity immutability (NULL-safe)
  if (OLD.id is distinct from NEW.id or
      OLD.customer_id is distinct from NEW.customer_id or
      OLD.shop_id is distinct from NEW.shop_id or
      OLD.address_id is distinct from NEW.address_id or
      OLD.subtotal is distinct from NEW.subtotal or
      OLD.delivery_fee is distinct from NEW.delivery_fee or
      OLD.total is distinct from NEW.total or
      OLD.created_at is distinct from NEW.created_at) then
    raise exception 'Order financial, customer, shop, and address fields are strictly immutable.';
  end if;

  if OLD.payment_id is not null and OLD.payment_id is distinct from NEW.payment_id then
    raise exception 'payment_id cannot be modified once set.';
  end if;

  if OLD.delivery_id is not null and OLD.delivery_id is distinct from NEW.delivery_id then
    raise exception 'delivery_id cannot be modified once set.';
  end if;

  -- 2. State transition and actor authorization
  if (OLD.status <> NEW.status) then
    v_is_admin := public.is_admin_or_super(v_caller_id);

    select exists (
      select 1 from public.shops s
      where s.id = OLD.shop_id
      and (s.owner_id = v_caller_id or exists (select 1 from public.shop_members sm where sm.shop_id = s.id and sm.user_id = v_caller_id))
    ) into v_is_merchant;

    select exists (
      select 1 from public.deliveries d
      join public.delivery_partners dp on dp.id = d.delivery_partner_id
      where d.order_id = OLD.id
      and dp.user_id = v_caller_id
      and dp.approval_status = 'APPROVED'
    ) into v_is_assigned_driver;

    case OLD.status
      when 'PLACED' then
        if NEW.status not in ('ACCEPTED', 'REJECTED', 'CANCELLED') then
          raise exception 'Invalid transition from PLACED to %', NEW.status;
        end if;
        if NEW.status in ('ACCEPTED', 'REJECTED') and not (v_is_merchant or v_is_admin) then
          raise exception 'Only the shop merchant or administrator can accept or reject orders.';
        end if;
        if NEW.status = 'CANCELLED' and not (v_caller_id = OLD.customer_id or v_is_merchant or v_is_admin) then
          raise exception 'Unauthorized to cancel this order.';
        end if;

      when 'ACCEPTED' then
        if NEW.status not in ('PREPARING', 'READY_FOR_PICKUP', 'CANCELLED') then
          raise exception 'Invalid transition from ACCEPTED to %', NEW.status;
        end if;
        if v_caller_id = OLD.customer_id and not v_is_admin then
          raise exception 'Customers cannot cancel an order after shopkeeper acceptance.';
        end if;
        if not (v_is_merchant or v_is_admin) then
          raise exception 'Only the shop merchant or administrator can advance accepted orders.';
        end if;

      when 'PREPARING' then
        if NEW.status not in ('READY_FOR_PICKUP', 'CANCELLED') then
          raise exception 'Invalid transition from PREPARING to %', NEW.status;
        end if;
        if v_caller_id = OLD.customer_id and not v_is_admin then
          raise exception 'Customers cannot cancel an order during preparation.';
        end if;
        if not (v_is_merchant or v_is_admin) then
          raise exception 'Only the shop merchant or administrator can advance preparing orders.';
        end if;

      when 'READY_FOR_PICKUP' then
        if NEW.status not in ('OUT_FOR_DELIVERY', 'CANCELLED') then
          raise exception 'Invalid transition from READY_FOR_PICKUP to %', NEW.status;
        end if;
        if NEW.status = 'OUT_FOR_DELIVERY' and not (v_is_assigned_driver or v_is_admin) then
          raise exception 'Only the assigned delivery partner can transition order to OUT_FOR_DELIVERY.';
        end if;
        if NEW.status = 'CANCELLED' and not (v_is_merchant or v_is_admin) then
          raise exception 'Only the shop merchant or administrator can cancel orders ready for pickup.';
        end if;

      when 'OUT_FOR_DELIVERY' then
        if NEW.status not in ('DELIVERED', 'CANCELLED') then
          raise exception 'Invalid transition from OUT_FOR_DELIVERY to %', NEW.status;
        end if;
        if NEW.status = 'DELIVERED' and not (v_is_assigned_driver or v_is_admin) then
          raise exception 'Only the assigned delivery partner can confirm delivery.';
        end if;
        if NEW.status = 'CANCELLED' and not v_is_admin then
          raise exception 'Only platform administrators can cancel orders already OUT_FOR_DELIVERY.';
        end if;

      when 'DELIVERED' then
        raise exception 'Delivered orders cannot be modified.';
      when 'CANCELLED' then
        raise exception 'Cancelled orders cannot be modified.';
      when 'REJECTED' then
        raise exception 'Rejected orders cannot be modified.';
    end case;

    -- 3. Automatic delivery row creation strictly at READY_FOR_PICKUP
    if (NEW.status = 'READY_FOR_PICKUP' and OLD.status <> 'READY_FOR_PICKUP') then
      select s.name || ', ' || coalesce(s.address_line, '') || ', ' || coalesce(s.locality, '') || ' - ' || coalesce(s.pincode, ''),
             s.lat, s.lng
      into v_pickup_address, v_pickup_lat, v_pickup_lng
      from public.shops s where s.id = NEW.shop_id;

      select a.line1 || coalesce(', ' || a.line2, '') || ', ' || a.city || ' - ' || a.pincode,
             a.lat, a.lng
      into v_dropoff_address, v_dropoff_lat, v_dropoff_lng
      from public.addresses a where a.id = NEW.address_id;

      insert into public.deliveries (
        order_id,
        status,
        payout,
        pickup_address,
        dropoff_address,
        pickup_lat,
        pickup_lng,
        dropoff_lat,
        dropoff_lng
      ) values (
        NEW.id,
        'UNASSIGNED',
        40.00,
        coalesce(v_pickup_address, 'Shop Pickup Location'),
        coalesce(v_dropoff_address, 'Customer Delivery Address'),
        v_pickup_lat,
        v_pickup_lng,
        v_dropoff_lat,
        v_dropoff_lng
      )
      on conflict (order_id) do update set updated_at = now()
      returning id into v_delivery_id;

      NEW.delivery_id := v_delivery_id;
    end if;

    -- 4. Mark unassigned deliveries FAILED if order is cancelled or rejected
    if (NEW.status in ('CANCELLED', 'REJECTED')) then
      update public.deliveries
      set status = 'FAILED'
      where order_id = NEW.id
      and status = 'UNASSIGNED';
    end if;
  end if;

  NEW.updated_at := now();
  return NEW;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

revoke all on function public.enforce_order_integrity_and_delivery() from public;

drop trigger if exists trigger_enforce_order_integrity on public.orders;
create trigger trigger_enforce_order_integrity
  before update on public.orders
  for each row execute function public.enforce_order_integrity_and_delivery();

-- ---------------------------------------------------------------------
-- 9. Centralized Order Status History Trigger
-- ---------------------------------------------------------------------
create or replace function public.log_order_status_history()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    insert into public.order_status_history (order_id, status, changed_by, note)
    values (NEW.id, NEW.status, auth.uid(), 'Order placed successfully.');
  elsif (TG_OP = 'UPDATE' and OLD.status <> NEW.status) then
    insert into public.order_status_history (order_id, status, changed_by, note)
    values (NEW.id, NEW.status, auth.uid(), 'Status transitioned from ' || OLD.status || ' to ' || NEW.status);
  end if;
  return NEW;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

revoke all on function public.log_order_status_history() from public;

drop trigger if exists trigger_log_order_status_history on public.orders;
create trigger trigger_log_order_status_history
  after insert or update of status on public.orders
  for each row execute function public.log_order_status_history();

-- ---------------------------------------------------------------------
-- 10. Realtime Notifications Trigger
-- ---------------------------------------------------------------------
create or replace function public.notify_on_order_status_change()
returns trigger as $$
declare
  notif_title text;
  notif_body text;
  v_shop_owner_id uuid;
begin
  if (TG_OP = 'INSERT') then
    notif_title := 'Order Placed';
    notif_body := 'Your order has been placed successfully and sent to the shop.';
  elsif (TG_OP = 'UPDATE' and OLD.status <> NEW.status) then
    case NEW.status
      when 'ACCEPTED' then
        notif_title := 'Shop Accepted Your Order';
        notif_body := 'The shop has accepted your order and will start preparing soon.';
      when 'PREPARING' then
        notif_title := 'Order Being Prepared';
        notif_body := 'Your order is currently being packed by the shop.';
      when 'READY_FOR_PICKUP' then
        notif_title := 'Order Ready for Pickup';
        notif_body := 'Your order is packed and waiting for delivery pickup.';
      when 'OUT_FOR_DELIVERY' then
        notif_title := 'Your Order is On the Way';
        notif_body := 'Your rider has picked up your order and is on the way.';
      when 'DELIVERED' then
        notif_title := 'Order Delivered';
        notif_body := 'Your order has been delivered. Enjoy your fresh items!';
      when 'CANCELLED' then
        notif_title := 'Order Cancelled';
        notif_body := 'Your order has been cancelled.';
      when 'REJECTED' then
        notif_title := 'Order Declined';
        notif_body := 'The shop was unable to accept your order.';
      else
        notif_title := 'Order Update';
        notif_body := 'Status updated to ' || NEW.status;
    end case;
  else
    return NEW;
  end if;

  insert into public.notifications (user_id, title, body, read, type, metadata)
  values (
    NEW.customer_id,
    notif_title,
    notif_body,
    false,
    'ORDER_UPDATE',
    jsonb_build_object('order_id', NEW.id, 'status', NEW.status)
  );

  if (TG_OP = 'INSERT') then
    select owner_id into v_shop_owner_id from public.shops where id = NEW.shop_id;
    if v_shop_owner_id is not null then
      insert into public.notifications (user_id, title, body, read, type, metadata)
      values (
        v_shop_owner_id,
        'New Incoming Order',
        'New order #' || substring(NEW.id::text, 1, 8) || ' received.',
        false,
        'MERCHANT_ORDER',
        jsonb_build_object('order_id', NEW.id, 'status', NEW.status)
      );
    end if;
  end if;

  return NEW;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

revoke all on function public.notify_on_order_status_change() from public;

-- ---------------------------------------------------------------------
-- 11. Delivery Assignment RPC (With Order Status Check & Compatibility Overload)
-- ---------------------------------------------------------------------
create or replace function public.claim_delivery_assignment(
  p_delivery_id uuid
) returns jsonb as $$
declare
  v_delivery public.deliveries%rowtype;
  v_partner public.delivery_partners%rowtype;
  v_order_status order_status;
begin
  if auth.uid() is null then
    return jsonb_build_object('success', false, 'message', 'Authentication required.');
  end if;

  select * into v_partner from public.delivery_partners
  where user_id = auth.uid();

  if not found then
    return jsonb_build_object('success', false, 'message', 'Delivery partner profile not found.');
  end if;

  if v_partner.approval_status <> 'APPROVED' then
    return jsonb_build_object('success', false, 'message', 'Your delivery partner account is not approved.');
  end if;

  if not v_partner.is_available then
    return jsonb_build_object('success', false, 'message', 'You must set your status to available to claim orders.');
  end if;

  select * into v_delivery from public.deliveries
  where id = p_delivery_id for update;

  if not found then
    return jsonb_build_object('success', false, 'message', 'Delivery request not found.');
  end if;

  if v_delivery.status <> 'UNASSIGNED' or v_delivery.delivery_partner_id is not null then
    return jsonb_build_object('success', false, 'message', 'Delivery has already been claimed by another partner.');
  end if;

  -- Verify linked order is strictly in READY_FOR_PICKUP
  select status into v_order_status from public.orders
  where id = v_delivery.order_id for update;

  if not found then
    return jsonb_build_object('success', false, 'message', 'Associated order not found.');
  end if;

  if v_order_status <> 'READY_FOR_PICKUP' then
    return jsonb_build_object('success', false, 'message', 'Order is no longer available for delivery (Status: ' || v_order_status || ').');
  end if;

  -- Assign delivery without changing order status
  update public.deliveries
  set delivery_partner_id = v_partner.id,
      status = 'ASSIGNED'
  where id = p_delivery_id;

  return jsonb_build_object('success', true, 'message', 'Delivery accepted successfully. Proceed to shop for pickup.');
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

-- 2-argument backwards-compatibility overload: ignores client p_partner_id
create or replace function public.claim_delivery_assignment(
  p_delivery_id uuid,
  p_partner_id uuid
) returns jsonb as $$
begin
  return public.claim_delivery_assignment(p_delivery_id);
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

revoke all on function public.claim_delivery_assignment(uuid) from public;
grant execute on function public.claim_delivery_assignment(uuid) to authenticated;

revoke all on function public.claim_delivery_assignment(uuid, uuid) from public;
grant execute on function public.claim_delivery_assignment(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------
-- 12. Row Level Security Policies
-- ---------------------------------------------------------------------

-- Customer Order Cancellation
drop policy if exists "orders_update_customer" on public.orders;
create policy "orders_update_customer" on public.orders
  for update using (
    auth.uid() = customer_id
    and status = 'PLACED'
  )
  with check (
    auth.uid() = customer_id
    and status = 'CANCELLED'
  );

-- Delivery Partner Order Update
drop policy if exists "orders_update_delivery_partner" on public.orders;
create policy "orders_update_delivery_partner" on public.orders
  for update using (
    exists (
      select 1 from public.deliveries d
      join public.delivery_partners dp on dp.id = d.delivery_partner_id
      where d.order_id = orders.id
      and dp.user_id = auth.uid()
    )
  )
  with check (
    status in ('OUT_FOR_DELIVERY', 'DELIVERED')
  );

-- Shop Members Management
drop policy if exists "shop_members_select" on public.shop_members;
create policy "shop_members_select" on public.shop_members
  for select using (
    exists (
      select 1 from public.shops s
      where s.id = shop_members.shop_id
      and (s.owner_id = auth.uid() or shop_members.user_id = auth.uid())
    )
    or public.is_admin_or_super(auth.uid())
  );

drop policy if exists "shop_members_all_owner" on public.shop_members;
create policy "shop_members_all_owner" on public.shop_members
  for all using (
    exists (
      select 1 from public.shops s
      where s.id = shop_members.shop_id
      and s.owner_id = auth.uid()
    )
    or public.is_admin_or_super(auth.uid())
  );

-- Shop Products: INSERT restricted strictly to Owners/Admins (Staff CANNOT insert)
drop policy if exists "shop_products_insert_shop" on public.shop_products;
drop policy if exists "shop_products_insert_owner" on public.shop_products;
create policy "shop_products_insert_owner" on public.shop_products
  for insert with check (
    exists (
      select 1 from public.shops s
      where s.id = shop_products.shop_id
      and (
        s.owner_id = auth.uid()
        or exists (select 1 from public.shop_members sm where sm.shop_id = s.id and sm.user_id = auth.uid() and sm.role = 'OWNER')
      )
    )
    or public.is_admin_or_super(auth.uid())
  );

drop policy if exists "shop_products_update_shop" on public.shop_products;
create policy "shop_products_update_shop" on public.shop_products
  for update using (
    exists (
      select 1 from public.shops s
      where s.id = shop_products.shop_id
      and (
        s.owner_id = auth.uid()
        or exists (select 1 from public.shop_members sm where sm.shop_id = s.id and sm.user_id = auth.uid())
      )
    )
    or public.is_admin_or_super(auth.uid())
  );

drop policy if exists "shop_products_delete_owner" on public.shop_products;
create policy "shop_products_delete_owner" on public.shop_products
  for delete using (
    exists (
      select 1 from public.shops s
      where s.id = shop_products.shop_id
      and (
        s.owner_id = auth.uid()
        or exists (select 1 from public.shop_members sm where sm.shop_id = s.id and sm.user_id = auth.uid() and sm.role = 'OWNER')
      )
    )
    or public.is_admin_or_super(auth.uid())
  );

-- Inventory: Split policies (Staff restricted to UPDATE quantity only)
drop policy if exists "inventory_modify_shop" on public.inventory;
drop policy if exists "inventory_insert_owner" on public.inventory;
create policy "inventory_insert_owner" on public.inventory
  for insert with check (
    exists (
      select 1 from public.shop_products sp
      join public.shops s on s.id = sp.shop_id
      where sp.id = inventory.shop_product_id
      and (
        s.owner_id = auth.uid()
        or exists (select 1 from public.shop_members sm where sm.shop_id = s.id and sm.user_id = auth.uid() and sm.role = 'OWNER')
      )
    )
    or public.is_admin_or_super(auth.uid())
  );

drop policy if exists "inventory_update_shop" on public.inventory;
create policy "inventory_update_shop" on public.inventory
  for update using (
    exists (
      select 1 from public.shop_products sp
      join public.shops s on s.id = sp.shop_id
      where sp.id = inventory.shop_product_id
      and (
        s.owner_id = auth.uid()
        or exists (select 1 from public.shop_members sm where sm.shop_id = s.id and sm.user_id = auth.uid())
      )
    )
    or public.is_admin_or_super(auth.uid())
  );

drop policy if exists "inventory_delete_owner" on public.inventory;
create policy "inventory_delete_owner" on public.inventory
  for delete using (
    exists (
      select 1 from public.shop_products sp
      join public.shops s on s.id = sp.shop_id
      where sp.id = inventory.shop_product_id
      and (
        s.owner_id = auth.uid()
        or exists (select 1 from public.shop_members sm where sm.shop_id = s.id and sm.user_id = auth.uid() and sm.role = 'OWNER')
      )
    )
    or public.is_admin_or_super(auth.uid())
  );

-- Order Items Read Access
drop policy if exists "order_items_select_shopkeeper" on public.order_items;
create policy "order_items_select_shopkeeper" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      join public.shops s on s.id = o.shop_id
      where o.id = order_items.order_id
      and (s.owner_id = auth.uid() or exists (select 1 from public.shop_members sm where sm.shop_id = s.id and sm.user_id = auth.uid()))
    )
    or public.is_admin_or_super(auth.uid())
  );

drop policy if exists "order_items_select_delivery_partner" on public.order_items;
create policy "order_items_select_delivery_partner" on public.order_items
  for select using (
    exists (
      select 1 from public.deliveries d
      join public.delivery_partners dp on dp.id = d.delivery_partner_id
      where d.order_id = order_items.order_id
      and dp.user_id = auth.uid()
    )
  );

-- Order Status History Read Access
drop policy if exists "order_status_history_select_shopkeeper" on public.order_status_history;
create policy "order_status_history_select_shopkeeper" on public.order_status_history
  for select using (
    exists (
      select 1 from public.orders o
      join public.shops s on s.id = o.shop_id
      where o.id = order_status_history.order_id
      and (s.owner_id = auth.uid() or exists (select 1 from public.shop_members sm where sm.shop_id = s.id and sm.user_id = auth.uid()))
    )
    or public.is_admin_or_super(auth.uid())
  );

drop policy if exists "order_status_history_select_delivery_partner" on public.order_status_history;
create policy "order_status_history_select_delivery_partner" on public.order_status_history
  for select using (
    exists (
      select 1 from public.deliveries d
      join public.delivery_partners dp on dp.id = d.delivery_partner_id
      where d.order_id = order_status_history.order_id
      and dp.user_id = auth.uid()
    )
  );
