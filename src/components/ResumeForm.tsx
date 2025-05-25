import React from 'react';
import styled from 'styled-components';
import type { ResumeData } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

interface ResumeFormProps {
  resumeData: ResumeData;
  updateResume: (newData: Partial<ResumeData>) => void;
}

const FormContainer = styled.div`
  margin-top: 20px;
`;

const FormSection = styled.div`
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  margin-top: 0;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  color: ${props => props.theme.primaryColor};
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  font-size: 14px;
  resize: vertical;
`;

const Button = styled.button`
  background-color: ${props => props.theme.primaryColor};
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const ItemContainer = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
`;

const FileInput = styled.div`
  position: relative;
  overflow: hidden;
  display: inline-block;
  width: 100%;
  
  & > input[type=file] {
    font-size: 100px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
  }
`;

const FileInputLabel = styled.div`
  display: inline-block;
  padding: 8px 15px;
  background-color: ${props => props.theme.primaryColor};
  color: white;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  
  &:hover {
    opacity: 0.9;
  }
`;

const ProfileImagePreview = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'imageUrl',
})<{ imageUrl?: string }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 10px;
  background-size: cover;
  background-position: center;
  background-image: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'none'};
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:empty:before {
    content: 'No Image';
    color: #888;
  }
`;

const SkillTag = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 5px;
  padding: 5px 10px;
  background-color: ${props => props.theme.primaryColor};
  color: white;
  border-radius: 15px;
  font-size: 14px;
  
  button {
    background: none;
    border: none;
    color: white;
    margin-left: 5px;
    cursor: pointer;
    padding: 0;
    font-size: 12px;
  }
`;

const SkillContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const SkillInput = styled.div`
  display: flex;
  
  input {
    flex: 1;
    margin-right: 10px;
  }
  
  button {
    flex-shrink: 0;
  }
`;

const ResumeForm: React.FC<ResumeFormProps> = ({ resumeData, updateResume }) => {
  // State for new skill input
  const [newSkill, setNewSkill] = React.useState('');
  
  // Handler for personal info updates
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateResume({
      personalInfo: {
        ...resumeData.personalInfo,
        [name]: value,
      },
    });
  };
  
  // Handler for summary update
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateResume({ summary: e.target.value });
  };
  
  // Handler for profile image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateResume({
          personalInfo: {
            ...resumeData.personalInfo,
            profileImage: reader.result as string,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handler for experience updates
  const handleExperienceChange = (index: number, field: string, value: string) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };
    updateResume({ experience: updatedExperience });
  };
  
  // Add new experience entry
  const addExperience = () => {
    const newId = Date.now().toString();
    const newExperience = {
      id: newId,
      company: 'New Employer',
      position: 'POSITION',
      startDate: 'From',
      endDate: 'Until',
      description: 'Enter your work experience description',
    };
    updateResume({ experience: [...resumeData.experience, newExperience] });
  };
  
  // Remove experience entry
  const removeExperience = (index: number) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience.splice(index, 1);
    updateResume({ experience: updatedExperience });
  };
  
  // Handler for education updates
  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    updateResume({ education: updatedEducation });
  };
  
  // Add new education entry
  const addEducation = () => {
    const newId = Date.now().toString();
    const newEducation = {
      id: newId,
      school: 'New School',
      degree: 'DEGREE',
      startDate: 'From',
      endDate: 'Until',
    };
    updateResume({ education: [...resumeData.education, newEducation] });
  };
  
  // Remove education entry
  const removeEducation = (index: number) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation.splice(index, 1);
    updateResume({ education: updatedEducation });
  };
  
  // Add a new skill
  const addSkill = () => {
    if (newSkill.trim() !== '') {
      updateResume({ skills: [...resumeData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };
  
  // Remove a skill
  const removeSkill = (index: number) => {
    const updatedSkills = [...resumeData.skills];
    updatedSkills.splice(index, 1);
    updateResume({ skills: updatedSkills });
  };
  
  return (
    <FormContainer>
      {/* Personal Information */}
      <FormSection>
        <SectionTitle>Personal Information</SectionTitle>
        
        <FormGroup>
          <Label htmlFor="name">Full Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={resumeData.personalInfo.name}
            onChange={handlePersonalInfoChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="role">Professional Role</Label>
          <Input
            type="text"
            id="role"
            name="role"
            value={resumeData.personalInfo.role}
            onChange={handlePersonalInfoChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Profile Picture</Label>
          <FileInput>
            <FileInputLabel>Choose File</FileInputLabel>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </FileInput>
          <ProfileImagePreview imageUrl={resumeData.personalInfo.profileImage} />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="location">Location</Label>
          <Input
            type="text"
            id="location"
            name="location"
            value={resumeData.personalInfo.location}
            onChange={handlePersonalInfoChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={resumeData.personalInfo.email}
            onChange={handlePersonalInfoChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="phone">Phone</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={resumeData.personalInfo.phone}
            onChange={handlePersonalInfoChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="website">Website</Label>
          <Input
            type="url"
            id="website"
            name="website"
            value={resumeData.personalInfo.website}
            onChange={handlePersonalInfoChange}
          />
        </FormGroup>
      </FormSection>
      
      {/* Professional Summary */}
      <FormSection>
        <SectionTitle>Professional Summary</SectionTitle>
        <FormGroup>
          <Label htmlFor="summary">Summary</Label>
          <TextArea
            id="summary"
            value={resumeData.summary}
            onChange={handleSummaryChange}
          />
        </FormGroup>
      </FormSection>
      
      {/* Work Experience */}
      <FormSection>
        <SectionTitle>Work Experience</SectionTitle>
        
        {resumeData.experience.map((exp, index) => (
          <ItemContainer key={exp.id}>
            <FormGroup>
              <Label>Company</Label>
              <Input
                type="text"
                value={exp.company}
                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Position</Label>
              <Input
                type="text"
                value={exp.position}
                onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
              />
            </FormGroup>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <FormGroup style={{ flex: 1 }}>
                <Label>Start Date</Label>
                <Input
                  type="text"
                  value={exp.startDate}
                  onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup style={{ flex: 1 }}>
                <Label>End Date</Label>
                <Input
                  type="text"
                  value={exp.endDate}
                  onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                />
              </FormGroup>
            </div>
            
            <FormGroup>
              <Label>Description</Label>
              <TextArea
                value={exp.description}
                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
              />
            </FormGroup>
            
            {resumeData.experience.length > 1 && (
              <DeleteButton onClick={() => removeExperience(index)}>
                <FontAwesomeIcon icon={faTrash} /> Remove
              </DeleteButton>
            )}
          </ItemContainer>
        ))}
        
        <Button onClick={addExperience}>
          <FontAwesomeIcon icon={faPlus} /> Add Experience
        </Button>
      </FormSection>
      
      {/* Education */}
      <FormSection>
        <SectionTitle>Education</SectionTitle>
        
        {resumeData.education.map((edu, index) => (
          <ItemContainer key={edu.id}>
            <FormGroup>
              <Label>School</Label>
              <Input
                type="text"
                value={edu.school}
                onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Degree</Label>
              <Input
                type="text"
                value={edu.degree}
                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
              />
            </FormGroup>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <FormGroup style={{ flex: 1 }}>
                <Label>Start Date</Label>
                <Input
                  type="text"
                  value={edu.startDate}
                  onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup style={{ flex: 1 }}>
                <Label>End Date</Label>
                <Input
                  type="text"
                  value={edu.endDate}
                  onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                />
              </FormGroup>
            </div>
            
            {resumeData.education.length > 1 && (
              <DeleteButton onClick={() => removeEducation(index)}>
                <FontAwesomeIcon icon={faTrash} /> Remove
              </DeleteButton>
            )}
          </ItemContainer>
        ))}
        
        <Button onClick={addEducation}>
          <FontAwesomeIcon icon={faPlus} /> Add Education
        </Button>
      </FormSection>
      
      {/* Skills */}
      <FormSection>
        <SectionTitle>Skills</SectionTitle>
        
        <SkillContainer>
          {resumeData.skills.map((skill, index) => (
            <SkillTag key={index}>
              {skill}
              <button onClick={() => removeSkill(index)}>×</button>
            </SkillTag>
          ))}
        </SkillContainer>
        
        <SkillInput>
          <Input
            type="text"
            placeholder="Add a skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          />
          <Button onClick={addSkill}>
            <FontAwesomeIcon icon={faPlus} /> Add
          </Button>
        </SkillInput>
      </FormSection>
    </FormContainer>
  );
};

export default ResumeForm;
