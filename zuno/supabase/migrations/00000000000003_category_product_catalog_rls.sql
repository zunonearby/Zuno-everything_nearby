-- =====================================================================
-- ZUNO — Category & Product Catalog RLS Policies & Initial Seed Data
-- Migration 00000000000003
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Read Policies for Catalog & Shops (Public Read)
-- ---------------------------------------------------------------------

-- Categories
drop policy if exists "categories_select_public" on categories;
create policy "categories_select_public" on categories
  for select using (is_active = true);

-- Products
drop policy if exists "products_select_public" on products;
create policy "products_select_public" on products
  for select using (true);

-- Shops
drop policy if exists "shops_select_public" on shops;
create policy "shops_select_public" on shops
  for select using (is_active = true);

-- Shop Products
drop policy if exists "shop_products_select_public" on shop_products;
create policy "shop_products_select_public" on shop_products
  for select using (available = true);

-- Inventory
drop policy if exists "inventory_select_public" on inventory;
create policy "inventory_select_public" on inventory
  for select using (true);

-- ---------------------------------------------------------------------
-- 2. Initial Category & Subcategory Seeds
-- ---------------------------------------------------------------------

-- Main Categories
insert into categories (id, name, slug, accent_color, is_active)
values
  ('11111111-1111-1111-1111-111111111111', 'Vegetables', 'vegetables', '#0F5D3A', true),
  ('22222222-2222-2222-2222-222222222222', 'Fruits', 'fruits', '#E67E22', true),
  ('33333333-3333-3333-3333-333333333333', 'Grocery', 'grocery', '#2980B9', true),
  ('44444444-4444-4444-4444-444444444444', 'Dairy', 'dairy', '#8E44AD', true),
  ('55555555-5555-5555-5555-555555555555', 'Snacks', 'snacks', '#D35400', true)
on conflict (slug) do update set
  name = excluded.name,
  accent_color = excluded.accent_color,
  is_active = excluded.is_active;

-- Vegetables Subcategories
insert into categories (id, name, slug, parent_id, is_active)
values
  ('11111111-1111-1111-1111-111111111112', 'Leafy', 'vegetables-leafy', '11111111-1111-1111-1111-111111111111', true),
  ('11111111-1111-1111-1111-111111111113', 'Roots', 'vegetables-roots', '11111111-1111-1111-1111-111111111111', true),
  ('11111111-1111-1111-1111-111111111114', 'Fruit Veggies', 'vegetables-fruits', '11111111-1111-1111-1111-111111111111', true),
  ('11111111-1111-1111-1111-111111111115', 'Exotics', 'vegetables-exotics', '11111111-1111-1111-1111-111111111111', true)
on conflict (slug) do nothing;
