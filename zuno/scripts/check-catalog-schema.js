const SUPABASE_URL = 'https://mwcvagktpvlzorojdsxg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13Y3ZhZ2t0cHZsem9yb2pkc3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2ODk4MDYsImV4cCI6MjEwNjI2NTgwNn0.KmkVlqAY8QmQItwU-JFbWzsFoHGjOtuef4jCVpDiAlY';

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

async function query(table, select = '*') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(select)}`, { headers });
  if (!res.ok) {
    const text = await res.text();
    return { error: `${res.status} ${text}` };
  }
  return { data: await res.json() };
}

async function check() {
  console.log('--- CATEGORIES ---');
  const cat = await query('categories', '*');
  console.log('Categories count:', cat.data ? cat.data.length : cat.error);
  if (cat.data) console.log(JSON.stringify(cat.data, null, 2));

  console.log('\n--- PRODUCTS ---');
  const prod = await query('products', 'id,name,description,unit,image_url,category_id,categories(name)');
  console.log('Products count:', prod.data ? prod.data.length : prod.error);
  if (prod.data) console.log(JSON.stringify(prod.data.slice(0, 10), null, 2));

  console.log('\n--- SHOPS ---');
  const shops = await query('shops', 'id,name,description,is_approved,is_active,phone');
  console.log('Shops count:', shops.data ? shops.data.length : shops.error);
  if (shops.data) console.log(JSON.stringify(shops.data, null, 2));

  console.log('\n--- SHOP_PRODUCTS ---');
  const sp = await query('shop_products', 'id,shop_id,product_id,price,stock,available');
  console.log('Shop products count:', sp.data ? sp.data.length : sp.error);
  if (sp.data) console.log(JSON.stringify(sp.data.slice(0, 5), null, 2));

  console.log('\n--- STORAGE BUCKETS ---');
  const bRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, { headers });
  console.log('Buckets status:', bRes.status, await bRes.text());
}

check();
