import type { FC } from 'react';
import type { ResumeData } from '../App';

export interface ClassicResumeLayoutProps {
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

declare const ClassicResumeLayout: FC<ClassicResumeLayoutProps>;
export default ClassicResumeLayout;
