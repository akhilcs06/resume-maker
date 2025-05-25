import { useUser } from '@clerk/clerk-react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import Landing from './Landing';

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #1E88E5;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useUser();

  // Show loading spinner while Clerk is loading
  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  // Show landing page if not signed in
  if (!isSignedIn) {
    return <Landing />;
  }

  // Render protected content if signed in
  return <>{children}</>;
};

export default ProtectedRoute;
