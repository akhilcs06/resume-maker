import React from 'react';
import styled from 'styled-components';
import useUserData from '../hooks/useUserData';

const Container = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 80px);
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const MinimalDashboard: React.FC = () => {
  const { firstName, email, isSignedIn, isLoaded } = useUserData();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Not signed in</div>;
  }

  return (
    <Container>
      <Card>
        <h1>🎉 Welcome to Your Dashboard!</h1>
        <p>Hello, {firstName}!</p>
        <p>Email: {email}</p>
        <p>This is a minimal dashboard that should work after sign in.</p>
      </Card>
      
      <Card>
        <h2>🔧 Status Check:</h2>
        <ul>
          <li>✅ Authentication: Working</li>
          <li>✅ User Data: Loaded</li>
          <li>✅ Dashboard: Rendering</li>
        </ul>
      </Card>
    </Container>
  );
};

export default MinimalDashboard;
