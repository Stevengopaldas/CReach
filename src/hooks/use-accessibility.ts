import { useAccessibility } from '@/contexts/AccessibilityContext';

/**
 * Utility hook for accessing accessibility settings throughout the application
 * 
 * @returns {object} Accessibility settings and controls
 * @example
 * const { isHighContrast, toggleHighContrast, screenReader } = useGlobalAccessibility();
 */
export const useGlobalAccessibility = () => {
  const { settings, updateSetting, screenReaderControls } = useAccessibility();
  
  return {
    // Individual setting accessors
    isHighContrast: settings.highContrast,
    isScreenReader: settings.screenReader,
    isSignLanguage: settings.signLanguage,
    isMagnifier: settings.magnifier,
    
    // All settings object
    settings,
    
    // Quick toggle functions
    toggleHighContrast: () => updateSetting('highContrast', !settings.highContrast),
    toggleScreenReader: () => updateSetting('screenReader', !settings.screenReader),
    toggleSignLanguage: () => updateSetting('signLanguage', !settings.signLanguage),
    toggleMagnifier: () => updateSetting('magnifier', !settings.magnifier),
    
    // Screen reader controls
    screenReader: {
      isEnabled: settings.screenReader,
      isReading: screenReaderControls.isReading,
      currentText: screenReaderControls.currentText,
      speak: screenReaderControls.speak,
      stop: screenReaderControls.stop,
      readPage: screenReaderControls.readPage,
      nextElement: screenReaderControls.nextElement,
      previousElement: screenReaderControls.previousElement,
    },
    
    // General update function
    updateSetting,
  };
};

export default useGlobalAccessibility; 