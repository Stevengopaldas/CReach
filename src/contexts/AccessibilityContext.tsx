import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useScreenReader } from '@/hooks/use-screen-reader';

interface AccessibilitySettings {
  highContrast: boolean;
  screenReader: boolean;
  signLanguage: boolean;
  magnifier: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: boolean) => void;
  resetSettings: () => void;
  screenReaderControls: {
    isReading: boolean;
    currentText: string;
    speak: (text: string) => void;
    stop: () => void;
    readPage: () => void;
    nextElement: () => void;
    previousElement: () => void;
  };
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  screenReader: false,
  signLanguage: false,
  magnifier: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('creach-accessibility-settings');
        return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
      } catch (error) {
        console.warn('Failed to load accessibility settings from localStorage:', error);
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Initialize screen reader
  const screenReader = useScreenReader(settings.screenReader);

  // Apply high contrast class to document
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    if (settings.highContrast) {
      htmlElement.classList.add('high-contrast');
    } else {
      htmlElement.classList.remove('high-contrast');
    }
    
    // Cleanup function
    return () => {
      htmlElement.classList.remove('high-contrast');
    };
  }, [settings.highContrast]);

  // Apply magnifier class to document
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    if (settings.magnifier) {
      htmlElement.classList.add('magnifier-mode');
    } else {
      htmlElement.classList.remove('magnifier-mode');
    }
    
    // Cleanup function
    return () => {
      htmlElement.classList.remove('magnifier-mode');
    };
  }, [settings.magnifier]);

  // Save to localStorage when settings change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('creach-accessibility-settings', JSON.stringify(settings));
      } catch (error) {
        console.warn('Failed to save accessibility settings to localStorage:', error);
      }
    }
  }, [settings]);

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    resetSettings,
    screenReaderControls: {
      isReading: screenReader.isReading,
      currentText: screenReader.currentText,
      speak: screenReader.speak,
      stop: screenReader.stop,
      readPage: screenReader.readPage,
      nextElement: screenReader.nextElement,
      previousElement: screenReader.previousElement,
    },
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  
  return context;
};

export default AccessibilityProvider; 