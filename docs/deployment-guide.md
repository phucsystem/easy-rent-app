# Deployment Guide

**Last Updated:** 2025-12-26
**Version:** 0.1.0
**Status:** Phase 1 Complete

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Supabase Setup](#supabase-setup)
- [Vercel Deployment](#vercel-deployment)
- [Alternative Deployment](#alternative-deployment)
- [Post-Deployment](#post-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## Overview

This guide covers deploying Easy Rent to production using **Vercel** (recommended) and **Supabase** for the backend.

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel (Hosting)                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Next.js Application (Server Components)        │   │
│  │  - Edge Network                                  │   │
│  │  - Automatic HTTPS                               │   │
│  │  - Zero-downtime deploys                          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↓ API Calls
┌─────────────────────────────────────────────────────────┐
│                    Supabase (Backend)                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database                            │   │
│  │  - RLS policies                                  │   │
│  │  - Automatic backups                             │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Supabase Auth                                   │   │
│  │  - JWT sessions                                  │   │
│  │  - OAuth providers                               │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

### Required Accounts

1. **Vercel Account**
   - Sign up at https://vercel.com
   - Connect GitHub account

2. **Supabase Account**
   - Sign up at https://supabase.com
   - Create a new project

### Required Tools

- **Node.js** 18+ installed locally
- **Git** for version control
- **GitHub** account (for Vercel integration)

## Environment Setup

### 1. Clone Repository

```bash
git clone <your-repository-url>
cd easy-rent-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

```bash
cp .env.example .env.local
```

## Supabase Setup

### 1. Create Project

1. Go to https://supabase.com
2. Click **"New Project"**
3. Configure:
   - **Organization**: Select or create
   - **Name**: `easy-rent-production` (or similar)
   - **Database Password**: Use a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., Singapore for Vietnam)
4. Click **"Create new project"**
5. Wait for project to be provisioned (~2 minutes)

### 2. Get Credentials

Navigate to your Supabase project → **Settings** → **API**:

```
Project URL: https://xxxxx.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Update .env.local

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Create Database Tables

Go to **SQL Editor** in Supabase and run:

```sql
-- Tenants table
CREATE TABLE tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  id_number TEXT,
  address TEXT,
  date_of_birth DATE,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contract templates table
CREATE TABLE contract_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contracts table
CREATE TABLE contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES contract_templates(id) ON DELETE CASCADE,
  tenant_snapshot JSONB NOT NULL,
  template_snapshot JSONB NOT NULL,
  generated_content TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_tenants_updated_at
BEFORE UPDATE ON tenants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_contract_templates_updated_at
BEFORE UPDATE ON contract_templates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

### 5. Enable Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Tenants policies
CREATE POLICY "Users can view their own tenants"
ON tenants FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tenants"
ON tenants FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tenants"
ON tenants FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tenants"
ON tenants FOR DELETE
USING (auth.uid() = user_id);

-- Contract templates policies
CREATE POLICY "Users can view their own templates"
ON contract_templates FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own templates"
ON contract_templates FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
ON contract_templates FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
ON contract_templates FOR DELETE
USING (auth.uid() = user_id);

-- Contracts policies
CREATE POLICY "Users can view their own contracts"
ON contracts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contracts"
ON contracts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contracts"
ON contracts FOR DELETE
USING (auth.uid() = user_id);
```

### 6. Generate TypeScript Types

1. Install Supabase CLI (if not installed):
   ```bash
   # macOS
   brew install supabase/tap/supabase

   # Or with npm
   npm install -g supabase
   ```

2. Generate types:
   ```bash
   supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
   ```

Or use the Supabase dashboard → **API** → **TypeScript** → **Copy** and paste into `src/types/database.ts`.

## Vercel Deployment

### 1. Deploy to Vercel

**Option A: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: easy-rent-app
# - Directory: . (current)
# - Override settings? No
```

**Option B: Via Vercel Dashboard**

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Click **Deploy**

### 2. Add Environment Variables in Vercel

1. Go to your project in Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | Your Vercel domain (e.g., `https://easy-rent-app.vercel.app`) | Production, Preview |

### 3. Redeploy

After adding environment variables:

1. Go to **Deployments**
2. Click **...** on latest deployment
3. Click **Redeploy**

### 4. Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your domain (e.g., `easyrent.vn`)
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

## Alternative Deployment

### Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

4. **Configure**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Framework: Next.js

### Self-Hosted (Docker)

**Dockerfile**:
```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
```

**Deploy**:
```bash
docker-compose up -d
```

## Post-Deployment

### 1. Verify Deployment

1. **Visit your URL**: Open `https://your-domain.com`
2. **Check console**: No errors
3. **Test auth flow**: Create account, login
4. **Test database**: Create tenant, view list

### 2. Set Up Monitoring

**Vercel Analytics** (included):
1. Go to **Analytics** tab
2. Enable Web Vitals
3. Monitor performance

**Supabase Logs**:
1. Go to Supabase dashboard
2. **Logs** → **Database** or **API**
3. Monitor queries and errors

### 3. Configure Email (Supabase Auth)

1. Go to Supabase → **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://your-domain.com`
3. Set **Redirect URLs**: `https://your-domain.com/auth/callback`

4. Go to **Email Templates** → **Confirm Signup**
5. Customize email template (Vietnamese/English)

### 4. Enable Supabase Auth

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure:
   - Enable email confirmations: **Yes** (recommended)
   - Double opt-in: **Yes** (recommended)
   - SMTP: Use default Supabase SMTP or configure custom

## Monitoring & Maintenance

### Performance Monitoring

**Vercel**:
- Web Vitals (LCP, FID, CLS)
- Build times
- Edge function logs

**Supabase**:
- Database query performance
- API response times
- Database size

### Database Maintenance

**Regular Backups** (Supabase handles this):
- Daily backups included
- Point-in-time recovery (Pro plan)

**Index Optimization** (as needed):
```sql
-- Example: Add index for faster tenant search
CREATE INDEX idx_tenants_user_id ON tenants(user_id);
CREATE INDEX idx_tenants_full_name ON tenants USING gin(to_tsvector('english', full_name));
```

**Database Size Monitoring**:
```sql
-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Log Management

**Vercel Logs**:
- Real-time logs in dashboard
- Download logs for analysis
- Set up log drains (external logging)

**Supabase Logs**:
- API logs
- Database logs
- Auth logs

### Security Best Practices

1. **Regular Updates**:
   ```bash
   npm audit
   npm update
   ```

2. **Environment Variable Rotation**:
   - Rotate Supabase keys periodically
   - Use different keys for staging/production

3. **RLS Review**:
   - Regularly audit RLS policies
   - Test with different user roles

4. **Rate Limiting** (Supabase):
   - Configure rate limits in dashboard
   - Monitor API usage

## Troubleshooting

### Common Issues

#### 1. Build Failures

**Error**: `Cannot find module 'xxx'`

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 2. Environment Variables Not Working

**Error**: `SUPABASE_URL is not defined`

**Solution**:
- Verify variable names (no spaces)
- Redeploy after adding variables
- Check for typos in variable names

#### 3. Supabase Connection Refused

**Error**: `Failed to fetch`

**Solution**:
- Check RLS policies
- Verify Supabase URL and key
- Check Supabase project status (not paused)

#### 4. i18n Not Working

**Error**: Default locale not applied

**Solution**:
- Check middleware configuration
- Verify `src/i18n.ts` setup
- Check locale files exist

#### 5. Authentication Failing

**Error**: Session not created

**Solution**:
- Check email confirmation settings
- Verify redirect URLs in Supabase
- Check site URL configuration

### Debug Mode

**Vercel**:
```bash
vercel logs --follow
```

**Supabase**:
- Enable debug mode in console
- Check network tab in browser DevTools

### Getting Help

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Issues**: Create issue in repository

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables set
- [ ] Database tables created
- [ ] RLS policies enabled
- [ ] TypeScript types generated
- [ ] Build succeeds locally
- [ ] Linting passes
- [ ] No sensitive data in code

### Deployment
- [ ] Repository pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] Custom domain configured (if needed)

### Post-Deployment
- [ ] Application loads in browser
- [ ] Auth flow works
- [ ] Database operations work
- [ ] i18n works (vi/en)
- [ ] No console errors
- [ ] Monitoring configured
- [ ] Backup strategy confirmed
- [ ] Documentation updated

## Related Documentation

- [Project Overview & PDR](./project-overview-pdr.md)
- [Code Standards](./code-standards.md)
- [System Architecture](./system-architecture.md)
- [Codebase Summary](./codebase-summary.md)

## Change Log

### 2025-12-26 - Initial Documentation
- Created deployment guide
- Documented Vercel + Supabase setup
- Added troubleshooting section
- Created deployment checklist
