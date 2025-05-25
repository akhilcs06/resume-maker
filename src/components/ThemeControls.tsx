import React from 'react';
import { ChromePicker } from 'react-color';
import type { ColorResult } from 'react-color';
import styled from 'styled-components';

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
}

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 8px 20px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(30,136,229,0.07);
  min-height: 48px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 1000;
  border-radius: 0 0 16px 16px;
  margin-bottom: 0;
`;

const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const ToolbarLabel = styled.label`
  font-size: 1rem;
  font-weight: 500;
  margin-right: 8px;
  color: #222;
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
  margin-top: 8px;
  position: absolute;
  z-index: 1100;
`;

const ThemeControls: React.FC<ThemeControlsProps> = ({ theme, updateTheme }) => {
  const [showPrimaryPicker, setShowPrimaryPicker] = React.useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = React.useState(false);
  const primaryPickerRef = React.useRef<HTMLDivElement>(null);
  const textPickerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showPrimaryPicker && primaryPickerRef.current && !primaryPickerRef.current.contains(event.target as Node)) {
        setShowPrimaryPicker(false);
      }
      if (showTextColorPicker && textPickerRef.current && !textPickerRef.current.contains(event.target as Node)) {
        setShowTextColorPicker(false);
      }
    }
    if (showPrimaryPicker || showTextColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPrimaryPicker, showTextColorPicker]);

  const handleColorChange = (colorType: keyof ThemeControlsProps['theme'], color: ColorResult) => {
    updateTheme({ [colorType]: color.hex });
  };

  return (
    <ToolbarContainer>
      <ToolbarGroup>
        <ToolbarLabel>Primary</ToolbarLabel>
        <ColorSwatch
          color={theme.primaryColor}
          onClick={() => setShowPrimaryPicker(!showPrimaryPicker)}
        />
        {showPrimaryPicker && (
          <ColorPickerWrapper ref={primaryPickerRef} style={{ left: 0, top: 40 }}>
            <ChromePicker
              color={theme.primaryColor}
              onChange={color => handleColorChange('primaryColor', color)}
              disableAlpha
            />
          </ColorPickerWrapper>
        )}
        <ToolbarLabel>Text</ToolbarLabel>
        <ColorSwatch
          color={theme.textColor}
          onClick={() => setShowTextColorPicker(!showTextColorPicker)}
        />
        {showTextColorPicker && (
          <ColorPickerWrapper ref={textPickerRef} style={{ left: 80, top: 40 }}>
            <ChromePicker
              color={theme.textColor}
              onChange={color => handleColorChange('textColor', color)}
              disableAlpha
            />
          </ColorPickerWrapper>
        )}
      </ToolbarGroup>
    </ToolbarContainer>
  );
};

export default ThemeControls;
