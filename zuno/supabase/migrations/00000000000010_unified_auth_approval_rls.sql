-- =====================================================================
-- ZUNO — Unified Authentication, Admin RLS & Application Approval Schema
-- Migration 00000000000010
-- =====================================================================

-- Add approval_status and metadata columns to shops table if not exists
alter table shops add column if not exists approval_status text not null default 'PENDING';
alter table shops add column if not exists phone text;
alter table shops add column if not exists address_line text;
alter table shops add column if not exists locality text;
alter table shops add column if not exists pincode text default '231217';
alter table shops add column if not exists updated_at timestamptz default now();

-- Ensure delivery_partners has all required fields
alter table delivery_partners add column if not exists approval_status text not null default 'PENDING';
alter table delivery_partners add column if not exists vehicle_type text default 'Two Wheeler / Scooter';
alter table delivery_partners add column if not exists vehicle_number text default 'UP64 AB 1234';
alter table delivery_partners add column if not exists updated_at timestamptz default now();

-- ---------------------------------------------------------------------
-- Admin Row Level Security Policies
-- ---------------------------------------------------------------------

-- Admins can view all profiles
drop policy if exists "profiles_select_admin" on profiles;
create policy "profiles_select_admin" on profiles
  for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- Admins can update profile roles and details
drop policy if exists "profiles_update_admin" on profiles;
create policy "profiles_update_admin" on profiles
  for update using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- Admins can view all delivery partner applications
drop policy if exists "delivery_partners_select_admin" on delivery_partners;
create policy "delivery_partners_select_admin" on delivery_partners
  for select using (
    user_id = auth.uid()
    or exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- Admins can update delivery partner approval status
drop policy if exists "delivery_partners_update_admin" on delivery_partners;
create policy "delivery_partners_update_admin" on delivery_partners
  for update using (
    user_id = auth.uid()
    or exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- Admins can view all shops
drop policy if exists "shops_select_admin" on shops;
create policy "shops_select_admin" on shops
  for select using (
    is_approved = true
    or owner_id = auth.uid()
    or exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- Admins can update shop approval status
drop policy if exists "shops_update_admin" on shops;
create policy "shops_update_admin" on shops
  for update using (
    owner_id = auth.uid()
    or exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );
