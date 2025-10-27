# Vercel CLI Commands Reference

Quick reference for common Vercel CLI commands during deployment.

## Installation

```bash
npm install -g vercel
```

## Authentication

```bash
# Login to Vercel
vercel login

# Logout
vercel logout

# Check current user
vercel whoami
```

## Project Setup

```bash
# Link local directory to Vercel project
vercel link

# Pull environment variables from Vercel
vercel env pull .env.production

# Add environment variable
vercel env add VARIABLE_NAME

# Remove environment variable
vercel env rm VARIABLE_NAME

# List all environment variables
vercel env ls
```

## Deployment

```bash
# Deploy to production
vercel --prod

# Deploy to preview (development)
vercel

# Deploy with specific environment
vercel --env production

# Deploy and skip build cache
vercel --prod --force
```

## Project Management

```bash
# List your projects
vercel ls

# Remove a deployment
vercel rm [deployment-url]

# View project details
vercel inspect [deployment-url]

# View deployment logs
vercel logs [deployment-url]
```

## Domain Management

```bash
# Add a domain
vercel domains add yourdomain.com

# List domains
vercel domains ls

# Remove a domain
vercel domains rm yourdomain.com
```

## Useful Deployment Workflows

### Initial Setup and Deploy

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Link project (run in project directory)
cd /path/to/team-track
vercel link

# 4. Deploy to production
vercel --prod
```

### Update Environment Variables

```bash
# 1. Pull current variables
vercel env pull .env.production

# 2. Edit variables in Vercel dashboard or via CLI
vercel env add DATABASE_URI production

# 3. Redeploy to apply changes
vercel --prod
```

### Continuous Deployment (Recommended)

Just push to GitHub - Vercel will auto-deploy:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Run Migrations

```bash
# Pull production environment variables
vercel env pull .env.production

# Run migrations locally against production database
pnpm payload migrate

# Or create a migration
pnpm payload migrate:create
```

### Check Deployment Status

```bash
# View recent deployments
vercel ls

# View logs for specific deployment
vercel logs [deployment-url]

# View logs in real-time
vercel logs [deployment-url] --follow
```

## Troubleshooting Commands

### Check Build Logs

```bash
# View deployment logs
vercel logs [deployment-url]

# View build logs for latest deployment
vercel logs --follow
```

### Test Environment Variables

```bash
# Pull and check environment variables
vercel env pull .env.production
cat .env.production
```

### Rollback Deployment

```bash
# List deployments
vercel ls

# Promote a previous deployment to production
vercel promote [deployment-url]
```

### Clear Build Cache

```bash
# Force rebuild without cache
vercel --prod --force
```

## Configuration Files

### vercel.json (Optional)

Create in project root for custom configuration:

```json
{
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_SERVER_URL": "@next-public-server-url",
    "DATABASE_URI": "@database-uri"
  }
}
```

## Environment Variable Scopes

```bash
# Production only
vercel env add VARIABLE_NAME production

# Preview only
vercel env add VARIABLE_NAME preview

# Development only
vercel env add VARIABLE_NAME development

# All environments
vercel env add VARIABLE_NAME production preview development
```

## Common Workflows

### Deploy New Feature

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to create preview deployment
git push origin feature/new-feature

# Vercel automatically creates preview deployment
# Test the preview URL

# Merge to main for production
git checkout main
git merge feature/new-feature
git push origin main
```

### Emergency Rollback

```bash
# 1. List recent deployments
vercel ls

# 2. Find the last working deployment URL
# 3. Promote it to production
vercel promote [previous-deployment-url]
```

### Update Domain

```bash
# Add new domain
vercel domains add new-domain.com

# Update DNS (follow Vercel instructions)

# Remove old domain (optional)
vercel domains rm old-domain.com

# Update environment variables
vercel env add NEXT_PUBLIC_SERVER_URL production
# Enter: https://new-domain.com

# Redeploy
vercel --prod
```

## Tips and Best Practices

1. **Always test in preview first**: Push to a branch to get preview deployment
2. **Use automatic deployments**: Let Vercel deploy on git push
3. **Monitor build times**: Check if you need to optimize build process
4. **Set up notifications**: Configure Slack/Discord/Email notifications in Vercel
5. **Use production branch**: Keep main/master for production only
6. **Regular backups**: Export database regularly from Supabase
7. **Monitor usage**: Check Vercel dashboard for bandwidth and function usage

## Resources

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Vercel Platform Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)

---

**Quick Help**: Run `vercel help` or `vercel [command] --help` for more info
