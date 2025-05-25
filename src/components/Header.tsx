import { UserButton, SignInButton, useUser, useClerk } from "@clerk/clerk-react";
import styled from "styled-components";
import SignOutButton from "./SignOutButton";

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
  color: #1e88e5;
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
    background-color: #1e88e5;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #1976d2;
    }
  }
`;

const UserButtonWrapper = styled.div`
  display: flex;
  align-items: center;

  .cl-userButtonBox {
    width: 32px;
    height: 32px;
  }

  .cl-userButtonTrigger {
    width: 32px;
    height: 32px;
  }
`;

const Header = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();

  console.log("Header Rendered:", { isSignedIn, user, isLoaded });

  if (!isLoaded) {
    return (
      <HeaderContainer>
        <Logo>Resume Maker</Logo>
        <AuthSection>
          <span>Loading...</span>
        </AuthSection>
      </HeaderContainer>
    );
  }

  return (
    <HeaderContainer>
      <Logo>Resume Maker</Logo>
      <AuthSection>
        {isSignedIn ? (
          <>
            <WelcomeText>Welcome, {user?.firstName || "User"}!</WelcomeText>
            <UserButtonWrapper>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "width: 32px; height: 32px;",
                    userButtonBox: "width: 32px; height: 32px;",
                    userButtonTrigger: "width: 32px; height: 32px;",
                  },
                }}
              />
              <SignOutButton onClick={() => signOut({ redirectUrl: "/" })}>
                Sign Out
              </SignOutButton>
            </UserButtonWrapper>
          </>
        ) : (
          <SignInWrapper>
            <SignInButton mode="modal">
              <button>Sign In</button>
            </SignInButton>
          </SignInWrapper>
        )}
      </AuthSection>
    </HeaderContainer>
  );
};

export default Header;
