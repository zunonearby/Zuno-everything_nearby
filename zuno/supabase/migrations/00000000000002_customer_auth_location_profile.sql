-- =====================================================================
-- ZUNO — Customer Authentication, Location, Profile & Consent Schema
-- Migration 00000000000002
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Extend Profiles Table
-- ---------------------------------------------------------------------
alter table profiles
  add column if not exists email text,
  add column if not exists email_verified_at timestamptz,
  add column if not exists gender text check (gender in ('Male', 'Female', 'Non-binary', 'Prefer not to say')),
  add column if not exists default_address_id uuid,
  add column if not exists onboarding_completed_at timestamptz,
  add column if not exists profile_completed_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

-- ---------------------------------------------------------------------
-- 2. Extend Service Areas Table
-- ---------------------------------------------------------------------
alter table service_areas
  add column if not exists city text not null default 'Renukoot',
  add column if not exists state text not null default 'Uttar Pradesh',
  add column if not exists country_code text not null default 'IN',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- Seed initial service area: 231217, Renukoot
insert into service_areas (name, pincode, city, state, country_code, is_active)
values ('Renukoot Central', '231217', 'Renukoot', 'Uttar Pradesh', 'IN', true)
on conflict (pincode) do update set
  city = excluded.city,
  state = excluded.state,
  country_code = excluded.country_code,
  is_active = excluded.is_active,
  updated_at = now();

-- ---------------------------------------------------------------------
-- 3. Extend Addresses Table & Make Coordinates Nullable
-- ---------------------------------------------------------------------
alter table addresses
  add column if not exists recipient_name text,
  add column if not exists phone_number text,
  add column if not exists locality text,
  add column if not exists city text not null default 'Renukoot',
  add column if not exists state text not null default 'Uttar Pradesh',
  add column if not exists country_code text not null default 'IN',
  add column if not exists updated_at timestamptz not null default now();

alter table addresses
  alter column lat drop not null,
  alter column lng drop not null;

-- Add foreign key constraint from profiles default_address_id to addresses
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'fk_profiles_default_address'
  ) then
    alter table profiles
      add constraint fk_profiles_default_address
      foreign key (default_address_id) references addresses (id) on delete set null;
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 4. Create User Consents Table (Append-Only)
-- ---------------------------------------------------------------------
create table if not exists user_consents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles (id) on delete cascade,
  consent_type text not null check (consent_type in ('TERMS_AND_CONDITIONS', 'PRIVACY_POLICY')),
  document_version text not null,
  accepted boolean not null default true,
  accepted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Enable RLS on user_consents
alter table user_consents enable row level security;

-- ---------------------------------------------------------------------
-- 5. Indexes for Hot Paths & Performance
-- ---------------------------------------------------------------------
create index if not exists idx_profiles_phone on profiles (phone);
create index if not exists idx_profiles_email on profiles (email);
create index if not exists idx_addresses_user on addresses (user_id);
create index if not exists idx_addresses_pincode on addresses (pincode);
create index if not exists idx_service_areas_pincode on service_areas (pincode);
create index if not exists idx_user_consents_user on user_consents (user_id);

-- ---------------------------------------------------------------------
-- 6. Row Level Security Policies
-- ---------------------------------------------------------------------

-- A. Profiles RLS
drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on profiles;
create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

-- B. Addresses RLS
drop policy if exists "addresses_select_own" on addresses;
create policy "addresses_select_own" on addresses
  for select using (auth.uid() = user_id);

drop policy if exists "addresses_insert_own" on addresses;
create policy "addresses_insert_own" on addresses
  for insert with check (auth.uid() = user_id);

drop policy if exists "addresses_update_own" on addresses;
create policy "addresses_update_own" on addresses
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "addresses_delete_own" on addresses;
create policy "addresses_delete_own" on addresses
  for delete using (auth.uid() = user_id);

-- C. User Consents RLS (Append-Only)
drop policy if exists "user_consents_select_own" on user_consents;
create policy "user_consents_select_own" on user_consents
  for select using (auth.uid() = user_id);

drop policy if exists "user_consents_insert_own" on user_consents;
create policy "user_consents_insert_own" on user_consents
  for insert with check (auth.uid() = user_id);

-- D. Service Areas RLS (Public Read-Only)
drop policy if exists "service_areas_select_public" on service_areas;
create policy "service_areas_select_public" on service_areas
  for select using (true);
