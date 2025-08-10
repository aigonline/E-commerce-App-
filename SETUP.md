# 🔧 Development Setup Guide

This guide will help you set up the complete BidBay e-commerce auction platform with all backend functionality.

## 📋 Prerequisites Checklist

- [ ] Node.js 20+ installed
- [ ] Git installed
- [ ] GitHub account
- [ ] Supabase account (free tier)
- [ ] Vercel account (free tier)

## 🚀 Step-by-Step Setup

### 1. Project Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/E-commerce-App-.git
cd E-commerce-App-

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 2. Supabase Backend Setup

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and set project name: `bidbay-ecommerce`
4. Set password and region
5. Wait for project creation (2-3 minutes)

#### Configure Database
1. Go to **SQL Editor** in Supabase dashboard
2. Copy and paste contents from `scripts/schema.sql`
3. Click **Run** to create all tables and policies
4. Copy and paste contents from `scripts/seed.sql`
5. Click **Run** to insert sample data

#### Setup Storage
1. Go to **Storage** > **Buckets**
2. Create bucket: `products` (Public)
3. Create bucket: `avatars` (Public)
4. Configure policies (included in seed.sql)

#### Get API Keys
1. Go to **Settings** > **API**
2. Copy `Project URL` and `anon public` key
3. Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Test Local Development

```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
# You should see the homepage with demo data
```

#### Test Core Features
- [ ] Homepage loads with featured auctions
- [ ] Product browsing works
- [ ] Category navigation functions
- [ ] Search and filters work
- [ ] Sign up/login functionality
- [ ] Product creation (/sell page)
- [ ] Bidding system
- [ ] Watchlist functionality

### 4. Production Deployment

#### Vercel Setup
1. Go to [vercel.com](https://vercel.com)
2. Connect GitHub account
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

#### GitHub Actions CI/CD
1. Go to repository **Settings** > **Secrets and variables** > **Actions**
2. Add repository secrets:
   - `VERCEL_ORG_ID` (from Vercel dashboard)
   - `VERCEL_PROJECT_ID` (from Vercel dashboard)
   - `VERCEL_TOKEN` (from Vercel settings)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Optional: Custom Domain

#### In Vercel Dashboard
1. Go to **Domains**
2. Add your domain
3. Configure DNS records as shown

#### Update Environment
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🔍 Testing Your Setup

### Authentication Flow
1. Visit `/auth/register`
2. Create a new account
3. Check email for confirmation
4. Sign in at `/auth/login`

### Product Management
1. Go to `/sell`
2. Create a new product listing
3. Upload images (tests storage)
4. Submit listing

### Bidding System
1. Browse to a product with auctions
2. Place a bid (tests real-time updates)
3. Check bid history

### Profile Features
1. Visit `/profile`
2. Update profile information
3. Check listings, bids, watchlist

## 🛠️ Troubleshooting

### Common Issues

#### "Supabase not configured" errors
- Check `.env.local` file exists
- Verify environment variable names
- Restart development server

#### Database connection errors
- Verify Supabase project is running
- Check API keys are correct
- Ensure database schema is created

#### Authentication issues
- Check email confirmation
- Verify auth policies in Supabase
- Clear browser cookies/localStorage

#### Image upload failures
- Verify storage buckets exist
- Check storage policies
- Ensure bucket names match code

### Debug Mode

```bash
# Enable debug logging
DEBUG=supabase* npm run dev

# Check TypeScript errors
npm run type-check

# Lint code
npm run lint
```

## 📊 Database Schema Overview

### Core Tables
- `profiles` - User information
- `categories` - Product categories
- `products` - Product listings
- `product_images` - Product photos
- `bids` - Auction bids
- `watchlist` - User saved items
- `orders` - Purchase orders

### Key Features
- **Row Level Security (RLS)** - Data protection
- **Real-time subscriptions** - Live updates
- **Automatic triggers** - Price updates
- **File storage** - Image handling

## 🔄 Development Workflow

### Making Changes
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test locally
3. Commit: `git commit -m "Add new feature"`
4. Push: `git push origin feature/new-feature`
5. Create Pull Request
6. CI/CD automatically tests and deploys preview
7. Merge to main for production deployment

### Database Changes
1. Update `scripts/schema.sql`
2. Test in local Supabase
3. Update production via Supabase dashboard
4. Document changes in commit

## 📈 Monitoring & Analytics

### Supabase Dashboard
- Database activity
- Auth usage
- Storage usage
- API requests

### Vercel Analytics
- Page views
- Performance metrics
- Error tracking
- Geographic data

## 🎯 Next Steps

Once setup is complete:
1. Customize branding and colors
2. Add payment integration (Stripe/PayPal)
3. Implement email notifications
4. Add admin dashboard
5. Set up monitoring/analytics
6. Configure backup strategy

## 📞 Support

- **Documentation**: Check README.md
- **Issues**: Create GitHub issue
- **Supabase Help**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Help**: [vercel.com/docs](https://vercel.com/docs)

---

**Happy coding! 🚀**
