import React, { useRef } from 'react';
import styled from 'styled-components';
import type { ResumeData } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faGlobe, 
  faFileDownload,
  faPlus 
} from '@fortawesome/free-solid-svg-icons';
import generatePDF from 'react-to-pdf';

interface ResumePreviewProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const PreviewContainer = styled.div`
  position: relative;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
  min-height: 1000px;
`;

const ResumeHeader = styled.div`
  background-color: ${props => props.theme.primaryColor};
  padding: 40px;
  color: white;
  display: flex;
  align-items: center;
  gap: 30px;
`;

const ProfileImage = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'imageUrl',
})<{ imageUrl?: string }>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 5px solid white;
  background-color: #e0e0e0;
  background-image: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const HeaderInfo = styled.div`
  flex-grow: 1;
`;

const Name = styled.h1`
  margin: 0;
  margin-bottom: 10px;
  font-size: 2.5rem;
  font-family: ${props => props.theme.headingFont};
`;

const Role = styled.div`
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ResumeBody = styled.div`
  display: flex;
  gap: 20px;
  padding: 40px;
`;

const LeftColumn = styled.div`
  flex: 1;
`;

const RightColumn = styled.div`
  flex: 2;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.primaryColor};
  border-bottom: 2px solid ${props => props.theme.primaryColor};
  padding-bottom: 5px;
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 15px;
  font-family: ${props => props.theme.headingFont};
`;

const ContactInfo = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  & svg {
    color: ${props => props.theme.primaryColor};
    width: 20px;
  }
`;

const SummaryText = styled.p`
  margin: 0;
  line-height: 1.6;
  color: ${props => props.theme.textColor};
  font-family: ${props => props.theme.bodyFont};
`;

const ExperienceItem = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CompanyName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: ${props => props.theme.textColor};
  font-family: ${props => props.theme.headingFont};
`;

const Position = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: ${props => props.theme.primaryColor};
  font-family: ${props => props.theme.bodyFont};
`;

const DateRange = styled.div`
  font-style: italic;
  margin-bottom: 10px;
  color: #666;
  font-family: ${props => props.theme.bodyFont};
`;

const Description = styled.p`
  margin: 0;
  line-height: 1.6;
  color: ${props => props.theme.textColor};
  font-family: ${props => props.theme.bodyFont};
`;

const EducationItem = styled.div`
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SchoolName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: ${props => props.theme.textColor};
  font-family: ${props => props.theme.headingFont};
`;

const Degree = styled.div`
  font-weight: bold;
  color: ${props => props.theme.primaryColor};
  margin-bottom: 5px;
  font-family: ${props => props.theme.bodyFont};
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Skill = styled.div`
  background-color: ${props => props.theme.primaryColor};
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-family: ${props => props.theme.bodyFont};
`;

const ExportButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${props => props.theme.primaryColor};
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Placeholder = styled.span`
  color: #bbb;
  font-style: italic;
`;

const AddButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background-color: #218838;
  }
`;

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, setResumeData }) => {
  const targetRef = useRef<HTMLDivElement>(null);

  // Handlers for inline editing
  const handlePersonalInfoChange = (field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };
  const handleSummaryChange = (value: string) => {
    setResumeData(prev => ({ ...prev, summary: value }));
  };
  const handleExperienceChange = (id: string, field: keyof ResumeData['experience'][0], value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp),
    }));
  };
  const handleEducationChange = (id: string, field: keyof ResumeData['education'][0], value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu),
    }));
  };
  const handleSkillChange = (index: number, value: string) => {
    setResumeData(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = value;
      return { ...prev, skills: newSkills };
    });
  };
  const handleAddSkill = () => {
    setResumeData(prev => ({ ...prev, skills: [...prev.skills, ''] }));
  };
  const handleRemoveSkill = (index: number) => {
    setResumeData(prev => {
      const newSkills = prev.skills.filter((_, i) => i !== index);
      return { ...prev, skills: newSkills };
    });
  };
  const handleAddExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          company: 'New Employer',
          position: 'POSITION',
          startDate: 'From',
          endDate: 'Until',
          description: 'Enter your work experience description'
        }
      ]
    }));
  };

  const handleRemoveExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const handleDownloadPDF = () => {
    generatePDF(targetRef, {
      filename: `${resumeData.personalInfo.name.replace(/\s+/g, '-')}-Resume.pdf`,
    });
  };

  return (
    <>
      <ExportButton onClick={handleDownloadPDF}>
        <FontAwesomeIcon icon={faFileDownload} /> Export PDF
      </ExportButton>
      <PreviewContainer ref={targetRef}>
        <ResumeHeader>
          <ProfileImage imageUrl={resumeData.personalInfo.profileImage} />
          <HeaderInfo>
            <Name
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              onBlur={e => handlePersonalInfoChange('name', e.currentTarget.textContent || '')}
              style={{ minWidth: 100 }}
            >
              {resumeData.personalInfo.name ? resumeData.personalInfo.name : <Placeholder>Your Name</Placeholder>}
            </Name>
            <Role
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              onBlur={e => handlePersonalInfoChange('role', e.currentTarget.textContent || '')}
            >
              {resumeData.personalInfo.role ? resumeData.personalInfo.role : <Placeholder>Your Role</Placeholder>}
            </Role>
          </HeaderInfo>
        </ResumeHeader>
        <ResumeBody>
          <LeftColumn>
            <Section>
              <SectionTitle>PERSONAL DETAILS</SectionTitle>
              <ContactInfo>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={e => handlePersonalInfoChange('location', e.currentTarget.textContent || '')}
                  style={{ minWidth: 60 }}
                >
                  {resumeData.personalInfo.location ? resumeData.personalInfo.location : <Placeholder>Enter Location</Placeholder>}
                </span>
              </ContactInfo>
              <ContactInfo>
                <FontAwesomeIcon icon={faEnvelope} />
                <span
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={e => handlePersonalInfoChange('email', e.currentTarget.textContent || '')}
                  style={{ minWidth: 60 }}
                >
                  {resumeData.personalInfo.email ? resumeData.personalInfo.email : <Placeholder>Enter your email</Placeholder>}
                </span>
              </ContactInfo>
              <ContactInfo>
                <FontAwesomeIcon icon={faPhone} />
                <span
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={e => handlePersonalInfoChange('phone', e.currentTarget.textContent || '')}
                  style={{ minWidth: 60 }}
                >
                  {resumeData.personalInfo.phone ? resumeData.personalInfo.phone : <Placeholder>Enter your phone</Placeholder>}
                </span>
              </ContactInfo>
              <ContactInfo>
                <FontAwesomeIcon icon={faGlobe} />
                <span
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={e => handlePersonalInfoChange('website', e.currentTarget.textContent || '')}
                  style={{ minWidth: 60 }}
                >
                  {resumeData.personalInfo.website ? resumeData.personalInfo.website : <Placeholder>Enter URL</Placeholder>}
                </span>
              </ContactInfo>
            </Section>
            <Section>
              <SectionTitle>SKILLS</SectionTitle>
              <SkillsContainer>
                {resumeData.skills.map((skill, index) => (
                  <Skill key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={e => handleSkillChange(index, e.currentTarget.textContent || '')}
                      style={{ minWidth: 40 }}
                    >
                      {skill ? skill : <Placeholder>Enter skill</Placeholder>}
                    </span>
                    {resumeData.skills.length > 1 && (
                      <button onClick={() => handleRemoveSkill(index)} style={{ marginLeft: 6, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>×</button>
                    )}
                  </Skill>
                ))}
                <button onClick={handleAddSkill} style={{ background: '#1E88E5', color: 'white', border: 'none', borderRadius: 15, padding: '5px 15px', cursor: 'pointer' }}>+ Add Skill</button>
              </SkillsContainer>
            </Section>
          </LeftColumn>
          <RightColumn>
            <Section>
              <SectionTitle>ABOUT ME</SectionTitle>
              <SummaryText
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                onBlur={e => handleSummaryChange(e.currentTarget.textContent || '')}
                style={{ minHeight: 40 }}
              >
                {resumeData.summary ? resumeData.summary : <Placeholder>Enter your professional summary</Placeholder>}
              </SummaryText>
            </Section>
            <Section>              <SectionTitle>EXPERIENCE</SectionTitle>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div></div>
                <button 
                  onClick={() => {
                    setResumeData(prev => ({
                      ...prev,
                      experience: [
                        ...prev.experience,
                        {
                          id: Date.now().toString(),
                          company: 'New Employer',
                          position: 'POSITION',
                          startDate: 'From',
                          endDate: 'Until',
                          description: 'Enter your work experience description'
                        }
                      ]
                    }));
                  }} 
                  style={{ 
                    background: '#1E88E5', 
                    color: 'white', 
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 12px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  + Add Experience
                </button>
              </div>
              {resumeData.experience.map((exp) => (
                <ExperienceItem key={exp.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <CompanyName
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={e => handleExperienceChange(exp.id, 'company', e.currentTarget.textContent || '')}
                    >
                      {exp.company ? exp.company : <Placeholder>Company</Placeholder>}
                    </CompanyName>
                    {resumeData.experience.length > 1 && (
                      <button 
                        onClick={() => {
                          setResumeData(prev => ({
                            ...prev,
                            experience: prev.experience.filter(e => e.id !== exp.id)
                          }));
                        }} 
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: '#ff5252', 
                          cursor: 'pointer',
                          fontSize: '14px',
                          padding: '0'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <Position
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    onBlur={e => handleExperienceChange(exp.id, 'position', e.currentTarget.textContent || '')}
                  >
                    {exp.position ? exp.position : <Placeholder>Position</Placeholder>}
                  </Position>
                  <DateRange>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={e => handleExperienceChange(exp.id, 'startDate', e.currentTarget.textContent || '')}
                      style={{ minWidth: 30 }}
                    >
                      {exp.startDate ? exp.startDate : <Placeholder>From</Placeholder>}
                    </span>
                    {' - '}
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={e => handleExperienceChange(exp.id, 'endDate', e.currentTarget.textContent || '')}
                      style={{ minWidth: 30 }}
                    >
                      {exp.endDate ? exp.endDate : <Placeholder>Until</Placeholder>}
                    </span>
                  </DateRange>
                  <Description
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    onBlur={e => handleExperienceChange(exp.id, 'description', e.currentTarget.textContent || '')}
                    style={{ minHeight: 40 }}
                  >
                    {exp.description ? exp.description : <Placeholder>Enter description</Placeholder>}
                  </Description>
                </ExperienceItem>
              ))}
              <AddButton onClick={handleAddExperience} style={{ marginTop: 10 }}>
                <FontAwesomeIcon icon={faPlus} /> Add Experience
              </AddButton>
            </Section>
            <Section>
              <SectionTitle>EDUCATION</SectionTitle>
              {resumeData.education.map((edu) => (
                <EducationItem key={edu.id}>
                  <SchoolName
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    onBlur={e => handleEducationChange(edu.id, 'school', e.currentTarget.textContent || '')}
                  >
                    {edu.school ? edu.school : <Placeholder>School/University</Placeholder>}
                  </SchoolName>
                  <Degree
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    onBlur={e => handleEducationChange(edu.id, 'degree', e.currentTarget.textContent || '')}
                  >
                    {edu.degree ? edu.degree : <Placeholder>Degree</Placeholder>}
                  </Degree>
                  <DateRange>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={e => handleEducationChange(edu.id, 'startDate', e.currentTarget.textContent || '')}
                      style={{ minWidth: 30 }}
                    >
                      {edu.startDate ? edu.startDate : <Placeholder>From</Placeholder>}
                    </span>
                    {' - '}
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={e => handleEducationChange(edu.id, 'endDate', e.currentTarget.textContent || '')}
                      style={{ minWidth: 30 }}
                    >
                      {edu.endDate ? edu.endDate : <Placeholder>Until</Placeholder>}
                    </span>
                  </DateRange>
                </EducationItem>
              ))}
            </Section>
          </RightColumn>
        </ResumeBody>
      </PreviewContainer>
    </>
  );
};

export default ResumePreview;
