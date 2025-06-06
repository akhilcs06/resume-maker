import React from 'react';
import styled from 'styled-components';
import type { ResumeData } from '../App';

interface ClassicResumeLayoutProps {
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

const ClassicResumeLayout: React.FC<ClassicResumeLayoutProps> = ({
  resumeData,
  setResumeData,
  sectionVisibility,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePersonalInfoChange = (
    field: keyof ResumeData['personalInfo'],
    value: string,
  ) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

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

  const handleExperienceChange = (
    id: string,
    field: keyof ResumeData['experience'][0],
    value: string,
  ) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    }));
  };

  const handleAddExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          company: 'Company',
          position: 'Position',
          startDate: 'Start',
          endDate: 'End',
          description: 'Description',
        },
      ],
    }));
  };

  const handleRemoveExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }));
  };

  const handleEducationChange = (
    id: string,
    field: keyof ResumeData['education'][0],
    value: string,
  ) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu,
      ),
    }));
  };

  const handleAddEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          school: 'School',
          degree: 'DEGREE',
          startDate: 'From',
          endDate: 'Until',
        },
      ],
    }));
  };

  const handleRemoveEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  };

  const handleSkillChange = (index: number, value: string) => {
    setResumeData(prev => {
      const skills = [...prev.skills];
      skills[index] = value;
      return { ...prev, skills };
    });
  };

  const handleAddSkill = () => {
    setResumeData(prev => ({ ...prev, skills: [...prev.skills, ''] }));
  };

  const handleRemoveSkill = (index: number) => {
    setResumeData(prev => {
      const skills = prev.skills.filter((_, i) => i !== index);
      return { ...prev, skills };
    });
  };

  const safeLanguages = resumeData.languages ?? [];
  const safeHobbies = resumeData.hobbies ?? [];

  return (
    <Container>
      <Header>
        <div>
          <Name
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={e =>
              handlePersonalInfoChange('name', e.currentTarget.textContent || '')
            }
          >
            {resumeData.personalInfo.name}
          </Name>
          {sectionVisibility.role && (
            <Role
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              onBlur={e =>
                handlePersonalInfoChange('role', e.currentTarget.textContent || '')
              }
            >
              {resumeData.personalInfo.role}
            </Role>
          )}
        </div>
        {sectionVisibility.picture && (
          <div style={{ position: 'relative' }}>
            <ProfileImage
              src={resumeData.personalInfo.profileImage || ''}
              alt="Profile"
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: 'pointer' }}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleProfileImageUpload}
            />
          </div>
        )}
      </Header>

      {sectionVisibility.location && (
        <p
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onBlur={e =>
            handlePersonalInfoChange('location', e.currentTarget.textContent || '')
          }
        >
          {resumeData.personalInfo.location}
        </p>
      )}
      {sectionVisibility.email && (
        <p
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onBlur={e =>
            handlePersonalInfoChange('email', e.currentTarget.textContent || '')
          }
        >
          {resumeData.personalInfo.email}
        </p>
      )}
      {sectionVisibility.phone && (
        <p
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onBlur={e =>
            handlePersonalInfoChange('phone', e.currentTarget.textContent || '')
          }
        >
          {resumeData.personalInfo.phone}
        </p>
      )}
      {sectionVisibility.website && (
        <p
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onBlur={e =>
            handlePersonalInfoChange('website', e.currentTarget.textContent || '')
          }
        >
          {resumeData.personalInfo.website}
        </p>
      )}
      {sectionVisibility.linkedin && (
        <p
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onBlur={e =>
            handlePersonalInfoChange('linkedin', e.currentTarget.textContent || '')
          }
        >
          {resumeData.personalInfo.linkedin}
        </p>
      )}

      {sectionVisibility.about && (
        <Section>
          <SectionTitle>Summary</SectionTitle>
          <p
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={e => handleSummaryChange(e.currentTarget.textContent || '')}
          >
            {resumeData.summary}
          </p>
        </Section>
      )}

      {sectionVisibility.work && (
        <Section>
          <SectionTitle>Experience</SectionTitle>
          {resumeData.experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: 16 }}>
              <strong
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                onBlur={e =>
                  handleExperienceChange(exp.id, 'position', e.currentTarget.textContent || '')
                }
              >
                {exp.position}
              </strong>{' '}
              -
              <span
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                onBlur={e =>
                  handleExperienceChange(exp.id, 'company', e.currentTarget.textContent || '')
                }
              >
                {exp.company}
              </span>
              <div style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={e =>
                    handleExperienceChange(exp.id, 'startDate', e.currentTarget.textContent || '')
                  }
                >
                  {exp.startDate}
                </span>{' '}
                -{' '}
                <span
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={e =>
                    handleExperienceChange(exp.id, 'endDate', e.currentTarget.textContent || '')
                  }
                >
                  {exp.endDate}
                </span>
              </div>
              <div
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                onBlur={e =>
                  handleExperienceChange(exp.id, 'description', e.currentTarget.textContent || '')
                }
              >
                {exp.description}
              </div>
              {resumeData.experience.length > 1 && (
                <button
                  onClick={() => handleRemoveExperience(exp.id)}
                  style={{ marginTop: 4 }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button onClick={handleAddExperience}>+ Add Experience</button>
        </Section>
      )}

      {sectionVisibility.education && (
        <Section>
          <SectionTitle>Education</SectionTitle>
          {resumeData.education.map(edu => (
            <div key={edu.id} style={{ marginBottom: 16 }}>
              <strong
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                onBlur={e =>
                  handleEducationChange(edu.id, 'school', e.currentTarget.textContent || '')
                }
              >
                {edu.school}
              </strong>{' '}
              -
              <span
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                onBlur={e =>
                  handleEducationChange(edu.id, 'degree', e.currentTarget.textContent || '')
                }
              >
                {edu.degree}
              </span>
              <div style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={e =>
                    handleEducationChange(edu.id, 'startDate', e.currentTarget.textContent || '')
                  }
                >
                  {edu.startDate}
                </span>{' '}
                -{' '}
                <span
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={e =>
                    handleEducationChange(edu.id, 'endDate', e.currentTarget.textContent || '')
                  }
                >
                  {edu.endDate}
                </span>
              </div>
              {resumeData.education.length > 1 && (
                <button
                  onClick={() => handleRemoveEducation(edu.id)}
                  style={{ marginTop: 4 }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button onClick={handleAddEducation}>+ Add Education</button>
        </Section>
      )}

      {sectionVisibility.skills && (
        <Section>
          <SectionTitle>Skills</SectionTitle>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {resumeData.skills.map((skill, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={e => handleSkillChange(idx, e.currentTarget.textContent || '')}
                >
                  {skill}
                </span>
                {resumeData.skills.length > 1 && (
                  <button onClick={() => handleRemoveSkill(idx)} style={{ marginLeft: 6 }}>
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
          <button onClick={handleAddSkill}>+ Add Skill</button>
        </Section>
      )}

      {sectionVisibility.languages && (
        <Section>
          <SectionTitle>Languages</SectionTitle>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {safeLanguages.map((lang, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={e => {
                    const text = e.currentTarget.textContent || '';
                    setResumeData(prev => {
                      const langs = [...(prev.languages ?? [])];
                      langs[idx] = text;
                      return { ...prev, languages: langs };
                    });
                  }}
                >
                  {lang}
                </span>
                {safeLanguages.length > 1 && (
                  <button
                    onClick={() => {
                      setResumeData(prev => {
                        const langs = [...(prev.languages ?? [])];
                        langs.splice(idx, 1);
                        return { ...prev, languages: langs };
                      });
                    }}
                    style={{ marginLeft: 6 }}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
          <button
            onClick={() =>
              setResumeData(prev => ({
                ...prev,
                languages: [...(prev.languages ?? []), ''],
              }))
            }
          >
            + Add Language
          </button>
        </Section>
      )}

      {sectionVisibility.hobbies && (
        <Section>
          <SectionTitle>Hobbies</SectionTitle>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {safeHobbies.map((hobby, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={e => {
                    const text = e.currentTarget.textContent || '';
                    setResumeData(prev => {
                      const hobbies = [...(prev.hobbies ?? [])];
                      hobbies[idx] = text;
                      return { ...prev, hobbies };
                    });
                  }}
                >
                  {hobby}
                </span>
                {safeHobbies.length > 1 && (
                  <button
                    onClick={() => {
                      setResumeData(prev => {
                        const hobbies = [...(prev.hobbies ?? [])];
                        hobbies.splice(idx, 1);
                        return { ...prev, hobbies };
                      });
                    }}
                    style={{ marginLeft: 6 }}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
          <button
            onClick={() =>
              setResumeData(prev => ({
                ...prev,
                hobbies: [...(prev.hobbies ?? []), ''],
              }))
            }
          >
            + Add Hobby
          </button>
        </Section>
      )}
    </Container>
  );
};

export default ClassicResumeLayout;
