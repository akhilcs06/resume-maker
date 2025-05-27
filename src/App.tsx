import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

// Define types for resume data (moved to separate types file later)
export interface ResumeData {
  personalInfo: {
    name: string;
    role: string;
    profileImage?: string;
    location: string;
    email: string;
    phone: string;
    website: string;
    linkedin?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
  languages?: string[];
  hobbies?: string[];
}

export interface ThemeType {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  headingFont: string;
  bodyFont: string;
}

export interface ResumeContent {
  resumeData: ResumeData;
  theme: ThemeType;
  sectionVisibility?: {
    picture: boolean;
    location: boolean;
    phone: boolean;
    email: boolean;
    website: boolean;
    role: boolean;
    about: boolean;
    work: boolean;
    education: boolean;
    skills: boolean;
    languages: boolean;
    hobbies: boolean;
    linkedin: boolean;
    custom1: boolean;
    custom2: boolean;
  };
}

const App = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            {/* Add more routes here as needed */}
          </Routes>
        </div>
      </Router>
    </ClerkProvider>
  );
};

export default App;
