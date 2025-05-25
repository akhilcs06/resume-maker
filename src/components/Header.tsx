import { UserButton, SignInButton, useUser } from '@clerk/clerk-react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
  margin: 0;
  color: #1E88E5;
  font-size: 1.5rem;
  font-weight: 600;
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WelcomeText = styled.span`
  color: #666;
  margin-right: 0.5rem;
`;

const SignInWrapper = styled.div`
  .cl-internal-b3fm6y {
    background-color: #1E88E5;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #1976D2;
    }
  }
`;

const Header = () => {
  const { isSignedIn, user } = useUser();

  console.log('Header Rendered:', { isSignedIn, user });

  return (
    <HeaderContainer>
      <Logo>Resume Maker</Logo>
      <AuthSection>
        {isSignedIn ? (
          <>
            <WelcomeText>Welcome, {user.firstName}!</WelcomeText>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "width: 32px; height: 32px;"
                }
              }}
            />
          </>
        ) : (
          <SignInWrapper>
            <SignInButton mode="modal">
              <button>Sign In</button>
            </SignInButton>
          </SignInWrapper>
        )}
        {!isSignedIn && <span>Sign-in state is false or user data is missing.</span>}
      </AuthSection>
    </HeaderContainer>
  );
};

export default Header;
