import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://mwcvagktpvlzorojdsxg.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13Y3ZhZ2t0cHZsem9yb2pkc3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2ODk4MDYsImV4cCI6MjEwNjI2NTgwNn0.KmkVlqAY8QmQItwU-JFbWzsFoHGjOtuef4jCVpDiAlY";

const safeStorage = {
  getItem: async (key: string) => {
    try {
      const item = await AsyncStorage.getItem(key);
      if (!item || item.trim() === "" || item === "undefined" || item === "null") {
        return null;
      }
      try {
        JSON.parse(item);
        return item;
      } catch {
        await AsyncStorage.removeItem(key).catch(() => {});
        return null;
      }
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (!value || value === "undefined") {
        await AsyncStorage.removeItem(key);
        return;
      }
      await AsyncStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

const customFetch: typeof fetch = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const cloned = response.clone();
    const text = await cloned.text().catch(() => "");
    if (!text || text.trim().length === 0) {
      return new Response(JSON.stringify(response.ok ? [] : null), {
        status: response.status,
        statusText: response.statusText,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      JSON.parse(text);
    } catch {
      return new Response(
        JSON.stringify(response.ok ? [] : { message: "Invalid JSON response from server" }),
        {
          status: response.status,
          statusText: response.statusText,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return response;
  } catch (err) {
    return new Response(
      JSON.stringify({ data: null, error: { message: "Network unavailable" } }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: safeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    fetch: customFetch,
  },
});
