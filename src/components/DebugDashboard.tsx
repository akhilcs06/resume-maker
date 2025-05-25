import React from 'react';
import styled from 'styled-components';
import { useUser } from '@clerk/clerk-react';

const Container = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 80px);
`;

const DebugCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const DebugDashboard: React.FC = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <Container>
        <DebugCard>
          <h2>Loading...</h2>
          <p>Clerk is loading user data...</p>
        </DebugCard>
      </Container>
    );
  }

  if (!isSignedIn) {
    return (
      <Container>
        <DebugCard>
          <h2>Not Signed In</h2>
          <p>User is not signed in. This should redirect to landing page.</p>
        </DebugCard>
      </Container>
    );
  }

  return (
    <Container>
      <DebugCard>
        <h2>🎉 Dashboard Loaded Successfully!</h2>
        <p><strong>User ID:</strong> {user?.id}</p>
        <p><strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}</p>
        <p><strong>First Name:</strong> {user?.firstName}</p>
        <p><strong>Full Name:</strong> {user?.fullName}</p>
        <p><strong>Is Signed In:</strong> {isSignedIn ? 'Yes' : 'No'}</p>
        <p><strong>Is Loaded:</strong> {isLoaded ? 'Yes' : 'No'}</p>
      </DebugCard>

      <DebugCard>
        <h3>Next Steps:</h3>
        <ol>
          <li>This debug dashboard confirms authentication is working</li>
          <li>We can now troubleshoot the main Dashboard component</li>
          <li>Check browser console for any errors</li>
        </ol>
      </DebugCard>
    </Container>
  );
};

export default DebugDashboard;
