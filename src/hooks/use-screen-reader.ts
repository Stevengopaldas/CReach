import { useState, useEffect, useCallback, useRef } from 'react';

interface ScreenReaderOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
}

interface UseScreenReaderReturn {
  isEnabled: boolean;
  isReading: boolean;
  currentText: string;
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  readElement: (element: HTMLElement) => void;
  readPage: () => void;
  nextElement: () => void;
  previousElement: () => void;
  setOptions: (options: ScreenReaderOptions) => void;
  availableVoices: SpeechSynthesisVoice[];
}

export const useScreenReader = (enabled: boolean = false): UseScreenReaderReturn => {
  const [isReading, setIsReading] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const readableElementsRef = useRef<HTMLElement[]>([]);
  
  const [options, setOptionsState] = useState<ScreenReaderOptions>({
    rate: 1,
    pitch: 1,
    volume: 1,
    voice: null
  });

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      // Load available voices
      const loadVoices = () => {
        const voices = synthRef.current?.getVoices() || [];
        setAvailableVoices(voices);
      };
      
      loadVoices();
      synthRef.current.onvoiceschanged = loadVoices;
    }
  }, []);

  // Get readable elements from the page
  const getReadableElements = useCallback((): HTMLElement[] => {
    const selectors = [
      'h1, h2, h3, h4, h5, h6',
      'p',
      'button',
      'a',
      'label',
      'input[type="text"], input[type="email"], textarea',
      '[role="button"]',
      '[aria-label]',
      '.card h3',
      '.card p'
    ];
    
    const elements: HTMLElement[] = [];
    selectors.forEach(selector => {
      const found = document.querySelectorAll(selector);
      found.forEach(el => {
        if (el instanceof HTMLElement && isElementVisible(el)) {
          elements.push(el);
        }
      });
    });
    
    return elements.sort((a, b) => {
      const aRect = a.getBoundingClientRect();
      const bRect = b.getBoundingClientRect();
      if (aRect.top !== bRect.top) {
        return aRect.top - bRect.top;
      }
      return aRect.left - bRect.left;
    });
  }, []);

  // Check if element is visible
  const isElementVisible = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.visibility !== 'hidden' &&
      style.display !== 'none' &&
      style.opacity !== '0'
    );
  };

  // Get text content from element
  const getElementText = (element: HTMLElement): string => {
    // Check for aria-label first
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    
    // Check for alt text on images
    if (element.tagName === 'IMG') {
      const alt = element.getAttribute('alt');
      if (alt) return alt;
    }
    
    // Check for input labels
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label) return label.textContent || '';
      
      const placeholder = element.getAttribute('placeholder');
      if (placeholder) return `Input field: ${placeholder}`;
    }
    
    // Get text content
    let text = element.textContent?.trim() || '';
    
    // Add context for interactive elements
    if (element.tagName === 'BUTTON') {
      text = `Button: ${text}`;
    } else if (element.tagName === 'A') {
      text = `Link: ${text}`;
    } else if (element.tagName.match(/^H[1-6]$/)) {
      text = `Heading: ${text}`;
    }
    
    return text;
  };

  // Speak text function
  const speak = useCallback((text: string) => {
    if (!synthRef.current || !enabled) return;
    
    // Stop any current speech
    synthRef.current.cancel();
    
    if (!text.trim()) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    
    if (options.voice) {
      utterance.voice = options.voice;
    }
    
    utterance.onstart = () => {
      setIsReading(true);
      setCurrentText(text);
    };
    
    utterance.onend = () => {
      setIsReading(false);
      setCurrentText('');
    };
    
    utterance.onerror = () => {
      setIsReading(false);
      setCurrentText('');
    };
    
    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, [enabled, options]);

  // Stop speaking
  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsReading(false);
      setCurrentText('');
    }
  }, []);

  // Pause speaking
  const pause = useCallback(() => {
    if (synthRef.current && isReading) {
      synthRef.current.pause();
    }
  }, [isReading]);

  // Resume speaking
  const resume = useCallback(() => {
    if (synthRef.current && isReading) {
      synthRef.current.resume();
    }
  }, [isReading]);

  // Read specific element
  const readElement = useCallback((element: HTMLElement) => {
    const text = getElementText(element);
    if (text) {
      // Highlight element
      element.style.outline = '3px solid #007ACC';
      element.style.outlineOffset = '2px';
      
      speak(text);
      
      // Remove highlight after reading
      setTimeout(() => {
        element.style.outline = '';
        element.style.outlineOffset = '';
      }, 3000);
    }
  }, [speak]);

  // Read entire page
  const readPage = useCallback(() => {
    const elements = getReadableElements();
    readableElementsRef.current = elements;
    setCurrentElementIndex(0);
    
    if (elements.length > 0) {
      const pageTitle = document.title;
      const headings = elements.filter(el => el.tagName.match(/^H[1-6]$/));
      const mainContent = elements.filter(el => !el.tagName.match(/^H[1-6]$/));
      
      let pageText = `Page: ${pageTitle}. `;
      
      if (headings.length > 0) {
        pageText += `This page has ${headings.length} headings. `;
      }
      
      // Read first few elements
      const firstElements = elements.slice(0, 5);
      firstElements.forEach(el => {
        const text = getElementText(el);
        if (text) pageText += `${text}. `;
      });
      
      speak(pageText);
    }
  }, [speak, getReadableElements]);

  // Navigate to next element
  const nextElement = useCallback(() => {
    const elements = readableElementsRef.current;
    if (elements.length === 0) {
      readableElementsRef.current = getReadableElements();
    }
    
    const nextIndex = (currentElementIndex + 1) % readableElementsRef.current.length;
    setCurrentElementIndex(nextIndex);
    
    const element = readableElementsRef.current[nextIndex];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      readElement(element);
    }
  }, [currentElementIndex, readElement, getReadableElements]);

  // Navigate to previous element
  const previousElement = useCallback(() => {
    const elements = readableElementsRef.current;
    if (elements.length === 0) {
      readableElementsRef.current = getReadableElements();
    }
    
    const prevIndex = currentElementIndex === 0 
      ? readableElementsRef.current.length - 1 
      : currentElementIndex - 1;
    setCurrentElementIndex(prevIndex);
    
    const element = readableElementsRef.current[prevIndex];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      readElement(element);
    }
  }, [currentElementIndex, readElement, getReadableElements]);

  // Set screen reader options
  const setOptions = useCallback((newOptions: ScreenReaderOptions) => {
    setOptionsState(prev => ({ ...prev, ...newOptions }));
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (!enabled) return;
    
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only respond to screen reader shortcuts when Alt + Shift are pressed
      if (!event.altKey || !event.shiftKey) return;
      
      switch (event.code) {
        case 'KeyS':
          event.preventDefault();
          stop();
          break;
        case 'KeyR':
          event.preventDefault();
          readPage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextElement();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          previousElement();
          break;
        case 'Space':
          event.preventDefault();
          if (isReading) {
            pause();
          } else {
            resume();
          }
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [enabled, stop, readPage, nextElement, previousElement, pause, resume, isReading]);

  // Announce when screen reader is enabled
  useEffect(() => {
    if (enabled && synthRef.current) {
      speak('Screen reader enabled. Use Alt + Shift + R to read page, Alt + Shift + arrows to navigate, Alt + Shift + S to stop.');
    } else if (!enabled && synthRef.current) {
      stop();
    }
  }, [enabled, speak, stop]);

  // Click handler for elements
  useEffect(() => {
    if (!enabled) return;
    
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && target.tagName) {
        readElement(target);
      }
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [enabled, readElement]);

  return {
    isEnabled: enabled,
    isReading,
    currentText,
    speak,
    stop,
    pause,
    resume,
    readElement,
    readPage,
    nextElement,
    previousElement,
    setOptions,
    availableVoices,
  };
};

export default useScreenReader; 