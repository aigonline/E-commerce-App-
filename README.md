# 🏪 BidBay - Modern E-commerce Auction Platform

> **Status**: ✅ Production Ready | 🚀 CI/CD Enabled

A full-stack e-commerce auction platform built with Next.js 15, TypeScript, Tailwind CSS, and Supabase. Features real-time bidding, user authentication, product management, and a complete auction system.

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Authentication**: Email/password with Supabase Auth
- **User Profiles**: Customizable profiles with avatars and ratings
- **Password Reset**: Email-based password recovery
- **Protected Routes**: Middleware-based route protection

### 🛍️ Product & Auction System
- **Product Listings**: Create detailed product listings with multiple images
- **Auction System**: Real-time bidding with automatic price updates
- **Buy Now Option**: Instant purchase functionality
- **Categories**: Organized product categorization
- **Search & Filters**: Advanced filtering by price, condition, format

### 📱 User Dashboard
- **My Listings**: Manage your active and past listings
- **Bid History**: Track all your bids and their status
- **Watchlist**: Save items you're interested in
- **Order Management**: View purchase and sales history

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first, works on all devices
- **Dark/Light Mode**: Theme switching with next-themes
- **Component Library**: Built with Radix UI and Tailwind CSS
- **Real-time Updates**: Live bidding and status updates

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Lucide Icons
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Vercel with CI/CD via GitHub Actions
- **Image Handling**: Unsplash API for demo images

## 📋 Prerequisites

- Node.js 20+ and npm
- Supabase account (free tier available)
- Vercel account (for deployment)
- Git and GitHub account

## 🛠️ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/E-commerce-App-.git
cd E-commerce-App-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Run the SQL schema in your Supabase SQL editor:
```bash
# Copy contents from scripts/schema.sql to Supabase SQL Editor
# Run the schema to create tables and RLS policies
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The application uses the following main tables:

- **profiles** - User profiles extending Supabase auth
- **categories** - Product categories with hierarchical support
- **products** - Product/auction listings
- **product_images** - Multiple images per product
- **bids** - Bidding history with automatic price updates
- **watchlist** - User saved items
- **orders** - Purchase orders and sales tracking

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
```

## 🚀 Deployment

### Automatic Deployment (Recommended)

The project includes GitHub Actions CI/CD pipeline:

1. **Connect to Vercel**: Link your GitHub repo to Vercel
2. **Set Environment Variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Configure GitHub Secrets**:
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `VERCEL_TOKEN`
4. **Push to main branch** - automatic deployment will trigger

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── actions/           # Server actions
│   │   ├── auth.ts        # Authentication actions
│   │   ├── products.ts    # Product CRUD operations
│   │   ├── bidding.ts     # Bidding system
│   │   └── profile.ts     # User profile management
│   ├── auth/              # Authentication pages
│   ├── products/          # Product pages
│   ├── profile/           # User dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── auth/             # Authentication components
│   └── [feature]/        # Feature-specific components
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── supabase/         # Supabase clients
│   └── utils.ts          # General utilities
├── scripts/              # Database scripts
│   ├── schema.sql        # Database schema
│   └── seed.sql          # Sample data
└── .github/workflows/    # CI/CD pipeline
```

## 🔧 Configuration

### Supabase Setup

1. **Create a new Supabase project**
2. **Run the database schema** from `scripts/schema.sql`
3. **Set up storage buckets**:
   - `avatars` - User profile pictures
   - `products` - Product images
4. **Configure RLS policies** (included in schema)

### Vercel Configuration

Add these environment variables in your Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Lucide](https://lucide.dev/) for the beautiful icons

## 📞 Support

For support, email support@bidbay.com or create an issue on GitHub.

---

**Built with ❤️ using Next.js and Supabase**