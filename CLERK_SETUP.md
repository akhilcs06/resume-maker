# Clerk Authentication Setup Guide

This guide will help you set up Clerk authentication for the Resume Maker application.

## Prerequisites

1. A Clerk account (sign up at [clerk.com](https://clerk.com))
2. Node.js and npm installed

## Setup Instructions

### 1. Create a Clerk Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Click "Add application"
3. Choose a name for your application (e.g., "Resume Maker")
4. Select the authentication providers you want to use:
   - Email & Password (recommended)
   - Google (optional)
   - GitHub (optional)
   - Other OAuth providers as needed

### 2. Get Your API Keys

1. In your Clerk dashboard, go to "API Keys"
2. Copy the "Publishable Key"
3. Update your `.env.local` file:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### 3. Configure Authentication Settings

In your Clerk dashboard:

1. **User & Authentication** → **Email, Phone, Username**:
   - Enable Email addresses
   - Set email as required
   - Configure other fields as needed

2. **User & Authentication** → **Social Connections**:
   - Enable desired OAuth providers
   - Configure redirect URLs

3. **User & Authentication** → **Restrictions**:
   - Set up any domain restrictions if needed

### 4. Set Up Webhooks (Optional)

If you plan to sync user data with your backend:

1. Go to **Webhooks** in Clerk dashboard
2. Add your backend webhook endpoint
3. Select events you want to listen for:
   - `user.created`
   - `user.updated`
   - `user.deleted`

## Environment Variables

Create a `.env.local` file in your project root:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# API Configuration (for future backend)
VITE_API_URL=http://localhost:3001/api
```

## Features Implemented

### ✅ Authentication Components
- **Header**: Shows user info and sign in/out buttons
- **ProtectedRoute**: Protects dashboard with authentication
- **Landing**: Welcome page for unauthenticated users
- **Dashboard**: Main app interface for authenticated users

### ✅ User Data Integration
- User's name and email pre-filled in resume
- Welcome message with user's first name
- User profile image in header

### ✅ API Integration Ready
- `useUserData` hook for accessing user information
- `useApi` hook for making authenticated backend calls
- Automatic token management for API requests

## Usage Examples

### Getting User Data
```tsx
import useUserData from '../hooks/useUserData';

const MyComponent = () => {
  const { userId, email, firstName, isSignedIn } = useUserData();
  
  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }
  
  return <div>Welcome, {firstName}!</div>;
};
```

### Making Authenticated API Calls
```tsx
import useApi from '../services/api';

const MyComponent = () => {
  const api = useApi();
  
  const saveResume = async (resumeData) => {
    try {
      const result = await api.saveResume(resumeData);
      console.log('Resume saved:', result);
    } catch (error) {
      console.error('Failed to save resume:', error);
    }
  };
  
  return (
    <button onClick={() => saveResume(myResumeData)}>
      Save Resume
    </button>
  );
};
```

## Next Steps

1. **Backend Integration**: Set up your backend with Clerk webhook handling
2. **Database**: Configure database to store user resumes
3. **Advanced Features**: Add features like resume templates, sharing, etc.

## Troubleshooting

### Common Issues

1. **"Missing Publishable Key" error**:
   - Make sure `.env.local` exists and contains the correct key
   - Restart your development server after adding environment variables

2. **Authentication not working**:
   - Check that your domain is allowed in Clerk dashboard
   - Verify the publishable key is correct

3. **Styling issues with Clerk components**:
   - Use Clerk's appearance prop to customize styling
   - Check for CSS conflicts

### Support

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Discord Community](https://discord.com/invite/b5rXHjAg7A)
