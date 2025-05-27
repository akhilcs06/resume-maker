import React, { useState, useRef } from 'react';
import { ChromePicker } from 'react-color';
import type { ColorResult } from 'react-color';
import styled from 'styled-components';

type SectionVisibilityState = {
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

interface ThemeControlsProps {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    backgroundColor: string;
    headingFont: string;
    bodyFont: string;
  };
  updateTheme: (newTheme: Partial<ThemeControlsProps['theme']>) => void;
  sectionVisibility: SectionVisibilityState;
  setSectionVisibility: React.Dispatch<React.SetStateAction<SectionVisibilityState>>;
}

interface SidebarContainerProps {
  $isOpen: boolean;
}

const SidebarContainer = styled.div<SidebarContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 24px 8px;
  background: #fff;
  box-shadow: 2px 0 12px rgba(30,136,229,0.07);
  min-width: 80px;
  top: 64px;
  height: calc(100vh - 64px);
  position: fixed;
  left: 0;
  z-index: 1000;
  border-radius: 0 16px 16px 0;
  transition: transform 0.3s ease;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
    width: 260px;
    max-width: 90vw;
    padding-bottom: 80px;
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  left: 20px;
  top: 20px;
  z-index: 1001;
  background: #1E88E5;
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  display: none;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const SidebarGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  padding: 0 16px;
`;

const SidebarLabel = styled.label`
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 6px;
  color: #222;
  width: 100%;
  text-align: left;
`;

const ColorSwatch = styled.div<{ color: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  background-color: ${props => props.color};
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(30,136,229,0.08);
  transition: box-shadow 0.15s;
  &:hover {
    box-shadow: 0 2px 8px rgba(30,136,229,0.18);
  }
`;

const ColorPickerWrapper = styled.div`
  position: absolute;
  z-index: 1100;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
`;

const SectionToggleContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(30,136,229,0.08);
  padding: 18px 18px 10px 18px;
  margin-top: 32px;
  width: 100%;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  margin-left: 12px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #e0e0e0;
    transition: 0.3s;
    border-radius: 24px;
  }

  span:before {
    position: absolute;
    content: '';
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
    box-shadow: 0 1px 4px rgba(30,136,229,0.08);
  }

  input:checked + span {
    background-color: #1E88E5;
  }

  input:checked + span:before {
    transform: translateX(20px);
  }
`;

const ThemeControls: React.FC<ThemeControlsProps> = ({
  theme,
  updateTheme,
  sectionVisibility,
  setSectionVisibility
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const primaryPickerRef = useRef<HTMLDivElement>(null);
  const textPickerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (primaryPickerRef.current && !primaryPickerRef.current.contains(event.target as Node)) {
      setShowPrimaryPicker(false);
    }
    if (textPickerRef.current && !textPickerRef.current.contains(event.target as Node)) {
      setShowTextColorPicker(false);
    }
  };

  React.useEffect(() => {
    if (showPrimaryPicker || showTextColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPrimaryPicker, showTextColorPicker]);

  const handleToggleSection = (key: keyof SectionVisibilityState) => {
    setSectionVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleColorChange = (key: keyof typeof theme, color: ColorResult) => {
    updateTheme({ [key]: color.hex });
  };

  return (
    <>
      <ToggleButton onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle theme controls">
        {sidebarOpen ? '×' : '⚙️'}
      </ToggleButton>
      <SidebarContainer $isOpen={sidebarOpen}>
        <SidebarGroup>
          <SidebarLabel>Colors</SidebarLabel>
          <ColorSwatch
            color={theme.primaryColor}
            onClick={() => setShowPrimaryPicker(!showPrimaryPicker)}
          />
          {showPrimaryPicker && (
            <ColorPickerWrapper ref={primaryPickerRef}>
              <ChromePicker
                color={theme.primaryColor}
                onChange={color => handleColorChange('primaryColor', color)}
                disableAlpha
              />
            </ColorPickerWrapper>
          )}
          <ColorSwatch
            color={theme.textColor}
            onClick={() => setShowTextColorPicker(!showTextColorPicker)}
          />
          {showTextColorPicker && (
            <ColorPickerWrapper ref={textPickerRef}>
              <ChromePicker
                color={theme.textColor}
                onChange={color => handleColorChange('textColor', color)}
                disableAlpha
              />
            </ColorPickerWrapper>
          )}
        </SidebarGroup>
        <SectionToggleContainer>
          {Object.entries(sectionVisibility).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ textTransform: 'capitalize' }}>{key}</span>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleToggleSection(key as keyof SectionVisibilityState)}
                  />
                  <span />
                </ToggleSwitch>
              </label>
            </div>
          ))}
        </SectionToggleContainer>
      </SidebarContainer>
    </>
  );
};

export default ThemeControls;
