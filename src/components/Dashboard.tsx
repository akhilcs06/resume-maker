import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import ResumePreview from './ResumePreview';
import ThemeControls from './ThemeControls';
import type { ResumeData } from '../App';
import useUserData from '../hooks/useUserData';
import useSupabaseUserSync from '../hooks/useSupabaseUserSync';
import { useApi } from '../services/api';

const defaultTheme = {
  primaryColor: '#1E88E5',
  secondaryColor: '#ffffff',
  textColor: '#333333',
  backgroundColor: '#f5f5f5',
  headingFont: '"Roboto", sans-serif',
  bodyFont: '"Open Sans", sans-serif',
};

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px);
  padding: 20px;
  gap: 20px;
  
  @media (min-width: 1024px) {
    flex-direction: row;
  }
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const PreviewSection = styled.div`
  flex: 2;
  position: relative;
  margin-top: 60px;
  
  @media (min-width: 1024px) {
    margin-top: 0;
  }
`;

const SaveStatus = styled.div<{ status: 'idle' | 'saving' | 'saved' | 'error' }>`
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
  text-align: center;
  margin: 10px auto;
  max-width: 200px;
`;

type SectionVisibilityState = {
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

const Dashboard: React.FC = () => {
  const { email, fullName } = useUserData();
  const { synced } = useSupabaseUserSync();
  const api = useApi();

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: fullName || 'Your Name',
      role: 'YOUR ROLE',
      profileImage: '',
      location: 'Location',
      email: email || 'Enter your email',
      phone: 'Enter your phone',
      website: 'Enter URL',
      linkedin: 'LinkedIn URL',
    },
    summary: 'Enter your professional summary',
    experience: [{
      id: '1',
      company: 'Company',
      position: 'Position',
      startDate: 'Start',
      endDate: 'End',
      description: 'Enter your work experience description',
    }],
    education: [{
      id: '1',
      school: 'School',
      degree: 'DEGREE',
      startDate: 'From',
      endDate: 'Until',
    }],
    skills: ['Enter skill'],
    languages: ['Language'],
    hobbies: ['Hobby'],
  });

  const [theme, setTheme] = useState(defaultTheme);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibilityState>({
    picture: true,
    location: true,
    phone: true,
    email: true,
    website: true,
    role: true,
    about: true,
    work: true,
    education: true,
    skills: true,
    languages: true,
    hobbies: true,
    linkedin: true,
    custom1: false,
    custom2: false,
  });

  // Load resume and theme from Supabase on mount
  useEffect(() => {
    const loadResume = async () => {
      if (!synced) return;
      try {
        const response = await api.getResumes();
        if (response.success && response.data && response.data.length > 0 && response.data[0].content) {
          const loaded = response.data[0].content;
          if ('resumeData' in loaded && 'theme' in loaded) {
            setResumeData(loaded.resumeData);
            setTheme(loaded.theme);
          } else {
            setResumeData(loaded as ResumeData);
          }
        }
      } catch (err) {
        console.error('Failed to load resume:', err);
      }
    };
    loadResume();
  }, [synced, api]);

  // Auto-save resume and theme
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const autoSave = async () => {
      if (!synced) return;
      setSaveStatus('saving');
      try {
        const content = { resumeData, theme };
        await api.saveResume(content, `Resume - ${new Date().toLocaleDateString()}`);
        setSaveStatus('saved');
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

  return (
    <ThemeProvider theme={theme}>
      <DashboardContainer>      <SaveStatus status={saveStatus}>
          {saveStatus === 'saving' && 'Saving...'}
          {saveStatus === 'saved' && 'All changes saved'}
          {saveStatus === 'error' && 'Error saving changes'}
        </SaveStatus>
        <ThemeControls
          theme={theme}
          updateTheme={newTheme => setTheme(prev => ({ ...prev, ...newTheme }))}
          sectionVisibility={sectionVisibility}
          setSectionVisibility={setSectionVisibility}
        />
        <PreviewSection>
          <ResumePreview
            resumeData={resumeData}
            setResumeData={setResumeData}
            sectionVisibility={sectionVisibility}
          />
        </PreviewSection>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default Dashboard;
