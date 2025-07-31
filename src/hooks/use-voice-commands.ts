import { useState, useEffect, useCallback, useRef } from 'react';
import { useGlobalAccessibility } from './use-accessibility';

interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
  category: 'navigation' | 'accessibility' | 'task' | 'general';
}

interface UseVoiceCommandsProps {
  onModuleChange?: (module: string) => void;
  onTaskAdd?: (taskText: string, priority?: string) => void;
}

export const useVoiceCommands = ({ onModuleChange, onTaskAdd }: UseVoiceCommandsProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [commandResult, setCommandResult] = useState<string>('');
  const [isSupported, setIsSupported] = useState(false);
  
  const { updateSetting, toggleHighContrast, toggleMagnifier, toggleScreenReader } = useGlobalAccessibility();
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';
        recognitionInstance.maxAlternatives = 1;
        
        setRecognition(recognitionInstance);
        setIsSupported(true);
      } else {
        setIsSupported(false);
        console.warn('Speech recognition not supported in this browser');
      }
    }
  }, []);

  // Define voice commands
  const commands: VoiceCommand[] = [
    // Navigation commands
    {
      command: 'open dashboard',
      action: () => onModuleChange?.('dashboard'),
      description: 'Opens the main dashboard',
      category: 'navigation'
    },
    {
      command: 'open workplace assistant',
      action: () => onModuleChange?.('workplace-assistant'),
      description: 'Opens workplace assistant',
      category: 'navigation'
    },
    {
      command: 'open smart navigation',
      action: () => onModuleChange?.('smart-navigation'),
      description: 'Opens smart navigation module',
      category: 'navigation'
    },
    {
      command: 'open communication hub',
      action: () => onModuleChange?.('communication-hub'),
      description: 'Opens communication hub',
      category: 'navigation'
    },
    {
      command: 'open focus comfort',
      action: () => onModuleChange?.('focus-comfort'),
      description: 'Opens focus and comfort module',
      category: 'navigation'
    },
    {
      command: 'open ergonomic coach',
      action: () => onModuleChange?.('ergonomic-coach'),
      description: 'Opens ergonomic coach',
      category: 'navigation'
    },
    {
      command: 'open buddy assist',
      action: () => onModuleChange?.('buddy-assist'),
      description: 'Opens buddy assist module',
      category: 'navigation'
    },
    {
      command: 'open career tracker',
      action: () => onModuleChange?.('career-tracker'),
      description: 'Opens career tracker',
      category: 'navigation'
    },
    {
      command: 'open social circle',
      action: () => onModuleChange?.('social-circle'),
      description: 'Opens social circle',
      category: 'navigation'
    },
    {
      command: 'open translator',
      action: () => onModuleChange?.('translator'),
      description: 'Opens translator module',
      category: 'navigation'
    },

    // Accessibility commands
    {
      command: 'enable high contrast',
      action: () => {
        updateSetting('highContrast', true);
        setCommandResult('High contrast mode enabled');
      },
      description: 'Enables high contrast mode',
      category: 'accessibility'
    },
    {
      command: 'disable high contrast',
      action: () => {
        updateSetting('highContrast', false);
        setCommandResult('High contrast mode disabled');
      },
      description: 'Disables high contrast mode',
      category: 'accessibility'
    },
    {
      command: 'toggle high contrast',
      action: () => {
        toggleHighContrast();
        setCommandResult('High contrast mode toggled');
      },
      description: 'Toggles high contrast mode',
      category: 'accessibility'
    },
    {
      command: 'enable magnifier',
      action: () => {
        updateSetting('magnifier', true);
        setCommandResult('Digital magnifier enabled');
      },
      description: 'Enables digital magnifier',
      category: 'accessibility'
    },
    {
      command: 'disable magnifier',
      action: () => {
        updateSetting('magnifier', false);
        setCommandResult('Digital magnifier disabled');
      },
      description: 'Disables digital magnifier',
      category: 'accessibility'
    },
    {
      command: 'toggle magnifier',
      action: () => {
        toggleMagnifier();
        setCommandResult('Digital magnifier toggled');
      },
      description: 'Toggles digital magnifier',
      category: 'accessibility'
    },
    {
      command: 'enable screen reader',
      action: () => {
        updateSetting('screenReader', true);
        setCommandResult('Screen reader support enabled');
      },
      description: 'Enables screen reader support',
      category: 'accessibility'
    },
    {
      command: 'disable screen reader',
      action: () => {
        updateSetting('screenReader', false);
        setCommandResult('Screen reader support disabled');
      },
      description: 'Disables screen reader support',
      category: 'accessibility'
    },

    // Task commands
    {
      command: 'add task',
      action: () => {
        setCommandResult('Please specify the task. Say "add task" followed by the task description.');
      },
      description: 'Prompts for task creation',
      category: 'task'
    },
    {
      command: 'schedule meeting',
      action: () => {
        onTaskAdd?.('Schedule meeting', 'medium');
        setCommandResult('Meeting scheduled in your task list');
      },
      description: 'Adds a meeting task',
      category: 'task'
    },
    {
      command: 'add high priority task',
      action: () => {
        setCommandResult('Please specify the high priority task description.');
      },
      description: 'Prompts for high priority task creation',
      category: 'task'
    },

    // General commands
    {
      command: 'help',
      action: () => {
        setCommandResult('Available commands: Open modules, toggle accessibility features, add tasks. Say "list commands" for full list.');
      },
      description: 'Shows help information',
      category: 'general'
    },
    {
      command: 'list commands',
      action: () => {
        const commandList = commands.map(cmd => cmd.command).join(', ');
        setCommandResult(`Available commands: ${commandList}`);
      },
      description: 'Lists all available commands',
      category: 'general'
    }
  ];

  // Process recognized speech
  const processCommand = useCallback((transcript: string) => {
    const normalizedTranscript = transcript.toLowerCase().trim();
    setLastCommand(transcript);

    // Find exact match first
    let matchedCommand = commands.find(cmd => 
      cmd.command.toLowerCase() === normalizedTranscript
    );

    // If no exact match, try partial matching
    if (!matchedCommand) {
      matchedCommand = commands.find(cmd => 
        normalizedTranscript.includes(cmd.command.toLowerCase()) ||
        cmd.command.toLowerCase().includes(normalizedTranscript)
      );
    }

    // Handle dynamic task creation
    if (!matchedCommand && normalizedTranscript.startsWith('add task ')) {
      const taskText = normalizedTranscript.replace('add task ', '');
      if (taskText.trim()) {
        const priority = normalizedTranscript.includes('urgent') || normalizedTranscript.includes('high priority') 
          ? 'high' 
          : normalizedTranscript.includes('low priority') 
          ? 'low' 
          : 'medium';
        
        onTaskAdd?.(taskText, priority);
        setCommandResult(`Task "${taskText}" added with ${priority} priority`);
        return;
      }
    }

    if (matchedCommand) {
      try {
        matchedCommand.action();
        if (!commandResult) { // Only set default result if action didn't set one
          setCommandResult(`Command "${matchedCommand.command}" executed successfully`);
        }
      } catch (error) {
        setCommandResult(`Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      setCommandResult(`Command "${transcript}" not recognized. Say "help" for available commands.`);
    }
  }, [commands, onModuleChange, onTaskAdd, updateSetting, toggleHighContrast, toggleMagnifier, toggleScreenReader, commandResult]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognition || !isSupported) {
      setCommandResult('Speech recognition not supported in this browser');
      return;
    }

    setIsListening(true);
    setCommandResult('Listening... Please speak your command');
    setLastCommand('');

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      processCommand(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setCommandResult(`Error: ${event.error}. Please try again.`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
      
      // Auto-stop after 10 seconds
      timeoutRef.current = setTimeout(() => {
        if (isListening) {
          recognition.stop();
          setCommandResult('Listening timeout. Please try again.');
        }
      }, 10000);
    } catch (error) {
      setCommandResult('Failed to start voice recognition. Please try again.');
      setIsListening(false);
    }
  }, [recognition, isSupported, processCommand, isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
      setCommandResult('Voice recognition stopped');
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [recognition, isListening]);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Clear results after 5 seconds
  useEffect(() => {
    if (commandResult) {
      const timer = setTimeout(() => {
        setCommandResult('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [commandResult]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    lastCommand,
    commandResult,
    commands,
    startListening,
    stopListening,
    toggleListening,
  };
};

export default useVoiceCommands; 