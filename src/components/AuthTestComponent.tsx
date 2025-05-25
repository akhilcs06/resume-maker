import React, { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
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

const SuccessCard = styled(Card)`
  background: #d1fae5;
  border: 1px solid #10b981;
  color: #065f46;
`;

const ErrorCard = styled(Card)`
  background: #fee2e2;
  border: 1px solid #ef4444;
  color: #991b1b;
`;

const AuthTestComponent: React.FC = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testJWTToken = async () => {
    setTesting(true);
    addResult('🔍 Testing JWT Token Generation...');
    
    try {
      const token = await getToken({ template: 'supabase' });
      if (token) {
        addResult('✅ Successfully got JWT token from Clerk');
        
        // Decode the JWT payload (just for inspection)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          addResult(`✅ Token payload includes: ${Object.keys(payload).join(', ')}`);
          addResult(`✅ Token subject (user ID): ${payload.sub}`);
          addResult(`✅ Token audience: ${payload.aud}`);
        } catch {
          addResult('⚠️ Could not decode token payload');
        }
      } else {
        addResult('❌ Failed to get JWT token');
      }
    } catch (error) {
      addResult(`❌ JWT Token Error: ${error}`);
    }
    
    setTesting(false);
  };

  const testBasicSupabaseConnection = async () => {
    setTesting(true);
    addResult('🔍 Testing Basic Supabase Connection...');
    
    try {
      // Import Supabase client
      const { supabase } = await import('../lib/supabase');
      addResult('✅ Supabase client imported successfully');
      
      // Test a simple query (no auth required)
      const { error } = await supabase.from('resume_templates').select('count');
      
      if (error) {
        addResult(`⚠️ Supabase query error: ${error.message}`);
      } else {
        addResult('✅ Basic Supabase connection working');
      }
    } catch (error) {
      addResult(`❌ Supabase Connection Error: ${error}`);
    }
    
    setTesting(false);
  };

  return (
    <Container>
      <Card>
        <h2>🧪 Authentication & Supabase Test</h2>
        <p>This component tests the authentication flow and Supabase connection step by step.</p>
      </Card>

      <Card>
        <h3>📊 Current Status:</h3>
        <ul>
          <li><strong>Authentication Loaded:</strong> {isLoaded ? '✅ Yes' : '❌ No'}</li>
          <li><strong>User Signed In:</strong> {isSignedIn ? '✅ Yes' : '❌ No'}</li>
          <li><strong>User ID:</strong> {user?.id || 'Not available'}</li>
          <li><strong>Email:</strong> {user?.emailAddresses?.[0]?.emailAddress || 'Not available'}</li>
        </ul>
      </Card>

      {isSignedIn && (
        <Card>
          <h3>🔧 Tests:</h3>
          <button onClick={testJWTToken} disabled={testing}>
            Test JWT Token
          </button>
          <button onClick={testBasicSupabaseConnection} disabled={testing}>
            Test Supabase Connection
          </button>
          <button onClick={clearResults} disabled={testing}>
            Clear Results
          </button>
        </Card>
      )}

      {testResults.length > 0 && (
        <Card>
          <h3>📋 Test Results:</h3>
          {testResults.map((result, index) => (
            <div key={index} style={{ margin: '5px 0', fontFamily: 'monospace' }}>
              {result}
            </div>
          ))}
        </Card>
      )}

      {isSignedIn && testResults.some(r => r.includes('✅ Successfully got JWT token')) && (
        <SuccessCard>
          <h3>🎉 Authentication Working!</h3>
          <p>The JWT token is being generated correctly. If you're still seeing RLS errors, the issue is likely in the Supabase JWT configuration rather than the client code.</p>
          
          <h4>Next Steps:</h4>
          <ol>
            <li>Verify the JWKS URL is correctly configured in Supabase</li>
            <li>Check that the JWT template name matches exactly ("supabase")</li>
            <li>Ensure RLS policies use the correct field path (auth.jwt() -&gt;&gt; 'sub')</li>
          </ol>
        </SuccessCard>
      )}

      {!isSignedIn && isLoaded && (
        <ErrorCard>
          <h3>🔑 Please Sign In</h3>
          <p>You need to be signed in to test the authentication and Supabase integration.</p>
        </ErrorCard>
      )}
    </Container>
  );
};

export default AuthTestComponent;
