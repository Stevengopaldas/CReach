import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Plus, Edit, Trash2, Video, MapPin, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';

interface Meeting {
  id: string;
  title: string;
  buddy_name: string;
  buddy_id: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'mentorship' | 'check-in' | 'training' | 'social';
  location: string;
  meeting_type: 'in-person' | 'virtual' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  meeting_url?: string;
  created_at: string;
}

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'view' | 'schedule';
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, mode = 'view' }) => {
  const [activeTab, setActiveTab] = useState(mode === 'schedule' ? 'schedule' : 'upcoming');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  // Form state for scheduling
  const [formData, setFormData] = useState({
    title: '',
    buddy_id: '',
    date: '',
    time: '',
    duration: 60,
    type: 'mentorship' as const,
    location: '',
    meeting_type: 'virtual' as const,
    notes: ''
  });

  // Mock data for meetings
  const mockMeetings: Meeting[] = [
    {
      id: '1',
      title: 'Screen Reader Training',
      buddy_name: 'Sarah Chen',
      buddy_id: '1',
      date: '2024-07-31',
      time: '14:00',
      duration: 60,
      type: 'training',
      location: 'Virtual',
      meeting_type: 'virtual',
      status: 'scheduled',
      notes: 'Focus on NVDA shortcuts and navigation techniques',
      meeting_url: 'https://meet.google.com/abc-defg-hij',
      created_at: '2024-07-30T10:00:00Z'
    },
    {
      id: '2',
      title: 'Ergonomic Assessment',
      buddy_name: 'Marcus Johnson',
      buddy_id: '2',
      date: '2024-08-01',
      time: '10:00',
      duration: 45,
      type: 'check-in',
      location: 'Building A, Room 205',
      meeting_type: 'in-person',
      status: 'scheduled',
      notes: 'Desk setup review and posture assessment',
      created_at: '2024-07-29T15:30:00Z'
    },
    {
      id: '3',
      title: 'Weekly Check-in',
      buddy_name: 'Dr. Aisha Patel',
      buddy_id: '5',
      date: '2024-08-02',
      time: '16:00',
      duration: 30,
      type: 'check-in',
      location: 'Virtual',
      meeting_type: 'virtual',
      status: 'scheduled',
      meeting_url: 'https://zoom.us/j/123456789',
      created_at: '2024-07-28T09:15:00Z'
    },
    {
      id: '4',
      title: 'Stress Management Workshop',
      buddy_name: 'Dr. Aisha Patel',
      buddy_id: '5',
      date: '2024-07-28',
      time: '13:00',
      duration: 90,
      type: 'training',
      location: 'Virtual',
      meeting_type: 'virtual',
      status: 'completed',
      notes: 'Covered breathing techniques and mindfulness exercises',
      created_at: '2024-07-25T11:20:00Z'
    }
  ];

  const [availableBuddies, setAvailableBuddies] = useState<Array<{id: string, name: string, expertise: string[]}>>([]);

  // Fetch available buddies from database
  const loadBuddies = async () => {
    try {
      const { data: buddies, error } = await supabase
        .from('users')
        .select('id, name, expertise')
        .eq('role', 'buddy')
        .eq('profile_completed', true);

      if (error) {
        console.error('Error fetching buddies:', error);
        return;
      }

      // Format buddies for dropdown
      const formattedBuddies = buddies?.map(buddy => ({
        id: buddy.id,
        name: buddy.name,
        expertise: Array.isArray(buddy.expertise) ? buddy.expertise : []
      })) || [];

      setAvailableBuddies(formattedBuddies);
    } catch (error) {
      console.error('Error loading buddies:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMeetings();
      loadBuddies();
    }
  }, [isOpen]);

  const loadMeetings = async () => {
    setLoading(true);
    try {
      // Fetch meetings from Supabase with buddy names
      const { data: meetingsData, error } = await supabase
        .from('buddy_meetings')
        .select(`
          *,
          users!buddy_meetings_buddy_id_fkey(name)
        `)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching meetings:', error);
        // Fallback to mock data on error
        setMeetings(mockMeetings);
        return;
      }

      // Transform data to include buddy names
      const formattedMeetings = meetingsData?.map(meeting => ({
        ...meeting,
        buddy_name: (meeting.users as any)?.name || 'Unknown Buddy'
      })) || [];

      setMeetings(formattedMeetings);
    } catch (error) {
      console.error('Error loading meetings:', error);
      // Fallback to mock data on error
      setMeetings(mockMeetings);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleMeeting = async () => {
    try {
      setLoading(true);

      // Generate mock requester ID for demo purposes
      const mockRequesterId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });

      const meetingData = {
        requester_id: mockRequesterId,
        buddy_id: formData.buddy_id,
        title: formData.title,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        type: formData.type,
        location: formData.location,
        meeting_type: formData.meeting_type,
        notes: formData.notes,
        status: 'scheduled'
      };

      console.log('Scheduling meeting:', meetingData);

      // Save to Supabase
      const { data, error } = await supabase
        .from('buddy_meetings')
        .insert([meetingData])
        .select(`
          *,
          users!buddy_meetings_buddy_id_fkey(name)
        `);

      if (error) {
        console.error('Error scheduling meeting:', error);
        throw error;
      }

      console.log('Meeting scheduled successfully:', data);

      // Refresh meetings list
      await loadMeetings();
      
      // Reset form
      setFormData({
        title: '',
        buddy_id: '',
        date: '',
        time: '',
        duration: 60,
        type: 'mentorship',
        location: '',
        meeting_type: 'virtual',
        notes: ''
      });
      
      setShowScheduleForm(false);
      setActiveTab('upcoming');
      
      alert('Meeting scheduled successfully!');

    } catch (error) {
      console.error('Error scheduling meeting:', error);
      
      // Handle Supabase errors properly
      let errorMessage = 'Failed to schedule meeting';
      if (error && typeof error === 'object') {
        if ('message' in error) {
          errorMessage += `: ${String(error.message)}`;
        }
      }
      
      alert(`${errorMessage}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingMeetings = () => {
    const today = new Date();
    return meetings
      .filter(m => m.status === 'scheduled' && new Date(m.date) >= today)
      .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());
  };

  const getPastMeetings = () => {
    return meetings
      .filter(m => m.status === 'completed')
      .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mentorship': return 'bg-primary/20 text-primary';
      case 'training': return 'bg-secondary/20 text-secondary';
      case 'check-in': return 'bg-success/20 text-success';
      case 'social': return 'bg-tertiary/20 text-tertiary';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'virtual': return Video;
      case 'phone': return Clock;
      default: return MapPin;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Buddy Calendar
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="schedule">Schedule New</TabsTrigger>
          </TabsList>

          {/* Upcoming Meetings */}
          <TabsContent value="upcoming" className="space-y-4 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading meetings...</p>
              </div>
            ) : getUpcomingMeetings().length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No upcoming meetings scheduled.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setActiveTab('schedule')}
                >
                  Schedule Your First Meeting
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {getUpcomingMeetings().map((meeting) => {
                  const MeetingIcon = getMeetingTypeIcon(meeting.meeting_type);
                  return (
                    <Card key={meeting.id} className="card-soft">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-10 h-10 bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-medium text-sm">
                              {meeting.buddy_name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">{meeting.title}</h3>
                              <Badge className={getTypeColor(meeting.type)}>
                                {meeting.type}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              with {meeting.buddy_name}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(meeting.date)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(meeting.time)} ({meeting.duration} min)
                              </div>
                              <div className="flex items-center gap-1">
                                <MeetingIcon className="h-3 w-3" />
                                {meeting.location}
                              </div>
                            </div>
                            
                            {meeting.notes && (
                              <p className="text-sm text-muted-foreground mb-2">
                                📝 {meeting.notes}
                              </p>
                            )}
                            
                            <div className="flex gap-2">
                              {meeting.meeting_url && (
                                <Button size="sm" variant="outline" asChild>
                                  <a href={meeting.meeting_url} target="_blank" rel="noopener noreferrer">
                                    <Video className="h-3 w-3 mr-1" />
                                    Join Meeting
                                  </a>
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3 mr-1" />
                                Reschedule
                              </Button>
                              <Button size="sm" variant="outline">
                                <Bell className="h-3 w-3 mr-1" />
                                Remind
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Meeting History */}
          <TabsContent value="history" className="space-y-4 max-h-96 overflow-y-auto">
            {getPastMeetings().length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No meeting history yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getPastMeetings().map((meeting) => (
                  <Card key={meeting.id} className="card-soft opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-8 h-8 bg-muted/20 flex items-center justify-center">
                          <span className="text-muted-foreground font-medium text-xs">
                            {meeting.buddy_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground">{meeting.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              Completed
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(meeting.date)} at {formatTime(meeting.time)} with {meeting.buddy_name}
                          </p>
                          {meeting.notes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              📝 {meeting.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Schedule New Meeting */}
          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Meeting Title</label>
                  <Input
                    placeholder="e.g., Weekly Check-in, Training Session"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Select Buddy</label>
                  <Select value={formData.buddy_id} onValueChange={(value) => setFormData(prev => ({ ...prev, buddy_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a buddy" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBuddies.map(buddy => (
                        <SelectItem key={buddy.id} value={buddy.id}>
                          {buddy.name} - {buddy.expertise}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Time</label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Duration (minutes)</label>
                  <Select value={formData.duration.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Meeting Type</label>
                  <Select value={formData.meeting_type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, meeting_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual Meeting</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-foreground">Location/Meeting Details</label>
                  <Input
                    placeholder={formData.meeting_type === 'virtual' ? 'Zoom/Teams link will be generated' : 'Building, Room number or phone number'}
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Meeting Purpose & Notes</label>
                <Textarea
                  placeholder="What would you like to discuss or learn in this meeting?"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="min-h-20"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleScheduleMeeting}
                  disabled={!formData.title || !formData.buddy_id || !formData.date || !formData.time || loading}
                  className="btn-primary"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarModal; 