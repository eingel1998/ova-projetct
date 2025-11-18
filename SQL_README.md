Setup Supabase database schema

1. Open Supabase Dashboard -> SQL Editor for your project.
2. Copy the SQL in `sql/supabase_schema.sql` and run it.
3. Optionally, run the CLI command:

```bash
# Run this if you installed supabase CLI and authenticated locally
supabase db query < sql/supabase_schema.sql

# Alternatively, run the SQL in the Dashboard SQL Editor: copy paste the file and execute.
```

4. Create an admin user by inserting a profile with role = 'admin' and the `id` equal to the `auth.users.id` of the user.

Example SQL:

```sql
insert into public.profiles (id, email, display_name, role) values ('<user-uuid>', 'admin@example.com', 'Admin', 'admin');
```

5. Test from the app: login with the admin account and navigate to `/admin`.

-- Create admin from script (recommended)

You can create an admin programmatically using a service role key. Create an env var `SUPABASE_SERVICE_ROLE_KEY` from your project's settings (DO NOT share it).

Then run the provided Bun script:

```bash
# set service role key temporarily
export SUPABASE_SERVICE_ROLE_KEY='<service_role_key>'
export ADMIN_EMAIL='admin@example.com'
export ADMIN_PASSWORD='secure-password'
bun run scripts/create-admin.ts
```

This will create an auth user and an entry in `public.profiles` with role `admin`.
