import { createClient } from '@supabase/supabase-js';

const URL = process.env.SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!URL || !SERVICE_ROLE) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars are required');
  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD env vars are required');
  process.exit(1);
}

const supabase = createClient(URL, SERVICE_ROLE);

async function main() {
  try {
    // Check for an existing user by email (admin API - requires service role)
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ perPage: 100 });
    if (listError) throw listError;

    const adminEmail = ADMIN_EMAIL!.toLowerCase();
    let user = listData?.users?.find((u: any) => u.email?.toLowerCase() === adminEmail);

    if (user) {
      console.log('Admin already exists with id', user.id);
      // Ensure confirmed
      await supabase.auth.admin.updateUserById(user.id, { email_confirm: true });
    } else {
      // Create a new user (admin) via admin API
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
      });
      if (userError) throw userError;
      user = userData?.user;
      console.log('User created', user?.id);
    }

    // Upsert profile with role admin
    const { data, error } = await supabase.from('profiles').upsert({ id: user!.id, email: ADMIN_EMAIL, display_name: 'Admin', role: 'admin' }).select();
    if (error) throw error;
    console.log('Profile upserted, role=admin');
  } catch (err) {
    console.error('Failed to create admin', err);
    process.exit(1);
  }
}

main();
