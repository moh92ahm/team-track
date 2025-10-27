# Running Database Migrations on Vercel

When you first deploy to Vercel, the database is empty and needs to be initialized with tables and schema.

## The Error You're Seeing

```
error: relation "users" does not exist
```

This means the database tables haven't been created yet.

## Solution: Run Migrations

### Step 1: Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Link Your Project

Navigate to your project directory and link it:

```bash
cd /home/bullseye/Desktop/team-track
vercel link
```

Follow the prompts to link to your deployed project.

### Step 4: Pull Production Environment Variables

```bash
vercel env pull .env.production
```

This will download your production environment variables (including DATABASE_URI) to a local file.

### Step 5: Run Migrations

Now run the PayloadCMS migrations against your production database:

```bash
# Make sure you're using the production environment
pnpm payload migrate
```

**Alternative**: If you want to be explicit about using production env:

```bash
# Use the production database URI directly
DATABASE_URI="your_production_database_uri" pnpm payload migrate
```

### Step 6: Verify Migration

After running migrations, you should see output like:

```
✓ Migrated batch 1
✓ Created users table
✓ Created departments table
✓ Created roles table
... (more tables)
✓ Migrations completed successfully
```

### Step 7: Visit Your App

Now go back to your Vercel URL:
```
https://your-app.vercel.app/admin/create-first-user
```

You should now be able to create your first admin user!

## Alternative: Use Payload Admin Panel (If Accessible)

If you can access the admin panel at all, Payload might prompt you to run migrations automatically. However, since you're getting the error on the create-first-user page, you'll need to run migrations manually first.

## Option 2: Create Migration Endpoint (Advanced)

You can create a protected API endpoint to run migrations:

### Create `/src/app/api/migrate/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  // Verify secret token
  const token = request.headers.get('x-migration-token')
  
  if (token !== process.env.MIGRATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    
    // Run migrations
    await payload.db.migrate()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Migrations completed successfully' 
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
```

### Add to Vercel Environment Variables:
```
MIGRATION_SECRET=your_secure_random_token_here
```

### Call the endpoint:
```bash
curl -X POST https://your-app.vercel.app/api/migrate \
  -H "x-migration-token: your_secure_random_token_here"
```

## Option 3: Run Migrations from Vercel Build

You can add a build script that runs migrations automatically. However, this is **NOT recommended** for production as it can cause issues with multiple builds running simultaneously.

### Modify `package.json`:

```json
{
  "scripts": {
    "build": "next build && pnpm payload migrate",
    ...
  }
}
```

⚠️ **Warning**: This approach can be problematic if you have multiple builds running or need more control over when migrations run.

## Recommended Approach

**Use Option 1** (Vercel CLI) for the most control and safety:

1. Pull production environment variables locally
2. Run migrations against production database from your local machine
3. Verify migrations completed successfully
4. Access your app

## Troubleshooting

### Error: "Connection refused"

Make sure your DATABASE_URI in production is correct and the Supabase database is accessible.

### Error: "Multiple migrations pending"

This is normal for first run. The command will run all pending migrations in order.

### Error: "Cannot connect to database"

Check:
1. DATABASE_URI is correctly set in Vercel
2. Supabase project is active
3. Database password is correct
4. You're using the Transaction mode connection string (port 6543)

### Want to reset the database?

⚠️ **DANGER**: This will delete all data!

```bash
# Drop all tables (use with caution)
pnpm payload migrate:reset

# Then run migrations again
pnpm payload migrate
```

## Quick Commands Reference

```bash
# Pull production environment
vercel env pull .env.production

# Run migrations
pnpm payload migrate

# Create a new migration
pnpm payload migrate:create

# Check migration status
pnpm payload migrate:status

# Rollback last migration (use with caution)
pnpm payload migrate:down
```

## After Migrations Are Complete

Once migrations are successfully run:

1. ✅ Visit `/admin/create-first-user`
2. ✅ Create your admin account
3. ✅ Login to the system
4. ✅ Start using your app!

---

**Need help?** Check the [Vercel CLI Reference](./VERCEL_CLI_REFERENCE.md) or [Deployment Guide](./VERCEL_DEPLOYMENT.md)
