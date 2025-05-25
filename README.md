# Resume Maker - AI-Powered Resume Builder

A modern, professional resume builder built with React, TypeScript, and Clerk authentication.

## 🚀 Features

### ✅ Completed
- **Authentication**: Full Clerk.com integration with user management
- **Resume Builder**: Interactive form-based resume creation
- **Live Preview**: Real-time resume preview as you type
- **Theme Customization**: Color schemes and typography options
- **PDF Export**: Download resumes as professional PDFs
- **Responsive Design**: Works on desktop and mobile devices
- **User Profile**: Personalized dashboard with user information

### 🔄 In Progress
- Backend API integration with Supabase
- Resume templates
- AI-powered content suggestions

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Styled Components
- **Authentication**: Clerk.com
- **Routing**: React Router DOM
- **Icons**: FontAwesome
- **PDF Generation**: react-to-pdf

## 📋 Prerequisites

- Node.js 16+ and npm
- Clerk account (free at [clerk.com](https://clerk.com))

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd ResumeMaker
   npm install
   ```

2. **Set up Authentication**
   - Create a Clerk application at [dashboard.clerk.com](https://dashboard.clerk.com)
   - Copy your publishable key
   - Create `.env.local`:
     ```env
     VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
     ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Application**
   - Navigate to `http://localhost:5173`
   - Sign up/Sign in to access the resume builder

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx           # Navigation with auth controls
│   ├── Dashboard.tsx        # Main authenticated interface  
│   ├── ProtectedRoute.tsx   # Route protection wrapper
│   ├── Landing.tsx          # Public landing page
│   ├── ProfileWidget.tsx    # User profile display
│   ├── ResumeForm.tsx       # Resume editing form
│   ├── ResumePreview.tsx    # Live preview component
│   └── ThemeControls.tsx    # Theme customization
├── hooks/
│   └── useUserData.ts       # User data access hook
├── services/
│   └── api.ts               # Backend API utilities
└── App.tsx                  # Main app with routing
```

## 🔐 Authentication Features

- **Secure Login/Signup**: Email, Google, GitHub OAuth
- **User Profiles**: Automatic profile data integration
- **Route Protection**: Dashboard requires authentication
- **Session Management**: Persistent login state
- **API Ready**: Hooks for authenticated backend calls

## 🎨 Customization

The app includes comprehensive theming:
- Primary/secondary colors
- Typography (heading/body fonts)  
- Component styling via styled-components

## 📖 Documentation

- [Clerk Setup Guide](./CLERK_SETUP.md) - Detailed authentication setup
- [Component Documentation](./docs/components.md) - Component API reference

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
  },
})
```
# resume-maker
