import { useState } from 'react';
import styled from 'styled-components';
import useUserData, { useAuthHeaders } from '../hooks/useUserData';
import useApi from '../services/api';
import type { ResumeData } from '../App';

const ExampleContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
`;

const Button = styled.button`
  background: #1E88E5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.5rem 0.5rem 0.5rem 0;
  
  &:hover {
    background: #1976D2;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div<{ $type: 'success' | 'error' | 'info' }>`
  padding: 0.75rem;
  border-radius: 4px;
  margin: 0.5rem 0;
  background: ${props => 
    props.$type === 'success' ? '#d4edda' :
    props.$type === 'error' ? '#f8d7da' : '#d1ecf1'
  };
  color: ${props => 
    props.$type === 'success' ? '#155724' :
    props.$type === 'error' ? '#721c24' : '#0c5460'
  };
  border: 1px solid ${props => 
    props.$type === 'success' ? '#c3e6cb' :
    props.$type === 'error' ? '#f5c6cb' : '#bee5eb'
  };
`;

/**
 * Example component demonstrating usage of authentication hooks
 * This shows how to use useUserData, useAuthHeaders, and useApi hooks
 */
const AuthExampleComponent = () => {
  const [status, setStatus] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');
  
  // Get user data
  const { userId, email, firstName, isSignedIn } = useUserData();
  
  // Get auth headers hook
  const { getAuthHeaders } = useAuthHeaders();
  
  // Get API functions
  const api = useApi();

  const handleTestAuthHeaders = async () => {
    try {
      setStatus('Getting auth headers...');
      setStatusType('info');
      
      const headers = await getAuthHeaders();
      setStatus(`Auth headers retrieved: ${JSON.stringify(headers, null, 2)}`);
      setStatusType('success');
    } catch (error) {
      setStatus(`Error getting auth headers: ${error}`);
      setStatusType('error');
    }
  };

  const handleTestApiCall = async () => {
    try {
      setStatus('Testing API call...');
      setStatusType('info');
      
      // Example: Try to get user profile (this will fail until you have a backend)
      const response = await api.getUserProfile();
      setStatus(`API call successful: ${JSON.stringify(response, null, 2)}`);
      setStatusType('success');
    } catch (error) {
      setStatus(`API call failed (expected if no backend): ${error}`);
      setStatusType('error');
    }
  };

  const handleSaveResume = async () => {
    try {
      setStatus('Saving resume...');
      setStatusType('info');
      
      // Example resume data
      const exampleResume: ResumeData = {
        personalInfo: {
          name: firstName || 'Test User',
          role: 'Software Developer',
          email: email || 'test@example.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          website: 'https://example.com'
        },
        summary: 'Experienced software developer with expertise in React and TypeScript.',
        experience: [{
          id: '1',
          company: 'Tech Company',
          position: 'Senior Developer',
          startDate: '2022',
          endDate: 'Present',
          description: 'Developed React applications with TypeScript.'
        }],
        education: [{
          id: '1',
          school: 'University of Technology',
          degree: 'Computer Science',
          startDate: '2018',
          endDate: '2022'
        }],
        skills: ['React', 'TypeScript', 'Node.js', 'MongoDB']
      };
      
      const response = await api.saveResume(exampleResume);
      setStatus(`Resume saved: ${JSON.stringify(response, null, 2)}`);
      setStatusType('success');
    } catch (error) {
      setStatus(`Failed to save resume (expected if no backend): ${error}`);
      setStatusType('error');
    }
  };

  if (!isSignedIn) {
    return (
      <ExampleContainer>
        <h3>Authentication Example</h3>
        <p>Please sign in to test authentication features.</p>
      </ExampleContainer>
    );
  }

  return (
    <ExampleContainer>
      <h3>Authentication Example</h3>
      <p>
        <strong>User ID:</strong> {userId}<br />
        <strong>Email:</strong> {email}<br />
        <strong>First Name:</strong> {firstName}
      </p>
      
      <div>
        <Button onClick={handleTestAuthHeaders}>
          Test Auth Headers
        </Button>
        <Button onClick={handleTestApiCall}>
          Test API Call
        </Button>
        <Button onClick={handleSaveResume}>
          Test Save Resume
        </Button>
      </div>
      
      {status && (
        <StatusMessage $type={statusType}>
          <pre>{status}</pre>
        </StatusMessage>
      )}
    </ExampleContainer>
  );
};

export default AuthExampleComponent;
