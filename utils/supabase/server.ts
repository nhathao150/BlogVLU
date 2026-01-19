import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

export const createClient = async () => {
  // 1. Lấy user hiện tại từ Clerk
  const { getToken } = await auth();
  
  // 2. Lấy Token đặc biệt để gửi sang Supabase
  const token = await getToken({ template: 'supabase' });

  // 3. Khởi tạo Supabase Client
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    }
  );
};