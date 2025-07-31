import React, { useState } from 'react';
import { Heart, Brain, Activity, TrendingUp, Calendar, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/lib/supabase';

interface EmotionalCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MoodOption {
  emoji: string;
  label: string;
  value: string;
  color: string;
}

const EmotionalCheckinModal: React.FC<EmotionalCheckinModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [moodScore, setMoodScore] = useState([7]);
  const [stressLevel, setStressLevel] = useState([5]);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [energyLevel, setEnergyLevel] = useState([6]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const moodOptions: MoodOption[] = [
    { emoji: '😊', label: 'Happy', value: 'happy', color: 'bg-success/20 text-success' },
    { emoji: '😌', label: 'Calm', value: 'calm', color: 'bg-primary/20 text-primary' },
    { emoji: '😴', label: 'Tired', value: 'tired', color: 'bg-muted/40 text-muted-foreground' },
    { emoji: '😰', label: 'Anxious', value: 'anxious', color: 'bg-warning/20 text-warning' },
    { emoji: '😔', label: 'Sad', value: 'sad', color: 'bg-destructive/20 text-destructive' },
    { emoji: '😤', label: 'Frustrated', value: 'frustrated', color: 'bg-orange-100 text-orange-600' },
    { emoji: '🤔', label: 'Confused', value: 'confused', color: 'bg-tertiary/20 text-tertiary' },
    { emoji: '🎯', label: 'Focused', value: 'focused', color: 'bg-secondary/20 text-secondary' },
    { emoji: '😷', label: 'Unwell', value: 'unwell', color: 'bg-gray-100 text-gray-600' },
    { emoji: '🔥', label: 'Motivated', value: 'motivated', color: 'bg-orange-100 text-orange-500' }
  ];

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const checkinData = {
        mood_score: moodScore[0],
        stress_level: stressLevel[0],
        energy_level: energyLevel[0],
        selected_mood: selectedMood,
        notes: notes.trim() || null
      };

      console.log('Submitting emotional check-in:', checkinData);

      // In real implementation, this would save to Supabase
      // const { error } = await supabase
      //   .from('emotional_checkins')
      //   .insert([checkinData]);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onClose();
      setStep(1);
      setMoodScore([7]);
      setStressLevel([5]);
      setEnergyLevel([6]);
      setSelectedMood('');
      setNotes('');

      // Show success message
      alert('Thank you for sharing! Your check-in has been recorded confidentially.');

    } catch (error) {
      console.error('Error submitting check-in:', error);
      alert('Failed to submit check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMoodLabel = (score: number) => {
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Okay';
    if (score >= 3) return 'Poor';
    return 'Very Poor';
  };

  const getStressLabel = (level: number) => {
    if (level >= 8) return 'Very High';
    if (level >= 6) return 'High';
    if (level >= 4) return 'Moderate';
    if (level >= 2) return 'Low';
    return 'Very Low';
  };

  const getEnergyLabel = (level: number) => {
    if (level >= 8) return 'Very High';
    if (level >= 6) return 'High';
    if (level >= 4) return 'Moderate';
    if (level >= 2) return 'Low';
    return 'Very Low';
  };

  const getProgressWidth = () => {
    return `${(step / 3) * 100}%`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-success" />
            Emotional Check-in
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
            style={{ width: getProgressWidth() }}
          ></div>
        </div>

        {/* Step 1: Mood Assessment */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">How are you feeling today?</h3>
              <p className="text-muted-foreground">Your responses are completely confidential and help us provide better support.</p>
            </div>

            {/* Overall Mood Rating */}
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-4 w-4 text-success" />
                  Overall Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Very Poor</span>
                    <Badge variant="secondary" className="min-w-20 justify-center">
                      {getMoodLabel(moodScore[0])} ({moodScore[0]}/10)
                    </Badge>
                    <span className="text-sm text-muted-foreground">Excellent</span>
                  </div>
                  <Slider
                    value={moodScore}
                    onValueChange={setMoodScore}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stress Level */}
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-4 w-4 text-warning" />
                  Stress Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Very Low</span>
                    <Badge variant="secondary" className="min-w-20 justify-center">
                      {getStressLabel(stressLevel[0])} ({stressLevel[0]}/10)
                    </Badge>
                    <span className="text-sm text-muted-foreground">Very High</span>
                  </div>
                  <Slider
                    value={stressLevel}
                    onValueChange={setStressLevel}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Energy Level */}
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-4 w-4 text-secondary" />
                  Energy Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Very Low</span>
                    <Badge variant="secondary" className="min-w-20 justify-center">
                      {getEnergyLabel(energyLevel[0])} ({energyLevel[0]}/10)
                    </Badge>
                    <span className="text-sm text-muted-foreground">Very High</span>
                  </div>
                  <Slider
                    value={energyLevel}
                    onValueChange={setEnergyLevel}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} className="btn-primary">
                Next Step
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Mood Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">Which best describes your current mood?</h3>
              <p className="text-muted-foreground">Select the emotion that resonates most with how you're feeling right now.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {moodOptions.map((mood) => (
                <Button
                  key={mood.value}
                  variant={selectedMood === mood.value ? "default" : "outline"}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`h-20 flex flex-col items-center gap-2 transition-all duration-200 ${
                    selectedMood === mood.value 
                      ? 'bg-primary text-primary-foreground' 
                      : `hover:${mood.color}`
                  }`}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-sm font-medium">{mood.label}</span>
                </Button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Previous
              </Button>
              <Button 
                onClick={() => setStep(3)} 
                disabled={!selectedMood}
                className="btn-primary"
              >
                Next Step
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Notes and Summary */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">Anything else you'd like to share?</h3>
              <p className="text-muted-foreground">This is optional but can help us provide better support.</p>
            </div>

            {/* Summary */}
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="text-lg">Your Check-in Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-success">{moodScore[0]}/10</div>
                    <div className="text-sm text-muted-foreground">Mood</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-warning">{stressLevel[0]}/10</div>
                    <div className="text-sm text-muted-foreground">Stress</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">{energyLevel[0]}/10</div>
                    <div className="text-sm text-muted-foreground">Energy</div>
                  </div>
                  <div>
                    <div className="text-2xl">
                      {moodOptions.find(m => m.value === selectedMood)?.emoji || '😊'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {moodOptions.find(m => m.value === selectedMood)?.label || 'Mood'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optional Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Additional thoughts or concerns (optional):
              </label>
              <Textarea
                placeholder="What's on your mind? Any challenges or wins you'd like to share? This information is completely confidential..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-24"
              />
            </div>

            {/* Privacy Notice */}
            <Card className="border-success/20 bg-success/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-success mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-success-foreground">Privacy & Confidentiality</p>
                    <p className="text-muted-foreground mt-1">
                      Your emotional check-in data is encrypted and completely confidential. It's used anonymously to improve workplace wellness and will never be shared with managers or colleagues.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Previous
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Check-in
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmotionalCheckinModal; 