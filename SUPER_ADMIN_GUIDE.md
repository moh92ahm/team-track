# Super Admin Setup Guide

This guide explains how the hidden super admin user works in your TeamTrack system.

## Overview

The super admin is a special system user that:
- ✅ Has full access to all features and collections
- ✅ Does NOT appear in the team members list
- ✅ Does NOT count toward user statistics on the dashboard
- ✅ Cannot be accidentally modified or deleted through the UI
- ✅ Is created automatically during database seeding

## Super Admin Details

### Default Credentials

```
Email: admin@teamtrack.local
Password: (Set via SUPER_ADMIN_PASSWORD environment variable)
```

### Environment Variable

Add this to your `.env` file (local and Vercel):

```bash
# Super Admin Password (Base64 encoded recommended)
SUPER_ADMIN_PASSWORD=your-secure-password-here
```

**For Vercel deployment**, encode your password:

```bash
echo -n "YourSecurePassword123!" | base64
```

Then set in Vercel:

```bash
vercel env add SUPER_ADMIN_PASSWORD
# Paste the Base64 encoded password when prompted
```

## How It Works

### 1. Database Schema

The `users` collection includes an `isSystemUser` field:

```typescript
{
  name: 'isSystemUser',
  type: 'checkbox',
  defaultValue: false,
  admin: {
    position: 'sidebar',
    description: 'System users are hidden from regular user listings',
    readOnly: true,
  },
  access: {
    // Only super admins can see this field
    read: ({ req: { user } }) => {
      return user?.email === 'admin@teamtrack.local'
    },
    update: () => false, // Can't be changed via UI
  },
}
```

### 2. Seed Process

The super admin is created **first** during seeding (before any other users):

```typescript
// src/seed/index.ts
export async function seed() {
  const payload = await getPayload({ config: configPromise })

  console.log('🌱 Starting database seeding...')

  // 0. Create Super Admin (first, before everything)
  await seedSuperAdmin(payload)

  // 1. Create Roles and Departments
  await seedRolesAndDepartments(payload)
  
  // 2. Create regular users...
}
```

### 3. Filtering System Users

All user queries automatically filter out system users:

**Users List Page:**
```typescript
const { docs } = await payload.find({
  collection: 'users',
  where: {
    isSystemUser: {
      not_equals: true,
    },
  },
  user,
})
```

**Dashboard Stats:**
```typescript
const allUsers = await payload.find({
  collection: 'users',
  where: {
    isSystemUser: {
      not_equals: true,
    },
  },
  user,
})
```

## Initial Setup

### Local Development

1. **Add environment variable:**
   ```bash
   # .env
   SUPER_ADMIN_PASSWORD=SuperAdmin@2025!Change
   ```

2. **Run migrations and seed:**
   ```bash
   pnpm payload migrate
   pnpm run seed
   ```

3. **Login as super admin:**
   - Navigate to: `http://localhost:3000/admin`
   - Email: `admin@teamtrack.local`
   - Password: Your `SUPER_ADMIN_PASSWORD`

### Production (Vercel)

1. **Set environment variable:**
   ```bash
   # Generate a secure password and encode it
   echo -n "$(openssl rand -base64 32)" | base64
   
   # Add to Vercel
   vercel env add SUPER_ADMIN_PASSWORD production
   ```

2. **Run seed from local against production:**
   ```bash
   # Pull production environment variables
   vercel env pull .env.production
   
   # Load production env and run seed
   export $(cat .env.production | xargs)
   pnpm run seed
   ```

   Or use the API endpoint:
   ```bash
   curl -X POST https://your-app.vercel.app/api/seed \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

3. **Login to admin panel:**
   - Navigate to: `https://your-app.vercel.app/admin`
   - Email: `admin@teamtrack.local`
   - Password: Your `SUPER_ADMIN_PASSWORD` (decoded from Base64)

## Security Best Practices

### 1. Strong Password

Use a long, random password:

```bash
# Generate a secure 32-character password
openssl rand -base64 32
```

### 2. Base64 Encoding (Production)

Always encode your password in production:

```bash
# Encode
echo -n "YourSecurePassword" | base64

# Decode (when you need to login)
echo "WW91clNlY3VyZVBhc3N3b3Jk" | base64 -d
```

### 3. Keep Credentials Secure

- ❌ Never commit credentials to git
- ✅ Store in password manager (1Password, LastPass, etc.)
- ✅ Share only with trusted system administrators
- ✅ Rotate password periodically

### 4. Change Default Password

After first login, change the password:

```bash
# Login to PayloadCMS admin
# Navigate to: Users > System Administrator
# Update password
# Or use the API:

curl -X PATCH https://your-app.vercel.app/api/users/[id] \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"password": "NewSecurePassword123!"}'
```

## Troubleshooting

### Super Admin Appears in User List

Check if the filter is applied in your user queries:

```typescript
where: {
  isSystemUser: {
    not_equals: true,
  },
}
```

### Can't Login as Super Admin

1. Verify the user exists:
   ```bash
   psql $DATABASE_URL -c "SELECT id, email, \"isSystemUser\" FROM users WHERE email = 'admin@teamtrack.local';"
   ```

2. Check environment variable:
   ```bash
   # Local
   echo $SUPER_ADMIN_PASSWORD
   
   # Vercel
   vercel env ls
   ```

3. Reset password via database:
   ```sql
   UPDATE users 
   SET password = crypt('NewPassword123!', gen_salt('bf'))
   WHERE email = 'admin@teamtrack.local';
   ```

### Super Admin Not Created During Seed

Check seed logs:

```bash
pnpm run seed | grep -i "super"
```

You should see:
```
👑 Creating super admin user...
✅ Super admin created successfully!
📧 Email: admin@teamtrack.local
🔑 Password: [your-password]
```

If not, check:
- `src/seed/super-admin.ts` exists
- Import added to `src/seed/index.ts`
- No errors during role creation

## Managing Multiple Admins

If you need multiple system administrators:

### Option 1: Multiple System Users

Create additional system users in the seed file:

```typescript
// src/seed/super-admin.ts
export async function seedSuperAdmin(payload: Payload) {
  const admins = [
    {
      email: 'admin@teamtrack.local',
      fullName: 'System Administrator',
      password: process.env.SUPER_ADMIN_PASSWORD,
    },
    {
      email: 'backup-admin@teamtrack.local',
      fullName: 'Backup Administrator',
      password: process.env.BACKUP_ADMIN_PASSWORD,
    },
  ]

  for (const admin of admins) {
    await payload.create({
      collection: 'users',
      data: {
        ...admin,
        isSystemUser: true,
        // ... other fields
      },
    })
  }
}
```

### Option 2: Regular Admin Users

Create regular admin users (visible in UI) with Super Admin role:

```typescript
// They appear in team members list but have full permissions
await payload.create({
  collection: 'users',
  data: {
    fullName: 'John Doe',
    email: 'john@company.com',
    role: superAdminRoleId,
    isSystemUser: false, // Visible in UI
    // ... other fields
  },
})
```

## API Access

### Login via API

```bash
curl -X POST https://your-app.vercel.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@teamtrack.local",
    "password": "your-password"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "abc123",
    "email": "admin@teamtrack.local",
    "fullName": "System Administrator"
  }
}
```

### Use Token for Authenticated Requests

```bash
curl -X GET https://your-app.vercel.app/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Summary

✅ **Super admin is automatically created during seeding**  
✅ **Hidden from team members list and dashboard stats**  
✅ **Has full access to all features**  
✅ **Password set via environment variable**  
✅ **Cannot be modified via UI**  
✅ **Use for emergency access and system administration**

For more information, see:
- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [Running Migrations](./RUN_MIGRATIONS.md)
- [Seed Data Documentation](./SEED_DATA_DOCUMENTATION.md)
