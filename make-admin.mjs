import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "https://myyotzrgcxifshcbxtfk.supabase.co";
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15eW90enJnY3hpZnNoY2J4dGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjAxNTk0MiwiZXhwIjoyMDk3NTkxOTQyfQ.M78qN2D_jcXH_6s6iU30fakqH6RVCrUQyukpd9jUY8U";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  console.log("Fetching users...");
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error("Error fetching users:", error.message);
    process.exit(1);
  }

  if (users.length === 0) {
    console.log("No users found. Please sign up on the site first!");
    process.exit(0);
  }

  console.log(`Found ${users.length} users. Assigning admin role...`);

  for (const user of users) {
    const { error: insertError } = await supabase
      .from("user_roles")
      .upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id, role" });

    if (insertError) {
      console.error(`Failed to assign admin role to ${user.email}:`, insertError.message);
    } else {
      console.log(`Successfully assigned admin role to ${user.email}`);
    }
  }
}

main().catch(console.error);
