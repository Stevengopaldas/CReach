import React, { useState } from 'react';
import { Camera, CameraOff, Volume2, Play, Pause, Monitor, User, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const ErgonomicCoach = () => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [exerciseActive, setExerciseActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);

  const exercises = [
    { name: "Neck Rolls", duration: "2 min", benefit: "Reduces neck tension" },
    { name: "Shoulder Shrugs", duration: "1 min", benefit: "Relieves shoulder stress" },
    { name: "Back Stretches", duration: "3 min", benefit: "Improves posture" },
    { name: "Eye Breaks", duration: "30 sec", benefit: "Reduces eye strain" }
  ];

  const tips = [
    { title: "Monitor Position", content: "Keep screen 20-26 inches away", urgency: "high" },
    { title: "Chair Height", content: "Feet flat on floor, knees at 90°", urgency: "medium" },
    { title: "Lighting", content: "Reduce glare and shadows", urgency: "low" },
    { title: "Break Reminder", content: "Take a 5-min break every hour", urgency: "high" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ergonomic Coach</h1>
          <p className="text-muted-foreground">Your personal workplace wellness guide</p>
        </div>
        <Badge variant="secondary" className="bg-success text-success-foreground">
          <Target className="w-4 h-4 mr-1" />
          Daily Goal: 80%
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Posture Camera */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Posture Monitor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Camera Detection</span>
              <Switch 
                checked={cameraEnabled} 
                onCheckedChange={setCameraEnabled}
                aria-label="Toggle posture camera"
              />
            </div>
            
            <div className="aspect-video bg-gradient-primary rounded-lg flex items-center justify-center">
              {cameraEnabled ? (
                <div className="text-center text-white">
                  <User className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm">Monitoring posture...</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Posture Score</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="bg-white/20" />
                  </div>
                </div>
              ) : (
                <div className="text-center text-white">
                  <CameraOff className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm">Camera disabled</p>
                  <p className="text-xs opacity-75">Enable for posture tracking</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-success/10 p-2 rounded text-center">
                <span className="text-success font-medium">Good</span>
                <p className="text-muted-foreground">Head position</p>
              </div>
              <div className="bg-warning/10 p-2 rounded text-center">
                <span className="text-warning font-medium">Needs Work</span>
                <p className="text-muted-foreground">Shoulder alignment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Coach */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-secondary" />
              Exercise Coach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-warm p-4 rounded-lg text-white">
              <h3 className="font-semibold">{exercises[currentExercise].name}</h3>
              <p className="text-sm opacity-90">{exercises[currentExercise].benefit}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs">{exercises[currentExercise].duration}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setExerciseActive(!exerciseActive)}
                  aria-label={exerciseActive ? 'Pause exercise' : 'Start exercise'}
                >
                  {exerciseActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>
              {exerciseActive && (
                <Progress value={65} className="mt-2 bg-white/20" />
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Exercise Playlist</h4>
              {exercises.map((exercise, index) => (
                <button
                  key={exercise.name}
                  onClick={() => setCurrentExercise(index)}
                  className={`w-full text-left p-2 rounded text-xs transition-colors ${
                    index === currentExercise 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{exercise.name}</span>
                    <span className="text-muted-foreground">{exercise.duration}</span>
                  </div>
                </button>
              ))}
            </div>

            <Button className="w-full" variant="outline">
              <Volume2 className="w-4 h-4 mr-2" />
              Voice Guidance
            </Button>
          </CardContent>
        </Card>

        {/* Recommendations & Tips */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-tertiary" />
              Smart Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <h4 className="font-semibold text-sm text-primary mb-1">Desk Setup Alert</h4>
              <p className="text-xs text-muted-foreground">Your monitor is too low. Raise it 2 inches for optimal viewing angle.</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Comfort Tips</h4>
              {tips.map((tip, index) => (
                <div key={tip.title} className="flex items-start gap-3 p-2 rounded hover:bg-accent/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    tip.urgency === 'high' ? 'bg-destructive' :
                    tip.urgency === 'medium' ? 'bg-warning' : 'bg-success'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{tip.title}</p>
                    <p className="text-xs text-muted-foreground">{tip.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-success/10 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-success" />
                <span className="font-semibold text-sm text-success">Achievement</span>
              </div>
              <p className="text-xs text-muted-foreground">7-day ergonomic streak!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-bold text-primary">85%</h3>
          <p className="text-xs text-muted-foreground">Today's Posture Score</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-bold text-secondary">12</h3>
          <p className="text-xs text-muted-foreground">Exercises Completed</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-bold text-tertiary">4h 30m</h3>
          <p className="text-xs text-muted-foreground">Active Work Time</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-bold text-success">7</h3>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </Card>
      </div>
    </div>
  );
};

export default ErgonomicCoach;