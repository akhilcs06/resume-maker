import React from 'react';
import styled from 'styled-components';
import type { ResumeData } from '../App';

interface ClassicResumeLayoutProps {
  resumeData: ResumeData;
  sectionVisibility: {
    picture: boolean;
    location: boolean;
    phone: boolean;
    email: boolean;
    website: boolean;
    role: boolean;
    about: boolean;
    work: boolean;
    education: boolean;
    skills: boolean;
    languages: boolean;
    hobbies: boolean;
    linkedin: boolean;
    custom1: boolean;
    custom2: boolean;
  };
}

const Container = styled.div`
  background: white;
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
  font-family: ${(props) => props.theme.bodyFont};
  color: ${(props) => props.theme.textColor};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
`;

const Name = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  font-family: ${(props) => props.theme.headingFont};
`;

const Role = styled.h2`
  margin: 4px 0 0 0;
  font-size: 1.2rem;
  font-weight: normal;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
`;

const Section = styled.section`
  margin-bottom: 28px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
  font-family: ${(props) => props.theme.headingFont};
  color: ${(props) => props.theme.primaryColor};
  border-bottom: 1px solid ${(props) => props.theme.primaryColor};
  padding-bottom: 4px;
  font-size: 1.25rem;
`;

const ClassicResumeLayout: React.FC<ClassicResumeLayoutProps> = ({ resumeData, sectionVisibility }) => {
  const { personalInfo } = resumeData;

  return (
    <Container>
      <Header>
        <div>
          <Name>{personalInfo.name}</Name>
          {sectionVisibility.role && <Role>{personalInfo.role}</Role>}
        </div>
        {sectionVisibility.picture && personalInfo.profileImage && (
          <ProfileImage src={personalInfo.profileImage} alt="Profile" />
        )}
      </Header>

      {sectionVisibility.about && resumeData.summary && (
        <Section>
          <SectionTitle>Summary</SectionTitle>
          <p>{resumeData.summary}</p>
        </Section>
      )}

      {sectionVisibility.work && resumeData.experience.length > 0 && (
        <Section>
          <SectionTitle>Experience</SectionTitle>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 16 }}>
              <strong>{exp.position}</strong> - {exp.company}
              <div style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                {exp.startDate} - {exp.endDate}
              </div>
              <div>{exp.description}</div>
            </div>
          ))}
        </Section>
      )}

      {sectionVisibility.education && resumeData.education.length > 0 && (
        <Section>
          <SectionTitle>Education</SectionTitle>
          {resumeData.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 16 }}>
              <strong>{edu.school}</strong> - {edu.degree}
              <div style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                {edu.startDate} - {edu.endDate}
              </div>
            </div>
          ))}
        </Section>
      )}

      {sectionVisibility.skills && resumeData.skills.length > 0 && (
        <Section>
          <SectionTitle>Skills</SectionTitle>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {resumeData.skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </Section>
      )}
    </Container>
  );
};

export default ClassicResumeLayout;
