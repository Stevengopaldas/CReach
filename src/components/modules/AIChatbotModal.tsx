import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Volume2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

interface AIChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChatbotModal: React.FC<AIChatbotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm CReach Assistant, your accessibility support companion. I'm here to help with workplace accessibility questions, guidance, and support. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        "How do I find accessible routes?",
        "Voice command help",
        "Screen reader support",
        "Emergency assistance"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "How do I use voice commands?",
    "Where is the nearest accessible restroom?",
    "Help with screen reader settings",
    "Book a meeting with a buddy",
    "Request emergency assistance",
    "Find quiet/sensory rooms",
    "Accessibility keyboard shortcuts",
    "Report an accessibility issue"
  ];

  // Simple response system based on keywords
  const getBotResponse = (userMessage: string): { text: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase();

    if (message.includes('voice') || message.includes('command')) {
      return {
        text: "Voice commands are available throughout CReach! Here are some examples:\n\n• Say 'Navigate to restroom' for directions\n• Say 'Emergency help' for immediate assistance\n• Say 'Start meeting captions' during meetings\n• Say 'Find buddy' to open the buddy finder\n\nYou can enable voice commands in the Workplace Assistant module. Would you like me to guide you there?",
        suggestions: ["Open Workplace Assistant", "More voice commands", "Accessibility settings"]
      };
    }

    if (message.includes('restroom') || message.includes('bathroom') || message.includes('toilet')) {
      return {
        text: "I can help you find the nearest accessible restroom! The closest accessible facilities are:\n\n• Building A, Floor 1 - Near the main elevator\n• Building B, Floor 2 - West wing corridor\n• Building C, Ground floor - Next to the cafeteria\n\nWould you like me to open Smart Navigation for detailed directions?",
        suggestions: ["Open Smart Navigation", "Get directions", "Find other facilities"]
      };
    }

    if (message.includes('screen reader') || message.includes('nvda') || message.includes('jaws')) {
      return {
        text: "I can help with screen reader support! Here are some quick tips:\n\n• Press NVDA+F7 for elements list\n• Use H key to navigate headings\n• Tab key moves between interactive elements\n• NVDA+Space toggles focus/browse mode\n\nFor personalized screen reader training, I recommend connecting with Sarah Chen through the Buddy Assist feature.",
        suggestions: ["Find Sarah Chen", "More shortcuts", "Screen reader training"]
      };
    }

    if (message.includes('emergency') || message.includes('help') || message.includes('urgent')) {
      return {
        text: "For emergency assistance:\n\n🚨 **Immediate Help**: Use the red emergency button in Workplace Assistant\n📞 **Security**: Extension 911 or say 'Emergency help'\n🏥 **First Aid**: Extension 234 or Building A reception\n♿ **Accessibility Emergency**: Extension 567\n\nI can also connect you directly to security or first aid. What type of assistance do you need?",
        suggestions: ["Contact security", "Get first aid", "Report accessibility issue"]
      };
    }

    if (message.includes('buddy') || message.includes('mentor') || message.includes('support')) {
      return {
        text: "Great choice! Our Buddy Assist system connects you with colleagues who can provide personalized support. We have experts in:\n\n• Visual accessibility (Sarah Chen)\n• Mobility support (Marcus Johnson)\n• Cognitive assistance (Emily Rodriguez)\n• Hearing support (David Kim)\n• Mental health (Dr. Aisha Patel)\n\nWould you like me to open the Buddy Finder to get matched?",
        suggestions: ["Open Buddy Finder", "Schedule a meeting", "Learn about mentors"]
      };
    }

    if (message.includes('meeting') || message.includes('schedule') || message.includes('calendar')) {
      return {
        text: "I can help you schedule meetings with accessibility features! Our calendar system includes:\n\n• Automatic captions for virtual meetings\n• Sign language interpreter booking\n• Accessible meeting room selection\n• Screen reader compatible scheduling\n\nWould you like to schedule a meeting or view your calendar?",
        suggestions: ["Open Calendar", "Schedule meeting", "View upcoming meetings"]
      };
    }

    if (message.includes('quiet') || message.includes('sensory') || message.includes('break')) {
      return {
        text: "Our sensory-friendly spaces are perfect for breaks and focus time:\n\n🌿 **Quiet Rooms**: Building A (Floor 2), Building C (Floor 1)\n🔕 **Silent Zones**: Library areas on each floor\n💡 **Adjustable Lighting**: Focus rooms in Building B\n🎧 **Noise Control**: Sensory pods in wellness area\n\nAll rooms can be booked through the Focus & Comfort module.",
        suggestions: ["Find quiet room", "Book sensory space", "Focus settings"]
      };
    }

    if (message.includes('keyboard') || message.includes('shortcut') || message.includes('navigation')) {
      return {
        text: "Here are essential accessibility keyboard shortcuts:\n\n**Windows:**\n• Windows + U: Accessibility settings\n• Alt + Shift + PrtSc: High contrast toggle\n• Windows + Plus: Magnifier zoom in\n\n**CReach Navigation:**\n• Ctrl + M: Open main menu\n• Ctrl + B: Find buddy\n• Ctrl + E: Emergency help\n• F6: Move between interface sections",
        suggestions: ["More shortcuts", "Customize navigation", "Accessibility settings"]
      };
    }

    if (message.includes('report') || message.includes('issue') || message.includes('problem')) {
      return {
        text: "Thank you for reporting accessibility issues! This helps us improve for everyone:\n\n📝 **Quick Report**: Use the Feedback App for immediate issues\n📞 **Direct Contact**: accessibility@company.com\n🔧 **IT Support**: For technical accessibility problems\n👥 **HR Support**: For workplace accommodation requests\n\nWould you like me to open the Feedback App to file a report?",
        suggestions: ["Open Feedback App", "Contact support", "Request accommodation"]
      };
    }

    // Default response
    return {
      text: "I'm here to help with accessibility questions and workplace support! I can assist with:\n\n• Finding accessible routes and facilities\n• Voice commands and shortcuts\n• Screen reader and assistive technology\n• Connecting with buddies and mentors\n• Emergency assistance\n• Meeting scheduling with accessibility features\n\nWhat would you like help with?",
      suggestions: ["Navigation help", "Technology support", "Find a buddy", "Emergency info"]
    };
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

    // Simulate bot response delay
    setTimeout(() => {
      const response = getBotResponse(text);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            CReach Assistant
            <Badge variant="secondary" className="ml-auto">AI Powered</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-96">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className={
                    message.sender === 'bot' 
                      ? 'bg-gradient-primary text-white' 
                      : 'bg-secondary/20 text-secondary'
                  }>
                    {message.sender === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>

                <div className={`flex-1 max-w-[80%] ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <Card className={`card-soft ${
                    message.sender === 'user' 
                      ? 'bg-primary/10 border-primary/20' 
                      : 'bg-card'
                  }`}>
                    <CardContent className="p-3">
                      <p className="text-sm text-foreground whitespace-pre-line">
                        {message.text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Suggestions */}
                  {message.suggestions && message.sender === 'bot' && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => sendMessage(suggestion)}
                          className="text-xs h-7"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-primary text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="card-soft">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-1">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">CReach Assistant is typing...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-6 py-2 border-t border-border">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground self-center">Quick help:</span>
              {quickReplies.slice(0, 4).map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(reply)}
                  className="text-xs h-6"
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 pt-2 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about accessibility..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={() => sendMessage(inputMessage)}
                disabled={!inputMessage.trim() || isTyping}
                className="btn-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIChatbotModal; 