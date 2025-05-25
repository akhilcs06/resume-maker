import React from 'react';
import { useUser } from '@clerk/clerk-react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background-color: #f0f8ff;
  min-height: calc(100vh - 80px);
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const SimpleDebug: React.FC = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  return (
    <Container>
      <Card>
        <h2>🔍 Simple Debug - Post Sign In</h2>
        <p>This component loads after successful sign in to check basic state.</p>
      </Card>

      <Card>
        <h3>📊 Authentication Status:</h3>
        <ul>
          <li><strong>Is Loaded:</strong> {isLoaded ? '✅ Yes' : '❌ No'}</li>
          <li><strong>Is Signed In:</strong> {isSignedIn ? '✅ Yes' : '❌ No'}</li>
          <li><strong>User ID:</strong> {user?.id || 'Not available'}</li>
          <li><strong>Email:</strong> {user?.emailAddresses?.[0]?.emailAddress || 'Not available'}</li>
          <li><strong>First Name:</strong> {user?.firstName || 'Not available'}</li>
        </ul>
      </Card>

      <Card>
        <h3>🎯 Next Steps:</h3>
        {isSignedIn ? (
          <div>
            <p>✅ You are successfully signed in!</p>
            <p>The Dashboard should load here. If you're seeing this instead, there's an issue with the Dashboard component.</p>
          </div>
        ) : (
          <div>
            <p>❌ Not signed in yet.</p>
            <p>This component should not be visible if you're not signed in.</p>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default SimpleDebug;
