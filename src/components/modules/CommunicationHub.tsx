import React, { useState } from 'react';
import { MessageCircle, Mic, Volume2, Image, Smile, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const CommunicationHub: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedPhrase, setSelectedPhrase] = useState<string | null>(null);
  const [audioText, setAudioText] = useState('');

  const commonPhrases = [
    { id: 1, text: 'Good morning', emoji: '🌅', category: 'greetings' },
    { id: 2, text: 'Thank you', emoji: '🙏', category: 'gratitude' },
    { id: 3, text: 'I need help', emoji: '🆘', category: 'assistance' },
    { id: 4, text: 'Meeting room', emoji: '🏢', category: 'workplace' },
    { id: 5, text: 'Break time', emoji: '☕', category: 'workplace' },
    { id: 6, text: 'Lunch break', emoji: '🍽️', category: 'workplace' },
  ];

  const transcriptMessages = [
    { id: 1, speaker: 'John', text: 'Good morning everyone, welcome to our team standup.', timestamp: '09:00' },
    { id: 2, speaker: 'Sarah', text: 'Thanks John. I completed the accessibility audit yesterday.', timestamp: '09:01' },
    { id: 3, speaker: 'Mike', text: 'Great work Sarah! The improvements look fantastic.', timestamp: '09:02' },
  ];

  const emoMoodIndicators = [
    { mood: 'happy', emoji: '😊', intensity: 85 },
    { mood: 'confident', emoji: '💪', intensity: 70 },
    { mood: 'calm', emoji: '😌', intensity: 60 },
    { mood: 'focused', emoji: '🎯', intensity: 90 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Communication Hub</h2>
        <p className="text-muted-foreground text-lg">Express yourself clearly and confidently</p>
      </div>

      {/* Live Transcript Feed */}
      <Card className="p-6 card-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-foreground">Live Transcript Feed</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
            <span className="text-sm text-foreground">LIVE</span>
          </div>
        </div>
        
        <div className="bg-accent/20 rounded-lg p-4 max-h-64 overflow-y-auto space-y-3">
          {transcriptMessages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <div className="text-xs text-muted-foreground mt-1 w-12">{message.timestamp}</div>
              <div className="flex-1">
                <div className="font-medium text-foreground text-sm">{message.speaker}:</div>
                <div className="text-foreground">{message.text}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audio to Text Converter */}
        <Card className="p-6 card-soft">
          <h3 className="text-xl font-semibold text-foreground mb-4">Audio to Text Converter</h3>
          
          <div className="space-y-4">
            <div className="text-center">
              <Button
                size="lg"
                className={`w-24 h-24 rounded-full transition-all duration-300 ${
                  isRecording 
                    ? 'bg-destructive hover:bg-destructive/90 animate-pulse shadow-focus' 
                    : 'btn-primary'
                }`}
                onClick={() => setIsRecording(!isRecording)}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
              >
                <Mic className="h-8 w-8" />
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                {isRecording ? 'Recording... Tap to stop' : 'Tap to record'}
              </p>
            </div>
            
            <Textarea 
              placeholder="Converted text will appear here..."
              value={audioText}
              onChange={(e) => setAudioText(e.target.value)}
              className="input-primary min-h-32"
              aria-label="Converted text from audio"
            />
            
            <Button 
              variant="outline" 
              className="w-full"
              disabled={!audioText}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Read Text Aloud
            </Button>
          </div>
        </Card>

        {/* Text to Sign Language */}
        <Card className="p-6 card-soft">
          <h3 className="text-xl font-semibold text-foreground mb-4">Text to Sign Language</h3>
          
          <div className="space-y-4">
            <Textarea 
              placeholder="Type your message to convert to sign language..."
              className="input-primary min-h-24"
              aria-label="Text to convert to sign language"
            />
            
            {/* Sign Language Animation Preview */}
            <div className="bg-accent/20 rounded-lg p-6 text-center min-h-32">
              <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👋</span>
              </div>
              <p className="text-sm text-muted-foreground">Sign language animation preview</p>
            </div>
            
            <Button className="w-full btn-secondary">
              <Play className="h-4 w-4 mr-2" />
              Show Sign Animation
            </Button>
          </div>
        </Card>
      </div>

      {/* Picture Board for Common Phrases */}
      <Card className="p-6 card-soft">
        <h3 className="text-xl font-semibold text-foreground mb-4">Quick Phrase Board</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {commonPhrases.map((phrase) => (
            <Button
              key={phrase.id}
              variant={selectedPhrase === phrase.text ? "default" : "outline"}
              className="h-20 flex-col space-y-1 transition-all duration-200"
              onClick={() => setSelectedPhrase(phrase.text)}
              aria-label={`Select phrase: ${phrase.text}`}
            >
              <span className="text-2xl">{phrase.emoji}</span>
              <span className="text-xs text-center">{phrase.text}</span>
            </Button>
          ))}
        </div>
        
        {selectedPhrase && (
          <div className="mt-4 p-4 bg-accent/30 rounded-lg flex items-center justify-between">
            <span className="text-foreground font-medium">"{selectedPhrase}"</span>
            <Button size="sm" variant="outline">
              <Volume2 className="h-4 w-4 mr-1" />
              Speak
            </Button>
          </div>
        )}
      </Card>

      {/* EmoVoice Tone Indicator */}
      <Card className="p-6 card-soft">
        <h3 className="text-xl font-semibold text-foreground mb-4">EmoVoice Tone Indicator</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {emoMoodIndicators.map((indicator) => (
            <div key={indicator.mood} className="text-center p-4 rounded-lg bg-accent/20">
              <div className="text-4xl mb-2">{indicator.emoji}</div>
              <div className="text-sm font-medium text-foreground capitalize mb-2">{indicator.mood}</div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${indicator.intensity}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{indicator.intensity}%</div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Current emotional tone: <span className="text-primary font-medium">Confident & Focused</span>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CommunicationHub;