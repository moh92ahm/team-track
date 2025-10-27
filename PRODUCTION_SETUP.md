# Production Deployment - Super Admin Setup

## Important: How Migrations Work

### Development (Local)
- ✅ Payload auto-pushes schema changes (no manual migrations needed)
- ✅ Use seed script to create test data: `pnpm run seed`
- ✅ Super admin created via seed for testing

### Production (Vercel)
- ✅ Payload **automatically runs migrations** on first build
- ✅ Super admin created via migration (not seed)
- ✅ No manual migration commands needed

## Quick Setup for Vercel

### 1. Add Environment Variable

In your Vercel dashboard or using CLI:

```bash
# Using Vercel CLI
vercel env add SUPER_ADMIN_PASSWORD production

# Or use a secure Base64 encoded password
echo -n "$(openssl rand -base64 32)" | base64
# Then add the output to Vercel
```

### 2. Deploy to Vercel

Simply push to your git repository:

```bash
git add .
git commit -m "Add super admin migration"
git push
```

Vercel will:
1. ✅ Automatically build your app
2. ✅ Run all migrations (including super admin creation)
3. ✅ Your app is ready to use!

### 3. Login to Admin Panel

After deployment completes:

1. Go to: `https://your-app.vercel.app/admin`
2. Email: `admin@teamtrack.local`
3. Password: Your `SUPER_ADMIN_PASSWORD` value

## Environment Variables Checklist

Make sure these are set in Vercel:

```bash
✅ DATABASE_URI              # Supabase connection string
✅ PAYLOAD_SECRET            # Base64 encoded
✅ CRON_SECRET               # Base64 encoded  
✅ PREVIEW_SECRET            # Base64 encoded
✅ SUPER_ADMIN_PASSWORD      # Your secure password
✅ NEXT_PUBLIC_SERVER_URL    # https://your-app.vercel.app
✅ NEXT_PUBLIC_PAYLOAD_URL   # https://your-app.vercel.app
✅ EMAIL_PROVIDER            # resend, sendgrid, or smtp
✅ RESEND_API_KEY            # If using Resend
```

## How It Works on Vercel

### First Deployment

When you deploy for the first time:

```
1. Vercel builds your Next.js app
2. Payload detects pending migrations
3. Payload runs migrations automatically:
   - Creates all database tables
   - Runs custom migrations (including super admin)
4. Super admin user is created
5. App is ready!
```

### Subsequent Deployments

```
1. Vercel builds your app
2. Payload checks for new migrations
3. Runs only new migrations (if any)
4. App updates
```

## Troubleshooting

### "No migrations to run"

This is normal! It means:
- All migrations have already run
- Your database schema is up to date

### "Super admin already exists"

This is expected on re-deployments. The migration checks and skips if super admin exists.

### Can't login to super admin

1. **Check environment variable:**
   ```bash
   vercel env ls
   ```

2. **Verify it's set for production:**
   ```bash
   vercel env pull .env.vercel
   cat .env.vercel | grep SUPER_ADMIN_PASSWORD
   ```

3. **Reset password via database (if needed):**
   Connect to your Supabase database and run:
   ```sql
   UPDATE users 
   SET password = crypt('NewPassword123!', gen_salt('bf'))
   WHERE email = 'admin@teamtrack.local';
   ```

### Super admin appears in user list

This shouldn't happen if the migration ran correctly. Check:

```bash
# Connect to your Supabase database
psql $DATABASE_URI

# Check the user
SELECT id, email, "isSystemUser" FROM users WHERE email = 'admin@teamtrack.local';
```

It should show `isSystemUser = true`.

## Local Development vs Production

| Feature | Local (Dev) | Production (Vercel) |
|---------|-------------|---------------------|
| Schema Changes | Auto-pushed | Migrations only |
| Super Admin | Via seed script | Via migration |
| Test Data | Via seed script | Not created |
| Migrations | Optional | Automatic |

## Manual Migration (If Needed)

Only use this if you need to run migrations against an existing production database:

```bash
# Pull production environment
vercel env pull .env.production

# Load env vars
export $(cat .env.production | xargs)

# Run migrations
pnpm payload migrate
```

**⚠️ Warning:** This should rarely be needed. Vercel handles migrations automatically.

## Summary

✅ **On Vercel: Deploy and forget!**  
✅ **Migrations run automatically during build**  
✅ **Super admin created on first deployment**  
✅ **No manual commands needed**  

Just make sure:
1. Environment variables are set in Vercel
2. Push your code to git
3. Vercel deploys automatically
4. Login and use your app!

For more details, see:
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Complete deployment guide
- [SUPER_ADMIN_GUIDE.md](./SUPER_ADMIN_GUIDE.md) - Super admin documentation
