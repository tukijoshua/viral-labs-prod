# 🚀 Viral Labs – The Simple Content Coach

Enterprise-grade content diagnostics platform powered by AI. Upload videos, images, or text and get instant Impact Scores with actionable steps to make content viral.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Features

- **🎬 Video Analysis** - Viewer Interest Pulse Charts + Drop Zone Detection
- **🖼️ Aura Check** - Visual appeal and status perception for images
- **📝 Hook Strength** - Text analysis with viral rewrites (1-10 scoring)
- **🎯 Viral Protocol** - 3 specific steps to fix content before posting
- **📈 Growth Prediction** - Data-backed reach estimates
- **💾 Audit Vault** - Complete analysis history with instant switching
- **🎨 Quiet Luxury Design** - Pure light mode, Space Grotesk typography
- **⚡ Claude-Style Interface** - Sidebar + main canvas for focused work

## 🛠️ Tech Stack

- **Framework**: Next.js 15.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Clerk
- **Payments**: Whop
- **AI**: Google Gemini 2.5/3.0
- **Storage**: Vercel Blob
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Clerk account
- Google AI Studio API key
- Whop account (for payments)
- Vercel account (for blob storage)

### Installation

1. **Clone the repository**

\`\`\`bash
git clone https://github.com/yourusername/viral-labs.git
cd viral-labs
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**

\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` with your actual credentials.

4. **Set up the database**

\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

5. **Run the development server**

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your app.

## 📦 Environment Variables

### Required Variables

| Variable | Description | Where to Get It |
|----------|-------------|----------------|
| \`DATABASE_URL\` | PostgreSQL connection string | Your database provider |
| \`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY\` | Clerk public key | [Clerk Dashboard](https://dashboard.clerk.com) |
| \`CLERK_SECRET_KEY\` | Clerk secret key | [Clerk Dashboard](https://dashboard.clerk.com) |
| \`CLERK_WEBHOOK_SECRET\` | Clerk webhook secret | Clerk > Webhooks |
| \`GEMINI_API_KEY\` | Google AI API key | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| \`BLOB_READ_WRITE_TOKEN\` | Vercel Blob token | Vercel Dashboard > Storage |
| \`WHOP_WEBHOOK_SECRET\` | Whop webhook secret | [Whop Dashboard](https://whop.com/dashboard) |
| \`WHOP_PRO_PLAN_IDS\` | Comma-separated plan IDs | Whop > Products |
| \`WHOP_AGENCY_PLAN_IDS\` | Comma-separated plan IDs | Whop > Products |
| \`NEXT_PUBLIC_URL\` | Your app URL | http://localhost:3000 (dev) |

## 🔧 Configuration

### 1. Clerk Setup

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Enable email authentication
3. Add webhook endpoint: \`https://your-domain.com/api/webhooks/clerk\`
4. Subscribe to \`user.created\` event
5. Copy webhook secret to \`.env\`

### 2. Whop Setup

1. Create products at [whop.com](https://whop.com)
   - **Pro**: $29/month
   - **Agency**: $199/month
2. Add webhook endpoint: \`https://your-domain.com/api/webhooks/whop\`
3. Subscribe to membership events
4. Copy plan IDs to \`.env\`
5. Add Clerk user ID to metadata when creating memberships

### 3. Google Gemini Setup

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Enable Gemini 2.0 Flash model access
3. Add API key to \`.env\`

### 4. Database Setup

**Local Development (PostgreSQL)**

\`\`\`bash
# Install PostgreSQL
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Create database
createdb viral_labs

# Update .env
DATABASE_URL="postgresql://user:password@localhost:5432/viral_labs"

# Push schema
npx prisma db push
\`\`\`

**Production (Recommended: Neon, Supabase, or Railway)**

1. Create PostgreSQL database
2. Copy connection string
3. Update \`DATABASE_URL\` in environment variables
4. Run \`npx prisma db push\`

## 📊 Database Schema

The application uses Prisma with PostgreSQL. Key models:

- \`User\` - User accounts (synced with Clerk)
- \`Audit\` - Content analysis records
- \`UsageTracking\` - Free tier limits

See \`prisma/schema.prisma\` for full schema.

## 🎨 Design System

### Typography

- **Primary**: Space Grotesk (all text)
- **Data/Scores**: Monospace (JetBrains Mono fallback)

### Colors

- **Background**: Pure white (#FFFFFF)
- **Accents**: Slate-50 (#F9FAFB)
- **Text**: Slate-900 (#0f172a)
- **Borders**: Slate-200

### Shadows

- \`shadow-quiet\`: Multi-layered subtle shadow
- \`shadow-quiet-lg\`: Larger quiet shadow

### Border Radius

- Default: 12px
- All components use consistent rounding

## 📝 API Routes

| Route | Method | Description |
|-------|--------|-------------|
| \`/api/upload\` | POST | Upload content for analysis |
| \`/api/analyze\` | POST | Trigger AI analysis |
| \`/api/audits\` | GET | Get user's audit history |
| \`/api/audit/[id]\` | GET | Get specific audit |
| \`/api/user/subscription\` | GET | Get user's subscription tier |
| \`/api/webhooks/clerk\` | POST | Clerk webhook handler |
| \`/api/webhooks/whop\` | POST | Whop webhook handler |

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Connect repository to Vercel**

\`\`\`bash
vercel
\`\`\`

2. **Add environment variables**

Go to Vercel Dashboard > Settings > Environment Variables and add all variables from \`.env.example\`

3. **Set up Blob Storage**

- Enable Vercel Blob in your project
- Copy the token to environment variables

4. **Deploy**

\`\`\`bash
vercel --prod
\`\`\`

### Production Checklist

- [ ] Database set up and migrated
- [ ] All environment variables configured
- [ ] Clerk webhooks configured
- [ ] Whop webhooks configured
- [ ] Blob storage enabled
- [ ] Domain configured (if custom)
- [ ] Analytics set up (optional)

## 💰 Subscription Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 1 audit/month, basic analysis |
| **Pro** | $29/mo | Unlimited audits, full features |
| **Agency** | $199/mo | Pro + 5 seats, bulk processing, API |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.virallabs.io](https://docs.virallabs.io)
- **Email**: support@virallabs.io
- **Discord**: [Join our community](https://discord.gg/virallabs)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org)
- [Clerk](https://clerk.com)
- [Whop](https://whop.com)
- [Google Gemini](https://ai.google.dev)
- [Vercel](https://vercel.com)
- [Prisma](https://prisma.io)

---

Built with ❤️ for creators, by creators.
