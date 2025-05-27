import React, { useRef } from 'react';
import styled from 'styled-components';
import type { ResumeData } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faGlobe, 
  faFileDownload
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import generatePDF from 'react-to-pdf';

interface ResumePreviewProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
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

const PreviewContainer = styled.div`
  position: relative;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
  min-height: 1000px;
  
  @media (max-width: 768px) {
    min-height: auto;
    box-shadow: none;
  }
`;

const ResumeHeader = styled.div`
  background-color: ${props => props.theme.primaryColor};
  padding: 40px;
  color: white;
  display: flex;
  align-items: center;
  gap: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
    gap: 20px;
  }
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
  
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
`;

const ProfileImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(0,0,0,0.45);
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  text-align: center;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  cursor: pointer;
  &:hover ${ProfileImageOverlay} {
    opacity: 1;
    pointer-events: auto;
  }
`;

const HeaderInfo = styled.div`
  flex-grow: 1;
`;

const Name = styled.h1`
  margin: 0;
  margin-bottom: 10px;
  font-size: 2.5rem;
  font-family: ${props => props.theme.headingFont};
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 5px;
  }
`;

const Role = styled.div`
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ResumeBody = styled.div`
  display: flex;
  gap: 20px;
  padding: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
  }
`;

const LeftColumn = styled.div`
  flex: 1;
  
  @media (max-width: 768px) {
    order: 2;
  }
`;

const RightColumn = styled.div`
  flex: 2;
  
  @media (max-width: 768px) {
    order: 1;
  }
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
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
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
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    & svg {
      width: 16px;
    }
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
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const Position = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: ${props => props.theme.primaryColor};
  font-family: ${props => props.theme.bodyFont};
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
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

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const Skill = styled.div`
  background-color: ${props => props.theme.primaryColor};
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-family: ${props => props.theme.bodyFont};
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 4px 12px;
  }
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

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, setResumeData, sectionVisibility }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  // Image upload handler
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handlePersonalInfoChange('profileImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
  const handleDownloadPDF = () => {
    generatePDF(targetRef, {
      filename: `${resumeData.personalInfo.name.replace(/\s+/g, '-')}-Resume.pdf`,
    });
  };

  // Ensure languages and hobbies are always arrays to avoid null/undefined errors
  const safeLanguages = resumeData.languages ?? [];
  const safeHobbies = resumeData.hobbies ?? [];

  return (
    <>
      <ExportButton onClick={handleDownloadPDF}>
        <FontAwesomeIcon icon={faFileDownload} /> Export PDF
      </ExportButton>
      <PreviewContainer ref={targetRef}>
        <ResumeHeader>
          {sectionVisibility.picture && (
            <ProfileImageWrapper onClick={() => fileInputRef.current?.click()} title={resumeData.personalInfo.profileImage ? 'Click to replace image' : 'Click to upload image'}>
              <ProfileImage
                imageUrl={resumeData.personalInfo.profileImage}
                style={{ cursor: 'pointer' }}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleProfileImageUpload}
                tabIndex={-1}
              />
              {!resumeData.personalInfo.profileImage && (
                <ProfileImageOverlay style={{ opacity: 1, color: '#444', background: 'rgba(255,255,255,0.85)' }}>
                  Click to upload image
                </ProfileImageOverlay>
              )}
              {resumeData.personalInfo.profileImage && (
                <ProfileImageOverlay>
                  Click to replace image
                </ProfileImageOverlay>
              )}
            </ProfileImageWrapper>
          )}
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
            {sectionVisibility.role && (
              <Role
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                onBlur={e => handlePersonalInfoChange('role', e.currentTarget.textContent || '')}
              >
                {resumeData.personalInfo.role ? resumeData.personalInfo.role : <Placeholder>Your Role</Placeholder>}
              </Role>
            )}
          </HeaderInfo>
        </ResumeHeader>
        <ResumeBody>
          <LeftColumn>
            <Section>
              <SectionTitle>PERSONAL DETAILS</SectionTitle>
              {sectionVisibility.location && (
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
              )}
              {sectionVisibility.email && (
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
              )}
              {sectionVisibility.phone && (
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
              )}
              {sectionVisibility.website && (
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
              )}
              {sectionVisibility.linkedin && (
                <ContactInfo>
                  <FontAwesomeIcon icon={faLinkedin} />
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    onBlur={e => handlePersonalInfoChange('linkedin', e.currentTarget.textContent || '')}
                    style={{ minWidth: 60 }}
                  >
                    {resumeData.personalInfo.linkedin ? resumeData.personalInfo.linkedin : <Placeholder>Enter URL</Placeholder>}
                  </span>
                </ContactInfo>
              )}
              {/* Add LinkedIn, Custom1, Custom2, etc. as needed */}
            </Section>
            {sectionVisibility.skills && (
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
            )}
          </LeftColumn>
          <RightColumn>
            {sectionVisibility.about && (
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
            )}
            {sectionVisibility.work && (
              <Section>
                <SectionTitle>EXPERIENCE</SectionTitle>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <div></div>
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
              </Section>
            )}
            {sectionVisibility.education && (
              <Section>
                <SectionTitle>EDUCATION</SectionTitle>
                {resumeData.education.map((edu, index) => (
                  <div key={edu.id} style={{ marginBottom: 18, borderRadius: 8, padding: 12 }}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 6 }}>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck={false}
                        onBlur={e => {
                          const text = e.currentTarget && typeof e.currentTarget.textContent === 'string' ? e.currentTarget.textContent : '';
                          setResumeData(prev => {
                            const updated = [...prev.education];
                            updated[index] = { ...updated[index], school: text };
                            return { ...prev, education: updated };
                          });
                        }}
                        style={{ minWidth: 60, fontWeight: 600 }}
                      >
                        {edu.school || <Placeholder>School</Placeholder>}
                      </span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck={false}
                        onBlur={e => {
                          const text = e.currentTarget && typeof e.currentTarget.textContent === 'string' ? e.currentTarget.textContent : '';
                          setResumeData(prev => {
                            const updated = [...prev.education];
                            updated[index] = { ...updated[index], degree: text };
                            return { ...prev, education: updated };
                          });
                        }}
                        style={{ minWidth: 60 }}
                      >
                        {edu.degree || <Placeholder>Degree</Placeholder>}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, color: '#666', fontSize: '0.95em', marginBottom: 6 }}>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck={false}
                        onBlur={e => {
                          const text = e.currentTarget && typeof e.currentTarget.textContent === 'string' ? e.currentTarget.textContent : '';
                          setResumeData(prev => {
                            const updated = [...prev.education];
                            updated[index] = { ...updated[index], startDate: text };
                            return { ...prev, education: updated };
                          });
                        }}
                        style={{ minWidth: 30 }}
                      >
                        {edu.startDate || <Placeholder>From</Placeholder>}
                      </span>
                      <span>-</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck={false}
                        onBlur={e => {
                          const text = e.currentTarget && typeof e.currentTarget.textContent === 'string' ? e.currentTarget.textContent : '';
                          setResumeData(prev => {
                            const updated = [...prev.education];
                            updated[index] = { ...updated[index], endDate: text };
                            return { ...prev, education: updated };
                          });
                        }}
                        style={{ minWidth: 30 }}
                      >
                        {edu.endDate || <Placeholder>Until</Placeholder>}
                      </span>
                    </div>
                    {resumeData.education.length > 1 && (
                      <button
                        onClick={() => setResumeData(prev => ({
                          ...prev,
                          education: prev.education.filter((_, i) => i !== index)
                        }))}
                        style={{ background: 'none', border: 'none', color: '#ff5252', cursor: 'pointer', fontSize: 14, padding: 0 }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setResumeData(prev => ({
                    ...prev,
                    education: [
                      ...prev.education,
                      { id: Date.now().toString(), school: '', degree: '', startDate: '', endDate: '' }
                    ]
                  }))}
                  style={{ background: '#1E88E5', color: 'white', border: 'none', borderRadius: 15, padding: '5px 15px', cursor: 'pointer', marginTop: 6 }}
                >
                  + Add Education
                </button>
              </Section>
            )}
            {sectionVisibility.languages && (
              <Section>
                <SectionTitle>LANGUAGES</SectionTitle>
                <SkillsContainer>
                  {safeLanguages.length > 0 ? safeLanguages.map((lang, index) => (
                    <Skill key={index} style={{ display: 'flex', alignItems: 'center' }}>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck={false}
                        onBlur={e => {
                          const text = e.currentTarget && typeof e.currentTarget.textContent === 'string' ? e.currentTarget.textContent : '';
                          setResumeData(prev => {
                            const langs = [...(prev.languages ?? [])];
                            langs[index] = text;
                            return { ...prev, languages: langs };
                          });
                        }}
                        style={{ minWidth: 40 }}
                      >
                        {lang || <Placeholder>Language</Placeholder>}
                      </span>
                      {safeLanguages.length > 1 && (
                        <button onClick={() => setResumeData(prev => {
                          const langs = [...(prev.languages ?? [])];
                          langs.splice(index, 1);
                          return { ...prev, languages: langs };
                        })} style={{ marginLeft: 6, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>×</button>
                      )}
                    </Skill>
                  )) : <span style={{ color: '#bbb', fontStyle: 'italic' }}>[No languages]</span>}
                  <button onClick={() => setResumeData(prev => ({ ...prev, languages: [...(prev.languages ?? []), ''] }))} style={{ background: '#1E88E5', color: 'white', border: 'none', borderRadius: 15, padding: '5px 15px', cursor: 'pointer' }}>+ Add Language</button>
                </SkillsContainer>
              </Section>
            )}
            {sectionVisibility.hobbies && (
              <Section>
                <SectionTitle>HOBBIES</SectionTitle>
                <SkillsContainer>
                  {safeHobbies.length > 0 ? safeHobbies.map((hobby, index) => (
                    <Skill key={index} style={{ display: 'flex', alignItems: 'center' }}>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck={false}
                        onBlur={e => {
                          const text = e.currentTarget && typeof e.currentTarget.textContent === 'string' ? e.currentTarget.textContent : '';
                          setResumeData(prev => {
                            const hobbies = [...(prev.hobbies ?? [])];
                            hobbies[index] = text;
                            return { ...prev, hobbies };
                          });
                        }}
                        style={{ minWidth: 40 }}
                      >
                        {hobby || <Placeholder>Hobby</Placeholder>}
                      </span>
                      {safeHobbies.length > 1 && (
                        <button onClick={() => setResumeData(prev => {
                          const hobbies = [...(prev.hobbies ?? [])];
                          hobbies.splice(index, 1);
                          return { ...prev, hobbies };
                        })} style={{ marginLeft: 6, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>×</button>
                      )}
                    </Skill>
                  )) : <span style={{ color: '#bbb', fontStyle: 'italic' }}>[No hobbies]</span>}
                  <button onClick={() => setResumeData(prev => ({ ...prev, hobbies: [...(prev.hobbies ?? []), ''] }))} style={{ background: '#1E88E5', color: 'white', border: 'none', borderRadius: 15, padding: '5px 15px', cursor: 'pointer' }}>+ Add Hobby</button>
                </SkillsContainer>
              </Section>
            )}
          </RightColumn>
        </ResumeBody>
      </PreviewContainer>
    </>
  );
};

export default ResumePreview;
