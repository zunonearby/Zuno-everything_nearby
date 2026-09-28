-- =====================================================================
-- ZUNO — Foundational schema
-- One migration establishing the core tables. Extend with new, additive
-- migrations as features are built — do not keep editing this file.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------
create type user_role as enum ('CUSTOMER', 'SHOPKEEPER', 'DELIVERY', 'ADMIN', 'SUPER_ADMIN');

create type order_status as enum (
  'PLACED', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP',
  'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REJECTED'
);

create type delivery_status as enum (
  'UNASSIGNED', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'COMPLETED', 'FAILED'
);

create type payment_method as enum ('COD', 'UPI', 'ONLINE');
create type payment_status as enum ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- ---------------------------------------------------------------------
-- Identity
-- ---------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'CUSTOMER',
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles (id) on delete cascade,
  label text not null,
  line1 text not null,
  line2 text,
  pincode text not null,
  lat double precision not null,
  lng double precision not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Location
-- ---------------------------------------------------------------------
create table service_areas (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  pincode text not null unique,
  is_active boolean not null default true
);

create table delivery_zones (
  id uuid primary key default uuid_generate_v4(),
  service_area_id uuid not null references service_areas (id) on delete cascade,
  name text not null,
  polygon jsonb
);

-- ---------------------------------------------------------------------
-- Shops
-- ---------------------------------------------------------------------
create table shops (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles (id) on delete cascade,
  name text not null,
  description text,
  is_approved boolean not null default false,
  is_active boolean not null default true,
  lat double precision not null,
  lng double precision not null,
  service_area_id uuid references service_areas (id),
  created_at timestamptz not null default now()
);

create table shop_members (
  id uuid primary key default uuid_generate_v4(),
  shop_id uuid not null references shops (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  role text not null check (role in ('OWNER', 'STAFF')),
  unique (shop_id, user_id)
);

-- ---------------------------------------------------------------------
-- Catalog — category-driven, never category-as-schema
-- ---------------------------------------------------------------------
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  parent_id uuid references categories (id),
  accent_color text,
  is_active boolean not null default true
);

create table products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references categories (id),
  name text not null,
  description text,
  unit text not null,
  image_url text
);

-- Shop-specific price/stock — never on `products` directly.
create table shop_products (
  id uuid primary key default uuid_generate_v4(),
  shop_id uuid not null references shops (id) on delete cascade,
  product_id uuid not null references products (id) on delete cascade,
  price numeric(10, 2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  available boolean not null default true,
  unique (shop_id, product_id)
);

create table inventory (
  id uuid primary key default uuid_generate_v4(),
  shop_product_id uuid not null references shop_products (id) on delete cascade,
  quantity integer not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Cart
-- ---------------------------------------------------------------------
create table carts (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references profiles (id) on delete cascade,
  shop_id uuid not null references shops (id),
  created_at timestamptz not null default now()
);

create table cart_items (
  id uuid primary key default uuid_generate_v4(),
  cart_id uuid not null references carts (id) on delete cascade,
  shop_product_id uuid not null references shop_products (id),
  quantity integer not null check (quantity > 0)
);

-- ---------------------------------------------------------------------
-- Orders — items snapshot name/price so history never mutates later
-- ---------------------------------------------------------------------
create table orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references profiles (id),
  shop_id uuid not null references shops (id),
  address_id uuid not null references addresses (id),
  status order_status not null default 'PLACED',
  subtotal numeric(10, 2) not null,
  delivery_fee numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid not null references products (id),
  product_name_snapshot text not null,
  unit_price_snapshot numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  subtotal numeric(10, 2) not null
);

create table order_status_history (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders (id) on delete cascade,
  status order_status not null,
  changed_by uuid references profiles (id),
  note text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Payments
-- ---------------------------------------------------------------------
create table payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders (id) on delete cascade,
  method payment_method not null,
  status payment_status not null default 'PENDING',
  amount numeric(10, 2) not null,
  provider_reference text,
  created_at timestamptz not null default now()
);

alter table orders
  add column payment_id uuid references payments (id);

-- ---------------------------------------------------------------------
-- Delivery
-- ---------------------------------------------------------------------
create table delivery_partners (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles (id) on delete cascade,
  full_name text not null,
  phone text not null,
  is_available boolean not null default false,
  created_at timestamptz not null default now()
);

create table deliveries (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders (id) on delete cascade,
  delivery_partner_id uuid references delivery_partners (id),
  status delivery_status not null default 'UNASSIGNED',
  pickup_lat double precision,
  pickup_lng double precision,
  dropoff_lat double precision,
  dropoff_lng double precision,
  picked_up_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

alter table orders
  add column delivery_id uuid references deliveries (id);

-- ---------------------------------------------------------------------
-- Notifications, audit, platform settings
-- ---------------------------------------------------------------------
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table activity_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles (id),
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table platform_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Indexes for the obvious hot paths
-- ---------------------------------------------------------------------
create index idx_shop_products_shop on shop_products (shop_id);
create index idx_shop_products_product on shop_products (product_id);
create index idx_orders_customer on orders (customer_id);
create index idx_orders_shop on orders (shop_id);
create index idx_orders_status on orders (status);
create index idx_deliveries_partner on deliveries (delivery_partner_id);
create index idx_activity_logs_entity on activity_logs (entity_type, entity_id);

-- ---------------------------------------------------------------------
-- Row Level Security — enabled now, policies added per-feature as each
-- app's server logic is built. Foundation only: block all client access
-- until explicit policies are written.
-- ---------------------------------------------------------------------
alter table profiles enable row level security;
alter table addresses enable row level security;
alter table shops enable row level security;
alter table shop_members enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table shop_products enable row level security;
alter table inventory enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_status_history enable row level security;
alter table payments enable row level security;
alter table delivery_partners enable row level security;
alter table deliveries enable row level security;
alter table notifications enable row level security;
alter table activity_logs enable row level security;
alter table platform_settings enable row level security;

-- Example baseline policy — a user can always read their own profile.
-- TODO: add the full policy set per docs/security.md before going live.
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);
