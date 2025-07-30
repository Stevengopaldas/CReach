import React, { useState } from 'react';
import { Heart, Volume2, Sun, Moon, Play, Pause, RotateCcw, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

const FocusComfort: React.FC = () => {
  const [sensoryMode, setSensoryMode] = useState(false);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [volume, setVolume] = useState([50]);
  const [isBreathing, setIsBreathing] = useState(false);
  const [heartRate, setHeartRate] = useState(72);
  const [stressLevel, setStressLevel] = useState(30);

  const soundOptions = [
    { id: 'rain', name: 'Gentle Rain', emoji: '🌧️', duration: '∞' },
    { id: 'ocean', name: 'Ocean Waves', emoji: '🌊', duration: '∞' },
    { id: 'forest', name: 'Forest Sounds', emoji: '🌲', duration: '∞' },
    { id: 'whitenoise', name: 'White Noise', emoji: '📻', duration: '∞' },
    { id: 'birds', name: 'Bird Songs', emoji: '🐦', duration: '∞' },
    { id: 'coffee', name: 'Coffee Shop', emoji: '☕', duration: '∞' },
  ];

  const getStressColor = (level: number) => {
    if (level < 30) return 'text-success';
    if (level < 60) return 'text-warning';
    return 'text-destructive';
  };

  const getStressBgColor = (level: number) => {
    if (level < 30) return 'bg-success';
    if (level < 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Focus & Comfort</h2>
        <p className="text-muted-foreground text-lg">Create your perfect work environment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sensory Mode Control */}
        <Card className="p-6 card-soft">
          <h3 className="text-xl font-semibold text-foreground mb-4">Sensory Environment</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-primary/20">
                  {sensoryMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-warning" />}
                </div>
                <div>
                  <span className="font-medium text-foreground">Low Sensory Mode</span>
                  <p className="text-sm text-muted-foreground">Reduces light and sound stimulation</p>
                </div>
              </div>
              <Switch 
                checked={sensoryMode} 
                onCheckedChange={setSensoryMode}
                aria-label="Toggle low sensory mode"
              />
            </div>

            {sensoryMode && (
              <div className="space-y-4 p-4 bg-accent/20 rounded-lg border border-primary/20">
                <p className="text-sm text-primary font-medium">✓ Low Sensory Mode Active</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>Screen dimmed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>Notifications muted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>Reduced animations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>Soft color palette</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* HR-Based Stress Meter */}
        <Card className="p-6 card-soft">
          <h3 className="text-xl font-semibold text-foreground mb-4">Wellness Monitor</h3>
          
          <div className="space-y-6">
            {/* Heart Rate */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 bg-gradient-primary rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div className="text-2xl font-bold text-foreground">{heartRate} BPM</div>
              <div className="text-sm text-muted-foreground">Heart Rate</div>
            </div>

            {/* Stress Level */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Stress Level</span>
                <span className={`text-sm font-bold ${getStressColor(stressLevel)}`}>{stressLevel}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${getStressBgColor(stressLevel)}`}
                  style={{ width: `${stressLevel}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stressLevel < 30 ? 'Relaxed' : stressLevel < 60 ? 'Moderate' : 'High Stress'}
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              <Activity className="h-3 w-3 inline mr-1" />
              Synced with your wearable device
            </div>
          </div>
        </Card>
      </div>

      {/* White Noise Player */}
      <Card className="p-6 card-soft">
        <h3 className="text-xl font-semibold text-foreground mb-4">Ambient Sound Player</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {soundOptions.map((sound) => (
            <Button
              key={sound.id}
              variant={currentSound === sound.id ? "default" : "outline"}
              className="h-20 flex-col space-y-1"
              onClick={() => setCurrentSound(currentSound === sound.id ? null : sound.id)}
              aria-label={`Play ${sound.name}`}
            >
              <span className="text-2xl">{sound.emoji}</span>
              <span className="text-xs text-center">{sound.name}</span>
            </Button>
          ))}
        </div>

        {currentSound && (
          <div className="bg-accent/30 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button size="sm" variant="outline">
                  <Pause className="h-4 w-4" />
                </Button>
                <div>
                  <div className="font-medium text-foreground">
                    {soundOptions.find(s => s.id === currentSound)?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">Playing continuously</div>
                </div>
              </div>
              <Volume2 className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Volume</span>
                <span className="text-foreground">{volume[0]}%</span>
              </div>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-full"
                aria-label="Volume control"
              />
            </div>
          </div>
        )}
      </Card>

      {/* Breathing Session */}
      <Card className="p-6 card-soft">
        <h3 className="text-xl font-semibold text-foreground mb-4">Daily Check-in & Breathing</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Check-in */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">How are you feeling today?</h4>
            <div className="grid grid-cols-3 gap-2">
              {['😊', '😐', '😔'].map((emoji, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-16 text-2xl"
                  aria-label={`Feeling ${index === 0 ? 'good' : index === 1 ? 'okay' : 'not great'}`}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>

          {/* Breathing Exercise */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Breathing Exercise</h4>
            <div className="text-center">
              <div className={`w-24 h-24 mx-auto mb-4 rounded-full border-4 border-primary 
                ${isBreathing ? 'animate-pulse bg-primary/20' : 'bg-accent/20'} 
                flex items-center justify-center transition-all duration-500`}>
                <span className="text-primary font-bold">
                  {isBreathing ? '4' : 'START'}
                </span>
              </div>
              <Button 
                onClick={() => setIsBreathing(!isBreathing)}
                className={isBreathing ? 'btn-secondary' : 'btn-primary'}
              >
                {isBreathing ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Stop Session
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start 4-7-8 Breathing
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                {isBreathing ? 'Breathe in for 4, hold for 7, out for 8' : 'Take a moment to center yourself'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FocusComfort;