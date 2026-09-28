-- Development-only seed data. Do NOT run against production.
-- Minimal category set to unblock local development of the catalog screens.
insert into categories (name, slug, accent_color) values
  ('Grocery', 'grocery', '#22A06B'),
  ('Vegetables', 'vegetables', '#A7D56B'),
  ('Fruits', 'fruits', '#A7D56B')
on conflict (slug) do nothing;
