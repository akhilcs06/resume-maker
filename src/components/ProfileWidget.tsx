import styled from 'styled-components';
import useUserData from '../hooks/useUserData';

const ProfileContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex: 1;
  
  h3 {
    margin: 0 0 0.25rem 0;
    color: #333;
    font-size: 1.1rem;
  }
  
  p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }
`;

const UserStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const Stat = styled.div`
  text-align: center;
  
  .number {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1E88E5;
    margin-bottom: 0.25rem;
  }
  
  .label {
    font-size: 0.8rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

interface ProfileWidgetProps {
  resumeCount?: number;
  templatesUsed?: number;
}

const ProfileWidget = ({ resumeCount = 0, templatesUsed = 1 }: ProfileWidgetProps) => {
  const { fullName, email, profileImageUrl, userId } = useUserData();

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar 
          src={profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`}
          alt={fullName || 'User'}
        />
        <UserInfo>
          <h3>{fullName || 'Unknown User'}</h3>
          <p>{email}</p>
        </UserInfo>
      </ProfileHeader>
      
      <UserStats>
        <Stat>
          <div className="number">{resumeCount}</div>
          <div className="label">Resumes</div>
        </Stat>
        <Stat>
          <div className="number">{templatesUsed}</div>
          <div className="label">Templates</div>
        </Stat>
        <Stat>
          <div className="number">{userId ? '✓' : '✗'}</div>
          <div className="label">Account</div>
        </Stat>
      </UserStats>
    </ProfileContainer>
  );
};

export default ProfileWidget;
