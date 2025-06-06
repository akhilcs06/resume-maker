import { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import ResumePreview from './ResumePreview';
import ThemeControls from './ThemeControls';
import Header from './Header';
import type { ResumeData, ResumeContent, ThemeType } from '../App';
import useUserData from '../hooks/useUserData';
import useSupabaseUserSync from '../hooks/useSupabaseUserSync';
import { useApi } from '../services/api';

// Define the default theme
const defaultTheme: ThemeType = {
  primaryColor: '#1E88E5',
  secondaryColor: '#ffffff',
  textColor: '#333333',
  backgroundColor: '#f5f5f5',
  headingFont: '"Roboto", sans-serif',
  bodyFont: '"Open Sans", sans-serif',
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-top: 96px;
`;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

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
  display: ${props =>
    props.status === 'saving' || props.status === 'error' ? 'block' : 'none'};
`;

const SafeDashboard = () => {  const { email, fullName } = useUserData();
  const { synced } = useSupabaseUserSync();
  const api = useApi();
  const [resumeData, setResumeData] = useState<ResumeData>({
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
  });

  const [sectionVisibility, setSectionVisibility] = useState({
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

  const [theme, setTheme] = useState(defaultTheme);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    const loadResume = async () => {
      if (!synced) return;
      try {
        const response = await api.getResumes();
        if (response.success && response.data && response.data.length > 0 && response.data[0].content) {
          const loaded = response.data[0].content as unknown;
          if (typeof loaded === 'object' && loaded !== null && 'resumeData' in loaded && 'theme' in loaded) {
            setResumeData((loaded as ResumeContent).resumeData);
            setTheme((loaded as ResumeContent).theme);
          } else {
            setResumeData(loaded as ResumeData);
            setTheme(defaultTheme);
          }
        }
      } catch (err) {
        console.error('Failed to load resume:', err);
      }
    };
    loadResume();
  }, [synced, api]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const autoSave = async () => {
      if (!synced) return;
      setSaveStatus('saving');
      try {
        const content: ResumeContent = { resumeData, theme };
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
    <>
      <Header />
      <ThemeProvider theme={theme}>
        <PageContainer style={{ marginTop: 0 }}>
          <ContentContainer>
            <SaveStatus status={saveStatus}>
              {saveStatus === 'error' && 'Error saving changes.'}
            </SaveStatus>
            <DashboardContainer>              <PreviewSection>
                <ResumePreview 
                  resumeData={resumeData} 
                  setResumeData={setResumeData} 
                  sectionVisibility={sectionVisibility}
                />
              </PreviewSection>
              <ThemeControls
                theme={theme}
                updateTheme={newTheme => setTheme(prev => ({ ...prev, ...newTheme }))}
                sectionVisibility={sectionVisibility}
                setSectionVisibility={setSectionVisibility}
                layoutType={"modern"}
                setLayoutType={() => {}}
              />
            </DashboardContainer>
          </ContentContainer>
        </PageContainer>
      </ThemeProvider>
    </>
  );
};

export default SafeDashboard;
