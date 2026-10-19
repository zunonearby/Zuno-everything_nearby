-- =====================================================================
-- ZUNO — Central Product Catalog Governance & Product Requests Schema
-- Migration 00000000000012
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Product Requests Table (Shopkeeper Catalog Contribution Flow)
-- ---------------------------------------------------------------------
create table if not exists public.product_requests (
  id uuid primary key default uuid_generate_v4(),
  shop_id uuid not null references public.shops (id) on delete cascade,
  requested_by uuid not null references public.profiles (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  product_name text not null,
  brand text,
  pack_size text,
  unit text not null default 'unit',
  suggested_price numeric(10, 2) check (suggested_price is null or suggested_price >= 0),
  notes text,
  image_url text,
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  reviewed_by uuid references public.profiles (id) on delete set null,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for request management
create index if not exists idx_product_requests_shop on public.product_requests (shop_id);
create index if not exists idx_product_requests_status on public.product_requests (status);
create index if not exists idx_product_requests_category on public.product_requests (category_id);
create index if not exists idx_product_requests_created on public.product_requests (created_at desc);

-- Catalog search indexes
create index if not exists idx_products_category on public.products (category_id);
create index if not exists idx_products_name on public.products (name);

-- ---------------------------------------------------------------------
-- 2. Row Level Security Policies for Product Requests
-- ---------------------------------------------------------------------
alter table public.product_requests enable row level security;

-- Shop Owners can view their own shop's product requests
drop policy if exists "product_requests_select_owner" on public.product_requests;
create policy "product_requests_select_owner" on public.product_requests
  for select using (
    exists (
      select 1 from public.shops s
      where s.id = product_requests.shop_id
      and s.owner_id = auth.uid()
    )
    or public.is_admin_or_super(auth.uid())
  );

-- Shop Owners can submit product requests for their own shop
drop policy if exists "product_requests_insert_owner" on public.product_requests;
create policy "product_requests_insert_owner" on public.product_requests
  for insert with check (
    exists (
      select 1 from public.shops s
      where s.id = product_requests.shop_id
      and s.owner_id = auth.uid()
      and s.is_approved = true
      and s.approval_status = 'APPROVED'
    )
    or public.is_admin_or_super(auth.uid())
  );

-- Admins can update product requests (approve/reject)
drop policy if exists "product_requests_update_admin" on public.product_requests;
create policy "product_requests_update_admin" on public.product_requests
  for update using (
    public.is_admin_or_super(auth.uid())
  );
