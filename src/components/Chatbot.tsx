import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Volume2, Minimize2, Maximize2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm CReach Assistant, your workplace accessibility guide. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        "Show me navigation help",
        "Accessibility features",
        "Emergency assistance",
        "Translate something"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "How do I use voice commands?",
    "Where is the nearest accessible restroom?",
    "Set up my workspace",
    "Join a meeting with captions",
    "Find a buddy for assistance",
    "Report an accessibility issue"
  ];

  const botResponses = {
    navigation: "I can help you navigate the office! The Smart Navigation module provides indoor maps, accessible routes, and voice guidance. Would you like me to open it for you?",
    accessibility: "CReach offers many accessibility features including screen readers, magnification, high contrast modes, voice commands, and real-time captions. Which feature interests you?",
    emergency: "For emergency assistance, use the red emergency button in the Workplace Assistant, or say 'Emergency Help' as a voice command. I can also connect you to security or first aid.",
    voice: "Voice commands are available throughout CReach! Try saying 'Navigate to restroom', 'Start meeting captions', or 'Emergency help'. Enable voice in the Workplace Assistant module.",
    translate: "The Translation module supports 12 languages with text-to-speech, sign language recognition, and visual dictionaries. What would you like to translate?",
    workspace: "The Ergonomic Coach can help set up your workspace! It provides posture monitoring, desk setup recommendations, and exercise guidance.",
    meeting: "The Communication Hub provides live transcripts, audio-to-text conversion, and sign language interpretation for meetings. Want me to show you?"
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: botResponse.suggestions
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateBotResponse = (userText: string) => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('navigation') || lowerText.includes('navigate') || lowerText.includes('find') || lowerText.includes('where')) {
      return {
        text: botResponses.navigation,
        suggestions: ["Open Smart Navigation", "Show me accessible routes", "Voice guidance help"]
      };
    } else if (lowerText.includes('accessibility') || lowerText.includes('screen reader') || lowerText.includes('contrast')) {
      return {
        text: botResponses.accessibility,
        suggestions: ["Screen reader setup", "High contrast mode", "Magnification tools", "Voice commands"]
      };
    } else if (lowerText.includes('emergency') || lowerText.includes('help') || lowerText.includes('urgent')) {
      return {
        text: botResponses.emergency,
        suggestions: ["Show emergency features", "Contact security", "First aid assistance"]
      };
    } else if (lowerText.includes('voice') || lowerText.includes('command') || lowerText.includes('speak')) {
      return {
        text: botResponses.voice,
        suggestions: ["Enable voice commands", "Voice command list", "Practice voice commands"]
      };
    } else if (lowerText.includes('translate') || lowerText.includes('language') || lowerText.includes('sign')) {
      return {
        text: botResponses.translate,
        suggestions: ["Open Translator", "Sign language help", "Common phrases"]
      };
    } else if (lowerText.includes('workspace') || lowerText.includes('desk') || lowerText.includes('ergonomic')) {
      return {
        text: botResponses.workspace,
        suggestions: ["Open Ergonomic Coach", "Posture check", "Desk setup guide"]
      };
    } else if (lowerText.includes('meeting') || lowerText.includes('caption') || lowerText.includes('transcript')) {
      return {
        text: botResponses.meeting,
        suggestions: ["Open Communication Hub", "Start live captions", "Meeting accessibility"]
      };
    } else {
      return {
        text: "I understand you're looking for help with CReach. I can assist with navigation, accessibility features, emergency support, translations, workspace setup, and meeting assistance. What specific area interests you?",
        suggestions: ["Navigation help", "Accessibility features", "Emergency assistance", "Workplace setup"]
      };
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-soft bg-gradient-primary animate-bounce-soft z-50"
        aria-label="Open chat assistant"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 shadow-soft z-50 transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-[500px]'
    }`}>
      <CardHeader className="p-4 bg-gradient-primary text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-white text-primary">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm text-white">CReach Assistant</CardTitle>
              <p className="text-xs text-white/80">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setIsMinimized(!isMinimized)}
              aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[436px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-l-lg rounded-tr-lg' 
                    : 'bg-muted rounded-r-lg rounded-tl-lg'
                } p-3`}>
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && (
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{message.text}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.sender === 'bot' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 opacity-70 hover:opacity-100"
                            onClick={() => speakMessage(message.text)}
                            aria-label="Read message aloud"
                          >
                            <Volume2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {message.sender === 'user' && (
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          <User className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-r-lg rounded-tl-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 border-t border-border">
            <div className="flex flex-wrap gap-1 mb-2">
              {quickReplies.slice(0, 3).map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => sendMessage(reply)}
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                className="flex-1"
                aria-label="Chat message input"
              />
              <Button
                onClick={() => sendMessage(inputMessage)}
                disabled={!inputMessage.trim() || isTyping}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default Chatbot;