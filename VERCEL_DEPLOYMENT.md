# Vercel Deployment Guide for Team Track

This guide will help you deploy your Team Track application to Vercel with Supabase PostgreSQL database and email configuration.

## Prerequisites

1. A Vercel account (https://vercel.com)
2. A Supabase account (https://supabase.com)
3. An email service provider (e.g., Resend, SendGrid, or SMTP)

## Step 1: Supabase Database Setup

### 1.1 Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in project details:
   - **Name**: team-track (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Choose according to your needs

### 1.2 Get Database Connection String

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Find the **Connection string** section
3. Select **URI** tab
4. Copy the connection string (format: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:[PORT]/postgres`)
5. Replace `[YOUR-PASSWORD]` with your actual database password

**Important**: For Vercel, you need the **Transaction** mode connection string:

- Change the port from `5432` to `6543`
- Add `?pgbouncer=true&connection_limit=1` at the end
- Final format: `postgresql://postgres.xxxxx:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`

## Step 2: Generate Secure Secrets with Base64

You need to generate secure secrets for your application. Here's how to generate them securely:

### 2.1 Generate Secrets Locally

Run these commands in your terminal:

```bash
# Generate PAYLOAD_SECRET (64 characters recommended)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generate CRON_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generate PREVIEW_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Save these values** - you'll need them for Vercel environment variables.

### 2.2 Alternative: Generate via OpenSSL

```bash
# Generate PAYLOAD_SECRET
openssl rand -base64 32

# Generate CRON_SECRET
openssl rand -base64 32

# Generate PREVIEW_SECRET
openssl rand -base64 32
```

## Step 3: Configure Email Service

### Option A: Resend (Recommended)

1. Sign up at https://resend.com
2. Verify your domain or use their test domain
3. Generate an API key from dashboard
4. Note down the API key (starts with `re_`)

### Option B: SendGrid

1. Sign up at https://sendgrid.com
2. Create an API key with Mail Send permissions
3. Note down the API key (starts with `SG.`)

### Option C: Custom SMTP

Use your own SMTP server (Gmail, Outlook, etc.)

## Step 4: Vercel Environment Variables

### 4.1 Push to GitHub

1. Make sure your code is committed to a Git repository
2. Push to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 4.2 Import Project to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Click "Import"

### 4.3 Configure Environment Variables

In Vercel project settings → **Environment Variables**, add these:

#### Database Configuration

```
DATABASE_URI=postgresql://postgres.xxxxx:[YOUR_SUPABASE_PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

#### Application Secrets (use Base64 generated values)

```
PAYLOAD_SECRET=your_base64_generated_payload_secret_here
CRON_SECRET=your_base64_generated_cron_secret_here
PREVIEW_SECRET=your_base64_generated_preview_secret_here
```

#### Public URLs (replace with your actual domain)

```
NEXT_PUBLIC_SERVER_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_PAYLOAD_URL=https://your-app-name.vercel.app
```

#### Email Configuration (Choose one)

**For Resend:**

```
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
```

**For SendGrid:**

```
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
```

**For SMTP:**

```
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your_base64_encoded_app_password
SMTP_SECURE=false
EMAIL_FROM=your-email@gmail.com
```

## Step 5: Update .env.example

Update your `.env.example` file to reflect the new required variables:

```bash
# Database Configuration
DATABASE_URI=postgresql://user:password@host:port/database

# Application Secrets (Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
PAYLOAD_SECRET=your_secret_here
CRON_SECRET=your_cron_secret_here
PREVIEW_SECRET=your_preview_secret_here

# Public URLs
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000

# Email Configuration (Choose one provider)
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com

# OR for SendGrid
# EMAIL_PROVIDER=sendgrid
# SENDGRID_API_KEY=your_sendgrid_api_key
# EMAIL_FROM=noreply@yourdomain.com

# OR for SMTP
# EMAIL_PROVIDER=smtp
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your_base64_encoded_password
# SMTP_SECURE=false
# EMAIL_FROM=your-email@gmail.com
```

## Step 6: Deploy

### 6.1 Initial Deployment

1. After adding environment variables in Vercel, click **Deploy**
2. Wait for the build to complete
3. Vercel will provide you with a deployment URL

### 6.2 Update Public URLs

1. Copy your Vercel deployment URL (e.g., `https://team-track.vercel.app`)
2. Go back to **Environment Variables**
3. Update these variables:
   ```
   NEXT_PUBLIC_SERVER_URL=https://your-actual-url.vercel.app
   NEXT_PUBLIC_PAYLOAD_URL=https://your-actual-url.vercel.app
   ```
4. **Redeploy** the application

## Step 7: Run Database Migrations

After first deployment, you need to run migrations:

### Option A: Via Vercel CLI (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link`
4. Run migrations:

```bash
vercel env pull .env.production
pnpm payload migrate
```

### Option B: Via Payload Admin Panel

1. Navigate to `https://your-app.vercel.app/admin`
2. You might be prompted to run migrations
3. Follow the on-screen instructions

## Step 8: Create Initial Admin User

1. Navigate to `https://your-app.vercel.app/admin`
2. Create your first admin user
3. Log in and configure your application

## Step 9: Post-Deployment Checklist

- [ ] Database connection working
- [ ] Admin panel accessible at `/admin`
- [ ] Email sending working (test with password reset)
- [ ] File uploads working (test document upload)
- [ ] Environment variables correctly set
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Vercel)

## Security Best Practices

### 1. Rotate Secrets Regularly

- Change `PAYLOAD_SECRET` every 90 days
- Update in Vercel environment variables
- Redeploy application

### 2. Database Security

- Never expose database credentials in code
- Use Supabase Row Level Security (RLS) if needed
- Enable database backups in Supabase

### 3. Email Security

- Use environment variables for API keys
- Enable SPF/DKIM records for your domain
- Monitor email sending limits

### 4. Base64 Encoding for Passwords

If you need to store passwords in Base64 (like SMTP password):

```bash
# Encode
echo -n 'your_password' | base64

# Decode (for verification)
echo 'encoded_string' | base64 -d
```

## Troubleshooting

### Database Connection Issues

- Verify connection string format includes `?pgbouncer=true&connection_limit=1`
- Check if Supabase project is active
- Verify password is URL-encoded if it contains special characters

### Build Failures

- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure `package.json` scripts are correct

### Email Not Sending

- Verify API keys are correct
- Check email provider dashboard for errors
- Test with a simple email send endpoint

### Public URL Issues

- Make sure `NEXT_PUBLIC_*` variables are set before build
- Redeploy after changing public environment variables
- Clear browser cache

## Monitoring and Maintenance

### 1. Vercel Analytics

Enable Vercel Analytics in project settings for performance monitoring

### 2. Supabase Monitoring

- Monitor database performance in Supabase dashboard
- Check connection pool usage
- Set up alerts for high resource usage

### 3. Error Tracking

Consider integrating Sentry or similar for error tracking:

```bash
npm install @sentry/nextjs
```

## Custom Domain (Optional)

1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update environment variables with new domain
5. Redeploy

## Continuous Deployment

Vercel automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically build and deploy your changes.

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PayloadCMS Deployment](https://payloadcms.com/docs/production/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review Supabase database logs
3. Check this project's GitHub issues
4. Contact support for respective services

---

**Last Updated**: October 27, 2025
