import React, { useState } from 'react';
import { Mic, Eye, Volume2, Contrast, AlertTriangle, Calendar, Plus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const WorkplaceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [signLanguage, setSignLanguage] = useState(false);
  const [magnifier, setMagnifier] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const tasks = [
    { id: 1, text: 'Review quarterly accessibility report', completed: false, priority: 'high' },
    { id: 2, text: 'Schedule meeting with ergonomic specialist', completed: true, priority: 'medium' },
    { id: 3, text: 'Complete accessibility training module', completed: false, priority: 'low' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Workplace Assistant</h2>
        <p className="text-muted-foreground text-lg">Your personalized accessibility companion</p>
      </div>

      {/* Voice Command */}
      <Card className="p-6 card-soft">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Voice Commands</h3>
          <Button
            size="lg"
            className={`w-32 h-32 rounded-full transition-all duration-300 ${
              isListening 
                ? 'bg-destructive hover:bg-destructive/90 animate-pulse shadow-focus' 
                : 'btn-primary'
            }`}
            onClick={() => setIsListening(!isListening)}
            aria-label={isListening ? 'Stop listening' : 'Start voice command'}
          >
            <Mic className="h-8 w-8" />
          </Button>
          <p className="text-sm text-muted-foreground">
            {isListening ? 'Listening... Say your command' : 'Tap to speak'}
          </p>
        </div>
      </Card>

      {/* Accessibility Toggles */}
      <Card className="p-6 card-soft">
        <h3 className="text-xl font-semibold text-foreground mb-4">Accessibility Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
            <div className="flex items-center space-x-3">
              <Volume2 className="h-5 w-5 text-primary" />
              <span className="font-medium">Screen Reader</span>
            </div>
            <Switch 
              checked={screenReader} 
              onCheckedChange={setScreenReader}
              aria-label="Toggle screen reader"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-secondary-accent" />
              <span className="font-medium">Sign Language</span>
            </div>
            <Switch 
              checked={signLanguage} 
              onCheckedChange={setSignLanguage}
              aria-label="Toggle sign language overlay"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-tertiary" />
              <span className="font-medium">Magnifier</span>
            </div>
            <Switch 
              checked={magnifier} 
              onCheckedChange={setMagnifier}
              aria-label="Toggle magnifier"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
            <div className="flex items-center space-x-3">
              <Contrast className="h-5 w-5 text-warning" />
              <span className="font-medium">High Contrast</span>
            </div>
            <Switch 
              checked={highContrast} 
              onCheckedChange={setHighContrast}
              aria-label="Toggle high contrast mode"
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Assist */}
        <Card className="p-6 card-soft">
          <h3 className="text-xl font-semibold text-foreground mb-4">Emergency Assistance</h3>
          <Button 
            variant="destructive" 
            size="lg" 
            className="w-full animate-bounce-soft"
            aria-label="Emergency assistance button"
          >
            <AlertTriangle className="h-6 w-6 mr-2" />
            Need Help Now
          </Button>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Connects you to workplace support immediately
          </p>
        </Card>

        {/* Task Planner */}
        <Card className="p-6 card-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-foreground">Task Planner</h3>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg bg-accent/30">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                <span className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.text}
                </span>
                {task.completed && <CheckCircle className="h-4 w-4 text-success" />}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Live Captions */}
      <Card className="p-6 card-soft">
        <h3 className="text-xl font-semibold text-foreground mb-4">Live Meeting Captions</h3>
        <div className="bg-accent/30 rounded-lg p-4 min-h-32">
          <div className="text-sm text-muted-foreground mb-2">🔴 LIVE</div>
          <div className="space-y-2">
            <p className="text-foreground">"Thank you everyone for joining today's accessibility review meeting..."</p>
            <p className="text-foreground">"We'll be discussing the quarterly improvements to our workplace tools."</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WorkplaceAssistant;