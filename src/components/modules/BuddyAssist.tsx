import React, { useState } from 'react';
import { Calendar, MessageCircle, Heart, Users, Clock, Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';

const BuddyAssist: React.FC = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [checkInResponse, setCheckInResponse] = useState('');

  const availableBuddies = [
    { id: 1, name: 'Sarah Chen', expertise: 'Visual Accessibility', available: true, rating: 4.9 },
    { id: 2, name: 'Marcus Johnson', expertise: 'Mobility Support', available: true, rating: 4.8 },
    { id: 3, name: 'Emily Rodriguez', expertise: 'Cognitive Support', available: false, rating: 4.9 },
    { id: 4, name: 'David Kim', expertise: 'Hearing Assistance', available: true, rating: 4.7 },
  ];

  const upcomingMeetings = [
    { id: 1, buddy: 'Sarah Chen', date: 'Today', time: '2:00 PM', topic: 'Screen reader training' },
    { id: 2, buddy: 'Marcus Johnson', date: 'Tomorrow', time: '10:00 AM', topic: 'Ergonomic assessment' },
  ];

  const aiSuggestions = [
    'How do I adjust my screen reader settings?',
    'I need help with keyboard shortcuts',
    'Can you explain the accessible parking policy?',
    'Where can I find the sensory room?'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Buddy Assist</h2>
        <p className="text-muted-foreground text-lg">Connect with colleagues who understand and can help</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Find a Buddy Scheduler */}
        <Card className="p-6 card-soft">
          <h3 className="text-xl font-semibold text-foreground mb-4">Find a Buddy</h3>
          
          <div className="space-y-4">
            {availableBuddies.map((buddy) => (
              <div key={buddy.id} className="flex items-center justify-between p-4 rounded-lg bg-accent/20 border border-border">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10 bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-medium text-sm">
                      {buddy.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">{buddy.name}</div>
                    <div className="text-sm text-muted-foreground">{buddy.expertise}</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-3 w-3 text-warning fill-current" />
                      <span className="text-xs text-muted-foreground">{buddy.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-xs font-medium mb-2 ${buddy.available ? 'text-success' : 'text-muted-foreground'}`}>
                    {buddy.available ? '● Available' : '○ Busy'}
                  </div>
                  <Button 
                    size="sm" 
                    disabled={!buddy.available}
                    className={buddy.available ? 'btn-primary' : 'opacity-50'}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Meetings */}
          <div className="mt-6">
            <h4 className="font-medium text-foreground mb-3">Upcoming Sessions</h4>
            <div className="space-y-2">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                  <div>
                    <div className="font-medium text-foreground text-sm">{meeting.topic}</div>
                    <div className="text-xs text-muted-foreground">
                      with {meeting.buddy} • {meeting.date} at {meeting.time}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* AI Chatbot Assistant */}
        <Card className="p-6 card-soft">
          <h3 className="text-xl font-semibold text-foreground mb-4">AI Assistant</h3>
          
          {/* Chat Interface */}
          <div className="bg-accent/20 rounded-lg p-4 min-h-64 mb-4 space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xs">AI</span>
              </div>
              <div className="flex-1 bg-card p-3 rounded-lg shadow-sm">
                <p className="text-sm text-foreground">
                  Hello! I'm here to help with any accessibility questions or workplace support needs. 
                  How can I assist you today?
                </p>
              </div>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Quick questions:</p>
            <div className="grid grid-cols-1 gap-2">
              {aiSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left justify-start h-auto p-2 text-xs"
                  onClick={() => setChatMessage(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <Textarea
              placeholder="Ask me anything about accessibility or workplace support..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 min-h-[44px] resize-none"
            />
            <Button size="sm" className="px-3">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Emotional Check-in */}
      <Card className="p-6 card-soft">
        <h3 className="text-xl font-semibold text-foreground mb-4">Emotional Check-in</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">How are you feeling about work today?</h4>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: '😊', label: 'Energized', color: 'success' },
                { emoji: '😌', label: 'Calm', color: 'primary' },
                { emoji: '😰', label: 'Overwhelmed', color: 'warning' },
                { emoji: '😔', label: 'Struggling', color: 'destructive' }
              ].map((mood) => (
                <Button
                  key={mood.label}
                  variant="outline"
                  className="h-16 flex-col space-y-1"
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs">{mood.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Would you like to share more?</h4>
            <Textarea
              placeholder="Tell us what's on your mind... (This is confidential and helps us provide better support)"
              value={checkInResponse}
              onChange={(e) => setCheckInResponse(e.target.value)}
              className="min-h-24"
            />
            <Button className="w-full btn-secondary">
              <Heart className="h-4 w-4 mr-2" />
              Submit Check-in
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BuddyAssist;