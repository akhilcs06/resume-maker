import { useEffect, useRef, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import ResumePreview from './ResumePreview';
import ThemeControls from './ThemeControls';
import type { ResumeData } from '../App';
import useUserData from '../hooks/useUserData';
import useSupabaseUserSync from '../hooks/useSupabaseUserSync';
import { useApi } from '../services/api';

// Define the default theme
const defaultTheme = {
  primaryColor: '#1E88E5', // Blue
  secondaryColor: '#ffffff', // White
  textColor: '#333333', // Dark gray
  backgroundColor: '#f5f5f5',
  headingFont: '"Roboto", sans-serif',
  bodyFont: '"Open Sans", sans-serif',
};

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px); // Account for header height
  padding: 20px;
  
  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const PreviewSection = styled.div`
  flex: 2;
  position: relative;
`;

const SaveStatus = styled.div<{ status: string }>`
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  background-color: ${props => {
    switch (props.status) {
      case 'saving': return '#fef3c7';
      case 'saved': return '#d1fae5';
      case 'error': return '#fee2e2';
      default: return 'transparent';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'saving': return '#92400e';
      case 'saved': return '#065f46';
      case 'error': return '#991b1b';
      default: return 'transparent';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'saving': return '#fcd34d';
      case 'saved': return '#10b981';
      case 'error': return '#ef4444';
      default: return 'transparent';
    }
  }};
  display: ${props => props.status === 'idle' ? 'none' : 'block'};
`;

const Dashboard = () => {
  const { email, fullName } = useUserData();
  const { synced } = useSupabaseUserSync();
  const api = useApi();
  const { convertResumeFromDb } = api;

  // Default resume data
  const defaultResumeData: ResumeData = {
    personalInfo: {
      name: fullName || 'Your Name',
      role: 'YOUR ROLE',
      profileImage: '',
      location: 'Enter Location',
      email: email || 'Enter your email',
      phone: 'Enter your phone',
      website: 'Enter URL',
    },
    summary: 'Enter your professional summary',
    experience: [
      {
        id: '1',
        company: 'Employer',
        position: 'POSITION',
        startDate: 'From',
        endDate: 'Until',
        description: 'Enter your work experience description',
      },
    ],
    education: [
      {
        id: '1',
        school: 'School',
        degree: 'DEGREE',
        startDate: 'From',
        endDate: 'Until',
      },
    ],
    skills: ['Enter skill'],
  };

  // State for resume data
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  // State for theme
  const [theme, setTheme] = useState(defaultTheme);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const lastSavedData = useRef(JSON.stringify(resumeData));

  // Load resume and theme from Supabase on mount (after user is synced)
  useEffect(() => {
    const loadResume = async () => {
      if (!synced) return;
      try {
        const response = await api.getResumes();
        if (response.success && response.data && response.data.length > 0 && response.data[0].content) {
          const loaded = convertResumeFromDb(response.data[0]);
          if ('resumeData' in loaded && 'theme' in loaded) {
            setResumeData(loaded.resumeData);
            setTheme(loaded.theme);
          } else {
            setResumeData(loaded as ResumeData);
            setTheme(defaultTheme);
          }
        }
      } catch (err) {
        // Optionally handle error
        console.error('Failed to load resume:', err);
      }
    };
    loadResume();
    // Only run once after sync
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [synced]);

  // Auto-save functionality (save both resumeData and theme)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const autoSave = async () => {
      if (!synced) return;
      const content = { resumeData, theme };
      if (JSON.stringify(content) === lastSavedData.current) return; // Only save if data changed
      setSaveStatus('saving');
      try {
        await api.saveResume(content, `Resume - ${new Date().toLocaleDateString()}`);
        setSaveStatus('saved');
        lastSavedData.current = JSON.stringify(content);
        timeoutId = setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveStatus('error');
        timeoutId = setTimeout(() => setSaveStatus('idle'), 2000);
      }
    };
    timeoutId = setTimeout(autoSave, 2000);
    return () => clearTimeout(timeoutId);
  }, [resumeData, theme, api, synced]);

  // Update theme handler
  const handleUpdateTheme = (newTheme: Partial<typeof theme>) => {
    setTheme((prev) => ({ ...prev, ...newTheme }));
  };

  return (
    <ThemeProvider theme={theme}>
      <DashboardContainer>
        <PreviewSection>
          <ResumePreview resumeData={resumeData} setResumeData={setResumeData} />
          <ThemeControls theme={theme} updateTheme={handleUpdateTheme} />
          <SaveStatus status={saveStatus}>
            {saveStatus === 'saving' && '💾 Saving...'}
            {saveStatus === 'saved' && '✅ Resume saved successfully'}
            {saveStatus === 'error' && '❌ Failed to save resume'}
          </SaveStatus>
        </PreviewSection>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default Dashboard;
