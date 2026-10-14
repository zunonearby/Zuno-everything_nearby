-- =====================================================================
-- ZUNO — Notifications Center RLS & Triggers Migration
-- Migration 00000000000008
-- =====================================================================

-- Add type & metadata columns to notifications table if missing
alter table notifications add column if not exists type text not null default 'ORDER_UPDATE';
alter table notifications add column if not exists metadata jsonb default '{}'::jsonb;

-- Customer RLS Policies for notifications table
drop policy if exists "notifications_select_own" on notifications;
create policy "notifications_select_own" on notifications
  for select using (auth.uid() = user_id);

drop policy if exists "notifications_update_own" on notifications;
create policy "notifications_update_own" on notifications
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Enable Supabase Realtime for notifications table
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table notifications;
  end if;
end $$;

-- Automated database trigger function: insert notification on order status change
create or replace function notify_on_order_status_change()
returns trigger as $$
declare
  notif_title text;
  notif_body text;
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

  insert into notifications (user_id, title, body, read, type, metadata)
  values (
    NEW.customer_id,
    notif_title,
    notif_body,
    false,
    'ORDER_UPDATE',
    jsonb_build_object('order_id', NEW.id, 'status', NEW.status)
  );

  return NEW;
end;
$$ language plpgsql security definer;

-- Create trigger on orders table
drop trigger if exists trigger_notify_order_status on orders;
create trigger trigger_notify_order_status
  after insert or update of status on orders
  for each row
  execute function notify_on_order_status_change();
