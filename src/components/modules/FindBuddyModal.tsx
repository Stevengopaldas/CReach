import React, { useState, useEffect } from 'react';
import { X, Search, Star, Calendar, MessageCircle, Filter, Users, Heart, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';

interface Buddy {
  id: string;
  name: string;
  expertise: string[];
  bio: string;
  rating: number;
  reviewCount: number;
  availability: 'online' | 'busy' | 'offline';
  responseTime: string;
  department: string;
  languages: string[];
  meetingPreference: 'in-person' | 'virtual' | 'both';
}

interface FindBuddyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSent?: () => void;
}

const FindBuddyModal: React.FC<FindBuddyModalProps> = ({ isOpen, onClose, onRequestSent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBuddy, setSelectedBuddy] = useState<Buddy | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);

  // Mock data - will be replaced with real Supabase data
  const mockBuddies: Buddy[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      expertise: ['Visual Accessibility', 'Screen Readers', 'Navigation'],
      bio: 'Accessibility advocate with 5+ years experience helping colleagues with visual impairments navigate the workplace.',
      rating: 4.9,
      reviewCount: 27,
      availability: 'online',
      responseTime: 'Usually responds in 2 hours',
      department: 'Engineering',
      languages: ['English', 'Mandarin'],
      meetingPreference: 'both'
    },
    {
      id: '2',
      name: 'Marcus Johnson',
      expertise: ['Mobility Support', 'Ergonomics', 'Physical Accessibility'],
      bio: 'Physical therapist and accessibility consultant. Specialized in workspace setup and mobility assistance.',
      rating: 4.8,
      reviewCount: 35,
      availability: 'online',
      responseTime: 'Usually responds in 1 hour',
      department: 'HR & Wellness',
      languages: ['English', 'Spanish'],
      meetingPreference: 'in-person'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      expertise: ['Cognitive Support', 'ADHD Strategies', 'Time Management'],
      bio: 'Cognitive behavioral specialist helping colleagues develop effective work strategies and manage neurodiversity.',
      rating: 4.9,
      reviewCount: 42,
      availability: 'busy',
      responseTime: 'Usually responds in 4 hours',
      department: 'Psychology',
      languages: ['English', 'Spanish', 'French'],
      meetingPreference: 'virtual'
    },
    {
      id: '4',
      name: 'David Kim',
      expertise: ['Hearing Assistance', 'Communication', 'Sign Language'],
      bio: 'ASL interpreter and communication specialist. Helping bridge communication gaps in the workplace.',
      rating: 4.7,
      reviewCount: 23,
      availability: 'online',
      responseTime: 'Usually responds in 30 minutes',
      department: 'Communications',
      languages: ['English', 'Korean', 'ASL'],
      meetingPreference: 'both'
    },
    {
      id: '5',
      name: 'Dr. Aisha Patel',
      expertise: ['Mental Health', 'Stress Management', 'Workplace Wellness'],
      bio: 'Licensed counselor specializing in workplace mental health and stress management techniques.',
      rating: 5.0,
      reviewCount: 18,
      availability: 'online',
      responseTime: 'Usually responds in 3 hours',
      department: 'Health Services',
      languages: ['English', 'Hindi', 'Gujarati'],
      meetingPreference: 'virtual'
    }
  ];

  const expertiseOptions = [
    'Visual Accessibility',
    'Mobility Support', 
    'Cognitive Support',
    'Hearing Assistance',
    'Mental Health',
    'Ergonomics',
    'Communication',
    'Navigation'
  ];

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      loadBuddies();
    }
  }, [isOpen]);

  const loadBuddies = async () => {
    try {
      console.log('Loading buddies from Supabase...');
      
      // Fetch real buddy data from Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'buddy')
        .eq('profile_completed', true)
        .order('rating', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('Loaded buddies:', data);

      // Transform Supabase data to our Buddy interface
      const transformedBuddies: Buddy[] = (data || []).map(user => ({
        id: user.id,
        name: user.name,
        expertise: user.expertise || [],
        bio: user.bio || 'No bio available',
        rating: user.rating || 5.0,
        reviewCount: user.review_count || 0,
        availability: user.availability_status || 'online',
        responseTime: user.response_time || 'Usually responds in 2 hours',
        department: user.department || 'Unknown',
        languages: user.languages || ['English'],
        meetingPreference: user.meeting_preference || 'both'
      }));

      setBuddies(transformedBuddies);
      
      // If no real buddies exist, show helpful message
      if (transformedBuddies.length === 0) {
        console.log('No registered buddies found, showing empty state');
      }

    } catch (error) {
      console.error('Error loading buddies:', error);
      
      // Fall back to mock data if database fails
      console.log('Falling back to mock data due to error');
      setBuddies(mockBuddies);
    } finally {
      setLoading(false);
    }
  };

  const filteredBuddies = buddies.filter(buddy => {
    const matchesSearch = buddy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buddy.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         buddy.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesExpertise = selectedExpertise === 'all' || 
                            buddy.expertise.some(exp => {
                              // Handle both the new format (IDs) and display format
                              return exp === selectedExpertise || 
                                     exp.toLowerCase().includes(selectedExpertise.toLowerCase()) ||
                                     selectedExpertise.toLowerCase().includes(exp.toLowerCase());
                            });
    
    const matchesAvailability = selectedAvailability === 'all' || 
                               buddy.availability === selectedAvailability;

    return matchesSearch && matchesExpertise && matchesAvailability;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'online': return 'text-success';
      case 'busy': return 'text-warning';
      case 'offline': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getAvailabilityDot = (availability: string) => {
    switch (availability) {
      case 'online': return 'bg-success';
      case 'busy': return 'bg-warning';
      case 'offline': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const handleSendRequest = async () => {
    if (!selectedBuddy || !requestMessage.trim()) return;

    try {
      setLoading(true);
      
      // Generate mock requester ID for demo purposes
      // In a real app, this would come from authenticated user session
      const mockRequesterId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });

      // Prepare buddy request data for Supabase
      const requestData = {
        requester_id: mockRequesterId,
        buddy_id: selectedBuddy.id,
        type: 'mentorship', // Default type, could be determined by buddy expertise
        description: requestMessage,
        status: 'pending'
      };

      console.log('Sending buddy request to Supabase:', requestData);
      
      // Save buddy request to Supabase
      const { data, error } = await supabase
        .from('buddy_requests')
        .insert([requestData])
        .select();

      if (error) {
        throw error;
      }

      console.log('Buddy request sent successfully:', data);
      
      setShowRequestForm(false);
      setSelectedBuddy(null);
      setRequestMessage('');
      onClose();
      
      // Show success notification
      alert(`✅ Buddy request sent successfully to ${selectedBuddy.name}! You'll be notified when they respond.`);
      
      // Trigger refresh of recent requests
      if (onRequestSent) {
        onRequestSent();
      }
      
    } catch (error) {
      console.error('Error sending buddy request:', error);
      alert(`Failed to send request: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (showRequestForm && selectedBuddy) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Send Buddy Request
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Selected Buddy Info */}
            <Card className="card-soft">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {selectedBuddy.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedBuddy.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedBuddy.department}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-warning fill-current" />
                      <span className="text-xs text-muted-foreground">
                        {selectedBuddy.rating} ({selectedBuddy.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Tell {selectedBuddy.name.split(' ')[0]} how they can help you:
              </label>
              <Textarea
                placeholder="Hi! I'm looking for guidance with... I would appreciate your help with... My main challenges are..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="min-h-32"
              />
              <p className="text-xs text-muted-foreground">
                Be specific about what kind of support you're looking for. This helps your buddy prepare better.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowRequestForm(false)}
                className="flex-1"
              >
                Back to Search
              </Button>
              <Button 
                onClick={handleSendRequest}
                disabled={!requestMessage.trim() || loading}
                className="flex-1 btn-primary"
              >
                {loading ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Find a Buddy
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, expertise, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
              <SelectTrigger>
                <SelectValue placeholder="Expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Expertise</SelectItem>
                {expertiseOptions.map(expertise => (
                  <SelectItem key={expertise} value={expertise}>{expertise}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          <div className="overflow-y-auto max-h-96">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-muted-foreground">Finding available buddies...</p>
              </div>
            ) : filteredBuddies.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No buddies found matching your criteria.</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredBuddies.map((buddy) => (
                  <Card key={buddy.id} className="card-soft hover:shadow-soft transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12 bg-primary/20 flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {buddy.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">{buddy.name}</h3>
                            <div className={`w-2 h-2 rounded-full ${getAvailabilityDot(buddy.availability)}`}></div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">{buddy.department}</p>
                          
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="h-3 w-3 text-warning fill-current" />
                            <span className="text-sm text-foreground">{buddy.rating}</span>
                            <span className="text-xs text-muted-foreground">({buddy.reviewCount} reviews)</span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{buddy.bio}</p>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {buddy.expertise.slice(0, 2).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {buddy.expertise.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{buddy.expertise.length - 2} more
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              <span className={getAvailabilityColor(buddy.availability)}>
                                ● {buddy.availability === 'online' ? 'Available' : 
                                   buddy.availability === 'busy' ? 'Busy' : 'Offline'}
                              </span>
                              <br />
                              {buddy.responseTime}
                            </div>
                            
                            <Button 
                              size="sm"
                              disabled={buddy.availability === 'offline'}
                              onClick={() => {
                                setSelectedBuddy(buddy);
                                setShowRequestForm(true);
                              }}
                              className="btn-primary"
                            >
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Connect
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FindBuddyModal; 