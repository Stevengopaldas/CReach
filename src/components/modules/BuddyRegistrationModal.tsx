import React, { useState } from 'react';
import { Heart, Users, Clock, MapPin, Globe, Star, Save, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

interface BuddyRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RegistrationData {
  // Personal Info
  name: string;
  department: string;
  bio: string;
  experience_years: number;
  
  // Expertise Areas
  expertise: string[];
  
  // Availability
  availability_days: string[];
  preferred_times: string[];
  
  // Preferences
  meeting_preference: 'in-person' | 'virtual' | 'both';
  languages: string[];
  max_weekly_hours: number;
  
  // Contact
  location: string;
}

const BuddyRegistrationModal: React.FC<BuddyRegistrationModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    department: '',
    bio: '',
    experience_years: 1,
    expertise: [],
    availability_days: [],
    preferred_times: [],
    meeting_preference: 'both',
    languages: ['English'],
    max_weekly_hours: 5,
    location: ''
  });

  const expertiseOptions = [
    { id: 'visual-accessibility', label: 'Visual Accessibility', description: 'Screen readers, magnification, visual aids' },
    { id: 'mobility-support', label: 'Mobility Support', description: 'Physical accessibility, ergonomics' },
    { id: 'cognitive-support', label: 'Cognitive Support', description: 'ADHD, autism, learning differences' },
    { id: 'hearing-assistance', label: 'Hearing Assistance', description: 'Deaf/HoH support, sign language' },
    { id: 'mental-health', label: 'Mental Health', description: 'Stress, anxiety, workplace wellness' },
    { id: 'assistive-technology', label: 'Assistive Technology', description: 'Software, hardware, apps' },
    { id: 'workplace-navigation', label: 'Workplace Navigation', description: 'Building layout, accessible routes' },
    { id: 'communication', label: 'Communication', description: 'Presentations, meetings, collaboration' },
    { id: 'career-development', label: 'Career Development', description: 'Professional growth, mentorship' },
    { id: 'ergonomics', label: 'Ergonomics', description: 'Desk setup, posture, equipment' }
  ];

  const departments = [
    'Engineering', 'Human Resources', 'Marketing', 'Sales', 'Operations', 
    'Finance', 'Legal', 'Design', 'Customer Support', 'Research', 'Other'
  ];

  const availabilityDays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const timeSlots = [
    'Early Morning (7-9 AM)', 'Morning (9-12 PM)', 'Lunch (12-2 PM)', 
    'Afternoon (2-5 PM)', 'Evening (5-7 PM)', 'Night (7-9 PM)'
  ];

  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 
    'Korean', 'Portuguese', 'Italian', 'Dutch', 'ASL (Sign Language)', 'Other'
  ];

  const handleExpertiseToggle = (expertiseId: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertiseId)
        ? prev.expertise.filter(id => id !== expertiseId)
        : [...prev.expertise, expertiseId]
    }));
  };

  const handleAvailabilityToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability_days: prev.availability_days.includes(day)
        ? prev.availability_days.filter(d => d !== day)
        : [...prev.availability_days, day]
    }));
  };

  const handleTimeSlotToggle = (time: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_times: prev.preferred_times.includes(time)
        ? prev.preferred_times.filter(t => t !== time)
        : [...prev.preferred_times, time]
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // For demo purposes, we'll create a mock user with a random ID and email
      // In a real app, this would use authenticated user data from Supabase Auth
      const mockUserId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      const mockEmail = `${formData.name.toLowerCase().replace(/\s+/g, '.')}@company.com`;

      // Prepare data for database
      const buddyData = {
        id: mockUserId,
        email: mockEmail,
        name: formData.name,
        department: formData.department,
        bio: formData.bio,
        role: 'buddy',
        location: formData.location,
        experience_years: formData.experience_years,
        expertise: formData.expertise,
        availability_days: formData.availability_days,
        preferred_times: formData.preferred_times,
        meeting_preference: formData.meeting_preference,
        languages: formData.languages,
        max_weekly_hours: formData.max_weekly_hours,
        rating: 5.0, // Default rating for new buddies
        review_count: 0,
        availability_status: 'online',
        response_time: 'Usually responds in 2 hours',
        profile_completed: true,
        last_active: new Date().toISOString()
      };

      console.log('Registering new buddy:', buddyData);

      // Test Supabase connection first
      console.log('Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('Supabase connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      
      console.log('Supabase connection test successful');

      // Save to Supabase - using insert to create new buddy
      console.log('Inserting buddy data...');
      const { data, error } = await supabase
        .from('users')
        .insert([buddyData])
        .select();

      if (error) {
        console.error('Detailed insertion error:', error);
        throw error;
      }

      console.log('Buddy registration successful:', data);

      // Reset form and close
      setFormData({
        name: '',
        department: '',
        bio: '',
        experience_years: 1,
        expertise: [],
        availability_days: [],
        preferred_times: [],
        meeting_preference: 'both',
        languages: ['English'],
        max_weekly_hours: 5,
        location: ''
      });
      setStep(1);
      onClose();

      alert('🎉 Congratulations! You\'re now registered as a buddy. You\'ll start receiving buddy requests based on your expertise!');

    } catch (error) {
      console.error('Error registering buddy:', error);
      
      // Handle Supabase errors properly
      let errorMessage = 'Unknown error';
      if (error && typeof error === 'object') {
        if ('message' in error) {
          errorMessage = String(error.message);
        } else if ('error' in error) {
          errorMessage = String(error.error);
        } else if ('details' in error) {
          errorMessage = String(error.details);
        } else {
          errorMessage = JSON.stringify(error);
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(`Failed to register as buddy: ${errorMessage}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const getProgressWidth = () => {
    return `${(step / 3) * 100}%`;
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.trim() && formData.department && formData.bio.trim();
      case 2:
        return formData.expertise.length > 0;
      case 3:
        return formData.availability_days.length > 0 && formData.preferred_times.length > 0;
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-secondary" />
            Become a Buddy - Registration
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-warm h-2 rounded-full transition-all duration-300"
            style={{ width: getProgressWidth() }}
          ></div>
        </div>

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div className="space-y-6 overflow-y-auto max-h-96">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">Tell us about yourself</h3>
              <p className="text-muted-foreground">Your profile helps colleagues understand how you can best help them.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name *</label>
                <Input
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Department *</label>
                <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Location/Building</label>
                <Input
                  placeholder="e.g., Building A, Floor 3"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Years of Experience</label>
                <Select value={formData.experience_years.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, experience_years: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1-2 years</SelectItem>
                    <SelectItem value="3">3-5 years</SelectItem>
                    <SelectItem value="6">6-10 years</SelectItem>
                    <SelectItem value="11">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bio & Motivation *</label>
              <Textarea
                placeholder="Tell colleagues about yourself, your accessibility experience, and why you want to be a buddy. What drives you to help others?"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="min-h-24"
              />
              <p className="text-xs text-muted-foreground">
                A good bio helps colleagues connect with you and understand your passion for accessibility.
              </p>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={() => setStep(2)} 
                disabled={!isStepValid()}
                className="btn-primary"
              >
                Next: Expertise <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Expertise & Specializations */}
        {step === 2 && (
          <div className="space-y-6 overflow-y-auto max-h-96">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">What are your areas of expertise?</h3>
              <p className="text-muted-foreground">Select all areas where you can provide guidance and support.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {expertiseOptions.map((expertise) => (
                <Card 
                  key={expertise.id} 
                  className={`cursor-pointer transition-all duration-200 ${
                    formData.expertise.includes(expertise.id)
                      ? 'border-secondary/50 bg-secondary/5'
                      : 'border-border hover:border-secondary/30'
                  }`}
                  onClick={() => handleExpertiseToggle(expertise.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        checked={formData.expertise.includes(expertise.id)}
                        onChange={() => handleExpertiseToggle(expertise.id)}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{expertise.label}</h4>
                        <p className="text-sm text-muted-foreground">{expertise.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {formData.expertise.length > 0 && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Selected expertise areas:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {formData.expertise.map(id => {
                    const expertise = expertiseOptions.find(e => e.id === id);
                    return (
                      <Badge key={id} className="bg-secondary/20 text-secondary">
                        {expertise?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button 
                onClick={() => setStep(3)} 
                disabled={!isStepValid()}
                className="btn-primary"
              >
                Next: Availability <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Availability & Preferences */}
        {step === 3 && (
          <div className="space-y-6 overflow-y-auto max-h-96">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">When are you available to help?</h3>
              <p className="text-muted-foreground">Set your availability so colleagues know when to reach out.</p>
            </div>

            {/* Available Days */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Available Days *</label>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {availabilityDays.map((day) => (
                  <Button
                    key={day}
                    variant={formData.availability_days.includes(day) ? "default" : "outline"}
                    onClick={() => handleAvailabilityToggle(day)}
                    className="h-auto p-2 text-xs"
                  >
                    {day.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Preferred Time Slots */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Preferred Time Slots *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={formData.preferred_times.includes(time) ? "default" : "outline"}
                    onClick={() => handleTimeSlotToggle(time)}
                    className="h-auto p-3 text-xs justify-start"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            {/* Meeting Preference */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Meeting Preference</label>
                <Select value={formData.meeting_preference} onValueChange={(value: any) => setFormData(prev => ({ ...prev, meeting_preference: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual meetings only</SelectItem>
                    <SelectItem value="in-person">In-person meetings only</SelectItem>
                    <SelectItem value="both">Both virtual and in-person</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Max Hours per Week</label>
                <Select value={formData.max_weekly_hours.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, max_weekly_hours: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 hours/week</SelectItem>
                    <SelectItem value="5">5 hours/week</SelectItem>
                    <SelectItem value="10">10 hours/week</SelectItem>
                    <SelectItem value="20">20+ hours/week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Languages</label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {languageOptions.map((language) => (
                  <Button
                    key={language}
                    variant={formData.languages.includes(language) ? "default" : "outline"}
                    onClick={() => handleLanguageToggle(language)}
                    className="h-auto p-2 text-xs"
                  >
                    {language}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!isStepValid() || loading}
                className="btn-primary"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Complete Registration
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

export default BuddyRegistrationModal; 