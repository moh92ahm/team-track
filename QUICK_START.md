# 🚀 Quick Deployment Reference

## The Simple Truth

**On Vercel: Just push your code. Everything else is automatic!**

```bash
git add .
git commit -m "Deploy to production"
git push
```

✅ Vercel builds your app  
✅ Migrations run automatically  
✅ Super admin created automatically  
✅ Ready to use!

---

## Environment Variables (Set Once in Vercel)

```bash
# Required
DATABASE_URI=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
PAYLOAD_SECRET=<generate-with-script>
SUPER_ADMIN_PASSWORD=YourSecurePassword123!
NEXT_PUBLIC_SERVER_URL=https://your-app.vercel.app
NEXT_PUBLIC_PAYLOAD_URL=https://your-app.vercel.app

# Email (Resend recommended)
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@yourdomain.com
```

**Generate secrets:**
```bash
./scripts/generate-secrets.sh
```

---

## After First Deployment

1. Visit: `https://your-app.vercel.app/admin`
2. Login:
   - Email: `admin@teamtrack.local`
   - Password: Your `SUPER_ADMIN_PASSWORD`
3. Start using your app!

---

## Development vs Production

| What | Local (Dev) | Vercel (Production) |
|------|-------------|---------------------|
| **Start app** | `pnpm dev` | Automatic on git push |
| **Database changes** | Auto-applied | Migrations run on build |
| **Super admin** | Run `pnpm run seed` | Created automatically |
| **Test data** | Run `pnpm run seed` | Not created (production) |

---

## Common Questions

### ❓ Do I need to run migrations manually?
**No!** Vercel runs them automatically during build.

### ❓ Do I run the seed script on production?
**No!** Seed is for local development only. Super admin is created via migration.

### ❓ What if migrations fail?
Check Vercel build logs. Usually it's a missing environment variable.

### ❓ Can I see migration status?
Yes, check the Vercel deployment logs. Look for:
```
✅ Running migrations...
✅ Super admin created successfully!
```

### ❓ How do I add more users?
After deployment:
1. Login as super admin
2. Go to Users section
3. Create new users through the UI

---

## Troubleshooting

### Build fails on Vercel
1. Check environment variables are set
2. Check Vercel build logs for specific error
3. Ensure `DATABASE_URI` is correct (use port 6543 for Supabase)

### Can't login as super admin
1. Verify `SUPER_ADMIN_PASSWORD` is set in Vercel
2. Check it matches what you're typing
3. Check Vercel logs to confirm super admin was created

### Database connection fails
- Use Supabase **transaction mode** connection string
- Must include port `:6543` and `?pgbouncer=true`
- Example: `postgresql://postgres.xxxxx:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true`

---

## Local Development

```bash
# First time setup
cp .env.example .env
# Edit .env with your local database

# Install dependencies
pnpm install

# Start dev server (auto-applies schema changes)
pnpm dev

# Create test data (includes super admin + Marvel characters)
pnpm run seed

# Visit
open http://localhost:3000
```

---

## Summary

✅ **Production = Zero manual work**
- Set environment variables once
- Push code to git
- Vercel handles everything

✅ **Development = Seed for test data**
- `pnpm dev` for auto-schema updates
- `pnpm run seed` for test data
- Iterate and develop

✅ **Super admin exists in both**
- Production: Created via migration
- Development: Created via seed

---

**Need more details?**
- [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) - How it all works
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Complete guide
- [SUPER_ADMIN_GUIDE.md](./SUPER_ADMIN_GUIDE.md) - Super admin details
