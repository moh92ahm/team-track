# Team Track - Employee Management System

A comprehensive employee management system built with Next.js 15, PayloadCMS 3.x, and PostgreSQL.

## Features

- 👥 **User Management**: Complete employee profiles with departments, roles, and documents
- 📊 **Payroll System**: Automated payroll generation, additional payments, and adjustments
- 📦 **Inventory Management**: Track company assets, assignments, and status
- 🏖️ **Leave Management**: Handle leave requests, approvals, and tracking
- 🔐 **RBAC**: Role-based access control with granular permissions
- 📱 **Responsive Design**: Mobile-friendly interface with drawer navigation
- 🎨 **Modern UI**: Built with Shadcn UI components and Tailwind CSS

## Quick Start - Local Development

To spin up this template locally, follow these steps:

### Clone

After you click the `Deploy` button above, you'll want to have standalone copy of this repo on your machine. If you've already cloned this repo, skip to [Development](#development).

### Development

1. First [clone the repo](#clone) if you have not done so already
2. `cd my-project && cp .env.example .env` to copy the example environment variables. You'll need to add the `MONGODB_URI` from your Cloud project to your `.env` if you want to use S3 storage and the MongoDB database that was created for you.

3. `pnpm install && pnpm dev` to install dependencies and start the dev server
4. open `http://localhost:3000` to open the app in your browser

That's it! Changes made in `./src` will be reflected in your app. Follow the on-screen instructions to login and create your first admin user. Then check out [Production](#production) once you're ready to build and serve your app, and [Deployment](#deployment) when you're ready to go live.

#### Docker (Optional)

If you prefer to use Docker for local development instead of a local MongoDB instance, the provided docker-compose.yml file can be used.

To do so, follow these steps:

- Modify the `MONGODB_URI` in your `.env` file to `mongodb://127.0.0.1/<dbname>`
- Modify the `docker-compose.yml` file's `MONGODB_URI` to match the above `<dbname>`
- Run `docker-compose up` to start the database, optionally pass `-d` to run in the background.

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this template locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root
1. Next run `docker-compose up`
1. Follow [steps 4 and 5 from above](#development) to login and create your first admin user

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

## 🚀 Production Deployment

### Deploy to Vercel with Supabase (Automatic)

This project is configured for **zero-config deployment** to Vercel with automatic migrations!

#### Quick Deploy (3 Steps)

1. **Setup Supabase**: Create a project and get your database connection string

2. **Configure Vercel**: Add environment variables (see below)

3. **Deploy**: Push to GitHub - Vercel auto-deploys and runs migrations!

   ```bash
   git push
   ```
   
   That's it! ✅ Migrations run automatically  
   ✅ Super admin created automatically  
   ✅ App ready to use!

#### Environment Variables

Set these in your Vercel dashboard:

```bash
DATABASE_URI=postgresql://...         # Supabase connection string  
PAYLOAD_SECRET=<base64-secret>       # Generate with ./scripts/generate-secrets.sh
SUPER_ADMIN_PASSWORD=YourPassword123 # Your super admin password
NEXT_PUBLIC_SERVER_URL=https://your-app.vercel.app
# + Email provider settings (Resend recommended)
```

#### Detailed Guides

- 🚀 **[Production Setup](./PRODUCTION_SETUP.md)** - **Start here!** How deployment works
- 📖 **[Complete Deployment Guide](./VERCEL_DEPLOYMENT.md)** - Comprehensive step-by-step instructions
- ✅ **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Quick checklist for deployment
- 💻 **[Vercel CLI Reference](./VERCEL_CLI_REFERENCE.md)** - Command-line tools and workflows

#### Environment Variables

See [`.env.example`](./.env.example) for all required environment variables. Key variables include:

- `DATABASE_URI`: PostgreSQL connection string (Supabase)
- `PAYLOAD_SECRET`: Base64-encoded secret for PayloadCMS
- `NEXT_PUBLIC_SERVER_URL`: Your application URL
- Email configuration (Resend, SendGrid, or SMTP)

For security, all secrets should be generated using Base64 encoding:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📚 Documentation

- 🚀 **[Quick Start Guide](./QUICK_START.md)** - **Start here!** Fast reference for deployment
- 📋 **[Production Setup](./PRODUCTION_SETUP.md)** - How deployment & migrations work
- [RBAC Documentation](./RBAC_DOCUMENTATION.md) - Role-based access control
- [Seed Data Documentation](./SEED_DATA_DOCUMENTATION.md) - Initial data setup
- [Department Structure](./DEPARTMENT_STRUCTURE.md) - Organization structure
- [Payroll Components](./PAYROLL_COMPONENTS_UPDATE.md) - Payroll system details
- [Super Admin Guide](./SUPER_ADMIN_GUIDE.md) - Hidden administrator setup
- [Run Migrations](./RUN_MIGRATIONS.md) - Database migration instructions

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.4 with App Router
- **CMS**: PayloadCMS 3.x
- **Database**: PostgreSQL (local or Supabase)
- **UI**: Shadcn UI + Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Authentication**: PayloadCMS built-in auth
- **Deployment**: Vercel (recommended)

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
