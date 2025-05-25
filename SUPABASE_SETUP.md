# Supabase Setup Guide for Resume Maker

This guide will help you complete the Supabase integration for your AI-powered Resume Maker.

## Prerequisites

- [x] Supabase account created
- [x] Clerk account and project set up
- [x] Code integration completed

## Quick Setup Checklist

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `resume-maker` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

### Step 2: Environment Variables Setup

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Config")
   - **Project API Key** → **anon/public** key

3. Create `.env.local` file in your project root:
```bash
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

4. Restart your development server after creating the environment file.

### Step 3: Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire content from `database/migrations/001_initial_schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the migration

**✅ Verify**: Go to **Table Editor** and confirm these tables exist:
- `user_profiles`
- `resumes` 
- `resume_templates`

### Step 4: Configure Clerk JWT Template

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your project
3. Go to **JWT Templates** (in sidebar)
4. Click "New Template"
5. Choose **Supabase** from the templates
6. Name it: `supabase`
7. The template should look like this:

```json
{
  "aud": "authenticated",
  "exp": {{exp}},
  "iat": {{iat}},
  "iss": "https://your-clerk-frontend-api.clerk.accounts.dev",
  "nbf": {{nbf}},
  "sub": "{{user.id}}"
}
```

8. Click "Save"

### Step 5: Configure Supabase JWT Settings

1. In Supabase dashboard, go to **Settings** → **API**
2. Scroll down to **JWT Settings**
3. Get Clerk's public key:
   - In Clerk Dashboard, go to **API Keys**
   - Copy the **JWKS Endpoint URL**
   - Visit that URL in your browser
   - Copy the entire JSON response

4. Back in Supabase **JWT Settings**:
   - Toggle "Use custom JWT secret"
   - Paste the JWKS JSON from Clerk
   - Click "Save"

### Step 6: Install Dependencies & Validate Setup

1. Install dependencies:
```bash
npm install
```

2. Run setup validation:
```bash
npm run validate-supabase
```

3. Start development server:
```bash
npm run dev
```

### Step 7: Test Integration

1. Sign in to your app
2. Go to the Dashboard
3. Use the "🧪 Supabase Integration Test" component
4. Click "Run Database Test"
5. All tests should pass ✅

## 🎯 Integration Features Completed

### ✅ Database Schema
- **Resumes table**: Stores user resume data with RLS
- **Resume templates**: Pre-built templates for users
- **User profiles**: Synced with Clerk authentication
- **Row Level Security**: Users can only access their own data

### ✅ API Service Layer
- **useApi()**: Consistent API interface for all operations
- **useSupabase()**: Direct Supabase operations with auth
- **useResumeManager()**: High-level resume management
- **useSupabaseUserSync()**: Automatic user profile synchronization

### ✅ Resume Operations
- **Save Resume**: Create new resumes with auto-save
- **Load Resumes**: Fetch user's saved resumes
- **Update Resume**: Edit existing resumes
- **Delete Resume**: Remove resumes
- **Template System**: Use pre-built resume templates

### ✅ Authentication Integration
- **Clerk + Supabase**: Seamless authentication flow
- **JWT Integration**: Secure token-based auth
- **User Profile Sync**: Automatic profile synchronization
- **Row-Level Security**: Data isolation per user

### ✅ Real-time Features
- **Auto-save**: Resume data saved automatically
- **Save Status**: Visual feedback for save operations
- **Error Handling**: Comprehensive error management
- **Loading States**: User-friendly loading indicators

## 🔧 Key Components

### Database Tables
```sql
-- Users can only see their own resumes
resumes (id, user_id, title, content, template_id, created_at, updated_at)

-- Public templates for all users
resume_templates (id, name, structure, tags, is_premium, created_at)

-- User profile sync with Clerk
user_profiles (id, clerk_user_id, email, first_name, last_name, created_at, updated_at)
```

### API Hooks
```typescript
// High-level resume management
const { saveResume, loadResumes, deleteResume } = useResumeManager();

// Direct Supabase operations
const supabase = useSupabase();

// Consistent API interface
const api = useApi();

// Auto user sync
const { synced, error } = useSupabaseUserSync();
```

## 🛠️ Troubleshooting

### Common Issues:

**1. "Missing Supabase environment variables"**
- Ensure `.env.local` exists with correct variables
- Restart dev server after updating environment

**2. "JWT verification failed"**
- Check Clerk JWT template is named `supabase`
- Verify JWKS is correctly configured in Supabase
- Ensure JWT template has correct structure

**3. "RLS policy violation"**
- Verify user is authenticated with Clerk
- Check JWT contains correct `sub` claim (user ID)
- Test policies in Supabase SQL Editor

**4. "Network request failed"**
- Check Supabase project is running
- Verify API keys are correct
- Ensure URLs don't have trailing slashes

### Debug Commands:

```bash
# Validate setup
npm run validate-supabase

# Check environment
echo $VITE_SUPABASE_URL

# Test JWT in Supabase SQL Editor
SELECT auth.jwt();
```

## 🚀 Next Steps

With Supabase fully integrated, you can now:

1. **Enhance Resume Builder**: Add more sophisticated editing features
2. **Template System**: Create more resume templates
3. **File Uploads**: Add profile pictures and attachments
4. **Real-time Collaboration**: Live editing with multiple users
5. **Analytics**: Track resume views and downloads
6. **Export Features**: PDF generation and sharing
7. **AI Integration**: AI-powered resume suggestions

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [JWT Templates in Clerk](https://clerk.com/docs/backend-requests/making/jwt-templates)

---

🎉 **Congratulations!** Your Resume Maker now has a complete, secure, and scalable backend powered by Supabase.
