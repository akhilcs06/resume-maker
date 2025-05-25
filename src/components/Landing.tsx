import styled from 'styled-components';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';

const LandingContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const HeroSection = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 600px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 2rem;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Features = styled.div`
  margin: 2rem 0;
  text-align: left;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  &::before {
    content: '✓';
    background: #1E88E5;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    font-weight: bold;
    font-size: 0.8rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
  
  button {
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    
    &:first-child {
      background: #1E88E5;
      color: white;
      
      &:hover {
        background: #1976D2;
        transform: translateY(-2px);
      }
    }
    
    &:last-child {
      background: transparent;
      color: #1E88E5;
      border: 2px solid #1E88E5;
      
      &:hover {
        background: #f5f5f5;
        transform: translateY(-2px);
      }
    }
  }
`;

const Landing = () => {
  return (
    <LandingContainer>
      <HeroSection>
        <Title>Resume Maker</Title>
        <Subtitle>Create Professional Resumes in Minutes</Subtitle>
        
        <Features>
          <Feature>AI-powered resume optimization</Feature>
          <Feature>Professional templates</Feature>
          <Feature>Real-time preview</Feature>
          <Feature>Export to PDF</Feature>
          <Feature>Save and edit anytime</Feature>
        </Features>
        
        <ButtonGroup>
          <SignUpButton mode="modal">
            <button>Get Started Free</button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button>Sign In</button>
          </SignInButton>
        </ButtonGroup>
      </HeroSection>
    </LandingContainer>
  );
};

export default Landing;
