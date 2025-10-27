# Vercel Deployment Quick Start Checklist

Use this checklist to quickly deploy Team Track to Vercel.

## ✅ Pre-Deployment

- [ ] Code committed to GitHub
- [ ] All features tested locally
- [ ] Environment variables documented

## ✅ Supabase Setup

- [ ] Create Supabase project
- [ ] Save database password securely
- [ ] Copy connection string (Transaction mode with port 6543)
- [ ] Format: `postgresql://postgres.xxxxx:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`

## ✅ Generate Secrets

Run the generator script:

```bash
./scripts/generate-secrets.sh
```

Or manually generate:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Save these values:

- [ ] PAYLOAD_SECRET (Base64)
- [ ] CRON_SECRET (Base64)
- [ ] PREVIEW_SECRET (Base64)

## ✅ Email Service Setup

Choose your email provider:

### Option 1: Resend (Recommended)

- [ ] Sign up at https://resend.com
- [ ] Verify domain or use test domain
- [ ] Generate API key
- [ ] Save: `RESEND_API_KEY=re_xxxxx`

### Option 2: SendGrid

- [ ] Sign up at https://sendgrid.com
- [ ] Create API key
- [ ] Save: `SENDGRID_API_KEY=SG.xxxxx`

### Option 3: SMTP

- [ ] Get SMTP credentials
- [ ] Encode password to Base64: `echo -n 'password' | base64`
- [ ] Save SMTP settings

## ✅ Vercel Configuration

### Import Project

- [ ] Go to https://vercel.com/new
- [ ] Import GitHub repository
- [ ] Select project

### Add Environment Variables

Copy and paste these to Vercel (replace with your actual values):

```bash
# Database
DATABASE_URI=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# Secrets
PAYLOAD_SECRET=your_base64_generated_secret
CRON_SECRET=your_base64_generated_secret
PREVIEW_SECRET=your_base64_generated_secret

# URLs (use placeholder first, update after deployment)
NEXT_PUBLIC_SERVER_URL=https://your-app.vercel.app
NEXT_PUBLIC_PAYLOAD_URL=https://your-app.vercel.app

# Email (choose one set)
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=noreply@yourdomain.com
```

- [ ] All environment variables added
- [ ] Values verified (no typos)

## ✅ Deploy

- [ ] Click "Deploy" in Vercel
- [ ] Wait for build to complete
- [ ] Note your deployment URL

## ✅ Post-Deployment

- [ ] Update `NEXT_PUBLIC_SERVER_URL` with actual Vercel URL
- [ ] Update `NEXT_PUBLIC_PAYLOAD_URL` with actual Vercel URL
- [ ] Redeploy application
- [ ] Visit `https://your-app.vercel.app/admin`
- [ ] Create first admin user
- [ ] Test login
- [ ] Test email sending (password reset)
- [ ] Test file upload
- [ ] Verify all features working

## ✅ Optional: Custom Domain

- [ ] Add domain in Vercel settings
- [ ] Update DNS records
- [ ] Update environment variables with new domain
- [ ] Redeploy

## 🆘 Troubleshooting

If something goes wrong:

1. **Check Vercel logs**: Project → Deployments → Click deployment → Logs
2. **Verify database connection**: Check Supabase dashboard
3. **Test email**: Check email provider dashboard
4. **Environment variables**: Verify all are set correctly

## 📚 Documentation

- Full guide: `VERCEL_DEPLOYMENT.md`
- Environment example: `.env.example`

## 🔒 Security Reminders

- ✅ Never commit `.env` files
- ✅ Use Base64 for sensitive values
- ✅ Rotate secrets every 90 days
- ✅ Enable 2FA on Vercel and Supabase
- ✅ Use strong database password
- ✅ Limit API key permissions

---

**Need help?** Check `VERCEL_DEPLOYMENT.md` for detailed instructions.
