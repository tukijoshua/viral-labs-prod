# 🔧 Viral Labs Setup Guide

Step-by-step guide to get Viral Labs running locally and in production.

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] A code editor (VS Code recommended)
- [ ] A Clerk account (free tier works)
- [ ] A Google AI Studio account
- [ ] A Whop account
- [ ] A Vercel account
- [ ] PostgreSQL database access

## 🚀 Local Development Setup

### Step 1: Clone and Install

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/viral-labs.git
cd viral-labs

# Install dependencies
npm install
\`\`\`

### Step 2: Database Setup

**Option A: Local PostgreSQL**

\`\`\`bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb viral_labs

# Connection string
DATABASE_URL="postgresql://localhost:5432/viral_labs"
\`\`\`

**Option B: Neon (Recommended for Development)**

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Use it as \`DATABASE_URL\`

### Step 3: Environment Variables

\`\`\`bash
# Copy example file
cp .env.example .env
\`\`\`

Now fill in each variable:

#### 1. Database

\`\`\`env
DATABASE_URL="postgresql://..."
\`\`\`

#### 2. Clerk (Authentication)

1. Go to [clerk.com](https://clerk.com)
2. Create application
3. Copy keys:

\`\`\`env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
\`\`\`

4. Set up webhook:
   - Go to Webhooks
   - Add endpoint: \`http://localhost:3000/api/webhooks/clerk\` (for local testing use ngrok)
   - Subscribe to \`user.created\`
   - Copy signing secret:

\`\`\`env
CLERK_WEBHOOK_SECRET="whsec_..."
\`\`\`

#### 3. Google Gemini

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Add to .env:

\`\`\`env
GEMINI_API_KEY="AIza..."
\`\`\`

#### 4. Vercel Blob (File Storage)

For local development, you can skip this initially. Files will fail to upload without it.

1. Go to [vercel.com](https://vercel.com)
2. Create project
3. Go to Storage > Create Database > Blob
4. Copy token:

\`\`\`env
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
\`\`\`

#### 5. Whop (Payments)

For local development, you can use test mode:

1. Go to [whop.com](https://whop.com)
2. Create products (Pro $29, Agency $199)
3. Get plan IDs from product URLs
4. Add webhook: \`http://localhost:3000/api/webhooks/whop\` (use ngrok)

\`\`\`env
WHOP_WEBHOOK_SECRET="whop_..."
WHOP_PRO_PLAN_IDS="plan_123,plan_456"
WHOP_AGENCY_PLAN_IDS="plan_789"
\`\`\`

#### 6. App URL

\`\`\`env
NEXT_PUBLIC_URL="http://localhost:3000"
NODE_ENV="development"
\`\`\`

### Step 4: Initialize Database

\`\`\`bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
\`\`\`

### Step 5: Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## 🌐 Testing Webhooks Locally

Webhooks need a public URL. Use ngrok:

\`\`\`bash
# Install ngrok
brew install ngrok

# Start ngrok
ngrok http 3000

# Copy the https URL (e.g., https://abc123.ngrok.io)
# Update webhook URLs in Clerk and Whop to use this URL
\`\`\`

## 🚀 Production Deployment

### Option 1: Vercel (Recommended)

1. **Push to GitHub**

\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

2. **Deploy to Vercel**

- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Vercel will auto-detect Next.js

3. **Add Environment Variables**

Go to Settings > Environment Variables and add ALL variables from \`.env\`

4. **Set up Blob Storage**

- In Vercel dashboard, go to Storage
- Create Blob Store
- Copy the token and add to environment variables

5. **Set up Database**

Option A: Use Neon
- Create production database at [neon.tech](https://neon.tech)
- Copy connection string
- Add as \`DATABASE_URL\` in Vercel

Option B: Use Vercel Postgres
- Create Postgres database in Vercel
- Connection string is auto-configured

6. **Update Webhooks**

- Update Clerk webhook URL to \`https://your-domain.vercel.app/api/webhooks/clerk\`
- Update Whop webhook URL to \`https://your-domain.vercel.app/api/webhooks/whop\`

7. **Deploy**

\`\`\`bash
vercel --prod
\`\`\`

### Post-Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrated (\`npx prisma db push\`)
- [ ] Clerk webhooks configured and tested
- [ ] Whop webhooks configured and tested
- [ ] Blob storage working
- [ ] Test signup flow
- [ ] Test content upload
- [ ] Test AI analysis
- [ ] Test subscription upgrade

## 🧪 Testing

### Test User Flow

1. **Sign Up**
   - Go to your app
   - Click "Get Started"
   - Sign up with test email

2. **Upload Content**
   - Go to Dashboard
   - Drag and drop a test image/video/text
   - Wait for analysis

3. **View Results**
   - Check Impact Score
   - Review Viral Protocol
   - Check Growth Prediction

4. **Test Subscription** (in development)
   - Use Whop test mode
   - Upgrade to Pro
   - Verify unlimited audits

## ⚠️ Common Issues

### Issue: Database connection fails

**Solution**: Check your DATABASE_URL format:
\`\`\`
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
\`\`\`

### Issue: Clerk webhooks not working

**Solution**:
1. Make sure webhook URL is correct
2. Check webhook secret matches
3. Test with ngrok for local development

### Issue: Gemini API errors

**Solution**:
1. Verify API key is correct
2. Check you have Gemini 2.0 access
3. Check API quotas in Google AI Studio

### Issue: File upload fails

**Solution**:
1. Verify BLOB_READ_WRITE_TOKEN is set
2. Check file size (max 100MB)
3. Check file type is supported

## 📞 Getting Help

If you're stuck:

1. Check the [README](README.md) for general info
2. Search existing GitHub issues
3. Join our Discord community
4. Email support@virallabs.io

## 🎯 Next Steps

Once your app is running:

1. ✅ Customize the landing page
2. ✅ Add your Whop product links
3. ✅ Test the full user journey
4. ✅ Set up analytics (optional)
5. ✅ Configure custom domain
6. ✅ Launch! 🚀

---

Good luck building! If you get stuck, don't hesitate to reach out.
